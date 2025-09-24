"""
Веб-панель администратора для Telegram бота
"""
import logging

import os
import sys
import uuid
from datetime import datetime, timedelta
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session, send_from_directory

# Добавляем путь к модулям бота
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import DatabaseManager
from bot_integration import TelegramBotIntegration

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'your-secret-key-change-in-production')

# Инициализация
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH_WEBPANEL = os.path.join(BASE_DIR, 'shop_bot.db')
db = DatabaseManager(DB_PATH_WEBPANEL)
telegram_bot = TelegramBotIntegration()

# Настройки загрузки файлов
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER)
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Создаем папку для загрузок
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        admin_name = os.getenv('ADMIN_NAME', 'AdminUser')
        
        if username == admin_name:
            session['logged_in'] = True
            session['username'] = username
            return redirect(url_for('dashboard'))
        else:
            flash('Неверное имя пользователя')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

def login_required(f):
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route('/')
@login_required
def dashboard():
    # Статистика за сегодня
    today = datetime.now().strftime('%Y-%m-%d')
    today_stats = db.execute_query('''
        SELECT 
            COUNT(*) as orders_today,
            COALESCE(SUM(total_amount), 0) as revenue_today,
            COUNT(DISTINCT user_id) as customers_today
        FROM orders 
        WHERE DATE(created_at) = ?
    ''', (today,))
    
    # Статистика за вчера
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    yesterday_stats = db.execute_query('''
        SELECT 
            COUNT(*) as orders_yesterday,
            COALESCE(SUM(total_amount), 0) as revenue_yesterday
        FROM orders 
        WHERE DATE(created_at) = ?
    ''', (yesterday,))
    
    # Общая статистика
    total_stats = db.execute_query('''
        SELECT 
            COUNT(DISTINCT id) as total_customers,
            COUNT(*) as total_orders,
            COALESCE(SUM(total_amount), 0) as total_revenue
        FROM (
            SELECT u.id, o.total_amount FROM users u
            LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
            WHERE u.is_admin = 0
        )
    ''')
    
    # Последние заказы
    recent_orders = db.execute_query('''
        SELECT o.id, o.total_amount, o.status, o.created_at, u.name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 10
    ''')
    
    # Топ товары за неделю
    top_products = db.execute_query('''
        SELECT p.name, SUM(oi.quantity) as sold, SUM(oi.quantity * oi.price) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at >= date('now', '-7 days')
        AND o.status != 'cancelled'
        GROUP BY p.id, p.name
        ORDER BY revenue DESC
        LIMIT 5
    ''')
    
    return render_template('dashboard.html',
                         today_stats=today_stats[0] if today_stats else (0, 0, 0),
                         yesterday_stats=yesterday_stats[0] if yesterday_stats else (0, 0),
                         total_stats=total_stats[0] if total_stats else (0, 0, 0),
                         recent_orders=recent_orders or [],
                         top_products=top_products or [])

@app.route('/orders')
@login_required
def orders():
    page = int(request.args.get('page', 1))
    per_page = 20
    status_filter = request.args.get('status', '')
    search = request.args.get('search', '')
    
    # Базовый запрос
    query = '''
        SELECT o.id, o.total_amount, o.status, o.created_at, u.name, u.phone, u.email, 
               o.delivery_address, o.payment_method
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE 1=1
    '''
    params = []
    
    # Фильтры
    if status_filter:
        query += ' AND o.status = ?'
        params.append(status_filter)
    
    if search:
        query += ' AND (u.name LIKE ? OR o.id = ?)'
        params.extend([f'%{search}%', search])
    
    query += ' ORDER BY o.created_at DESC'
    
    # Получаем все заказы для подсчета страниц
    all_orders = db.execute_query(query, params)
    total_orders = len(all_orders) if all_orders else 0
    total_pages = (total_orders + per_page - 1) // per_page
    
    # Получаем заказы для текущей страницы
    offset = (page - 1) * per_page
    paginated_query = query + f' LIMIT {per_page} OFFSET {offset}'
    orders_data = db.execute_query(paginated_query, params)
    
    return render_template('orders.html',
                         orders=orders_data or [],
                         current_page=page,
                         total_pages=total_pages,
                         status_filter=status_filter,
                         search=search)

