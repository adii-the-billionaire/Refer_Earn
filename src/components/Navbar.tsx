import React from 'react';
import { Users, TrendingUp, Wallet, BarChart3 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userStats?: {
    totalEarnings: number;
    directReferrals: number;
  };
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, userStats }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ReferralPro</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {userStats && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ₹{userStats.totalEarnings.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Total Earnings</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {userStats.directReferrals}
                </div>
                <div className="text-xs text-gray-500">Direct Referrals</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;