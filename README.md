# Multi-Level Referral and Earning System
@ADITYA SHUKLA REFERAL GAME
A comprehensive referral system with real-time earnings tracking, built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Core Functionality
- **Multi-Level Referral System**: Users can refer up to 8 people directly
- **Automated Profit Distribution**: 
  - Direct referrals earn 5% commission
  - Indirect referrals earn 1% commission
- **Real-Time Updates**: Live earnings notifications via Socket.io
- **Transaction Management**: Track all purchases and earnings
- **Interactive Dashboard**: Comprehensive analytics and reporting

### User Experience
- **Beautiful UI**: Modern design with smooth animations
- **Responsive Design**: Works perfectly on all devices
- **Real-Time Notifications**: Instant earning alerts
- **Visual Referral Tree**: See your network structure
- **Detailed Analytics**: Track performance and earnings

## 🏗️ System Architecture

### Database Schema

#### Users Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  parentId: ObjectId (reference to parent user),
  position: Number (1-8, position under parent),
  referralCode: String (unique),
  level: Number (hierarchy level),
  directReferrals: [ObjectId] (array of direct referrals),
  totalEarnings: Number,
  totalDirectEarnings: Number,
  totalIndirectEarnings: Number,
  isActive: Boolean,
  createdAt: Date
}
```

#### Transactions Collection
```javascript
{
  userId: ObjectId (reference to user),
  amount: Number,
  status: String (pending/completed/failed),
  description: String,
  profitGenerated: Boolean (true if amount > 1000),
  createdAt: Date
}
```

#### Earnings Collection
```javascript
{
  userId: ObjectId (earning user),
  transactionId: ObjectId (source transaction),
  referralLevel: Number (1 or 2),
  amount: Number (earning amount),
  percentage: Number (5% or 1%),
  fromUserId: ObjectId (user who made purchase),
  transactionAmount: Number (original purchase amount),
  createdAt: Date
}
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd multi-level-referral-system
npm install
```

2. **Environment Configuration**:
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/referral_system
PORT=5000
NODE_ENV=development
```

3. **Start the development servers**:
```bash
# Start both backend and frontend
npm run dev

# Or start individually
npm run server  # Backend only
npm run client  # Frontend only
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Currently using simple user ID-based authentication for demo purposes.

### Endpoints

#### Users API

**Register User**
```http
POST /users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "parentReferralCode": "JANE123ABC" // optional
}
```

**Get User Profile**
```http
GET /users/:userId
```

**Get All Users** (Admin)
```http
GET /users
```

#### Transactions API

**Create Transaction**
```http
POST /transactions
Content-Type: application/json

{
  "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "amount": 1500,
  "description": "Product purchase"
}
```

**Get User Transactions**
```http
GET /transactions/user/:userId
```

**Get All Transactions** (Admin)
```http
GET /transactions
```

#### Earnings API

**Get User Earnings**
```http
GET /earnings/user/:userId
```

**Get Earnings Statistics**
```http
GET /earnings/stats/:userId
```

**Get All Earnings** (Admin)
```http
GET /earnings
```

#### Analytics API

**Get User Analytics**
```http
GET /analytics/user/:userId
```

**Get System Analytics** (Admin)
```http
GET /analytics/system
```

## 💰 Profit Distribution Logic

### Conditions
- Earnings are generated only when purchase amount > ₹1000
- Maximum 8 direct referrals per user
- 2-level deep profit sharing

### Calculation Examples

**Purchase: ₹2000**
- Direct parent earns: ₹100 (5% of ₹2000)
- Grandparent earns: ₹20 (1% of ₹2000)

**Purchase: ₹800**
- No earnings generated (below ₹1000 threshold)

## 🔄 Real-Time Features

### Socket.io Implementation
- Users join their personal room: `user-${userId}`
- Real-time earnings notifications
- Live dashboard updates
- Instant transaction confirmations

### Event Types
```javascript
// Client joins user room
socket.emit('join-user-room', userId);

// Server sends earnings update
socket.emit('earnings-update', {
  type: 'direct' | 'indirect',
  amount: 100,
  from: 'username',
  through: 'parent_username', // for indirect
  transactionAmount: 2000,
  totalEarnings: 1500
});
```



## 📊 Business Logic

### User Registration Flow
1. User provides username, email, and optional referral code
2. System validates referral code and checks parent capacity
3. User assigned position (1-8) under parent
4. Unique referral code generated
5. User added to parent's direct referrals list

### Transaction Processing Flow
1. User creates transaction with amount
2. System checks if amount > ₹1000
3. If eligible, calculates earnings for parent chain
4. Creates earning records in database
5. Updates user earning totals
6. Sends real-time notifications via Socket.io

### Earning Distribution Flow
1. **Level 1 (Direct)**: Parent gets 5% of transaction
2. **Level 2 (Indirect)**: Grandparent gets 1% of transaction
3. Both earnings calculated simultaneously
4. Database updated atomically
5. Real-time notifications sent to both users

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables (Production)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/referral_system
PORT=5000
NODE_ENV=production
```

### Deployment Platforms
- **Backend**: Heroku, DigitalOcean, AWS
- **Frontend**: Netlify, Vercel
- **Database**: MongoDB Atlas

## 🔧 Configuration

### Customization Options
- Maximum referrals per user (currently 8)
- Commission percentages (currently 5% and 1%)
- Minimum purchase threshold (currently ₹1000)
- Maximum referral levels (currently 2)

### Scaling Considerations
- Database indexing on frequently queried fields
- Redis for session management in production
- Load balancing for high traffic
- CDN for static assets

## 📈 Analytics & Reporting

### User Analytics
- Total and average earnings
- Referral performance metrics
- Transaction history analysis
- Growth trends over time

### System Analytics
- Total users and transactions
- Revenue distribution
- Top performing users
- System-wide statistics

## 🧪 Testing

### Manual Testing Workflow
1. Register multiple users with referral relationships
2. Create transactions of various amounts
3. Verify earnings calculations
4. Test real-time notifications
5. Validate analytics accuracy

### Test Scenarios
- New user registration with/without referral
- Transactions above/below threshold
- Maximum referral limit validation
- Real-time notification delivery
- Analytics accuracy verification

## 🔒 Security Considerations

### Current Implementation
- Input validation on all endpoints
- MongoDB injection prevention
- CORS configuration
- Error handling without data exposure

### Production Recommendations
- JWT-based authentication
- Rate limiting on API endpoints
- Input sanitization
- HTTPS enforcement
- Database connection encryption

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Check connection string and network access
2. **Socket.io Not Working**: Verify CORS settings and port configuration
3. **Real-time Updates Missing**: Check user room joining logic
4. **Incorrect Earnings**: Validate transaction amount and parent relationships

### Debug Mode
```bash
DEBUG=* npm run server
```

## 🤝 Contributing

### Development Guidelines
1. Follow existing code structure
2. Add comments for complex logic
3. Test all new features thoroughly
4. Update documentation for API changes

### Code Style
- ES6+ JavaScript
- Functional React components
- Consistent error handling
- Clear variable naming

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Review the troubleshooting section
- Check the API documentation
-gmail me @ adiishukla196@gmail.com
---