@app.route('/products')
@login_required
def products():
    # Фильтры
    q = request.args.get('search', '').strip()
    category_filter = request.args.get('category', '').strip()
    page = _int_or(request.args.get('page', 1), 1)
    per_page = _int_or(request.args.get('per_page', 10), 10)
    if per_page <= 0 or per_page > 50:
        per_page = 10
    offset = (page - 1) * per_page

    where = "WHERE 1=1"
    params = []
    if q:
        where += " AND (p.name LIKE ? OR p.description LIKE ?)"
        pattern = f"%{q}%"
        params.extend([pattern, pattern])
    if category_filter:
        where += " AND p.category_id = ?"
        params.append(int(category_filter))

    # Total count
    total_rows = db.execute_query(f"SELECT COUNT(*) FROM products p {where}", tuple(params)) or [(0,)]
    total = total_rows[0][0] if isinstance(total_rows[0], (list, tuple)) else total_rows[0]
    total_pages = max(1, (total + per_page - 1) // per_page)

    # Data with category name
    rows = db.execute_query(
        f"""
        SELECT p.id, p.name, p.price, p.stock, p.is_active,
               c.name as category_name,
               p.sales_count, p.views, p.image_url
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        {where}
        ORDER BY p.id DESC
        LIMIT ? OFFSET ?
        """,
        tuple(params + [per_page, offset])
    ) or []

    categories = db.get_categories() or []
    return render_template('products.html',
                           products=rows,
                           categories=categories,
                           search=q,
                           category_filter=str(category_filter) if category_filter else '',
                           current_page=page,
                           per_page=per_page,
                           total_pages=total_pages,
                           total=total)

@app.route('/add_product', methods=['GET', 'POST'])
@login_required
def add_product():
    if request.method == 'POST':
        name = request.form['name'].strip()
        description = request.form.get('description', '').strip()
        price = float(request.form['price'])
        cost_price = float(request.form.get('cost_price', 0) or 0)
        category_id = int(request.form['category_id'])
        brand = request.form.get('brand', '').strip()
        stock = int(request.form.get('stock', 0) or 0)

        image_url = ''
        if 'image_file' in request.files and request.files['image_file'].filename:
            file = request.files['image_file']
            if file and allowed_file(file.filename):
                ext = file.filename.rsplit('.', 1)[1].lower()
                filename = str(uuid.uuid4()) + '.' + ext
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(path)
                image_url = url_for('uploaded_file', filename=filename, _external=False)

        res = db.execute_query(
            """INSERT INTO products (name, description, price, category_id, subcategory_id, brand, image_url, stock, is_active, cost_price)
                VALUES (?, ?, ?, ?, NULL, ?, ?, ?, 1, ?)""",
            (name, description, price, category_id, brand, image_url, stock, cost_price)
        )
        if res:
            telegram_bot.trigger_bot_data_reload()
            flash(f'Товар "{name}" успешно добавлен!')
            return redirect(url_for('products'))
        else:
            flash('Ошибка добавления товара')

    categories = db.get_categories()
    return render_template('add_product.html', categories=categories or [])

@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/categories')
@login_required
def categories():
    categories_data = db.execute_query('''
        SELECT c.id, c.name, c.description, c.emoji, c.is_active,
               COUNT(p.id) as products_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
        GROUP BY c.id, c.name, c.description, c.emoji, c.is_active
        ORDER BY c.name
    ''')
    
    return render_template('categories.html', categories=categories_data or [])

@app.route('/add_category', methods=['GET', 'POST'])
@login_required
def add_category():
    if request.method == 'POST':
        name = request.form['name']
        description = request.form.get('description', '')
        emoji = request.form.get('emoji', '')
        
        category_id = db.execute_query('''
            INSERT INTO categories (name, description, emoji)
            VALUES (?, ?, ?)
        ''', (name, description, emoji))
        
        if category_id:
            # Уведомляем админов в Telegram
            admin_message = f"✅ <b>Новая категория добавлена!</b>\n\n"
            admin_message += f"📂 <b>{emoji} {name}</b>\n"
            admin_message += f"📝 {description}\n"
            admin_message += f"📅 Добавлена через веб-панель"
            
            telegram_bot.notify_admins(admin_message)
            
            # Сигнализируем боту о необходимости обновления
            telegram_bot.trigger_bot_data_reload()
            
            flash(f'Категория "{name}" успешно добавлена!')
            return redirect(url_for('categories'))
        else:
            flash('Ошибка добавления категории')
    
    return render_template('add_category.html')

@app.route('/customers')
@login_required
def customers():
    page = int(request.args.get('page', 1))
    per_page = 20
    search = request.args.get('search', '')
    
    # Базовый запрос
    query = '''
        SELECT u.id, u.name, u.phone, u.email, u.created_at,
               COUNT(o.id) as orders_count,
               COALESCE(SUM(o.total_amount), 0) as total_spent,
               MAX(o.created_at) as last_order
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
        WHERE u.is_admin = 0
    '''
    params = []
    
    if search:
        query += ' AND (u.name LIKE ? OR u.phone LIKE ? OR u.email LIKE ?)'
        params.extend([f'%{search}%', f'%{search}%', f'%{search}%'])
    
    query += ' GROUP BY u.id ORDER BY total_spent DESC'
    
    # Получаем всех клиентов для подсчета страниц
    all_customers = db.execute_query(query, params)
    total_customers = len(all_customers) if all_customers else 0
    total_pages = (total_customers + per_page - 1) // per_page
    
    # Получаем клиентов для текущей страницы
    offset = (page - 1) * per_page
    paginated_query = query + f' LIMIT {per_page} OFFSET {offset}'
    customers_data = db.execute_query(paginated_query, params)
    
    return render_template('customers.html',
                         customers=customers_data or [],
                         current_page=page,
                         total_pages=total_pages,
                         search=search,
                         now=datetime.now())

@app.route('/analytics', methods=['GET'])
@login_required
def analytics_page():
    start_date = request.args.get('start', (datetime.now()-timedelta(days=30)).strftime('%Y-%m-%d'))
    end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
    group = request.args.get('group','daily')
    sales_report = get_sales_report(db, start_date, end_date)
    series = get_timeseries(db, start_date, end_date, group=group)
    return render_template('analytics.html',
                           sales_report=sales_report,
                           series=series,
                           start=start_date, end=end_date, group=group)


@app.route('/crm')
@login_required
def crm_page():
    try:
        from crm import CRMManager
        crm_manager = CRMManager(db)
        
        segments = crm_manager.segment_customers()
        at_risk_customers = crm_manager.get_churn_risk_customers()
        
        return render_template('crm.html',
                             segments=segments,
                             at_risk_customers=at_risk_customers)
    except ImportError:
        # Фолбэк: простая сегментация RFM без внешнего модуля
        segments = {'champions': [], 'loyal': [], 'at_risk': [], 'new': []}
        rows = db.execute_query("""
            SELECT u.id, u.name, COUNT(o.id) as orders, IFNULL(SUM(o.total_amount),0) as spent,
                   MAX(o.created_at) as last_date
            FROM users u LEFT JOIN orders o ON o.user_id=u.id AND o.status!='cancelled'
            GROUP BY u.id, u.name
        """) or []
        from datetime import datetime
        import time
        now = datetime.now()
        for r in rows:
            uid, name, orders, spent, last_date = r
            days = 999
            try:
                days = (now - datetime.fromisoformat(last_date)).days if last_date else 999
            except Exception:
                pass
            if orders and orders>=3 and days<=30:
                segments['champions'].append((uid, name, orders, spent))
            elif orders and orders>=3 and days>30:
                segments['at_risk'].append((uid, name, orders, spent))
            elif orders and orders>=1:
                segments['loyal'].append((uid, name, orders, spent))
            else:
                segments['new'].append((uid, name, orders, spent))
        return render_template('crm.html', segments=segments, at_risk_customers=segments['at_risk'])

@app.route('/scheduled_posts')
@login_required
def scheduled_posts():
    try:
        posts = db.execute_query('''
            SELECT id, title, content, time_morning, time_afternoon, time_evening,
                   target_audience, is_active, created_at, updated_at
            FROM scheduled_posts
            ORDER BY created_at DESC
        ''')
        
        # Статистика за последние 7 дней
        stats = db.execute_query('''
            SELECT sp.title, ps.time_period, ps.sent_count, ps.error_count
            FROM post_statistics ps
            JOIN scheduled_posts sp ON ps.post_id = sp.id
            WHERE ps.sent_at >= date('now', '-7 days')
            ORDER BY ps.sent_at DESC
            LIMIT 10
        ''')
        
        return render_template('scheduled_posts.html',
                             posts=posts or [],
                             stats=stats or [])
    except Exception as e:
        flash(f'Ошибка загрузки автопостов: {e}')
        return redirect(url_for('dashboard'))

@app.route('/create_post', methods=['GET', 'POST'])
@login_required
def create_post():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        
        # Обработка времени отправки
        morning_time = request.form.get('morning_time') if request.form.get('morning_enabled') else None
        afternoon_time = request.form.get('afternoon_time') if request.form.get('afternoon_enabled') else None
        evening_time = request.form.get('evening_time') if request.form.get('evening_enabled') else None
        
        target_audience = request.form['target_audience']
        
        # Обработка изображения
        image_url = ''
        if 'image_file' in request.files and request.files['image_file'].filename:
            file = request.files['image_file']
            if file and allowed_file(file.filename):
                filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                image_url = f'/static/uploads/{filename}'
        elif request.form.get('image_url'):
            image_url = request.form['image_url']
        
        post_id = db.execute_query('''
            INSERT INTO scheduled_posts (
                title, content, time_morning, time_afternoon, time_evening,
                target_audience, image_url, is_active, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        ''', (
            title, content, morning_time, afternoon_time, evening_time,
            target_audience, image_url, datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ))
        
        if post_id:
            # Сигнализируем боту о необходимости обновления
            telegram_bot.trigger_bot_data_reload()
            
            flash(f'Автоматический пост "{title}" создан!')
            return redirect(url_for('scheduled_posts'))
        else:
            flash('Ошибка создания поста')
    
    return render_template('create_post.html')

@app.route('/edit_post/<int:post_id>', methods=['GET', 'POST'])
@login_required
def edit_post(post_id):
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        
        # Обработка времени отправки
        morning_time = request.form.get('morning_time') if request.form.get('morning_enabled') else None
        afternoon_time = request.form.get('afternoon_time') if request.form.get('afternoon_enabled') else None
        evening_time = request.form.get('evening_time') if request.form.get('evening_enabled') else None
        
        target_audience = request.form['target_audience']
        
        # Обработка изображения
        image_url = request.form.get('image_url', '')
        if 'image_file' in request.files and request.files['image_file'].filename:
            file = request.files['image_file']
            if file and allowed_file(file.filename):
                filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                image_url = f'/static/uploads/{filename}'
        
        result = db.execute_query('''
            UPDATE scheduled_posts 
            SET title = ?, content = ?, time_morning = ?, time_afternoon = ?, 
                time_evening = ?, target_audience = ?, image_url = ?, updated_at = ?
            WHERE id = ?
        ''', (
            title, content, morning_time, afternoon_time, evening_time,
            target_audience, image_url, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), post_id
        ))
        
        if result and result > 0:
            # Сигнализируем боту о необходимости обновления
            telegram_bot.trigger_bot_data_reload()
            
            flash(f'Пост "{title}" обновлен!')
            return redirect(url_for('scheduled_posts'))
        else:
            flash('Ошибка обновления поста')
    
    # Получаем данные поста
    post = db.execute_query('SELECT * FROM scheduled_posts WHERE id = ?', (post_id,))
    if not post:
        flash('Пост не найден')
        return redirect(url_for('scheduled_posts'))
    
    return render_template('edit_post.html', post=post[0])

