import React, { useEffect, useState } from 'react';
import { X, TrendingUp, Users } from 'lucide-react';
import { EarningsUpdate } from '../types';

interface NotificationToastProps {
  notification: EarningsUpdate | null;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-4 max-w-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="bg-green-100 rounded-full p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-gray-900">
              New Earning! 🎉
            </div>
            <div className="text-sm text-gray-700 mt-1">
              You earned <span className="font-semibold text-green-600">₹{notification.amount.toLocaleString()}</span> from{' '}
              {notification.type === 'direct' ? (
                <span>direct referral <strong>{notification.from}</strong></span>
              ) : (
                <span>indirect referral <strong>{notification.from}</strong> through <strong>{notification.through}</strong></span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Transaction: ₹{notification.transactionAmount.toLocaleString()} • 
              Total Earnings: ₹{notification.totalEarnings.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;