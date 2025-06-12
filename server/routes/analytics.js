import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Earning from '../models/Earning.js';

const router = express.Router();

// Get analytics data for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user with populated referrals
    const user = await User.findById(userId)
      .populate('directReferrals', 'username totalEarnings level')
      .populate('parentId', 'username');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's transactions
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 });

    // Get user's earnings
    const earnings = await Earning.find({ userId })
      .populate('fromUserId', 'username')
      .sort({ createdAt: -1 });

    // Calculate analytics
    const totalTransactionAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const profitGeneratingTransactions = transactions.filter(t => t.profitGenerated).length;
    
    const directEarnings = earnings.filter(e => e.referralLevel === 1);
    const indirectEarnings = earnings.filter(e => e.referralLevel === 2);

    const analytics = {
      user: {
        id: user._id,
        username: user.username,
        level: user.level,
        totalEarnings: user.totalEarnings,
        directReferrals: user.directReferrals.length,
        maxReferrals: 8,
        referralCode: user.referralCode
      },
      transactions: {
        total: transactions.length,
        totalAmount: totalTransactionAmount,
        profitGenerating: profitGeneratingTransactions,
        averageAmount: transactions.length > 0 ? totalTransactionAmount / transactions.length : 0,
        recent: transactions.slice(0, 10)
      },
      earnings: {
        total: earnings.length,
        totalAmount: user.totalEarnings,
        direct: {
          count: directEarnings.length,
          amount: user.totalDirectEarnings
        },
        indirect: {
          count: indirectEarnings.length,
          amount: user.totalIndirectEarnings
        },
        recent: earnings.slice(0, 10)
      },
      referrals: {
        direct: user.directReferrals,
        availableSlots: 8 - user.directReferrals.length,
        parent: user.parentId
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get system-wide analytics (admin)
router.get('/system', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalEarnings = await Earning.countDocuments();
    
    const totalTransactionAmount = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalEarningsAmount = await Earning.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const topEarners = await User.find()
      .sort({ totalEarnings: -1 })
      .limit(10)
      .select('username totalEarnings level directReferrals');

    const recentActivity = await Transaction.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(20);

    const systemAnalytics = {
      overview: {
        totalUsers,
        totalTransactions,
        totalEarnings,
        totalTransactionAmount: totalTransactionAmount[0]?.total || 0,
        totalEarningsAmount: totalEarningsAmount[0]?.total || 0
      },
      topEarners,
      recentActivity
    };

    res.json(systemAnalytics);
  } catch (error) {
    console.error('System analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch system analytics' });
  }
});

export default router;