@app.route('/send_now_post', methods=['POST'])
@login_required
def send_now_post():
    post_id = request.form['post_id']
    
    # Получаем данные поста
    post_data = db.execute_query(
        'SELECT title, content, target_audience, image_url FROM scheduled_posts WHERE id = ?',
        (post_id,)
    )
    
    if not post_data:
        flash('Пост не найден')
        return redirect(url_for('scheduled_posts'))
    
    title, content, target_audience, image_url = post_data[0]
    
    # Отправляем немедленно
    try:
        from scheduled_posts import ScheduledPostsManager
        posts_manager = ScheduledPostsManager(None, db)
        posts_manager.bot = telegram_bot
        
        # Получаем получателей
        recipients = posts_manager.get_target_audience(target_audience)
        
        if recipients:
            message_text = posts_manager.format_post_message(title, content, 'manual')
            keyboard = posts_manager.create_post_keyboard()
            
            success_count = 0
            error_count = 0
            
            for recipient in recipients:
                try:
                    if target_audience == 'channel':
                        if image_url:
                            result = telegram_bot.send_photo(posts_manager.channel_id, image_url, message_text, keyboard)
                        else:
                            result = telegram_bot.send_message(posts_manager.channel_id, message_text, keyboard)
                    else:
                        telegram_id = recipient[0] if isinstance(recipient, (list, tuple)) else recipient.get('telegram_id')
                        if image_url:
                            result = telegram_bot.send_photo(telegram_id, image_url, message_text, keyboard)
                        else:
                            result = telegram_bot.send_message(telegram_id, message_text, keyboard)
                    
                    if result and result.get('ok'):
                        success_count += 1
                    else:
                        error_count += 1
                except Exception as e:
                    error_count += 1
                    logging.info(f"Ошибка отправки: {e}")
            
            # Если это канал, отправляем товары с отзывами
            if target_audience == 'channel':
                pass  # отключено: без автодобавления товаров
            
            flash(f'Пост отправлен! Успешно: {success_count}, Ошибок: {error_count}')
        else:
            flash('Нет получателей для отправки')
            
    except Exception as e:
        flash(f'Ошибка отправки поста: {e}')
    
    return redirect(url_for('scheduled_posts'))

