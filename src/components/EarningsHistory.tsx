import React, { useState, useEffect } from 'react';
import { earningsService } from '../services/api';
import { Earning } from '../types';
import { TrendingUp, Calendar, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface EarningsHistoryProps {
  userId: string;
}

const EarningsHistory: React.FC<EarningsHistoryProps> = ({ userId }) => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'direct' | 'indirect'>('all');

  useEffect(() => {
    fetchEarnings();
  }, [userId]);

  const fetchEarnings = async () => {
    try {
      const data = await earningsService.getUserEarnings(userId);
      setEarnings(data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEarnings = earnings.filter(earning => {
    if (filter === 'all') return true;
    if (filter === 'direct') return earning.referralLevel === 1;
    if (filter === 'indirect') return earning.referralLevel === 2;
    return true;
  });

  const totalEarnings = filteredEarnings.reduce((sum, earning) => sum + earning.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Earnings History
          </h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Earnings</option>
              <option value="direct">Direct Only</option>
              <option value="indirect">Indirect Only</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">₹{totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-green-700">
              {filter === 'all' ? 'Total' : filter === 'direct' ? 'Direct' : 'Indirect'} Earnings
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{filteredEarnings.length}</div>
            <div className="text-sm text-blue-700">Total Transactions</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {filteredEarnings.length > 0 ? `₹${(totalEarnings / filteredEarnings.length).toFixed(2)}` : '₹0'}
            </div>
            <div className="text-sm text-purple-700">Average Earning</div>
          </div>
        </div>
      </div>

      {/* Earnings List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {filteredEarnings.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredEarnings.map((earning) => (
              <div key={earning._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      earning.referralLevel === 1 ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {earning.referralLevel === 1 ? (
                        <ArrowUpRight className={`h-5 w-5 ${
                          earning.referralLevel === 1 ? 'text-blue-600' : 'text-purple-600'
                        }`} />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        ₹{earning.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {earning.referralLevel === 1 ? 'Direct' : 'Indirect'} earning • {earning.percentage}% commission
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        From transaction of ₹{earning.transactionAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      earning.referralLevel === 1 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      Level {earning.referralLevel}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(earning.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No earnings found</p>
            <p className="text-sm">Start referring people to see your earnings here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsHistory;