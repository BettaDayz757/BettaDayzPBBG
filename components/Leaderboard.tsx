'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  score: number;
  users: {
    username: string;
    display_name?: string;
    avatar_url?: string;
    level: number;
  };
}

export default function Leaderboard() {
  const [category, setCategory] = useState('level');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const categories = [
    { id: 'level', name: 'Level', icon: '🏆', description: 'Highest level players' },
    { id: 'wealth', name: 'Wealth', icon: '💰', description: 'Richest players' },
    { id: 'reputation', name: 'Reputation', icon: '⭐', description: 'Most respected players' },
    { id: 'experience', name: 'Experience', icon: '📈', description: 'Most experienced players' }
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [category]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?category=${category}&limit=50`);
      const data = await response.json();
      
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score: number, category: string) => {
    switch (category) {
      case 'wealth':
        return `$${score.toLocaleString()}`;
      case 'level':
        return `Level ${score}`;
      case 'experience':
        return `${score.toLocaleString()} XP`;
      case 'reputation':
        return `${score} Rep`;
      default:
        return score.toLocaleString();
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400'; // Gold
      case 2: return 'text-gray-300'; // Silver  
      case 3: return 'text-amber-600'; // Bronze
      default: return 'text-gray-400';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-white/20 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">🏆 Leaderboards</h2>
        <button 
          onClick={fetchLeaderboard}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Category Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`p-3 rounded-lg border transition-all ${
              category === cat.id
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <div className="text-lg mb-1">{cat.icon}</div>
            <div className="font-semibold text-sm">{cat.name}</div>
          </button>
        ))}
      </div>

      {/* Current Category Info */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
        <p className="text-gray-300 text-sm">
          {categories.find(c => c.id === category)?.description}
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/4"></div>
                  </div>
                  <div className="w-20 h-4 bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-gray-400">No leaderboard data available</p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={entry.user_id}
              className={`bg-gray-800/50 rounded-lg p-4 border transition-all hover:bg-gray-800/70 ${
                user?.id === entry.user_id ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className={`text-xl font-bold w-12 text-center ${getRankColor(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <img
                  src={entry.users.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.users.username}`}
                  alt={entry.users.username}
                  className="w-12 h-12 rounded-full border-2 border-gray-600"
                />

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">
                      {entry.users.display_name || entry.users.username}
                    </span>
                    {user?.id === entry.user_id && (
                      <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    Level {entry.users.level} • @{entry.users.username}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    {formatScore(entry.score, category)}
                  </div>
                  {entry.rank <= 3 && (
                    <div className="text-xs text-gray-400">
                      Top {Math.round((entry.rank / leaderboard.length) * 100)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {leaderboard.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            Showing top {leaderboard.length} players • Updates every hour
          </p>
        </div>
      )}
    </div>
  );
}