@app.route('/test_channel_post', methods=['POST'])
@login_required
def test_channel_post():
    title = "🧪 Тест канала"
    content = "Это тестовое сообщение из веб-панели администратора.\n\n✅ Если вы видите это сообщение, интеграция работает корректно!\n\n📅 Время отправки: " + datetime.now().strftime('%H:%M:%S')
    test_image = "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"
    
    try:
        message_text = f"{content}\n\n🛍 Перейти в каталог: /start"
        
        # Создаем тестовые кнопки
        test_keyboard = {
            'inline_keyboard': [
                [
                    {'text': '🛒 Заказать товары', 'url': 'https://t.me/your_bot_username'},
                    {'text': '🌐 Перейти на сайт', 'url': 'https://your-website.com'}
                ],
                [
                    {'text': '📱 Открыть каталог', 'url': 'https://t.me/your_bot_username?start=catalog'},
                    {'text': '💬 Поддержка', 'url': 'https://t.me/your_support_username'}
                ]
            ]
        }
        
        result = telegram_bot.send_photo("-1002566537425", test_image, f"📢 <b>{title}</b>\n\n{message_text}", test_keyboard)
        
        if result and result.get('ok'):
            flash('✅ Тестовый пост с изображением отправлен в канал!')
        else:
            flash(f'Ошибка отправки в канал: {result}')
    except Exception as e:
        flash(f'Ошибка отправки тестового поста: {e}')
    
    return redirect(url_for('scheduled_posts'))

@app.route('/toggle_post_status', methods=['POST'])
@login_required
def toggle_post_status():
    post_id = request.form['post_id']
    current_status = int(request.form['current_status'])
    new_status = 0 if current_status else 1
    
    result = db.execute_query(
        'UPDATE scheduled_posts SET is_active = ? WHERE id = ?',
        (new_status, post_id)
    )
    
    if result and result > 0:
        # Сигнализируем боту о необходимости обновления
        telegram_bot.trigger_bot_data_reload()
        
        status_text = "включен" if new_status else "выключен"
        flash(f'Пост {status_text}!')
    else:
        flash('Ошибка изменения статуса поста')
    
    return redirect(url_for('scheduled_posts'))

@app.route('/delete_post', methods=['POST'])
@login_required
def delete_post():
    post_id = request.form['post_id']
    
    result = db.execute_query('DELETE FROM scheduled_posts WHERE id = ?', (post_id,))
    
    if result and result > 0:
        # Сигнализируем боту о необходимости обновления
        telegram_bot.trigger_bot_data_reload()
        
        flash('Пост удален!')
    else:
        flash('Ошибка удаления поста')
    
    return redirect(url_for('scheduled_posts'))

@app.route('/update_order_status', methods=['POST'])
@login_required
def update_order_status():
    order_id = request.form['order_id']
    status = request.form['status']
    
    result = db.update_order_status(order_id, status)
    
    if result and result > 0:
        # Уведомляем клиента об изменении статуса
        try:
            order_details = db.get_order_details(order_id)
            if order_details:
                user_id = order_details['order'][1]
                user = db.execute_query('SELECT telegram_id, name FROM users WHERE id = ?', (user_id,))
                
                if user:
                    status_messages = {
                        'confirmed': 'подтвержден',
                        'shipped': 'отправлен',
                        'delivered': 'доставлен',
                        'cancelled': 'отменен'
                    }
                    
                    status_text = status_messages.get(status, status)
                    notification = f"📦 <b>Обновление заказа #{order_id}</b>\n\n"
                    notification += f"Статус изменен на: <b>{status_text}</b>\n\n"
                    notification += f"Спасибо за покупку!"
                    
                    telegram_bot.send_message(user[0][0], notification)
        except Exception as e:
            logging.info(f"Ошибка уведомления клиента: {e}")
        
        flash(f'Статус заказа #{order_id} изменен на "{status}"')
    else:
        flash('Ошибка обновления статуса заказа')
    
    return redirect(url_for('orders'))

@app.route('/order_detail/<int:order_id>')
@login_required
def order_detail(order_id):
    order_data = db.get_order_details(order_id)
    
    if not order_data:
        flash('Заказ не найден')
        return redirect(url_for('orders'))
    
    return render_template('order_detail.html', order_data=order_data, db=db)

@app.route('/toggle_product_status', methods=['POST'])
@login_required
def toggle_product_status():
    product_id = request.form['product_id']
    current_status = int(request.form['current_status'])
    new_status = 0 if current_status else 1
    
    result = db.execute_query(
        'UPDATE products SET is_active = ? WHERE id = ?',
        (new_status, product_id)
    )
    
    if result and result > 0:
        # Сигнализируем боту о необходимости обновления
        telegram_bot.trigger_bot_data_reload()
        
        status_text = "активирован" if new_status else "скрыт"
        flash(f'Товар {status_text}!')
    else:
        flash('Ошибка изменения статуса товара')
    
    return redirect(url_for('products'))

@app.route('/delete_product', methods=['POST'])
@login_required
def delete_product():
    product_id = request.form['product_id']
    
    # Получаем название товара для уведомления
    product = db.get_product_by_id(product_id)
    product_name = product[1] if product else f"ID {product_id}"
    
    result = db.execute_query('DELETE FROM products WHERE id = ?', (product_id,))
    
    if result and result > 0:
        # Сигнализируем боту о необходимости обновления
        telegram_bot.trigger_bot_data_reload()
        
        flash(f'Товар "{product_name}" удален!')
    else:
        flash('Ошибка удаления товара')
    
    return redirect(url_for('products'))

@app.route('/notify_new_product', methods=['POST'])
@login_required
def notify_new_product():
    product_id = request.form['product_id']
    
    product = db.get_product_by_id(product_id)
    if not product:
        flash('Товар не найден')
        return redirect(url_for('products'))
    
    # Создаем сообщение о товаре
    message = f"🆕 <b>Новинка в каталоге!</b>\n\n"
    message += f"🛍 <b>{product[1]}</b>\n"
    if product[2]:
        message += f"📝 {product[2][:100]}{'...' if len(product[2]) > 100 else ''}\n"
    message += f"💰 Цена: <b>${product[3]:.2f}</b>\n"
    message += f"📦 В наличии: {product[6]} шт.\n\n"
    message += f"🛒 Заказать: /start"
    
    try:
        if product[5]:  # Если есть изображение
            result = telegram_bot.send_photo_to_channel(product[5], message)
        else:
            result = telegram_bot.send_to_channel(message)
        
        if result and result.get('ok'):
            flash(f'Уведомление о товаре "{product[1]}" отправлено в канал!')
        else:
            flash(f'Ошибка отправки в канал: {result}')
    except Exception as e:
        flash(f'Ошибка отправки уведомления: {e}')
    
    return redirect(url_for('products'))

@app.route('/send_broadcast', methods=['POST'])
@login_required
def send_broadcast():
    message = request.form['message']
    target_audience = request.form['target_audience']
    
    try:
        # Получаем список получателей
        if target_audience == 'all':
            recipients = db.execute_query(
                'SELECT telegram_id, name, language FROM users WHERE is_admin = 0'
            )
        elif target_audience == 'active':
            recipients = db.execute_query('''
                SELECT DISTINCT u.telegram_id, u.name, u.language
                FROM users u
                JOIN orders o ON u.id = o.user_id
                WHERE u.is_admin = 0 AND o.created_at >= datetime('now', '-30 days')
            ''')
        elif target_audience == 'vip':
            recipients = db.execute_query('''
                SELECT DISTINCT u.telegram_id, u.name, u.language
                FROM users u
                JOIN orders o ON u.id = o.user_id
                WHERE u.is_admin = 0
                GROUP BY u.id
                HAVING SUM(o.total_amount) >= 500
            ''')
        else:
            recipients = []
        
        if recipients:
            success_count, error_count = telegram_bot.send_broadcast(message, recipients)
            flash(f'Рассылка завершена! Отправлено: {success_count}, Ошибок: {error_count}')
        else:
            flash('Нет получателей для рассылки')
            
    except Exception as e:
        flash(f'Ошибка рассылки: {e}')
    
    return redirect(url_for('customers'))

