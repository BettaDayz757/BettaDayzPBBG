'use client';

import React from 'react';
import { useAuth } from './AuthProvider';

interface UserProfileWidgetProps {
  onShowAuth: () => void;
}

export default function UserProfileWidget({ onShowAuth }: UserProfileWidgetProps) {
  const { user, profile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-2">
        <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-600 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <button
        onClick={onShowAuth}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3 bg-gray-800/80 rounded-lg p-2">
      {/* Avatar */}
      <div className="relative">
        <img
          src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
          alt={profile.username}
          className="w-10 h-10 rounded-full border-2 border-purple-500"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium truncate">
            {profile.display_name || profile.username}
          </span>
          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
            Lv.{profile.level}
          </span>
        </div>
        
        {/* Mini Wallet */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <span>🪙</span>
            <span className="text-yellow-400">{profile.wallet_coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💎</span>
            <span className="text-blue-400">{profile.wallet_gems}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💵</span>
            <span className="text-green-400">${(profile.wallet_cash / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="relative group">
        <button className="text-gray-400 hover:text-white p-1">
          ⚙️
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 rounded-lg border border-gray-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2">
            <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors">
              👤 Profile
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors">
              🎒 Inventory
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors">
              🏆 Achievements
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors">
              📊 Stats
            </button>
            <hr className="my-2 border-gray-700" />
            <button 
              onClick={() => signOut()}
              className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}