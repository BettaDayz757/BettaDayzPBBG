'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface DailyReward {
  day: number;
  type: string;
  amount: number;
  icon: string;
  claimed: boolean;
  available: boolean;
}

const dailyRewardSchedule: DailyReward[] = [
  { day: 1, type: 'coins', amount: 500, icon: '🪙', claimed: false, available: false },
  { day: 2, type: 'gems', amount: 5, icon: '💎', claimed: false, available: false },
  { day: 3, type: 'coins', amount: 750, icon: '🪙', claimed: false, available: false },
  { day: 4, type: 'experience', amount: 200, icon: '📈', claimed: false, available: false },
  { day: 5, type: 'gems', amount: 10, icon: '💎', claimed: false, available: false },
  { day: 6, type: 'coins', amount: 1000, icon: '🪙', claimed: false, available: false },
  { day: 7, type: 'special', amount: 1, icon: '🎁', claimed: false, available: false }
];

export default function DailyRewards() {
  const [rewards, setRewards] = useState<DailyReward[]>(dailyRewardSchedule);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [nextResetTime, setNextResetTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDailyRewards();
      updateResetTimer();
    }
  }, [user]);

  const fetchDailyRewards = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/user/daily-rewards');
      const data = await response.json();
      
      if (data.rewards) {
        setRewards(data.rewards);
        setCurrentStreak(data.currentStreak || 0);
        setCanClaim(data.canClaim || false);
      }
    } catch (error) {
      console.error('Failed to fetch daily rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateResetTimer = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setNextResetTime(tomorrow);
  };

  const claimReward = async (day: number) => {
    try {
      const response = await fetch('/api/user/daily-rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day })
      });

      const data = await response.json();
      
      if (response.ok) {
        fetchDailyRewards();
        refreshProfile(); // Update wallet
        
        // Show success message or animation
        showClaimAnimation(day);
      } else {
        console.error('Failed to claim reward:', data.error);
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    }
  };

  const showClaimAnimation = (day: number) => {
    // You can implement a success animation here
    console.log(`Claimed day ${day} reward!`);
  };

  const getRewardDisplay = (reward: DailyReward) => {
    switch (reward.type) {
      case 'coins':
        return `${reward.amount.toLocaleString()} Coins`;
      case 'gems':
        return `${reward.amount} Gems`;
      case 'experience':
        return `${reward.amount} XP`;
      case 'special':
        return 'Mystery Box';
      default:
        return 'Reward';
    }
  };

  const getTimeUntilReset = () => {
    if (!nextResetTime) return '';
    
    const now = new Date();
    const diff = nextResetTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Available now!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (!user) {
    return (
      <div className="bg-gray-900 rounded-lg border border-white/20 p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎁</div>
          <h3 className="text-xl font-bold text-white mb-2">Daily Rewards</h3>
          <p className="text-gray-400">Sign in to claim daily rewards</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-white/20 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">🎁 Daily Rewards</h2>
          <p className="text-gray-400">
            Current streak: {currentStreak} days
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Next reset in:</div>
          <div className="text-lg font-bold text-purple-400">
            {getTimeUntilReset()}
          </div>
        </div>
      </div>

      {/* Streak Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Weekly Progress</span>
          <span className="text-sm text-gray-400">{currentStreak}/7 days</span>
        </div>
        <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-500"
            style={{ width: `${(currentStreak / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {rewards.map((reward) => {
          const isNextClaim = reward.day === currentStreak + 1 && canClaim;
          const isClaimed = reward.claimed;
          const isLocked = reward.day > currentStreak + 1;
          
          return (
            <div
              key={reward.day}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                isClaimed
                  ? 'bg-green-900/20 border-green-500'
                  : isNextClaim
                  ? 'bg-purple-900/20 border-purple-500 animate-pulse'
                  : isLocked
                  ? 'bg-gray-800/50 border-gray-600'
                  : 'bg-gray-800 border-gray-600'
              }`}
            >
              {/* Day Number */}
              <div className="text-center mb-2">
                <span className="text-xs font-bold text-gray-400">Day {reward.day}</span>
              </div>

              {/* Reward Icon */}
              <div className={`text-2xl text-center mb-2 ${
                isLocked ? 'grayscale opacity-50' : ''
              }`}>
                {reward.icon}
              </div>

              {/* Reward Amount */}
              <div className="text-center">
                <div className={`text-xs font-semibold ${
                  isClaimed ? 'text-green-400' : 
                  isNextClaim ? 'text-purple-400' : 
                  isLocked ? 'text-gray-500' : 'text-white'
                }`}>
                  {getRewardDisplay(reward)}
                </div>
              </div>

              {/* Status Overlay */}
              {isClaimed && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-600/20 rounded-lg">
                  <div className="text-green-400 text-xl">✓</div>
                </div>
              )}

              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-lg">
                  <div className="text-gray-500 text-xl">🔒</div>
                </div>
              )}

              {/* Special Day 7 Effect */}
              {reward.day === 7 && !isClaimed && !isLocked && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg opacity-75 animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Claim Button */}
      {canClaim && (
        <div className="text-center">
          <button
            onClick={() => claimReward(currentStreak + 1)}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
          >
            {loading ? 'Claiming...' : `Claim Day ${currentStreak + 1} Reward!`}
          </button>
        </div>
      )}

      {!canClaim && currentStreak < 7 && (
        <div className="text-center">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">
              {currentStreak === 0 
                ? 'Come back tomorrow to start your streak!'
                : 'Come back tomorrow to continue your streak!'
              }
            </p>
          </div>
        </div>
      )}

      {currentStreak === 7 && (
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-lg p-4">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-yellow-400 font-bold">
              Congratulations! You've completed a full week!
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Your streak will reset tomorrow with even better rewards!
            </p>
          </div>
        </div>
      )}

      {/* Reward Schedule Info */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <details className="cursor-pointer">
          <summary className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            View Reward Schedule
          </summary>
          <div className="mt-3 space-y-2">
            {dailyRewardSchedule.map((reward) => (
              <div key={reward.day} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Day {reward.day}:</span>
                <span className="text-white">
                  {reward.icon} {getRewardDisplay(reward)}
                </span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}