@app.route('/toggle_category_status', methods=['POST'])
@login_required
def toggle_category_status():
    category_id = request.form['category_id']
    current_status = int(request.form['current_status'])
    new_status = 0 if current_status else 1
    
    result = db.execute_query(
        'UPDATE categories SET is_active = ? WHERE id = ?',
        (new_status, category_id)
    )
    
    if result and result > 0:
        # Сигнализируем боту о необходимости обновления
        telegram_bot.trigger_bot_data_reload()
        
        status_text = "активирована" if new_status else "скрыта"
        flash(f'Категория {status_text}!')
    else:
        flash('Ошибка изменения статуса категории')
    
    return redirect(url_for('categories'))

@app.route('/edit_category', methods=['POST'])
@login_required
def edit_category():
    category_id = request.form['category_id']
    name = request.form['name']
    description = request.form.get('description', '')
    emoji = request.form.get('emoji', '')
    
    result = db.execute_query('''
        UPDATE categories 
        SET name = ?, description = ?, emoji = ?
        WHERE id = ?
    ''', (name, description, emoji, category_id))
    
    if result and result > 0:
        # Сигнализируем боту о необходимости обновления
        telegram_bot.trigger_bot_data_reload()
        
        flash(f'Категория "{name}" обновлена!')
    else:
        flash('Ошибка обновления категории')
    
    return redirect(url_for('categories'))

@app.route('/reload_bot_data', methods=['POST'])
@login_required
def reload_bot_data():
    """Принудительная перезагрузка данных в боте"""
    try:
        # Сигнализируем боту о необходимости обновления
        if telegram_bot.trigger_bot_data_reload():
            flash('Сигнал обновления отправлен боту!')
        else:
            flash('Ошибка отправки сигнала обновления')
            
    except Exception as e:
        flash(f'Ошибка обновления данных: {e}')
    
    return redirect(request.referrer or url_for('dashboard'))

@app.route('/force_reload_bot', methods=['POST'])
@login_required
def force_reload_bot():
    """Принудительная перезагрузка всех данных в боте"""
    try:
        # Создаем специальный флаг для полной перезагрузки
        force_reload_flag = '../force_reload_flag.txt'
        with open(force_reload_flag, 'w') as f:
            f.write(datetime.now().isoformat())
        
        # Уведомляем админов
        reload_message = "🔄 <b>ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ</b>\n\n"
        reload_message += "✅ Все данные перезагружены\n"
        reload_message += "✅ Кэш очищен\n"
        reload_message += "✅ Автопосты перезапущены\n\n"
        reload_message += f"⏰ {datetime.now().strftime('%H:%M:%S')}"
        
        telegram_bot.notify_admins(reload_message)
        flash('Данные в боте обновлены!')
    except Exception as e:
        flash(f'Ошибка обновления данных: {e}')
    
    return redirect(request.referrer or url_for('dashboard'))

