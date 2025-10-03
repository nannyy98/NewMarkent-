# 🚀 Руководство по запуску Telegram Shop Bot

## 📋 Содержание
1. [Быстрый старт](#быстрый-старт)
2. [Подробная инструкция](#подробная-инструкция)
3. [Настройка переменных окружения](#настройка-переменных-окружения)
4. [Запуск веб-панели](#запуск-веб-панели)
5. [Решение проблем](#решение-проблем)

---

## 🎯 Быстрый старт

### 1. Установите зависимости

```bash
# Установите Python зависимости
pip3 install -r requirements.txt
```

### 2. Настройте токен бота

```bash
# Создайте файл .env
nano .env
```

Добавьте токен вашего бота:
```
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
```

### 3. Запустите бота

```bash
python3 main.py
```

✅ Бот запущен и готов к работе!

---

## 📖 Подробная инструкция

### Шаг 1: Создание Telegram бота

1. Откройте Telegram и найдите **@BotFather**
2. Отправьте команду `/newbot`
3. Следуйте инструкциям:
   - Введите название бота (например: "My Shop Bot")
   - Введите username бота (например: "myshop_bot")
4. Скопируйте токен, который выдаст BotFather
   - Выглядит так: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### Шаг 2: Установка зависимостей

#### Проверьте Python (нужна версия 3.8+)
```bash
python3 --version
```

#### Установите все зависимости
```bash
pip3 install -r requirements.txt
```

Будут установлены:
- telebot (pyTelegramBotAPI)
- requests
- python-dotenv
- и другие необходимые пакеты

### Шаг 3: Настройка конфигурации

#### Создайте файл .env
```bash
# В корневой директории проекта
touch .env
nano .env
```

#### Добавьте необходимые переменные
```env
# Обязательные переменные
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather

# Опциональные переменные
ADMIN_TELEGRAM_ID=ваш_telegram_id
CHANNEL_ID=-1001234567890
DATABASE_PATH=shop_bot.db

# Для веб-панели
FLASK_SECRET_KEY=случайная_строка_для_безопасности
ADMIN_NAME=AdminUser
```

#### Как узнать свой Telegram ID?
1. Напишите боту **@userinfobot**
2. Он отправит вам ваш ID (например: 123456789)

### Шаг 4: Инициализация базы данных

База данных создается автоматически при первом запуске бота.

Если хотите создать её вручную:
```bash
python3 -c "from database import DatabaseManager; db = DatabaseManager('shop_bot.db')"
```

### Шаг 5: Запуск бота

#### Простой запуск
```bash
python3 main.py
```

#### Запуск в фоновом режиме (Linux/Mac)
```bash
nohup python3 main.py > bot.log 2>&1 &
```

#### Запуск в фоновом режиме с автоперезапуском
```bash
# Используйте screen
screen -S telegram_bot
python3 main.py

# Отсоедините сессию: Ctrl+A, затем D
# Вернитесь к сессии: screen -r telegram_bot
```

#### Запуск с Docker (опционально)
```bash
# Если есть Dockerfile
docker build -t shop-bot .
docker run -d --name shop-bot shop-bot
```

---

## 🌐 Запуск веб-панели

Веб-панель позволяет управлять ботом через браузер.

### 1. Перейдите в директорию веб-панели
```bash
cd web_admin
```

### 2. Установите зависимости Flask (если еще не установлены)
```bash
pip3 install -r requirements.txt
```

### 3. Настройте администратора
```bash
# В файле .env добавьте
export ADMIN_NAME="YourAdminUsername"
```

### 4. Запустите веб-сервер
```bash
python3 run.py
```

### 5. Откройте в браузере
```
http://localhost:5000
```

Логин: **AdminUser** (или значение из ADMIN_NAME)

### Функции веб-панели:
- 📊 Статистика и аналитика
- 📦 Управление заказами
- 🛍 Управление товарами и категориями
- 👥 База клиентов
- 💰 Финансовые отчеты
- 📦 Учет склада
- 📅 Отложенные посты в канал
- 📢 Массовые рассылки

---

## ⚙️ Настройка переменных окружения

### Файл .env (полный пример)
```env
# ========================================
# ОСНОВНЫЕ НАСТРОЙКИ БОТА
# ========================================

# Токен Telegram бота (обязательно!)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# ID администратора (ваш Telegram ID)
ADMIN_TELEGRAM_ID=123456789

# ID канала для публикаций (опционально)
CHANNEL_ID=-1001234567890

# ========================================
# БАЗА ДАННЫХ
# ========================================

# Путь к файлу базы данных
DATABASE_PATH=shop_bot.db

# ========================================
# ВЕБ-ПАНЕЛЬ
# ========================================

# Секретный ключ Flask (измените!)
FLASK_SECRET_KEY=your_very_secret_key_change_this

# Имя администратора для входа
ADMIN_NAME=AdminUser

# ========================================
# ПЛАТЕЖНЫЕ СИСТЕМЫ (опционально)
# ========================================

# Payme
PAYME_MERCHANT_ID=your_payme_id
PAYME_SECRET_KEY=your_payme_secret

# Click
CLICK_MERCHANT_ID=your_click_id
CLICK_SERVICE_ID=your_click_service_id
CLICK_SECRET_KEY=your_click_secret

# Stripe
STRIPE_API_KEY=sk_test_your_stripe_key

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# ========================================
# УВЕДОМЛЕНИЯ
# ========================================

# Email уведомления (опционально)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

---

## 🔧 Решение проблем

### Проблема: "ModuleNotFoundError: No module named 'telebot'"
```bash
# Решение: Установите зависимости
pip3 install -r requirements.txt
```

### Проблема: "telegram.error.InvalidToken"
```bash
# Решение: Проверьте токен в .env файле
# Токен должен быть в формате: 1234567890:ABCdefGHI...
cat .env | grep TELEGRAM_BOT_TOKEN
```

### Проблема: База данных не создается
```bash
# Решение: Создайте вручную
python3 -c "from database import DatabaseManager; DatabaseManager('shop_bot.db')"
```

### Проблема: Бот не отвечает на сообщения
1. Проверьте, что бот запущен: `ps aux | grep main.py`
2. Проверьте логи: `tail -f bot.log`
3. Убедитесь, что токен правильный
4. Проверьте интернет-соединение

### Проблема: Веб-панель не открывается
```bash
# Решение 1: Проверьте, что Flask установлен
pip3 install flask

# Решение 2: Проверьте порт
netstat -an | grep 5000

# Решение 3: Используйте другой порт
# В файле web_admin/run.py измените port=5000 на port=8080
```

### Проблема: Локализация не работает
```bash
# Решение: Проверьте файл localization.py
python3 -c "from localization import t; print(t('catalog_title', language='uz'))"
```

---

## 📱 Использование бота

### После запуска бота:

1. **Найдите своего бота в Telegram**
   - Введите username бота в поиск
   - Или перейдите по ссылке: `t.me/your_bot_username`

2. **Начните диалог**
   - Нажмите START или отправьте `/start`

3. **Выберите язык**
   - 🇷🇺 Русский
   - 🇺🇿 O'zbekcha

4. **Используйте основные функции**
   - 🛍 **Каталог** - просмотр товаров
   - 🛒 **Корзина** - ваши товары
   - 📋 **Мои заказы** - история покупок
   - 👤 **Профиль** - ваши данные
   - 🔍 **Поиск** - найти товар
   - ℹ️ **Помощь** - справка

---

## 🎨 Настройка бота под себя

### Изменить название и описание
1. Откройте @BotFather
2. Отправьте `/mybots`
3. Выберите своего бота
4. **Edit Bot** → **Name** или **Description**

### Добавить свои категории товаров
```python
# Через веб-панель: http://localhost:5000/categories
# Или напрямую в базу данных
```

### Добавить товары
```python
# Через веб-панель: http://localhost:5000/products
# Заполните: название, цену, описание, категорию
```

### Настроить платежи
```python
# В файле .env добавьте ключи платежных систем
# Поддерживаются: Payme, Click, Stripe, PayPal, ZoodPay
```

---

## 📊 Мониторинг

### Просмотр логов бота
```bash
tail -f bot.log
tail -f bot_errors.log
```

### Статистика через веб-панель
1. Откройте http://localhost:5000
2. Главная страница показывает:
   - Продажи за сегодня
   - Активные пользователи
   - Последние заказы
   - Топ товары

### Резервное копирование базы данных
```bash
# Создайте бэкап
cp shop_bot.db shop_bot_backup_$(date +%Y%m%d).db

# Или используйте скрипт
python3 database_backup.py
```

---

## 🆘 Поддержка

### Если ничего не помогает:

1. Проверьте все требования системы
2. Убедитесь, что все зависимости установлены
3. Проверьте правильность токена
4. Посмотрите логи ошибок

### Полезные команды для диагностики:
```bash
# Проверка Python
python3 --version

# Проверка установленных пакетов
pip3 list | grep -E "telebot|flask|requests"

# Проверка процессов
ps aux | grep python

# Проверка портов
netstat -tulpn | grep -E "5000|8443"

# Тест импортов
python3 -c "import telebot; print('OK')"
python3 -c "from database import DatabaseManager; print('OK')"
```

---

## ✅ Чек-лист перед запуском

- [ ] Python 3.8+ установлен
- [ ] Все зависимости установлены (`pip3 install -r requirements.txt`)
- [ ] Файл .env создан с правильным токеном
- [ ] База данных инициализирована
- [ ] Токен бота действителен
- [ ] Интернет-соединение работает
- [ ] Бот не заблокирован в вашей стране

---

## 🎉 Готово!

Теперь ваш магазин-бот готов к работе!

**Команды для запуска:**
```bash
# Запуск бота
python3 main.py

# Запуск веб-панели
cd web_admin && python3 run.py
```

**Доступ:**
- 🤖 Telegram бот: `t.me/your_bot_username`
- 🌐 Веб-панель: `http://localhost:5000`

Удачи! 🚀
