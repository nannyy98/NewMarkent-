import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Users, Eye, ShoppingCart, Star } from 'lucide-react';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalViews: number;
  conversionRate: number;
  averageRating: number;
  salesByMonth: { month: string; sales: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  recentOrders: { id: string; date: string; amount: number; status: string }[];
}

export function SellerAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics({
        totalSales: 45230,
        totalOrders: 1247,
        totalProducts: 156,
        totalViews: 23450,
        conversionRate: 5.3,
        averageRating: 4.7,
        salesByMonth: [
          { month: 'Jan', sales: 12000 },
          { month: 'Feb', sales: 15000 },
          { month: 'Mar', sales: 18000 },
          { month: 'Apr', sales: 22000 },
          { month: 'May', sales: 25000 },
          { month: 'Jun', sales: 28000 },
        ],
        topProducts: [
          { name: 'Wireless Headphones', sales: 234, revenue: 7020 },
          { name: 'Smart Watch', sales: 189, revenue: 17010 },
          { name: 'Phone Case', sales: 156, revenue: 1560 },
        ],
        recentOrders: [
          { id: 'ORD-1001', date: '2024-01-15', amount: 89.99, status: 'completed' },
          { id: 'ORD-1002', date: '2024-01-14', amount: 156.50, status: 'shipped' },
          { id: 'ORD-1003', date: '2024-01-14', amount: 45.00, status: 'processing' },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const statCards = [
    {
      title: 'Total Sales',
      value: `$${analytics.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+8.2%',
    },
    {
      title: 'Products',
      value: analytics.totalProducts.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+3 new',
    },
    {
      title: 'Page Views',
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15.3%',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Trend</h3>
          <div className="space-y-4">
            {analytics.salesByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(item.sales / 30000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${item.sales.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Conversion Rate</span>
              </div>
              <span className="text-lg font-bold text-green-600">{analytics.conversionRate}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-700">Average Rating</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">{analytics.averageRating}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Return Customers</span>
              </div>
              <span className="text-lg font-bold text-blue-600">68%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
                <span className="font-bold text-green-600">${product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {analytics.recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-600' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}