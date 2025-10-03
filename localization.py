"""
Модуль локализации для поддержки русского и узбекского языков
"""

class Localization:
    def __init__(self):
        self.translations = {
            'ru': {
                # Основные сообщения
                'welcome_new': """
🛍 <b>Добро пожаловать в наш интернет-магазин!</b>

Здесь вы можете:
• 📱 Просматривать каталог товаров
• 🛒 Добавлять товары в корзину  
• 📦 Оформлять заказы
• 📋 Отслеживать статус доставки

Для начала работы пройдите быструю регистрацию.
                """,
                
                'welcome_back': """
👋 <b>С возвращением!</b>

Рады видеть вас снова в нашем магазине.
Выберите действие из меню ниже:
                """,
                
                # Кнопки меню
                'btn_catalog': '🛍 Каталог',
                'btn_cart': '🛒 Корзина',
                'btn_orders': '📋 Мои заказы',
                'btn_profile': '👤 Профиль',
                'btn_search': '🔍 Поиск',
                'btn_help': 'ℹ️ Помощь',
                'btn_back': '🔙 Назад',
                'btn_main': '🏠 Главная',
                'btn_cancel': '❌ Отмена',
                'btn_yes': '✅ Да',
                'btn_no': '❌ Нет',
                
                # Статусы заказов
                'status_pending': '⏳ В обработке',
                'status_confirmed': '✅ Подтвержден',
                'status_shipped': '🚚 Отправлен',
                'status_delivered': '📦 Доставлен',
                'status_cancelled': '❌ Отменен',
                
                # Уведомления
                'order_status_update': 'Обновление заказа',
                'payment_success_title': 'Оплата прошла успешно!',
                'payment_confirmed': 'Платеж подтвержден',
                'loyalty_points_earned': 'Начислено баллов',
                'contact_soon': 'Мы свяжемся с вами в ближайшее время',
                
                # Регистрация
                'registration_complete': """
✅ <b>Регистрация завершена!</b>

Добро пожаловать в наш магазин! 🎉

Теперь вы можете:
• Просматривать каталог товаров
• Добавлять товары в корзину
• Оформлять заказы

Приятных покупок! 🛍
                """,
                
                # Корзина
                'empty_cart': """
🛒 <b>Ваша корзина пуста</b>

Перейдите в каталог, чтобы добавить товары!
                """,

                # Каталог
                'catalog_title': '🛍 <b>Каталог товаров</b>\n\nВыберите категорию:',
                'catalog_unavailable': '❌ Каталог временно недоступен',
                'no_products': '❌ Товары не найдены',
                'cart_title': '🛒 <b>Ваша корзина:</b>',
                'total': '💳 <b>Итого:',
                'no_orders': '📋 У вас пока нет заказов',
                'orders_title': '📋 <b>Ваши заказы:</b>',
                'profile_title': '👤 <b>Ваш профиль</b>',
                'name': '📝 Имя:',
                'phone': '📱 Телефон:',
                'email': '📧 Email:',
                'language': '🌍 Язык:',
                'registration_date': '📅 Регистрация:',
                'statistics': '📊 <b>Статистика:</b>',
                'orders_count': '📦 Заказов:',
                'total_spent': '💰 Потрачено:',
                'last_order': '📅 Последний заказ:',
                'change_language': '🌍 Для смены языка: /language',
                'help': 'ℹ️ <b>Помощь</b>\n\n🛍 <b>Каталог</b> - просмотр товаров\n🛒 <b>Корзина</b> - ваши товары\n📋 <b>Мои заказы</b> - история заказов\n👤 <b>Профиль</b> - ваши данные\n🔍 <b>Поиск</b> - поиск товаров\n\n📧 По вопросам: @support',
                'error': '❌ Произошла ошибка. Попробуйте еще раз.',
                'added_to_cart': '✅ Товар добавлен в корзину!',
                'product_not_found': '❌ Товар не найден',
                'order_created': '✅ <b>Заказ #{} оформлен!</b>',
                'order_sum': '💰 Сумма:',
                'order_address': '📍 Адрес:',
                'order_payment': '💳 Оплата:',
                'payment_link': '💳 Ссылка для оплаты будет отправлена отдельно',
                'contact_confirm': '📞 Мы свяжемся с вами для подтверждения'
            },
            
            'uz': {
                # Основные сообщения
                'welcome_new': """
🛍 <b>Internet-do'konimizga xush kelibsiz!</b>

Bu yerda siz:
• 📱 Mahsulotlar katalogini ko'rishingiz
• 🛒 Mahsulotlarni savatchaga qo'shishingiz  
• 📦 Buyurtma berishingiz
• 📋 Yetkazib berish holatini kuzatishingiz mumkin

Ishni boshlash uchun tezkor ro'yxatdan o'ting.
                """,
                
                'welcome_back': """
👋 <b>Qaytganingiz bilan!</b>

Sizni do'konimizda yana ko'rishdan xursandmiz.
Quyidagi menyudan amalni tanlang:
                """,
                
                # Кнопки меню
                'btn_catalog': '🛍 Katalog',
                'btn_cart': '🛒 Savat',
                'btn_orders': '📋 Mening buyurtmalarim',
                'btn_profile': '👤 Profil',
                'btn_search': '🔍 Qidiruv',
                'btn_help': 'ℹ️ Yordam',
                'btn_back': '🔙 Orqaga',
                'btn_main': '🏠 Bosh sahifa',
                'btn_cancel': '❌ Bekor qilish',
                'btn_yes': '✅ Ha',
                'btn_no': '❌ Yo\'q',
                
                # Статусы заказов
                'status_pending': '⏳ Qayta ishlanmoqda',
                'status_confirmed': '✅ Tasdiqlangan',
                'status_shipped': '🚚 Jo\'natilgan',
                'status_delivered': '📦 Yetkazilgan',
                'status_cancelled': '❌ Bekor qilingan',
                
                # Уведомления
                'order_status_update': 'Buyurtma yangilanishi',
                'payment_success_title': 'To\'lov muvaffaqiyatli o\'tdi!',
                'payment_confirmed': 'To\'lov tasdiqlandi',
                'loyalty_points_earned': 'Ball qo\'shildi',
                'contact_soon': 'Tez orada siz bilan bog\'lanamiz',
                
                # Регистрация
                'registration_complete': """
✅ <b>Ro'yxatdan o'tish yakunlandi!</b>

Do'konimizga xush kelibsiz! 🎉

Endi siz:
• Mahsulotlar katalogini ko'rishingiz
• Mahsulotlarni savatchaga qo'shishingiz
• Buyurtma berishingiz mumkin

Xaridlaringiz baxtiyor bo'lsin! 🛍
                """,
                
                # Корзина
                'empty_cart': """
🛒 <b>Savatingiz bo'sh</b>

Mahsulot qo'shish uchun katalogga o'ting!
                """,

                # Каталог
                'catalog_title': '🛍 <b>Mahsulotlar katalogi</b>\n\nKategoriyani tanlang:',
                'catalog_unavailable': '❌ Katalog vaqtincha mavjud emas',
                'no_products': '❌ Mahsulotlar topilmadi',
                'cart_title': '🛒 <b>Sizning savatingiz:</b>',
                'total': '💳 <b>Jami:',
                'no_orders': '📋 Sizda hali buyurtmalar yo\'q',
                'orders_title': '📋 <b>Sizning buyurtmalaringiz:</b>',
                'profile_title': '👤 <b>Sizning profilingiz</b>',
                'name': '📝 Ism:',
                'phone': '📱 Telefon:',
                'email': '📧 Email:',
                'language': '🌍 Til:',
                'registration_date': '📅 Ro\'yxatdan o\'tish:',
                'statistics': '📊 <b>Statistika:</b>',
                'orders_count': '📦 Buyurtmalar:',
                'total_spent': '💰 Sarflangan:',
                'last_order': '📅 Oxirgi buyurtma:',
                'change_language': '🌍 Tilni o\'zgartirish uchun: /language',
                'help': 'ℹ️ <b>Yordam</b>\n\n🛍 <b>Katalog</b> - mahsulotlarni ko\'rish\n🛒 <b>Savat</b> - sizning mahsulotlaringiz\n📋 <b>Mening buyurtmalarim</b> - buyurtmalar tarixi\n👤 <b>Profil</b> - sizning ma\'lumotlaringiz\n🔍 <b>Qidiruv</b> - mahsulotlarni qidirish\n\n📧 Savollar uchun: @support',
                'error': '❌ Xatolik yuz berdi. Qayta urinib ko\'ring.',
                'added_to_cart': '✅ Mahsulot savatga qo\'shildi!',
                'product_not_found': '❌ Mahsulot topilmadi',
                'order_created': '✅ <b>Buyurtma #{} qabul qilindi!</b>',
                'order_sum': '💰 Summa:',
                'order_address': '📍 Manzil:',
                'order_payment': '💳 To\'lov:',
                'payment_link': '💳 To\'lov havolasi alohida yuboriladi',
                'contact_confirm': '📞 Tasdiqlash uchun siz bilan bog\'lanamiz'
            }
        }
    
    def get_text(self, key, language='ru'):
        """Получение переведенного текста"""
        return self.translations.get(language, self.translations['ru']).get(key, key)

# Глобальный экземпляр локализации
localization = Localization()

def get_user_language(db, telegram_id):
    """Получение языка пользователя"""
    try:
        user_data = db.get_user_by_telegram_id(telegram_id)
        if user_data:
            return user_data[0][5]  # language поле
    except Exception:
        pass
    return 'ru'  # По умолчанию русский

def t(key, telegram_id=None, db=None, language=None):
    """Быстрая функция для получения переведенного текста"""
    if language is None and telegram_id and db:
        language = get_user_language(db, telegram_id)
    elif language is None:
        language = 'ru'
    
    return localization.get_text(key, language)