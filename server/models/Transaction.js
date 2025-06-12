import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  description: {
    type: String,
    default: ''
  },
  profitGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Transaction', transactionSchema);