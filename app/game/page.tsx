'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExoticCarShowroom from '../components/ExoticCarShowroom';
import PersonalGarage from '../components/PersonalGarage';
import RacingSystem from '../components/RacingSystem';
import CarMarketplace from '../components/CarMarketplace';

type GameSection = 'showroom' | 'garage' | 'racing' | 'marketplace' | 'dashboard';

interface GameStats {
  totalCars: number;
  totalValue: number;
  raceWins: number;
  totalEarnings: number;
  experience: number;
  level: number;
}

export default function GameHub() {
  const [currentSection, setCurrentSection] = useState<GameSection>('dashboard');
  const [playerMoney, setPlayerMoney] = useState(2500000);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalCars: 12,
    totalValue: 4500000,
    raceWins: 47,
    totalEarnings: 1875000,
    experience: 2340,
    level: 18
  });

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', color: 'blue' },
    { id: 'showroom', name: 'Exotic Cars', icon: '🏎️', color: 'red' },
    { id: 'marketplace', name: 'Marketplace', icon: '🏪', color: 'green' },
    { id: 'garage', name: 'My Garage', icon: '🏢', color: 'purple' },
    { id: 'racing', name: 'Racing', icon: '🏁', color: 'yellow' }
  ] as const;

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-600 text-white' : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40',
      red: isActive ? 'bg-red-600 text-white' : 'bg-red-600/20 text-red-400 hover:bg-red-600/40',
      green: isActive ? 'bg-green-600 text-white' : 'bg-green-600/20 text-green-400 hover:bg-green-600/40',
      purple: isActive ? 'bg-purple-600 text-white' : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/40',
      yellow: isActive ? 'bg-yellow-600 text-white' : 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/40'
    };
    return colors[color as keyof typeof colors];
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'showroom':
        return <ExoticCarShowroom />;
      case 'garage':
        return <PersonalGarage />;
      case 'racing':
        return <RacingSystem />;
      case 'marketplace':
        return <CarMarketplace />;
      case 'dashboard':
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h1 className="text-6xl font-bold text-white mb-4">
                  🎮 BettaDayz PBBG
                </h1>
                <p className="text-xl text-gray-300">
                  Premium Car Collection & Racing Experience
                </p>
              </motion.div>

              {/* Player Stats */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              >
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-2xl font-bold">${playerMoney.toLocaleString()}</div>
                  <div className="text-green-200">Available Cash</div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                  <div className="text-3xl mb-2">🚗</div>
                  <div className="text-2xl font-bold">{gameStats.totalCars}</div>
                  <div className="text-purple-200">Cars Owned</div>
                </div>

                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-2xl font-bold">{gameStats.raceWins}</div>
                  <div className="text-yellow-200">Race Victories</div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-2xl font-bold">Level {gameStats.level}</div>
                  <div className="text-blue-200">{gameStats.experience} XP</div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
              >
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">🎯 Quick Actions</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setCurrentSection('showroom')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                      🏎️ Browse Exotic Cars
                    </button>
                    <button 
                      onClick={() => setCurrentSection('marketplace')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                      🏪 Visit Marketplace
                    </button>
                    <button 
                      onClick={() => setCurrentSection('racing')}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                      🏁 Enter Racing Circuit
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">📊 Performance Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Collection Value:</span>
                      <span className="text-green-400 font-bold">${gameStats.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Race Earnings:</span>
                      <span className="text-yellow-400 font-bold">${gameStats.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Win Rate:</span>
                      <span className="text-blue-400 font-bold">
                        {Math.round((gameStats.raceWins / (gameStats.raceWins + 23)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                        style={{ width: `${(gameStats.experience % 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-gray-400 text-sm">
                      {gameStats.experience % 100}/100 XP to Level {gameStats.level + 1}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Featured Cars */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 rounded-xl p-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6">🌟 Featured Vehicles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg p-4 border border-yellow-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏎️</div>
                      <h4 className="text-yellow-400 font-bold text-lg">Bugatti Chiron</h4>
                      <p className="text-gray-300 text-sm">Limited Edition Hypercar</p>
                      <div className="text-green-400 font-bold mt-2">$3,500,000</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-900 to-pink-900 rounded-lg p-4 border border-red-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏁</div>
                      <h4 className="text-red-400 font-bold text-lg">Neon Nights Circuit</h4>
                      <p className="text-gray-300 text-sm">New Racing Track Available</p>
                      <div className="text-yellow-400 font-bold mt-2">Prize: $25,000</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-4 border border-purple-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">💎</div>
                      <h4 className="text-purple-400 font-bold text-lg">VIP Collection</h4>
                      <p className="text-gray-300 text-sm">Exclusive Legendary Cars</p>
                      <div className="text-blue-400 font-bold mt-2">Members Only</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🎮</div>
              <span className="text-xl font-bold text-white">BettaDayz PBBG</span>
            </div>

            <div className="flex items-center space-x-2">
              {navigation.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentSection(item.id as GameSection)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-300
                    ${getColorClasses(item.color, currentSection === item.id)}
                  `}
                >
                  <span className="text-lg mr-2">{item.icon}</span>
                  <span className="hidden md:inline">{item.name}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-green-400 font-bold">
                💰 ${playerMoney.toLocaleString()}
              </div>
              <div className="text-blue-400">
                ⭐ Level {gameStats.level}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}