import React, { useState, useEffect } from 'react';
import { User } from './types';
import { userService, transactionService } from './services/api';
import { useSocket } from './hooks/useSocket';
import Navbar from './components/Navbar';
import UserRegistration from './components/UserRegistration';
import Dashboard from './components/Dashboard';
import ReferralTree from './components/ReferralTree';
import TransactionForm from './components/TransactionForm';
import TransactionsList from './components/TransactionsList';
import EarningsHistory from './components/EarningsHistory';
import NotificationToast from './components/NotificationToast';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [recentEarnings, setRecentEarnings] = useState<any[]>([]);
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Socket connection for real-time updates
  useSocket(currentUser?._id, (earningsUpdate) => {
    setNotification(earningsUpdate);
    // Refresh user data to get updated earnings
    if (currentUser) {
      refreshUserData();
    }
  });

  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      const updatedUser = await userService.getUser(currentUser._id);
      setCurrentUser(updatedUser);
      
      // Fetch recent transactions
      const transactions = await transactionService.getUserTransactions(currentUser._id);
      setRecentTransactions(transactions);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshUserData();
    }
  }, [currentUser?._id]);

  const handleUserRegistered = (user: any) => {
    setCurrentUser(user);
  };

  const handleTransactionCreated = (response: any) => {
    if (currentUser) {
      refreshUserData();
    }
    
    if (response.profitGenerated) {
      // Show success message for profit-generating transaction
      alert(`Transaction successful! This purchase will generate referral earnings.`);
    }
  };

  // For demo purposes - allow switching between users
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const users = await userService.getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchAllUsers();
  }, []);

  if (!currentUser) {
    return (
      <div>
        <UserRegistration onUserRegistered={handleUserRegistered} />
        
        {/* Demo User Selection */}
        {allUsers.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
            <h3 className="text-sm font-medium mb-2">Demo: Switch User</h3>
            <select
              onChange={(e) => {
                const userId = e.target.value;
                const user = allUsers.find(u => u._id === userId);
                if (user) setCurrentUser(user);
              }}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="">Select user...</option>
              {allUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.username} (Level {user.level})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Dashboard 
              user={currentUser} 
              recentTransactions={recentTransactions}
              recentEarnings={recentEarnings}
            />
            <TransactionForm 
              userId={currentUser._id} 
              onTransactionCreated={handleTransactionCreated}
            />
          </div>
        );
      case 'referrals':
        return <ReferralTree user={currentUser} />;
      case 'transactions':
        return <TransactionsList userId={currentUser._id} />;
      case 'earnings':
        return <EarningsHistory userId={currentUser._id} />;
      default:
        return <Dashboard user={currentUser} recentTransactions={recentTransactions} recentEarnings={recentEarnings} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userStats={{
          totalEarnings: currentUser?.totalEarnings ?? 0,
 directReferrals: currentUser?.directReferrals?.length ?? 0,
        }}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Real-time notification */}
      <NotificationToast 
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Demo User Switcher */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="text-sm font-medium mb-2">Demo: Switch User</h3>
        <select
          value={currentUser._id}
          onChange={(e) => {
            const userId = e.target.value;
            const user = allUsers.find(u => u._id === userId);
            if (user) setCurrentUser(user);
          }}
          className="text-xs border rounded px-2 py-1 w-full"
        >
          {allUsers.map(user => (
            <option key={user._id} value={user._id}>
              {user.username} (Level {user.level}, ₹{user.totalEarnings})
            </option>
          ))}
        </select>
        <button
          onClick={() => setCurrentUser(null)}
          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
        >
          Register New User
        </button>
      </div>
    </div>
  );
}

export default App;