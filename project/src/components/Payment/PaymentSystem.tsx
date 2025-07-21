import React, { useState } from 'react';
import { CreditCard, Smartphone, DollarSign, Shield, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'bank' | 'crypto';
  icon: React.ReactNode;
  fee: number;
  processingTime: string;
  available: boolean;
}

interface PaymentSystemProps {
  amount: number;
  onPaymentComplete: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

export function PaymentSystem({ amount, onPaymentComplete, onPaymentError }: PaymentSystemProps) {
  const { state } = useApp();
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'processing' | 'success' | 'error'>('select');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'click',
      name: 'Click',
      type: 'wallet',
      icon: <Smartphone className="h-6 w-6" />,
      fee: 0,
      processingTime: 'Мгновенно',
      available: true
    },
    {
      id: 'payme',
      name: 'Payme',
      type: 'wallet',
      icon: <Smartphone className="h-6 w-6" />,
      fee: 0,
      processingTime: 'Мгновенно',
      available: true
    },
    {
      id: 'uzcard',
      name: 'UzCard',
      type: 'card',
      icon: <CreditCard className="h-6 w-6" />,
      fee: 1.5,
      processingTime: '1-3 минуты',
      available: true
    },
    {
      id: 'humo',
      name: 'Humo',
      type: 'card',
      icon: <CreditCard className="h-6 w-6" />,
      fee: 1.5,
      processingTime: '1-3 минуты',
      available: true
    },
    {
      id: 'visa',
      name: 'Visa/MasterCard',
      type: 'card',
      icon: <CreditCard className="h-6 w-6" />,
      fee: 2.5,
      processingTime: '3-5 минут',
      available: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'wallet',
      icon: <DollarSign className="h-6 w-6" />,
      fee: 3.5,
      processingTime: '5-10 минут',
      available: true
    }
  ];

  const currencySymbol = state.currency === 'USD' ? '$' : 'сум';
  const displayAmount = state.currency === 'USD' ? amount : amount * 12500;
  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
  const feeAmount = selectedPaymentMethod ? (amount * selectedPaymentMethod.fee / 100) : 0;
  const totalAmount = amount + feeAmount;
  const displayTotal = state.currency === 'USD' ? totalAmount : totalAmount * 12500;

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    const method = paymentMethods.find(m => m.id === methodId);
    
    if (method?.type === 'wallet') {
      // For wallets, go directly to processing
      processPayment(methodId);
    } else {
      // For cards, show details form
      setPaymentStep('details');
    }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      onPaymentError('Заполните все поля карты');
      return;
    }
    processPayment(selectedMethod);
  };

  const processPayment = async (methodId: string) => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate success/failure (90% success rate)
      if (Math.random() > 0.1) {
        const paymentId = `PAY_${Date.now()}`;
        setPaymentStep('success');
        setTimeout(() => {
          onPaymentComplete(paymentId);
        }, 2000);
      } else {
        throw new Error('Ошибка обработки платежа');
      }
    } catch (error) {
      setPaymentStep('error');
      onPaymentError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (paymentStep === 'processing') {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Обработка платежа</h3>
        <p className="text-gray-600 mb-4">Пожалуйста, не закрывайте страницу</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-700">
            <Lock className="h-4 w-4" />
            <span className="text-sm">Ваш платеж защищен SSL-шифрованием</span>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Платеж успешно выполнен!</h3>
        <p className="text-gray-600 mb-4">
          Оплачено: {currencySymbol}{state.currency === 'USD' ? displayTotal.toFixed(2) : displayTotal.toLocaleString()}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm">Ваш заказ будет обработан в ближайшее время</p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'error') {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ошибка платежа</h3>
        <p className="text-gray-600 mb-4">Попробуйте другой способ оплаты</p>
        <button
          onClick={() => {
            setPaymentStep('select');
            setSelectedMethod('');
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (paymentStep === 'details') {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Данные карты</h3>
          <button
            onClick={() => setPaymentStep('select')}
            className="text-gray-500 hover:text-gray-700"
          >
            Назад
          </button>
        </div>

        <form onSubmit={handleCardSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер карты
            </label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({
                ...cardDetails,
                number: formatCardNumber(e.target.value)
              })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срок действия
              </label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  expiry: formatExpiry(e.target.value)
                })}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  cvv: e.target.value.replace(/\D/g, '').substring(0, 3)
                })}
                placeholder="123"
                maxLength={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя держателя карты
            </label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({
                ...cardDetails,
                name: e.target.value.toUpperCase()
              })}
              placeholder="IVAN IVANOV"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Сумма заказа:</span>
              <span className="font-medium">
                {currencySymbol}{state.currency === 'USD' ? amount.toFixed(2) : displayAmount.toLocaleString()}
              </span>
            </div>
            {feeAmount > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Комиссия ({selectedPaymentMethod?.fee}%):</span>
                <span className="font-medium">
                  {currencySymbol}{state.currency === 'USD' ? feeAmount.toFixed(2) : (feeAmount * 12500).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-2">
              <span>Итого к оплате:</span>
              <span className="text-orange-600">
                {currencySymbol}{state.currency === 'USD' ? displayTotal.toFixed(2) : displayTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Shield className="h-5 w-5" />
            <span>Оплатить безопасно</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Выберите способ оплаты</h3>
      
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            disabled={!method.available}
            className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
              method.available
                ? 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                method.available ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {method.icon}
              </div>
              <div className="text-left">
                <div className={`font-medium ${method.available ? 'text-gray-900' : 'text-gray-400'}`}>
                  {method.name}
                </div>
                <div className="text-sm text-gray-500">
                  {method.processingTime}
                  {method.fee > 0 && ` • Комиссия ${method.fee}%`}
                </div>
              </div>
            </div>
            {!method.available && (
              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                Недоступно
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Безопасные платежи</h4>
            <p className="text-sm text-blue-700 mt-1">
              Все платежи защищены SSL-шифрованием. Мы не храним данные ваших карт.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}