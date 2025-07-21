import { useApp } from '../contexts/AppContext';
import { translations, Language, TranslationKey } from '../i18n';

interface TranslationOptions {
  count?: number;
  [key: string]: any;
}

export function useTranslation() {
  const { state } = useApp();
  
  const t = (key: TranslationKey, options?: TranslationOptions): string => {
    let translation = translations[state.language][key] || translations.en[key] || key;
    
    // Handle pluralization
    if (options?.count !== undefined) {
      const count = options.count;
      if (state.language === 'ru') {
        // Russian pluralization rules
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
          // 11-14 use plural form
        } else if (lastDigit === 1) {
          // 1, 21, 31, etc. use singular
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          // 2-4, 22-24, etc. use few form
        }
      }
    }
    
    // Handle interpolation
    if (options) {
      Object.keys(options).forEach(key => {
        if (key !== 'count') {
          translation = translation.replace(`{${key}}`, String(options[key]));
        }
      });
    }
    
    return translation;
  };

  const formatCurrency = (amount: number, currency?: 'USD' | 'UZS'): string => {
    const currentCurrency = currency || state.currency;
    const symbol = currentCurrency === 'USD' ? '$' : 'сум';
    const value = currentCurrency === 'USD' ? amount : amount * 12500;
    
    if (currentCurrency === 'USD') {
      return `${symbol}${value.toFixed(2)}`;
    } else {
      return `${value.toLocaleString()} ${symbol}`;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}${t('number.billion')}`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}${t('number.million')}`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}${t('number.thousand')}`;
    }
    return num.toString();
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return t('time.now');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${t('time.minutes')} ${t('time.ago')}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${t('time.hours')} ${t('time.ago')}`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${t('time.days')} ${t('time.ago')}`;
    } else {
      return d.toLocaleDateString(state.language === 'uz' ? 'uz-UZ' : state.language === 'ru' ? 'ru-RU' : 'en-US');
    }
  };

  const getLanguageName = (lang: Language): string => {
    const names = {
      en: 'English',
      ru: 'Русский',
      uz: 'O\'zbek'
    };
    return names[lang];
  };

  const isRTL = (): boolean => {
    // Add RTL languages if needed
    return false;
  };

  return { 
    t, 
    formatCurrency, 
    formatNumber, 
    formatDate, 
    getLanguageName, 
    isRTL,
    currentLanguage: state.language,
    currentCurrency: state.currency
  };
}