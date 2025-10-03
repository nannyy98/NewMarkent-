import os
import sys
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import DatabaseManager

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'your-secret-key-change-in-production')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'shop_bot.db')
db = DatabaseManager(DB_PATH)

def login_required(f):
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '')
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

@app.route('/')
@login_required
def dashboard():
    today = datetime.now().date()

    today_stats = db.execute_query('''
        SELECT
            COUNT(*) as orders_count,
            IFNULL(SUM(total_amount), 0) as revenue
        FROM orders
        WHERE DATE(created_at) = ?
    ''', (today,)) or [(0, 0)]

    total_stats = db.execute_query('''
        SELECT
            COUNT(*) as total_orders,
            IFNULL(SUM(total_amount), 0) as total_revenue,
            COUNT(DISTINCT user_id) as total_customers
        FROM orders
    ''') or [(0, 0, 0)]

    recent_orders = db.execute_query('''
        SELECT
            o.id,
            u.name as customer_name,
            o.total_amount,
            o.status,
            o.created_at
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 10
    ''') or []

    products_count = db.execute_query('SELECT COUNT(*) FROM products WHERE is_active = 1') or [(0,)]
    categories_count = db.execute_query('SELECT COUNT(*) FROM categories WHERE is_active = 1') or [(0,)]

    return render_template('dashboard.html',
                         today_orders=today_stats[0][0],
                         today_revenue=today_stats[0][1],
                         total_orders=total_stats[0][0],
                         total_revenue=total_stats[0][1],
                         total_customers=total_stats[0][2],
                         products_count=products_count[0][0],
                         categories_count=categories_count[0][0],
                         recent_orders=recent_orders)

@app.route('/orders')
@login_required
def orders():
    status_filter = request.args.get('status', 'all')

    query = '''
        SELECT
            o.id,
            u.name as customer_name,
            u.phone,
            o.total_amount,
            o.status,
            o.created_at
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
    '''

    params = []
    if status_filter != 'all':
        query += ' WHERE o.status = ?'
        params.append(status_filter)

    query += ' ORDER BY o.created_at DESC'

    orders_data = db.execute_query(query, tuple(params)) or []

    return render_template('orders.html', orders=orders_data, status_filter=status_filter)

@app.route('/products')
@login_required
def products():
    products_data = db.execute_query('''
        SELECT
            p.id,
            p.name,
            p.price,
            p.stock,
            c.name as category_name,
            p.is_active
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    ''') or []

    return render_template('products.html', products=products_data)

@app.route('/categories')
@login_required
def categories():
    categories_data = db.execute_query('''
        SELECT
            c.id,
            c.name,
            c.emoji,
            c.is_active,
            COUNT(p.id) as products_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
        GROUP BY c.id
        ORDER BY c.name
    ''') or []

    return render_template('categories.html', categories=categories_data)

@app.route('/customers')
@login_required
def customers():
    customers_data = db.execute_query('''
        SELECT
            u.id,
            u.telegram_id,
            u.name,
            u.phone,
            u.language,
            u.created_at,
            COUNT(o.id) as orders_count,
            IFNULL(SUM(o.total_amount), 0) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
    ''') or []

    return render_template('customers.html', customers=customers_data)

@app.route('/update_order_status', methods=['POST'])
@login_required
def update_order_status():
    order_id = request.form.get('order_id')
    new_status = request.form.get('status')

    db.execute_query('UPDATE orders SET status = ? WHERE id = ?', (new_status, order_id))

    flash('Статус заказа обновлен')
    return redirect(url_for('orders'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
