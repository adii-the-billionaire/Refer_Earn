import mongoose from 'mongoose';

const earningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  referralLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Earning', earningSchema);