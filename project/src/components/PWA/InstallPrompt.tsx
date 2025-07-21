import React from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    if (isInstallable) {
      // Show prompt after 30 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  if (!isInstallable || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Download className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Install AliExpress App
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Get the full app experience with offline access and push notifications.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={installApp}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded text-sm transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}