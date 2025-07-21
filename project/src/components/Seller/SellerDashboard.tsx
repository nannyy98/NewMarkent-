import React, { useState } from 'react';
import { Plus, Package, BarChart3, Settings, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AddProduct } from './AddProduct';
import { SellerAnalytics } from '../Analytics/SellerAnalytics';
import { PromoSystem } from '../Promotions/PromoSystem';

interface SellerDashboardProps {
  onBack: () => void;
}

export function SellerDashboard({ onBack }: SellerDashboardProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: t('seller.myProducts'), icon: Package },
    { id: 'add-product', label: t('seller.addProduct'), icon: Plus },
    { id: 'promotions', label: 'Promotions', icon: Settings },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 md:hidden"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('seller.dashboard')}</h1>
        <p className="text-gray-600 mt-2">Manage your products and track your sales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-600'
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {activeTab === 'overview' && (
              <SellerAnalytics />
            )}

            {activeTab === 'products' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Products</h2>
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No products added yet</p>
                  <button
                    onClick={() => setActiveTab('add-product')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Add Your First Product
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'add-product' && (
              <AddProduct />
            )}

            {activeTab === 'promotions' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Promotions & Discounts</h2>
                <PromoSystem />
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Seller Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Store Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Store Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Business Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <textarea
                      placeholder="Store Description"
                      rows={4}
                      className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Bank Account Number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Tax ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}