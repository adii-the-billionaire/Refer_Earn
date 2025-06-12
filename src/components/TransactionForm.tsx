import React, { useState } from 'react';
import { transactionService } from '../services/api';
import { Wallet, CreditCard, DollarSign, ArrowRight } from 'lucide-react';

interface TransactionFormProps {
  userId: string;
  onTransactionCreated: (transaction: any) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ userId, onTransactionCreated }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await transactionService.createTransaction({
        userId,
        amount: parseFloat(amount),
        description: description || `Purchase of ₹${amount}`,
      });

      onTransactionCreated(response);
      setAmount('');
      setDescription('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  const willGenerateProfit = parseFloat(amount) > 1000;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
        Make a Purchase
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {amount && (
            <div className={`mt-2 text-sm ${willGenerateProfit ? 'text-green-600' : 'text-orange-600'}`}>
              {willGenerateProfit 
                ? '✓ This purchase will generate referral earnings'
                : '⚠ Minimum ₹1000 required for referral earnings'
              }
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Purchase description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              Complete Purchase
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </button>
      </form>

      {willGenerateProfit && amount && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">Referral Earnings Preview:</h3>
          <div className="text-sm text-green-700 space-y-1">
            <div>Direct referrer will earn: ₹{(parseFloat(amount) * 0.05).toFixed(2)} (5%)</div>
            <div>Indirect referrer will earn: ₹{(parseFloat(amount) * 0.01).toFixed(2)} (1%)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;