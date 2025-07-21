import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Star, Package, AlertTriangle } from 'lucide-react';

interface AdminProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  seller: string;
  stock: number;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  image: string;
  createdAt: string;
}

export function AdminProducts() {
  const [products] = useState<AdminProduct[]>([
    {
      id: '1',
      title: 'Wireless Bluetooth Headphones',
      price: 29.99,
      category: 'Electronics',
      seller: 'TechStore',
      stock: 150,
      rating: 4.5,
      reviews: 1234,
      status: 'active',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Smart Watch Series 8',
      price: 199.99,
      category: 'Electronics',
      seller: 'GadgetWorld',
      stock: 0,
      rating: 4.7,
      reviews: 856,
      status: 'active',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Gaming Keyboard RGB',
      price: 89.99,
      category: 'Electronics',
      seller: 'GameGear',
      stock: 75,
      rating: 4.8,
      reviews: 567,
      status: 'pending',
      image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=100',
      createdAt: '2024-01-18'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Управление товарами</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Добавить товар</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все категории</option>
            <option value="Electronics">Электроника</option>
            <option value="Fashion">Мода</option>
            <option value="Home">Дом и сад</option>
            <option value="Sports">Спорт</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="pending">На модерации</option>
            <option value="inactive">Неактивные</option>
            <option value="rejected">Отклоненные</option>
          </select>

          <div className="flex space-x-2">
            <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
              Экспорт
            </button>
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              Импорт
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                  {product.status === 'active' ? 'Активен' : 
                   product.status === 'pending' ? 'На модерации' : 
                   product.status === 'inactive' ? 'Неактивен' : 'Отклонен'}
                </span>
              </div>
              {product.stock === 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Нет в наличии
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-green-600">${product.price}</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <p>Продавец: {product.seller}</p>
                <p>Категория: {product.category}</p>
                <p className="flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  Остаток: {product.stock}
                  {product.stock < 10 && product.stock > 0 && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500 ml-1" />
                  )}
                </p>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Просмотр
                </button>
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Изменить
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
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
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
            Удалить выбранные
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Экспорт выбранных
          </button>
        </div>
      </div>
    </div>
  );
}