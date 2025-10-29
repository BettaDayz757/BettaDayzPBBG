'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import AuthModal from '@/components/AuthModal';
import UserProfileWidget from '@/components/UserProfileWidget';
import InGamePurchases, { PurchaseSuccess } from '@/InGamePurchases';
import Leaderboard from '@/components/Leaderboard';
import AchievementSystem from '@/components/AchievementSystem';
import DailyRewards from '@/components/DailyRewards';
import GTAStyleUI from '@/GTAStyleUI';
import Game3D from '@/Game3D';

interface PlayerWallet {
  coins: number;
  gems: number;
  cash: number;
  [key: string]: number;
}

export default function EnhancedBettaDayzApp() {
  const [showAuth, setShowAuth] = useState(false);
  const [showPurchases, setShowPurchases] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<any>(null);

  // Game state for demonstration
  const [playerWallet, setPlayerWallet] = useState<PlayerWallet>({
    coins: 10000,
    gems: 50,
    cash: 2000 // in cents
  });

  const handlePurchase = async (item: any) => {
    try {
      // In a real app, this would make an API call to process the purchase
      if (playerWallet[item.currency] >= item.price) {
        setPlayerWallet(prev => ({
          ...prev,
          [item.currency]: prev[item.currency] - item.price
        }));

        setPurchaseSuccess(item);
        
        // Here you would also:
        // - Create purchase record in database
        // - Add item to user inventory
        // - Update achievements
        // - Process payment if using real money
        
        console.log('Purchase successful:', item);
      } else {
        alert('Insufficient funds!');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                🎮 BettaDayz PBBG
              </h1>
              <span className="text-purple-400 text-sm">
                Enhanced Edition
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <UserProfileWidget onShowAuth={() => setShowAuth(true)} />
            </div>
          </div>
        </header>

        {/* Main Navigation */}
        <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowPurchases(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🛍️ Store
              </button>
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={() => setShowAchievements(!showAchievements)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🎯 Achievements
              </button>
              <button
                onClick={() => setShowDailyRewards(!showDailyRewards)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🎁 Daily Rewards
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Area */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 rounded-lg border border-white/20 p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">🎮 Game World</h2>
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🌟</div>
                    <h3 className="text-xl font-bold text-white mb-2">Welcome to Norfolk</h3>
                    <p className="text-gray-400 mb-4">Your virtual life simulation adventure awaits</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-yellow-400 font-bold">Level 15</div>
                        <div className="text-gray-300">Character Level</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-green-400 font-bold">$125,000</div>
                        <div className="text-gray-300">Bank Balance</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-blue-400 font-bold">75%</div>
                        <div className="text-gray-300">Respect</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-purple-400 font-bold">⭐⭐</div>
                        <div className="text-gray-300">Wanted Level</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 rounded-lg border border-white/20 p-4 text-center hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="text-white font-semibold">Business</div>
                  <div className="text-gray-400 text-sm">Manage Empire</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg border border-white/20 p-4 text-center hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="text-white font-semibold">Properties</div>
                  <div className="text-gray-400 text-sm">Real Estate</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg border border-white/20 p-4 text-center hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">🚗</div>
                  <div className="text-white font-semibold">Garage</div>
                  <div className="text-gray-400 text-sm">Vehicle Collection</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg border border-white/20 p-4 text-center hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-white font-semibold">Social</div>
                  <div className="text-gray-400 text-sm">Friends & Crew</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gray-900/50 rounded-lg border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">💰 Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🪙 Coins</span>
                    <span className="text-yellow-400 font-bold">{playerWallet.coins.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">💎 Gems</span>
                    <span className="text-blue-400 font-bold">{playerWallet.gems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">💵 Cash</span>
                    <span className="text-green-400 font-bold">${(playerWallet.cash / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Daily Rewards Compact */}
              {showDailyRewards && <DailyRewards />}

              {/* Recent Activity */}
              <div className="bg-gray-900/50 rounded-lg border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">📱 Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Purchased Lamborghini Aventador</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Achieved "Car Enthusiast"</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">Claimed daily reward</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Leveled up to 15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Views */}
          {showLeaderboard && (
            <div className="mt-6">
              <Leaderboard />
            </div>
          )}

          {showAchievements && (
            <div className="mt-6">
              <AchievementSystem />
            </div>
          )}
        </main>

        {/* Modals */}
        {showAuth && (
          <AuthModal 
            isOpen={showAuth} 
            onClose={() => setShowAuth(false)} 
          />
        )}

        {showPurchases && (
          <InGamePurchases
            playerWallet={playerWallet}
            onPurchase={handlePurchase}
            onClose={() => setShowPurchases(false)}
          />
        )}

        {purchaseSuccess && (
          <PurchaseSuccess
            item={purchaseSuccess}
            onClose={() => setPurchaseSuccess(null)}
          />
        )}

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 p-6 mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400 mb-2">
              BettaDayz PBBG - Enhanced Edition
            </p>
            <p className="text-gray-500 text-sm">
              Experience the ultimate virtual life simulation at{' '}
              <a href="https://bettadayz.shop" className="text-purple-400 hover:text-purple-300 transition-colors">
                bettadayz.shop
              </a>
            </p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}