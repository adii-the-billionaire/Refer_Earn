import express from 'express';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Earning from '../models/Earning.js';

const router = express.Router();

// Create new transaction and calculate profits
router.post('/', async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const io = req.app.get('io');

    // Validate input
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid userId and amount are required' });
    }

    // Find user making the transaction
    const user = await User.findById(userId).populate('parentId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create transaction
    const transaction = new Transaction({
      userId,
      amount,
      description: description || `Purchase of ${amount}Rs`
    });

    await transaction.save();

    // Only calculate profits if amount > 1000
    if (amount > 1000) {
      transaction.profitGenerated = true;
      await transaction.save();

      await calculateAndDistributeProfits(transaction, user, io);
    }

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
      profitGenerated: amount > 1000
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Function to calculate and distribute profits
async function calculateAndDistributeProfits(transaction, user, io) {
  const earnings = [];

  // Level 1: Direct parent gets 5%
  if (user.parentId) {
    const directParent = await User.findById(user.parentId);
    if (directParent && directParent.isActive) {
      const directEarning = (transaction.amount * 5) / 100;
      
      const earning = new Earning({
        userId: directParent._id,
        transactionId: transaction._id,
        referralLevel: 1,
        amount: directEarning,
        percentage: 5,
        fromUserId: user._id,
        transactionAmount: transaction.amount
      });

      await earning.save();
      earnings.push(earning);

      // Update parent's earnings
      directParent.totalDirectEarnings += directEarning;
      directParent.totalEarnings += directEarning;
      await directParent.save();

      // Send real-time notification
      io.to(`user-${directParent._id}`).emit('earnings-update', {
        type: 'direct',
        amount: directEarning,
        from: user.username,
        transactionAmount: transaction.amount,
        totalEarnings: directParent.totalEarnings
      });

      // Level 2: Grandparent gets 1% of the direct parent's profit
      const grandParent = await User.findById(directParent.parentId);
      if (grandParent && grandParent.isActive) {
        const indirectEarning = (transaction.amount * 1) / 100;
        
        const indirectEarningRecord = new Earning({
          userId: grandParent._id,
          transactionId: transaction._id,
          referralLevel: 2,
          amount: indirectEarning,
          percentage: 1,
          fromUserId: user._id,
          transactionAmount: transaction.amount
        });

        await indirectEarningRecord.save();
        earnings.push(indirectEarningRecord);

        // Update grandparent's earnings
        grandParent.totalIndirectEarnings += indirectEarning;
        grandParent.totalEarnings += indirectEarning;
        await grandParent.save();

        // Send real-time notification
        io.to(`user-${grandParent._id}`).emit('earnings-update', {
          type: 'indirect',
          amount: indirectEarning,
          from: user.username,
          through: directParent.username,
          transactionAmount: transaction.amount,
          totalEarnings: grandParent.totalEarnings
        });
      }
    }
  }

  return earnings;
}

// Get user transactions
router.get('/user/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get all transactions (for admin)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;