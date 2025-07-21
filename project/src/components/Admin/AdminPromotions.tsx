import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Calendar, Percent, DollarSign, Users, Tag } from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minOrder: number;
  maxUses: number;
  currentUses: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: string;
}

export function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      name: 'Скидка новичкам',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrder: 50,
      maxUses: 1000,
      currentUses: 234,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      description: 'Скидка 10% для новых пользователей'
    },
    {
      id: '2',
      name: 'Бесплатная доставка',
      code: 'FREESHIP',
      type: 'shipping',
      value: 0,
      minOrder: 25,
      maxUses: 500,
      currentUses: 89,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      isActive: true,
      description: 'Бесплатная доставка при заказе от $25'
    },
    {
      id: '3',
      name: 'Скидка $20',
      code: 'SAVE20',
      type: 'fixed',
      value: 20,
      minOrder: 100,
      maxUses: 200,
      currentUses: 156,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      isActive: false,
      description: 'Скидка $20 при заказе от $100'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    code: '',
    type: 'percentage' as const,
    value: 0,
    minOrder: 0,
    maxUses: 100,
    startDate: '',
    endDate: '',
    description: ''
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-4 w-4" />;
      case 'fixed': return <DollarSign className="h-4 w-4" />;
      case 'shipping': return <Tag className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-blue-100 text-blue-600';
      case 'fixed': return 'bg-green-100 text-green-600';
      case 'shipping': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeLabel = (type: string, value: number) => {
    switch (type) {
      case 'percentage': return `${value}% OFF`;
      case 'fixed': return `$${value} OFF`;
      case 'shipping': return 'FREE SHIPPING';
      default: return '';
    }
  };

  const handleCreatePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    const promotion: Promotion = {
      id: Date.now().toString(),
      ...newPromotion,
      currentUses: 0,
      isActive: true
    };
    setPromotions([...promotions, promotion]);
    setNewPromotion({
      name: '',
      code: '',
      type: 'percentage',
      value: 0,
      minOrder: 0,
      maxUses: 100,
      startDate: '',
      endDate: '',
      description: ''
    });
    setShowCreateForm(false);
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions(promotions.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  const copyPromotionCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // В реальном приложении здесь был бы toast notification
    alert(`Код ${code} скопирован!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Управление акциями</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Создать акцию</span>
        </button>
      </div>

      {/* Create Promotion Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Создать новую акцию</h3>
          <form onSubmit={handleCreatePromotion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Название акции"
                value={newPromotion.name}
                onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Промокод"
                value={newPromotion.code}
                onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={newPromotion.type}
                onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="percentage">Процент</option>
                <option value="fixed">Фиксированная сумма</option>
                <option value="shipping">Бесплатная доставка</option>
              </select>
              <input
                type="number"
                placeholder="Значение"
                value={newPromotion.value}
                onChange={(e) => setNewPromotion({ ...newPromotion, value: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                placeholder="Минимальная сумма заказа"
                value={newPromotion.minOrder}
                onChange={(e) => setNewPromotion({ ...newPromotion, minOrder: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Максимальное количество использований"
                value={newPromotion.maxUses}
                onChange={(e) => setNewPromotion({ ...newPromotion, maxUses: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="date"
                placeholder="Дата начала"
                value={newPromotion.startDate}
                onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="date"
                placeholder="Дата окончания"
                value={newPromotion.endDate}
                onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <textarea
              placeholder="Описание акции"
              value={newPromotion.description}
              onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Создать акцию
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getTypeColor(promotion.type)}`}>
                {getTypeIcon(promotion.type)}
                <span className="text-sm font-medium">
                  {getTypeLabel(promotion.type, promotion.value)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyPromotionCode(promotion.code)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-2">{promotion.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{promotion.description}</p>

            <div className="space-y-2 mb-4">
              <div className="font-mono text-lg font-bold text-center bg-gray-100 py-2 rounded">
                {promotion.code}
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Использовано:</span>
                <span>{promotion.currentUses}/{promotion.maxUses}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(promotion.currentUses / promotion.maxUses) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Мин. заказ: ${promotion.minOrder}</span>
                <span>До: {new Date(promotion.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                promotion.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {promotion.isActive ? 'Активна' : 'Неактивна'}
              </span>
              
              <button
                onClick={() => togglePromotionStatus(promotion.id)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  promotion.isActive
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {promotion.isActive ? 'Деактивировать' : 'Активировать'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Массовые действия</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
            Активировать выбранные
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors">
            Деактивировать выбранные
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Экспорт промокодов
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
            Аналитика использования
          </button>
        </div>
      </div>
    </div>
  );
}