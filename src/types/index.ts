export interface User {
  _id: string;
  username: string;
  email: string;
  parentId?: string;
  position?: number;
  referralCode: string;
  level: number;
  directReferrals: User[];
  totalEarnings: number;
  totalDirectEarnings: number;
  totalIndirectEarnings: number;
  isActive: boolean;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  profitGenerated: boolean;
  createdAt: string;
}

export interface Earning {
  _id: string;
  userId: string;
  transactionId: string;
  referralLevel: number;
  amount: number;
  percentage: number;
  fromUserId: string;
  transactionAmount: number;
  createdAt: string;
}

export interface EarningsUpdate {
  type: 'direct' | 'indirect';
  amount: number;
  from: string;
  through?: string;
  transactionAmount: number;
  totalEarnings: number;
}