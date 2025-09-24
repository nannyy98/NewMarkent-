#!/bin/bash

# Скрипт развертывания для продакшена

set -e

echo "🚀 Развертывание Telegram Shop Bot..."

# Проверяем переменные окружения
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ Ошибка: TELEGRAM_BOT_TOKEN не установлен"
    exit 1
fi

# Создаем директории
mkdir -p data logs backups ssl

# Устанавливаем права
chmod 755 data logs backups
chmod 600 .env

# Проверяем Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен"
    exit 1
fi

# Останавливаем старые контейнеры
echo "🛑 Остановка старых контейнеров..."
docker-compose down

# Создаем резервную копию
if [ -f "data/shop_bot.db" ]; then
    echo "💾 Создание резервной копии..."
    cp data/shop_bot.db backups/shop_bot_$(date +%Y%m%d_%H%M%S).db
fi

# Собираем и запускаем
echo "🔨 Сборка и запуск..."
docker-compose up --build -d

# Проверяем статус
echo "🔍 Проверка статуса..."
sleep 10

if curl -f http://localhost:8080/health; then
    echo "✅ Бот успешно развернут!"
    echo "📊 Health check: http://localhost:8080/health"
    echo "📋 Логи: docker-compose logs -f shop-bot"
else
    echo "❌ Ошибка развертывания"
    docker-compose logs shop-bot
    exit 1
fi

echo "🎉 Развертывание завершено!"