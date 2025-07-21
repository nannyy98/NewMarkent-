import React, { useState } from 'react';
import { Tag, Percent, Gift, Clock, Users, Copy, Check } from 'lucide-react';

interface Promo {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minOrder: number;
  maxUses: number;
  currentUses: number;
  expiresAt: Date;
  isActive: boolean;
  description: string;
}

export function PromoSystem() {
  const [promos] = useState<Promo[]>([
    {
      id: '1',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrder: 50,
      maxUses: 1000,
      currentUses: 234,
      expiresAt: new Date('2024-12-31'),
      isActive: true,
      description: 'Welcome discount for new customers'
    },
    {
      id: '2',
      code: 'FREESHIP',
      type: 'shipping',
      value: 0,
      minOrder: 25,
      maxUses: 500,
      currentUses: 89,
      expiresAt: new Date('2024-06-30'),
      isActive: true,
      description: 'Free shipping on orders over $25'
    },
    {
      id: '3',
      code: 'SAVE20',
      type: 'fixed',
      value: 20,
      minOrder: 100,
      maxUses: 200,
      currentUses: 156,
      expiresAt: new Date('2024-03-31'),
      isActive: true,
      description: '$20 off orders over $100'
    }
  ]);

  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [promoInput, setPromoInput] = useState('');
  const [copiedCode, setCopiedCode] = useState<string>('');

  const handleApplyPromo = () => {
    const promo = promos.find(p => p.code.toLowerCase() === promoInput.toLowerCase() && p.isActive);
    if (promo) {
      setAppliedPromo(promo.code);
      alert(`Promo code ${promo.code} applied successfully!`);
    } else {
      alert('Invalid or expired promo code');
    }
    setPromoInput('');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getPromoIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-5 w-5" />;
      case 'fixed': return <Tag className="h-5 w-5" />;
      case 'shipping': return <Gift className="h-5 w-5" />;
      default: return <Tag className="h-5 w-5" />;
    }
  };

  const getPromoValue = (promo: Promo) => {
    switch (promo.type) {
      case 'percentage': return `${promo.value}% OFF`;
      case 'fixed': return `$${promo.value} OFF`;
      case 'shipping': return 'FREE SHIPPING';
      default: return '';
    }
  };

  const getPromoColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'fixed': return 'bg-green-100 text-green-600 border-green-200';
      case 'shipping': return 'bg-purple-100 text-purple-600 border-purple-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Apply Promo Code */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Apply Promo Code</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={handleApplyPromo}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Apply
          </button>
        </div>
        {appliedPromo && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">✓ Promo code {appliedPromo} applied!</p>
          </div>
        )}
      </div>

      {/* Available Promos */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Available Promotions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.filter(p => p.isActive).map((promo) => (
            <div key={promo.id} className={`border-2 border-dashed rounded-lg p-4 ${getPromoColor(promo.type)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getPromoIcon(promo.type)}
                  <span className="font-bold text-lg">{getPromoValue(promo)}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(promo.code)}
                  className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                >
                  {copiedCode === promo.code ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="font-mono text-lg font-bold tracking-wider bg-white bg-opacity-50 px-2 py-1 rounded text-center">
                  {promo.code}
                </div>
                <p className="text-sm opacity-90">{promo.description}</p>
                
                <div className="flex items-center space-x-4 text-xs opacity-75">
                  <div className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" />
                    <span>Min: ${promo.minOrder}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{promo.currentUses}/{promo.maxUses}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Until {promo.expiresAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div
                    className="bg-white bg-opacity-60 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(promo.currentUses / promo.maxUses) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loyalty Program */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Loyalty Program</h3>
            <p className="opacity-90 mb-4">Earn points with every purchase and unlock exclusive rewards!</p>
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">1,250</div>
                <div className="text-sm opacity-75">Points</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">Gold</div>
                <div className="text-sm opacity-75">Status</div>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            🏆
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to Platinum</span>
            <span>1,250 / 2,000 points</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: '62.5%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}