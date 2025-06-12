import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, parentReferralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this username or email already exists' 
      });
    }

    let parentUser = null;
    let position = null;
    let level = 0;

    // If parent referral code provided, find parent and assign position
    if (parentReferralCode) {
      parentUser = await User.findOne({ referralCode: parentReferralCode });
      
      if (!parentUser) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }

      // Check if parent has space for more referrals (max 8)
      if (parentUser.directReferrals.length >= 8) {
        return res.status(400).json({ 
          error: 'Referrer has reached maximum referral limit (8)' 
        });
      }

      position = parentUser.directReferrals.length + 1;
      level = parentUser.level + 1;
    }

    // Generate referral code
    const referralCode = username.toUpperCase() + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Create new user
    const newUser = new User({
      username,
      email,
      parentId: parentUser ? parentUser._id : null,
 referralCode,
      position,
      level
    });

    await newUser.save();

    // Update parent's direct referrals
    if (parentUser) {
      parentUser.directReferrals.push(newUser._id);
      await parentUser.save();
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        referralCode: newUser.referralCode,
        level: newUser.level,
        position: newUser.position
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Get user profile with referral tree
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('parentId', 'username referralCode')
      .populate('directReferrals', 'username referralCode level totalEarnings');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .populate('parentId', 'username')
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user earnings (internal use)
router.put('/:userId/earnings', async (req, res) => {
  try {
    const { directEarnings, indirectEarnings } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (directEarnings !== undefined) {
      user.totalDirectEarnings += directEarnings;
    }
    
    if (indirectEarnings !== undefined) {
      user.totalIndirectEarnings += indirectEarnings;
    }

    user.totalEarnings = user.totalDirectEarnings + user.totalIndirectEarnings;
    await user.save();

    res.json({
      message: 'Earnings updated successfully',
      totalEarnings: user.totalEarnings,
      totalDirectEarnings: user.totalDirectEarnings,
      totalIndirectEarnings: user.totalIndirectEarnings
    });
  } catch (error) {
    console.error('Update earnings error:', error);
    res.status(500).json({ error: 'Failed to update earnings' });
  }
});

export default router;