import React, { useState } from 'react';
import { TrendingUp, Users, Package, DollarSign, ShoppingCart, Star, Eye, Download } from 'lucide-react';

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = {
    totalRevenue: 2450000,
    totalOrders: 8920,
    totalUsers: 15420,
    totalProducts: 45680,
    conversionRate: 3.2,
    averageOrderValue: 156.50,
    returnRate: 2.1,
    customerSatisfaction: 4.6
  };

  const salesData = [
    { month: 'Янв', sales: 120000, orders: 850 },
    { month: 'Фев', sales: 150000, orders: 1020 },
    { month: 'Мар', sales: 180000, orders: 1200 },
    { month: 'Апр', sales: 220000, orders: 1450 },
    { month: 'Май', sales: 250000, orders: 1680 },
    { month: 'Июн', sales: 280000, orders: 1890 }
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 1250, revenue: 37500 },
    { name: 'Smart Watch', sales: 890, revenue: 178000 },
    { name: 'Gaming Keyboard', sales: 670, revenue: 60300 },
    { name: 'Phone Case', sales: 1450, revenue: 14500 },
    { name: 'Bluetooth Speaker', sales: 520, revenue: 31200 }
  ];

  const topCategories = [
    { name: 'Electronics', percentage: 45, revenue: 1102500 },
    { name: 'Fashion', percentage: 25, revenue: 612500 },
    { name: 'Home & Garden', percentage: 15, revenue: 367500 },
    { name: 'Sports', percentage: 10, revenue: 245000 },
    { name: 'Beauty', percentage: 5, revenue: 122500 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Аналитика и отчеты</h2>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
            <option value="90d">Последние 90 дней</option>
            <option value="1y">Последний год</option>
          </select>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общий доход</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+15.3% за месяц</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Заказы</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
              <p className="text-sm text-green-600">+8.2% за месяц</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Пользователи</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12.1% за месяц</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Конверсия</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              <p className="text-sm text-green-600">+0.5% за месяц</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Продажи по месяцам</h3>
          <div className="space-y-4">
            {salesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-12">{item.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(item.sales / 300000) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${item.sales.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.orders} заказов
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Ключевые показатели</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Средний чек</span>
              </div>
              <span className="text-lg font-bold text-green-600">${stats.averageOrderValue}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-700">Удовлетворенность</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">{stats.customerSatisfaction}/5</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Конверсия</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{stats.conversionRate}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-red-600" />
                <span className="text-gray-700">Возвраты</span>
              </div>
              <span className="text-lg font-bold text-red-600">{stats.returnRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Топ товары</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} продаж</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">${product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Топ категории</h3>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ${category.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Дополнительная аналитика</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">68%</div>
            <div className="text-sm text-gray-600">Повторные покупки</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4.2</div>
            <div className="text-sm text-gray-600">Среднее время на сайте (мин)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">12.5%</div>
            <div className="text-sm text-gray-600">Рост трафика</div>
          </div>
        </div>
      </div>
    </div>
  );
}