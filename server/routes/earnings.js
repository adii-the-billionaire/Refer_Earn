import express from 'express';
import Earning from '../models/Earning.js';
import User from '../models/User.js';

const router = express.Router();

// Get earnings for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const earnings = await Earning.find({ userId: req.params.userId })
      .populate('fromUserId', 'username')
      .populate('transactionId', 'amount description')
      .sort({ createdAt: -1 });

    res.json(earnings);
  } catch (error) {
    console.error('Get user earnings error:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

// Get all earnings (admin)
router.get('/', async (req, res) => {
  try {
    const earnings = await Earning.find()
      .populate('userId', 'username')
      .populate('fromUserId', 'username')
      .populate('transactionId', 'amount description')
      .sort({ createdAt: -1 });

    res.json(earnings);
  } catch (error) {
    console.error('Get all earnings error:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

// Get earnings statistics for a user
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const earnings = await Earning.find({ userId });
    
    const directEarnings = earnings.filter(e => e.referralLevel === 1);
    const indirectEarnings = earnings.filter(e => e.referralLevel === 2);

    const stats = {
      total: {
        count: earnings.length,
        amount: user.totalEarnings
      },
      direct: {
        count: directEarnings.length,
        amount: user.totalDirectEarnings
      },
      indirect: {
        count: indirectEarnings.length,
        amount: user.totalIndirectEarnings
      },
      averageEarning: earnings.length > 0 ? user.totalEarnings / earnings.length : 0,
      lastEarning: earnings.length > 0 ? earnings[earnings.length - 1].createdAt : null
    };

    res.json(stats);
  } catch (error) {
    console.error('Get earnings stats error:', error);
    res.status(500).json({ error: 'Failed to fetch earnings statistics' });
  }
});

export default router;