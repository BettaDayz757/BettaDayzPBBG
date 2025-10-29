'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface Achievement {
  id: string;
  achievement_id: string;
  achievement_name: string;
  achievement_description: string;
  progress: number;
  max_progress: number;
  completed: boolean;
  reward_coins: number;
  reward_gems: number;
  reward_experience: number;
  unlocked_at?: string;
}

const achievementTemplates = [
  {
    id: 'first_purchase',
    name: 'Big Spender',
    description: 'Make your first purchase',
    icon: '💰',
    category: 'Shopping',
    max_progress: 1,
    rewards: { coins: 500, gems: 5, experience: 100 }
  },
  {
    id: 'level_10',
    name: 'Rising Star',
    description: 'Reach level 10',
    icon: '⭐',
    category: 'Progress',
    max_progress: 10,
    rewards: { coins: 1000, gems: 10, experience: 0 }
  },
  {
    id: 'luxury_collector',
    name: 'Luxury Collector',
    description: 'Own 5 luxury items',
    icon: '💎',
    category: 'Collection',
    max_progress: 5,
    rewards: { coins: 2000, gems: 15, experience: 200 }
  },
  {
    id: 'car_enthusiast',
    name: 'Car Enthusiast',
    description: 'Own 3 exotic cars',
    icon: '🏎️',
    category: 'Collection',
    max_progress: 3,
    rewards: { coins: 5000, gems: 25, experience: 500 }
  },
  {
    id: 'jewelry_collector',
    name: 'Bling King',
    description: 'Own 10 pieces of jewelry',
    icon: '💍',
    category: 'Collection',
    max_progress: 10,
    rewards: { coins: 3000, gems: 20, experience: 300 }
  },
  {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Accumulate 1,000,000 coins',
    icon: '🏆',
    category: 'Wealth',
    max_progress: 1000000,
    rewards: { coins: 0, gems: 50, experience: 1000 }
  },
  {
    id: 'daily_streak_7',
    name: 'Dedicated Player',
    description: 'Login for 7 consecutive days',
    icon: '📅',
    category: 'Activity',
    max_progress: 7,
    rewards: { coins: 1500, gems: 15, experience: 250 }
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Add 5 friends',
    icon: '👥',
    category: 'Social',
    max_progress: 5,
    rewards: { coins: 1000, gems: 10, experience: 150 }
  }
];

export default function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const categories = ['all', 'Shopping', 'Progress', 'Collection', 'Wealth', 'Activity', 'Social'];

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/user/achievements`);
      const data = await response.json();
      
      if (data.achievements) {
        setAchievements(data.achievements);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (achievementId: string) => {
    try {
      const response = await fetch('/api/user/achievements/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementId })
      });

      if (response.ok) {
        fetchAchievements();
        // Refresh user profile to show updated wallet
        // You might want to trigger a profile refresh here
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    }
  };

  const getProgressPercent = (progress: number, maxProgress: number) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  const getAchievementTemplate = (achievementId: string) => {
    return achievementTemplates.find(t => t.id === achievementId);
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    const template = getAchievementTemplate(achievement.achievement_id);
    return template?.category === filter;
  });

  const completedCount = achievements.filter(a => a.completed).length;
  const totalCount = achievements.length;
  const completionPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!user) {
    return (
      <div className="bg-gray-900 rounded-lg border border-white/20 p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-white mb-2">Achievements</h3>
          <p className="text-gray-400">Sign in to track your achievements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-white/20 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">🏆 Achievements</h2>
          <p className="text-gray-400">
            {completedCount} of {totalCount} completed ({completionPercent.toFixed(1)}%)
          </p>
        </div>
        <button 
          onClick={fetchAchievements}
          className="text-purple-400 hover:text-purple-300 transition-colors"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                    <div className="h-2 bg-gray-600 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-gray-400">No achievements found for this category</p>
          </div>
        ) : (
          filteredAchievements.map((achievement) => {
            const template = getAchievementTemplate(achievement.achievement_id);
            const progressPercent = getProgressPercent(achievement.progress, achievement.max_progress);
            
            return (
              <div
                key={achievement.id}
                className={`bg-gray-800/50 rounded-lg p-4 border transition-all ${
                  achievement.completed 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`text-3xl p-2 rounded-lg ${
                    achievement.completed ? 'bg-green-600' : 'bg-gray-700'
                  }`}>
                    {template?.icon || '🏆'}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {achievement.achievement_name || template?.name}
                      </h3>
                      {achievement.completed && (
                        <span className="text-green-400 font-semibold">✓ Completed</span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-3">
                      {achievement.achievement_description || template?.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.max_progress}</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            achievement.completed 
                              ? 'bg-green-500' 
                              : 'bg-gradient-to-r from-purple-600 to-blue-600'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        {achievement.reward_coins > 0 && (
                          <span className="text-yellow-400">
                            🪙 {achievement.reward_coins.toLocaleString()}
                          </span>
                        )}
                        {achievement.reward_gems > 0 && (
                          <span className="text-blue-400">
                            💎 {achievement.reward_gems}
                          </span>
                        )}
                        {achievement.reward_experience > 0 && (
                          <span className="text-purple-400">
                            📈 {achievement.reward_experience} XP
                          </span>
                        )}
                      </div>

                      {achievement.completed && !achievement.unlocked_at && (
                        <button
                          onClick={() => claimReward(achievement.achievement_id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded transition-colors"
                        >
                          Claim Reward
                        </button>
                      )}
                    </div>

                    {achievement.unlocked_at && (
                      <p className="text-xs text-gray-500 mt-2">
                        Completed on {new Date(achievement.unlocked_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}