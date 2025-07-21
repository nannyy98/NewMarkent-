import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, ShoppingCart, Star, TrendingUp, Settings, 
  Plus, Edit, Trash2, Eye, Ban, CheckCircle, AlertTriangle,
  DollarSign, BarChart3, MessageSquare, Tag, Shield, FileText, LogOut
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { AdminUsers } from './AdminUsers';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminReviews } from './AdminReviews';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminPromotions } from './AdminPromotions';
import { AdminSettings } from './AdminSettings';

export function AdminDashboard() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin-login');
  };

  // Mock admin stats
  const stats = {
    totalUsers: 15420,
    totalSellers: 1250,
    totalProducts: 45680,
    totalOrders: 8920,
    totalRevenue: 2450000,
    pendingReviews: 156,
    activeCoupons: 23,
    pendingVerifications: 12
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: BarChart3 },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'products', label: 'Товары', icon: Package },
    { id: 'orders', label: 'Заказы', icon: ShoppingCart },
    { id: 'reviews', label: 'Отзывы', icon: Star },
    { id: 'promotions', label: 'Акции', icon: Tag },
    { id: 'analytics', label: 'Аналитика', icon: TrendingUp },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  const quickActions = [
    { label: 'Добавить товар', icon: Plus, action: () => setActiveTab('products') },
    { label: 'Создать скидку', icon: Tag, action: () => setActiveTab('promotions') },
    { label: 'Модерация отзывов', icon: MessageSquare, action: () => setActiveTab('reviews') },
    { label: 'Верификация продавцов', icon: Shield, action: () => setActiveTab('users') },
  ];

  const recentActivity = [
    { type: 'order', message: 'Новый заказ #12345 на сумму $156.99', time: '2 мин назад' },
    { type: 'user', message: 'Новый продавец зарегистрировался', time: '15 мин назад' },
    { type: 'review', message: 'Новый отзыв требует модерации', time: '1 час назад' },
    { type: 'product', message: 'Товар "iPhone 15" добавлен', time: '2 часа назад' },
  ];

  if (!state.user || state.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещен</h2>
          <p className="text-gray-600">У вас нет прав администратора</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Админ панель</h1>
          <p className="text-gray-600 mt-2">Управление маркетплейсом</p>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Выйти из панели администратора</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Пользователи</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+12% за месяц</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Товары</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+8% за месяц</p>
                      </div>
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Заказы</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+15% за месяц</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Доходы</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+22% за месяц</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Быстрые действия</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <action.icon className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Activity & Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Последняя активность</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Требуют внимания</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm font-medium">Отзывы на модерации</span>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          {stats.pendingReviews}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium">Верификация продавцов</span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {stats.pendingVerifications}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Tag className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium">Активные акции</span>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {stats.activeCoupons}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'orders' && <AdminOrders />}
            {activeTab === 'reviews' && <AdminReviews />}
            {activeTab === 'promotions' && <AdminPromotions />}
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}