# API endpoints
@app.route('/api/chart_data')
@login_required
def chart_data():
    chart_type = request.args.get('type', 'sales')
    period = int(request.args.get('period', 30))
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=period)
    
    if chart_type == 'sales':
        # Данные продаж по дням
        sales_data = db.execute_query('''
            SELECT 
                DATE(created_at) as date,
                COALESCE(SUM(total_amount), 0) as daily_revenue
            FROM orders
            WHERE DATE(created_at) BETWEEN ? AND ?
            AND status != 'cancelled'
            GROUP BY DATE(created_at)
            ORDER BY date
        ''', (start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')))
        
        labels = [item[0] for item in sales_data] if sales_data else []
        data = [float(item[1]) for item in sales_data] if sales_data else []
        
    elif chart_type == 'orders':
        # Количество заказов по дням
        orders_data = db.execute_query('''
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as daily_orders
            FROM orders
            WHERE DATE(created_at) BETWEEN ? AND ?
            AND status != 'cancelled'
            GROUP BY DATE(created_at)
            ORDER BY date
        ''', (start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')))
        
        labels = [item[0] for item in orders_data] if orders_data else []
        data = [item[1] for item in orders_data] if orders_data else []
    
    else:
        labels = []
        data = []
    
    return jsonify({
        'labels': labels,
        'data': data
    })

@app.route('/api/test_telegram')
@login_required
def test_telegram():
    try:
        if telegram_bot.test_connection():
            return jsonify({
                'success': True,
                'bot_name': 'Shop Bot'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Не удалось подключиться к Telegram API'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/export_orders')
@login_required
def export_orders():
    flash('Экспорт заказов будет добавлен в следующей версии')
    return redirect(url_for('orders'))

@app.route('/export_products')
@login_required
def export_products():
    flash('Экспорт товаров будет добавлен в следующей версии')
    return redirect(url_for('products'))

@app.route('/export_customers')
@login_required
def export_customers():
    flash('Экспорт клиентов будет добавлен в следующей версии')
    return redirect(url_for('customers'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

@app.route('/finance')
@login_required
def finance_page():
    rows = db.execute_query('''
        SELECT 
            IFNULL(SUM(o.total_amount), 0) as revenue,
            IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)), 0) as cost
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        LEFT JOIN products p ON p.id = oi.product_id
        WHERE o.status != 'cancelled'
    ''') or [(0,0)]
    revenue, cost = rows[0]
    profit = revenue - cost
    return render_template('financial.html', revenue=revenue, cost=cost, profit=profit)


def _int_or(v, default=0):
    try:
        return int(v)
    except Exception:
        return default


@app.route('/reports/profit')
@login_required
def profit_report():
    # Определяем колонку цены в order_items, если таблица существует
    price_col = None
    try:
        cols = db.execute_query("PRAGMA table_info(order_items)") or []
        names = [c[1] for c in cols] if cols and len(cols[0])>1 else []
        for cand in ['price', 'unit_price', 'price_sold']:
            if cand in names:
                price_col = cand
                break
    except Exception:
        price_col = None

    # Прибыль по товарам
    if price_col:
        product_rows = db.execute_query(f'''
            SELECT p.id, p.name,
                   IFNULL(SUM(oi.quantity * oi.{price_col}), 0) as revenue,
                   IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)), 0) as cost,
                   IFNULL(SUM(oi.quantity * oi.{price_col}), 0) - IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)), 0) as profit
            FROM products p
            LEFT JOIN order_items oi ON oi.product_id = p.id
            GROUP BY p.id, p.name
            ORDER BY profit DESC
            LIMIT 200
        ''') or []
    else:
        product_rows = db.execute_query('''
            SELECT p.id, p.name,
                   0 as revenue,
                   IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)), 0) as cost,
                   0 - IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)), 0) as profit
            FROM products p
            LEFT JOIN order_items oi ON oi.product_id = p.id
            GROUP BY p.id, p.name
            ORDER BY profit DESC
            LIMIT 200
        ''') or []

    # По категориям
    if price_col:
        cat_rows = db.execute_query(f'''
            SELECT c.id, c.name,
                   IFNULL(SUM(oi.quantity * oi.{price_col}), 0) as revenue,
                   IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)), 0) as cost,
                   IFNULL(SUM(oi.quantity * oi.{price_col}), 0) - IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)), 0) as profit
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            LEFT JOIN order_items oi ON oi.product_id = p.id
            GROUP BY c.id, c.name
            ORDER BY profit DESC
            LIMIT 100
        ''') or []
    else:
        cat_rows = db.execute_query('''
            SELECT c.id, c.name,
                   0 as revenue,
                   IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)), 0) as cost,
                   0 - IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)), 0) as profit
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            LEFT JOIN order_items oi ON oi.product_id = p.id
            GROUP BY c.id, c.name
            ORDER BY profit DESC
            LIMIT 100
        ''') or []

    # Топ-10 для графиков
    top_products = [{"name": r[1], "profit": r[4]} for r in product_rows[:10]]
    top_categories = [{"name": r[1], "profit": r[4]} for r in cat_rows[:10]]
    return render_template('report_profit.html',
                           product_rows=product_rows,
                           category_rows=cat_rows,
                           top_products=top_products,
                           top_categories=top_categories)


@app.route('/crm/quick_action', methods=['POST'])
@login_required
def crm_quick_action():
    action = request.form.get('action')
    user_id = request.form.get('user_id', type=int)
    if not user_id or not action:
        flash('Некорректные параметры')
        return redirect(url_for('crm_page'))
    try:
        if action == 'send_coupon':
            code = f'PROMO{int(datetime.now().timestamp())%100000}'
            db.execute_query('INSERT INTO promo_codes (code, discount_type, discount_value, is_active, created_at) VALUES (?, ?, ?, 1, datetime("now"))', (code, 'percent', 10))
            # try notify user
            user = db.execute_query('SELECT telegram_id FROM users WHERE id=?', (user_id,))
            if user and user[0][0]:
                telegram_bot.send_message(user[0][0], f'🎁 Для вас промокод: <b>{code}</b> на скидку 10%')
            flash('Промокод отправлен')
        elif action == 'ban_user':
            db.execute_query('UPDATE users SET is_banned=1 WHERE id=?', (user_id,))
            flash('Пользователь заблокирован')
        elif action == 'mark_vip':
            db.execute_query('UPDATE users SET is_vip=1 WHERE id=?', (user_id,))
            flash('Пользователь отмечен как VIP')
        else:
            flash('Неизвестное действие')
    except Exception as e:
        flash(f'Ошибка действия: {e}')
    return redirect(url_for('crm_page'))


@app.route('/categories/toggle/<int:cid>', methods=['POST'])
@role_required('admin')
def toggle_category(cid):
    row = db.execute_query('SELECT is_active FROM categories WHERE id=?', (cid,))
    if not row:
        flash('Категория не найдена')
    else:
        newv = 0 if (row[0][0] or 0)==1 else 1
        db.execute_query('UPDATE categories SET is_active=? WHERE id=?', (newv, cid))
        flash('Категория ' + ('скрыта' if newv==0 else 'показана'))
    return redirect(url_for('categories'))


@app.route('/inventory', methods=['GET'], endpoint='inventory_page')
@login_required
def inventory_page():
    try:
        rows = db.execute_query('''
            SELECT COUNT(*), IFNULL(SUM(stock),0), IFNULL(SUM(stock*COALESCE(cost_price,0)),0)
            FROM products WHERE is_active=1
        ''') or [(0,0,0)]
        product_count, total_stock, stock_cost = rows[0]
        low_stock = db.execute_query('''
            SELECT id, name, stock FROM products
            WHERE is_active=1 AND stock<=5
            ORDER BY stock ASC LIMIT 20
        ''') or []
        abc = db.execute_query('''
            SELECT name, IFNULL(sales_count,0) as sales
            FROM products WHERE is_active=1
            ORDER BY sales DESC LIMIT 100
        ''') or []
        return render_template('inventory.html',
                               inventory_summary={'product_count': product_count,
                                                  'total_stock': total_stock,
                                                  'stock_cost': stock_cost},
                               low_stock=low_stock,
                               abc_analysis=abc)
    except Exception as e:
        flash(f'Ошибка загрузки склада: {e}')
        return redirect(url_for('dashboard'))



@app.route('/financial', methods=['GET'], endpoint='financial_page')
@login_required
def financial_page():
    sales = db.execute_query("SELECT IFNULL(SUM(total_amount),0), COUNT(*), IFNULL(AVG(total_amount),0) FROM orders WHERE status!='cancelled'") or [(0,0,0)]
    revenue, orders_count, aov = sales[0]
    cost_row = db.execute_query("SELECT IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)),0) FROM order_items oi JOIN products p ON p.id=oi.product_id JOIN orders o ON o.id=oi.order_id WHERE o.status!='cancelled'") or [(0,)]
    cost = cost_row[0][0] if isinstance(cost_row[0], (list, tuple)) else cost_row[0]
    profit = (revenue or 0) - (cost or 0)
    by_cat = db.execute_query("SELECT c.name, IFNULL(SUM(oi.quantity*COALESCE(oi.price,0)),0) as rev FROM categories c LEFT JOIN products p ON p.category_id=c.id LEFT JOIN order_items oi ON oi.product_id=p.id LEFT JOIN orders o ON o.id=oi.order_id AND o.status!='cancelled' GROUP BY c.id, c.name ORDER BY rev DESC LIMIT 10") or []
    metrics = {'revenue': revenue or 0, 'cost': cost or 0, 'profit': profit or 0, 'orders': orders_count or 0, 'aov': aov or 0}
    return render_template('financial.html', metrics=metrics, by_cat=by_cat)


@app.route('/inventory', methods=['GET'], endpoint='inventory_page')
@login_required
def inventory_page():
    try:
        rows = db.execute_query('''
            SELECT COUNT(*), IFNULL(SUM(stock),0), IFNULL(SUM(stock*COALESCE(cost_price,0)),0)
            FROM products WHERE is_active=1
        ''') or [(0,0,0)]
        product_count, total_stock, stock_cost = rows[0]
        low_stock = db.execute_query('''
            SELECT id, name, stock FROM products
            WHERE is_active=1 AND stock<=5
            ORDER BY stock ASC LIMIT 20
        ''') or []
        abc = db.execute_query('''
            SELECT name, IFNULL(sales_count,0) as sales
            FROM products WHERE is_active=1
            ORDER BY sales DESC LIMIT 100
        ''') or []
        return render_template('inventory.html',
                               inventory_summary={'product_count': product_count,
                                                  'total_stock': total_stock,
                                                  'stock_cost': stock_cost},
                               low_stock=low_stock,
                               abc_analysis=abc)
    except Exception as e:
        flash(f'Ошибка загрузки склада: {e}')
        return redirect(url_for('dashboard'))

@app.route('/financial', methods=['GET'], endpoint='financial_page')
@login_required
def financial_page():
    sales = db.execute_query("SELECT IFNULL(SUM(total_amount),0), COUNT(*), IFNULL(AVG(total_amount),0) FROM orders WHERE status!='cancelled'") or [(0,0,0)]
    revenue, orders_count, aov = sales[0]
    cost_row = db.execute_query("SELECT IFNULL(SUM(oi.quantity * COALESCE(p.cost_price,0)),0) FROM order_items oi JOIN products p ON p.id=oi.product_id JOIN orders o ON o.id=oi.order_id WHERE o.status!='cancelled'") or [(0,)]
    cost = cost_row[0][0] if isinstance(cost_row[0], (list, tuple)) else cost_row[0]
    profit = (revenue or 0) - (cost or 0)
    by_cat = db.execute_query("SELECT c.name, IFNULL(SUM(oi.quantity*COALESCE(oi.price,0)),0) as rev FROM categories c LEFT JOIN products p ON p.category_id=c.id LEFT JOIN order_items oi ON oi.product_id=p.id LEFT JOIN orders o ON o.id=oi.order_id AND o.status!='cancelled' GROUP BY c.id, c.name ORDER BY rev DESC LIMIT 10") or []
    metrics = {'revenue': revenue or 0, 'cost': cost or 0, 'profit': profit or 0, 'orders': orders_count or 0, 'aov': aov or 0}
    return render_template('financial.html', metrics=metrics, by_cat=by_cat)

