import React from 'react';
import { User } from '../types';
import { Users, UserCheck, Crown, TrendingUp } from 'lucide-react';

interface ReferralTreeProps {
  user: User;
}

const ReferralTree: React.FC<ReferralTreeProps> = ({ user }) => {
  const maxReferrals = 8;
  const remainingSlots = maxReferrals - user.directReferrals.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Your Referral Network
          </h2>
          <div className="text-sm text-gray-500">
            {user.directReferrals.length}/{maxReferrals} slots filled
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <Crown className="h-5 w-5 mr-2" />
            <span className="font-medium">{user.username} (You)</span>
          </div>
          <div className="text-sm text-blue-100">
            Referral Code: <span className="font-mono bg-white/20 px-2 py-1 rounded">{user.referralCode}</span>
          </div>
          <div className="text-sm text-blue-100 mt-1">
            Level {user.level} • Total Earnings: ₹{user.totalEarnings.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{user.directReferrals.length}</div>
            <div className="text-sm text-blue-700">Direct Referrals</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">₹{user.totalDirectEarnings.toLocaleString()}</div>
            <div className="text-sm text-green-700">Direct Earnings</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">₹{user.totalIndirectEarnings.toLocaleString()}</div>
            <div className="text-sm text-purple-700">Indirect Earnings</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{remainingSlots}</div>
            <div className="text-sm text-orange-700">Available Slots</div>
          </div>
        </div>
      </div>

      {/* Direct Referrals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <UserCheck className="h-5 w-5 mr-2 text-green-600" />
          Direct Referrals (Level 1)
        </h3>

        {user.directReferrals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.directReferrals.map((referral, index) => (
              <div key={referral._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{referral.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{referral.username}</div>
                      <div className="text-sm text-gray-500">Position {index + 1}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      ₹{referral.totalEarnings?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-500">Their Earnings</div>
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Level {referral.level}
                  <span className="mx-2">•</span>
                  {referral.directReferrals?.length || 0} referrals
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No direct referrals yet</p>
            <p className="text-sm">Share your referral code to start earning!</p>
          </div>
        )}
      </div>

      {/* Available Slots */}
      {remainingSlots > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Available Referral Slots</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {Array.from({ length: maxReferrals }, (_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center ${
                  index < user.directReferrals.length
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                {index < user.directReferrals.length ? (
                  <UserCheck className="h-6 w-6 text-green-500" />
                ) : (
                  <div className="text-xs text-gray-400 text-center">
                    <div>Slot</div>
                    <div>{index + 1}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Share your referral code:</strong> <code className="bg-white px-2 py-1 rounded">{user.referralCode}</code>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              You have {remainingSlots} available slots for new referrals
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralTree;