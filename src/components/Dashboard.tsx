import React from 'react';
import { User } from '../types';
import { TrendingUp, Users, Wallet, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  recentTransactions: any[];
  recentEarnings: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, recentTransactions, recentEarnings }) => {
  const stats = [
    {
      title: 'Total Earnings',
      value: `₹${user.totalEarnings.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Direct Earnings',
      value: `₹${user.totalDirectEarnings.toLocaleString()}`,
      change: '+8.2%',
      changeType: 'positive',
      icon: ArrowUpRight,
      color: 'bg-blue-500',
    },
    {
      title: 'Indirect Earnings',
      value: `₹${user.totalIndirectEarnings.toLocaleString()}`,
      change: '+15.7%',
      changeType: 'positive',
      icon: ArrowDownRight,
      color: 'bg-purple-500',
    },
    {
      title: 'Direct Referrals',
      value: user.directReferrals.length,
      change: `${8 - user.directReferrals.length} remaining`,
      changeType: 'neutral',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.username}!</h1>
        <p className="text-blue-100">
          Your referral code: <span className="font-mono bg-white/20 px-2 py-1 rounded">{user.referralCode}</span>
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <span>Level {user.level}</span>
          <span>•</span>
          <span>Position {user.position || 'Root'}</span>
          <span>•</span>
          <span>Active since {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-blue-600" />
            Recent Transactions
          </h2>
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">₹{transaction.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{transaction.description}</div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Recent Earnings
          </h2>
          <div className="space-y-3">
            {recentEarnings.slice(0, 5).map((earning, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">₹{earning.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">
                    Level {earning.referralLevel} • {earning.percentage}% commission
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    earning.referralLevel === 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {earning.referralLevel === 1 ? 'Direct' : 'Indirect'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(earning.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;