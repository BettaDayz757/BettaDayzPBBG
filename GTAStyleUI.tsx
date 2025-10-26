import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GTAStyleUIProps {
  playerStats: {
    money: number;
    level: number;
    health: number;
    armor: number;
    wanted: number;
    respect: number;
  };
  onMenuAction: (action: string) => void;
}

// Wanted Level Stars
function WantedLevel({ level }: { level: number }) {
  return (
    <div className="flex space-x-1">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 ${
            i < level ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          ⭐
        </div>
      ))}
    </div>
  );
}

// Circular Progress Bar
function CircularProgress({ value, max, color, size = 60 }: {
  value: number;
  max: number;
  color: string;
  size?: number;
}) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * (size / 2 - 5);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
        {value}
      </div>
    </div>
  );
}

// Main Menu Component
function MainMenu({ isOpen, onClose, onMenuAction }: {
  isOpen: boolean;
  onClose: () => void;
  onMenuAction: (action: string) => void;
}) {
  const menuItems = [
    { icon: '🏪', label: 'Shop', action: 'shop', color: 'bg-blue-600' },
    { icon: '💼', label: 'Business', action: 'business', color: 'bg-green-600' },
    { icon: '🏠', label: 'Properties', action: 'properties', color: 'bg-purple-600' },
    { icon: '🚗', label: 'Garage', action: 'garage', color: 'bg-orange-600' },
    { icon: '👥', label: 'Social', action: 'social', color: 'bg-pink-600' },
    { icon: '📊', label: 'Stats', action: 'stats', color: 'bg-indigo-600' },
    { icon: '⚙️', label: 'Settings', action: 'settings', color: 'bg-gray-600' },
    { icon: '❌', label: 'Close', action: 'close', color: 'bg-red-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full mx-4"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              BettaDayz Menu
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {menuItems.map((item) => (
                <motion.button
                  key={item.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (item.action === 'close') {
                      onClose();
                    } else {
                      onMenuAction(item.action);
                    }
                  }}
                  className={`${item.color} hover:opacity-80 text-white p-4 rounded-lg transition-all flex flex-col items-center space-y-2`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Shop Component
function ShopMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const shopItems = [
    { name: 'Health Pack', price: 100, icon: '❤️', description: 'Restore full health' },
    { name: 'Armor Vest', price: 500, icon: '🛡️', description: 'Increase armor protection' },
    { name: 'Sports Car', price: 50000, icon: '🏎️', description: 'Fast and stylish vehicle' },
    { name: 'Business Suit', price: 2000, icon: '👔', description: 'Increase respect +10' },
    { name: 'Luxury Watch', price: 10000, icon: '⌚', description: 'Status symbol' },
    { name: 'VIP Pass', price: 25000, icon: '🎫', description: 'Access exclusive areas' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-gray-900 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Shop</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-red-400 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <p className="text-green-400 font-bold">${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors">
                    Purchase
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main GTA Style UI Component
export default function GTAStyleUI({ 
  playerStats, 
  onMenuAction,
  gamepadConnected = false
}: GTAStyleUIProps & {
  gamepadConnected?: boolean;
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const handleMenuAction = (action: string) => {
    if (action === 'shop') {
      setIsShopOpen(true);
      setIsMenuOpen(false);
    } else {
      onMenuAction(action);
      addNotification(`Opened ${action}`);
    }
  };

  return (
    <>
      {/* Top Left HUD */}
      <div className="fixed top-4 left-4 z-40">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-white/20"
        >
          {/* Money */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-green-400 text-xl">💰</span>
            <span className="text-white font-bold text-lg">
              ${playerStats.money.toLocaleString()}
            </span>
          </div>

          {/* Level and Respect */}
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <span className="text-blue-400">⭐</span>
              <span className="text-white text-sm">Lv.{playerStats.level}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-purple-400">👑</span>
              <span className="text-white text-sm">{playerStats.respect}</span>
            </div>
          </div>

          {/* Health and Armor Circles */}
          <div className="flex space-x-3 mb-3">
            <CircularProgress
              value={playerStats.health}
              max={100}
              color="#ef4444"
              size={50}
            />
            <CircularProgress
              value={playerStats.armor}
              max={100}
              color="#3b82f6"
              size={50}
            />
          </div>

          {/* Wanted Level */}
          <div className="mb-2">
            <div className="text-white text-xs mb-1">Wanted Level</div>
            <WantedLevel level={playerStats.wanted} />
          </div>
        </motion.div>
      </div>

      {/* Top Right - Time and Weather */}
      <div className="fixed top-4 right-4 z-40">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center"
        >
          <div className="text-white font-bold text-lg">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-gray-300 text-sm">
            {currentTime.toLocaleDateString()}
          </div>
          <div className="text-yellow-400 text-2xl mt-2">☀️</div>
        </motion.div>
      </div>

      {/* Minimap */}
      <div className="fixed top-20 right-4 z-40">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-40 h-40 bg-black/90 backdrop-blur-sm rounded-lg border-2 border-white/20 p-2"
        >
          <div className="relative w-full h-full bg-green-900 rounded overflow-hidden">
            {/* Player dot */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />
            
            {/* Buildings */}
            <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-gray-600 rounded" />
            <div className="absolute bottom-1/4 left-1/4 w-2 h-4 bg-gray-600 rounded" />
            <div className="absolute top-3/4 right-1/3 w-4 h-2 bg-gray-600 rounded" />
            
            {/* Roads */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 transform -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 transform -translate-x-1/2" />
            
            {/* Objectives */}
            <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-red-400 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Bottom Right Action Buttons */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col space-y-2"
        >
          <button
            onClick={() => setIsMenuOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            📱 Menu
          </button>
          <button
            onClick={() => handleMenuAction('phone')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            📞 Phone
          </button>
          <button
            onClick={() => handleMenuAction('map')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            🗺️ Map
          </button>
          {gamepadConnected && (
            <div className="bg-green-600/80 backdrop-blur-sm text-white p-2 rounded-full border border-white/20 text-sm">
              🎮
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Left Controls */}
      <div className="fixed bottom-4 left-4 z-40">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-white/20"
        >
          <div className="text-white text-sm space-y-1">
            <div><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">WASD</kbd> Move</div>
            <div><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Mouse</kbd> Look</div>
            <div><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">E</kbd> Interact</div>
            <div><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">TAB</kbd> Menu</div>
          </div>
        </motion.div>
      </div>

      {/* Notifications */}
      <div className="fixed top-1/4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs"
            >
              {notification}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Menus */}
      <MainMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onMenuAction={handleMenuAction}
      />
      
      <ShopMenu
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
      />
    </>
  );
}