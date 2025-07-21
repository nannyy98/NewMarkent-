import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../i18n';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'modal';
  className?: string;
}

export function LanguageSwitcher({ variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const { state, dispatch } = useApp();
  const { getLanguageName } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' },
  ];

  const handleLanguageChange = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    setIsOpen(false);
    
    // Save to localStorage
    localStorage.setItem('preferred_language', language);
    
    // Update document language
    document.documentElement.lang = language;
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              state.language === lang.code
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        >
          <Globe className="h-5 w-5" />
          <span>{getLanguageName(state.language)}</span>
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Choose Language</h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      state.language === lang.code
                        ? 'bg-orange-100 text-orange-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </div>
                    {state.language === lang.code && (
                      <Check className="h-5 w-5 text-orange-600" />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Globe className="h-5 w-5" />
        <span className="text-sm">{state.language.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                lang.code === languages[0].code ? 'rounded-t-lg' : ''
              } ${
                lang.code === languages[languages.length - 1].code ? 'rounded-b-lg' : 'border-b border-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </div>
              {state.language === lang.code && (
                <Check className="h-4 w-4 text-orange-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Currency Switcher Component
interface CurrencySwitcherProps {
  variant?: 'dropdown' | 'buttons';
  className?: string;
}

export function CurrencySwitcher({ variant = 'dropdown', className = '' }: CurrencySwitcherProps) {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'USD' as const, name: 'US Dollar', symbol: '$' },
    { code: 'UZS' as const, name: 'Uzbek Som', symbol: 'сум' },
  ];

  const handleCurrencyChange = (currency: 'USD' | 'UZS') => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
    setIsOpen(false);
    
    // Save to localStorage
    localStorage.setItem('preferred_currency', currency);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {currencies.map((currency) => (
          <button
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              state.currency === currency.code
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {currency.code}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium">{state.currency}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {currencies.map((currency, index) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                index === 0 ? 'rounded-t-lg' : ''
              } ${
                index === currencies.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
              }`}
            >
              <span className="text-sm font-medium">{currency.code}</span>
              {state.currency === currency.code && (
                <Check className="h-4 w-4 text-orange-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Combined Language and Currency Switcher
export function LocaleSwitcher() {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile.language')}
        </label>
        <LanguageSwitcher variant="buttons" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile.currency')}
        </label>
        <CurrencySwitcher variant="buttons" />
      </div>
    </div>
  );
}