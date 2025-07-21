import React, { useState } from 'react';
import { Search, Star, CheckCircle, X, Eye, Flag, MessageSquare } from 'lucide-react';

interface AdminReview {
  id: string;
  productName: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  reported: boolean;
  helpful: number;
  images?: string[];
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([
    {
      id: '1',
      productName: 'Wireless Bluetooth Headphones',
      productId: 'prod-1',
      customerName: 'Алексей И.',
      rating: 5,
      comment: 'Отличные наушники! Звук чистый, батарея держит долго. Рекомендую всем!',
      date: '2024-01-20',
      status: 'pending',
      reported: false,
      helpful: 12,
      images: ['https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200']
    },
    {
      id: '2',
      productName: 'Smart Watch Series 8',
      productId: 'prod-2',
      customerName: 'Мария П.',
      rating: 4,
      comment: 'Хорошие часы, но цена завышена. Функционал богатый, но есть мелкие баги.',
      date: '2024-01-19',
      status: 'approved',
      reported: false,
      helpful: 8
    },
    {
      id: '3',
      productName: 'Gaming Keyboard',
      productId: 'prod-3',
      customerName: 'Иван С.',
      rating: 1,
      comment: 'Полное разочарование! Клавиши западают, подсветка не работает. Деньги на ветер!',
      date: '2024-01-18',
      status: 'pending',
      reported: true,
      helpful: 3
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateReviewStatus = (reviewId: string, newStatus: 'approved' | 'rejected') => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Модерация отзывов</h2>
        <div className="flex space-x-2">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
            Одобрить все
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
            Отклонить спам
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск отзывов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="pending">На модерации</option>
            <option value="approved">Одобрены</option>
            <option value="rejected">Отклонены</option>
          </select>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все рейтинги</option>
            <option value="5">5 звезд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </select>

          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              Экспорт
            </button>
            <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
              Аналитика
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">{review.productName}</h3>
                    {review.reported && (
                      <Flag className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                    {review.status === 'pending' ? 'На модерации' : 
                     review.status === 'approved' ? 'Одобрен' : 'Отклонен'}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">от {review.customerName}</span>
                  <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                  <span className="text-sm text-gray-500">{review.helpful} считают полезным</span>
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex space-x-2 mb-4">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        onClick={() => setSelectedReview(review)}
                      />
                    ))}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Подробнее</span>
                  </button>
                  
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReviewStatus(review.id, 'approved')}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Одобрить</span>
                      </button>
                      <button
                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        <X className="h-4 w-4" />
                        <span>Отклонить</span>
                      </button>
                    </>
                  )}
                  
                  <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-800 text-sm">
                    <MessageSquare className="h-4 w-4" />
                    <span>Ответить</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">Детали отзыва</h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Товар</h4>
                <p className="text-gray-700">{selectedReview.productName}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Рейтинг</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < selectedReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({selectedReview.rating}/5)</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Комментарий</h4>
                <p className="text-gray-700">{selectedReview.comment}</p>
              </div>
              
              {selectedReview.images && selectedReview.images.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Фотографии</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedReview.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p>Автор: {selectedReview.customerName}</p>
                  <p>Дата: {new Date(selectedReview.date).toLocaleDateString()}</p>
                  <p>Полезность: {selectedReview.helpful} голосов</p>
                </div>
                
                {selectedReview.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        updateReviewStatus(selectedReview.id, 'approved');
                        setSelectedReview(null);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => {
                        updateReviewStatus(selectedReview.id, 'rejected');
                        setSelectedReview(null);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}