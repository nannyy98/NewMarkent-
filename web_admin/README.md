# Веб-панель администратора

Простая веб-панель для управления Telegram ботом интернет-магазина.

## Установка

```bash
cd web_admin
pip3 install -r requirements.txt
```

## Запуск

```bash
python3 run.py
```

Панель будет доступна: **http://localhost:5000**

## Вход

По умолчанию:
- Логин: **AdminUser**

Изменить логин:
```bash
export ADMIN_NAME="YourUsername"
```

## Функции

- 📊 Главная - статистика продаж
- 📦 Заказы - управление заказами
- 🛍 Товары - список товаров
- 🏷 Категории - категории товаров
- 👥 Клиенты - база клиентов

## Структура

```
web_admin/
├── app.py              # Flask приложение
├── run.py              # Скрипт запуска
├── requirements.txt    # Зависимости
├── templates/          # HTML шаблоны
│   ├── base.html
│   ├── login.html
│   ├── dashboard.html
│   ├── orders.html
│   ├── products.html
│   ├── categories.html
│   └── customers.html
└── static/
    └── css/
        └── admin.css   # Стили
```
