import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api';
import { Transaction } from '../types';
import { Wallet, Calendar, TrendingUp, Filter, CreditCard } from 'lucide-react';

interface TransactionsListProps {
  userId: string;
  onTransactionCreated?: (transaction: any) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ userId, onTransactionCreated }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getUserTransactions(userId);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const profitGeneratingTransactions = filteredTransactions.filter(t => t.profitGenerated).length;

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
            <Wallet className="h-5 w-5 mr-2 text-blue-600" />
            Transaction History
          </h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">₹{totalAmount.toLocaleString()}</div>
            <div className="text-sm text-blue-700">Total Amount</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{filteredTransactions.length}</div>
            <div className="text-sm text-green-700">Total Transactions</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{profitGeneratingTransactions}</div>
            <div className="text-sm text-purple-700">Profit Generating</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {filteredTransactions.length > 0 ? `₹${(totalAmount / filteredTransactions.length).toFixed(2)}` : '₹0'}
            </div>
            <div className="text-sm text-orange-700">Average Amount</div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.profitGenerated ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {transaction.profitGenerated ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        ₹{transaction.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.description}
                      </div>
                      {transaction.profitGenerated && (
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Generated referral earnings
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No transactions found</p>
            <p className="text-sm">Make your first purchase to see transaction history!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;