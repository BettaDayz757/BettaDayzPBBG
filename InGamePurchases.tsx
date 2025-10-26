import React, { useState, useEffect } from 'react';

// Types for the purchase system
interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems' | 'cash';
  category: 'vehicles' | 'properties' | 'clothing' | 'weapons' | 'currency' | 'premium';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discount?: number;
  limited?: boolean;
}

interface PlayerWallet {
  coins: number;
  gems: number;
  cash: number;
}

// Sample items for purchase
const purchaseItems: PurchaseItem[] = [
  // Currency Packs
  {
    id: 'coins_1000',
    name: '1,000 Coins',
    description: 'Basic coin pack for everyday purchases',
    price: 99,
    currency: 'cash',
    category: 'currency',
    icon: '🪙',
    rarity: 'common'
  },
  {
    id: 'coins_5000',
    name: '5,000 Coins',
    description: 'Popular coin pack with bonus coins',
    price: 499,
    currency: 'cash',
    category: 'currency',
    icon: '💰',
    rarity: 'rare',
    discount: 10
  },
  {
    id: 'gems_100',
    name: '100 Gems',
    description: 'Premium currency for exclusive items',
    price: 999,
    currency: 'cash',
    category: 'currency',
    icon: '💎',
    rarity: 'epic'
  },

  // Vehicles
  {
    id: 'sports_car',
    name: 'Lightning Sports Car',
    description: 'High-speed sports car with custom paint job',
    price: 15000,
    currency: 'coins',
    category: 'vehicles',
    icon: '🏎️',
    rarity: 'epic'
  },
  {
    id: 'luxury_suv',
    name: 'Executive SUV',
    description: 'Luxury SUV perfect for business meetings',
    price: 25000,
    currency: 'coins',
    category: 'vehicles',
    icon: '🚙',
    rarity: 'legendary'
  },
  {
    id: 'motorcycle',
    name: 'Street Bike',
    description: 'Fast motorcycle for quick city travel',
    price: 8000,
    currency: 'coins',
    category: 'vehicles',
    icon: '🏍️',
    rarity: 'rare'
  },

  // Properties
  {
    id: 'penthouse',
    name: 'Downtown Penthouse',
    description: 'Luxury penthouse with city views',
    price: 50,
    currency: 'gems',
    category: 'properties',
    icon: '🏢',
    rarity: 'legendary'
  },
  {
    id: 'beach_house',
    name: 'Beach House',
    description: 'Relaxing beachfront property',
    price: 35000,
    currency: 'coins',
    category: 'properties',
    icon: '🏖️',
    rarity: 'epic'
  },

  // Clothing
  {
    id: 'business_suit',
    name: 'Executive Suit',
    description: 'Professional attire for business meetings',
    price: 2500,
    currency: 'coins',
    category: 'clothing',
    icon: '👔',
    rarity: 'rare'
  },
  {
    id: 'street_outfit',
    name: 'Street Style Set',
    description: 'Trendy casual outfit for everyday wear',
    price: 1500,
    currency: 'coins',
    category: 'clothing',
    icon: '👕',
    rarity: 'common'
  },

  // Premium Features
  {
    id: 'vip_membership',
    name: 'VIP Membership (30 days)',
    description: 'Exclusive benefits and bonuses for 30 days',
    price: 1999,
    currency: 'cash',
    category: 'premium',
    icon: '👑',
    rarity: 'legendary',
    limited: true
  }
];

export default function InGamePurchases({ 
  playerWallet, 
  onPurchase,
  onClose 
}: {
  playerWallet: PlayerWallet;
  onPurchase: (item: PurchaseItem) => void;
  onClose: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PurchaseItem | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛍️' },
    { id: 'currency', name: 'Currency', icon: '💰' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
    { id: 'properties', name: 'Properties', icon: '🏠' },
    { id: 'clothing', name: 'Clothing', icon: '👔' },
    { id: 'premium', name: 'Premium', icon: '👑' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? purchaseItems 
    : purchaseItems.filter(item => item.category === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-100';
      case 'rare': return 'border-blue-400 bg-blue-100';
      case 'epic': return 'border-purple-400 bg-purple-100';
      case 'legendary': return 'border-yellow-400 bg-yellow-100';
      default: return 'border-gray-400 bg-gray-100';
    }
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'coins': return '🪙';
      case 'gems': return '💎';
      case 'cash': return '💵';
      default: return '💰';
    }
  };

  const canAfford = (item: PurchaseItem) => {
    return playerWallet[item.currency] >= item.price;
  };

  const handlePurchaseClick = (item: PurchaseItem) => {
    setSelectedItem(item);
    setShowConfirmation(true);
  };

  const confirmPurchase = () => {
    if (selectedItem) {
      onPurchase(selectedItem);
      setShowConfirmation(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">🛍️ BettaDayz Store</h2>
            <p className="text-purple-200">Enhance your Norfolk experience</p>
          </div>
          
          {/* Wallet Display */}
          <div className="flex space-x-4 bg-black/30 rounded-lg p-3">
            <div className="text-center">
              <div className="text-yellow-400 font-bold">🪙 {playerWallet.coins.toLocaleString()}</div>
              <div className="text-xs text-gray-300">Coins</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">💎 {playerWallet.gems.toLocaleString()}</div>
              <div className="text-xs text-gray-300">Gems</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">💵 ${(playerWallet.cash / 100).toFixed(2)}</div>
              <div className="text-xs text-gray-300">Cash</div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-white hover:text-red-400 text-2xl transition-colors"
          >
            ❌
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Category Sidebar */}
          <div className="w-48 bg-gray-800 p-4 border-r border-white/10">
            <h3 className="text-white font-bold mb-4">Categories</h3>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-gray-800 rounded-lg border-2 p-4 transition-all hover:scale-105 ${getRarityColor(item.rarity)} ${
                    !canAfford(item) ? 'opacity-50' : 'cursor-pointer hover:shadow-lg'
                  }`}
                >
                  {/* Item Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-3xl">{item.icon}</div>
                    {item.limited && (
                      <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        LIMITED
                      </div>
                    )}
                    {item.discount && (
                      <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        -{item.discount}%
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <h4 className="text-white font-bold mb-2">{item.name}</h4>
                  <p className="text-gray-300 text-sm mb-3">{item.description}</p>

                  {/* Rarity Badge */}
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-3 capitalize ${
                    item.rarity === 'common' ? 'bg-gray-600 text-white' :
                    item.rarity === 'rare' ? 'bg-blue-600 text-white' :
                    item.rarity === 'epic' ? 'bg-purple-600 text-white' :
                    'bg-yellow-600 text-black'
                  }`}>
                    {item.rarity}
                  </div>

                  {/* Price and Purchase */}
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">
                      <span className="mr-1">{getCurrencyIcon(item.currency)}</span>
                      {item.currency === 'cash' 
                        ? `$${(item.price / 100).toFixed(2)}`
                        : item.price.toLocaleString()
                      }
                    </div>
                    <button
                      onClick={() => handlePurchaseClick(item)}
                      disabled={!canAfford(item)}
                      className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                        canAfford(item)
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford(item) ? 'Buy Now' : 'Insufficient Funds'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase Confirmation Modal */}
        {showConfirmation && selectedItem && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">Confirm Purchase</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{selectedItem.icon}</div>
                <div>
                  <div className="text-white font-bold">{selectedItem.name}</div>
                  <div className="text-gray-300 text-sm">{selectedItem.description}</div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Price:</span>
                  <span className="text-white font-bold">
                    {getCurrencyIcon(selectedItem.currency)} 
                    {selectedItem.currency === 'cash' 
                      ? `$${(selectedItem.price / 100).toFixed(2)}`
                      : selectedItem.price.toLocaleString()
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-300">Your Balance:</span>
                  <span className="text-white">
                    {getCurrencyIcon(selectedItem.currency)} 
                    {selectedItem.currency === 'cash' 
                      ? `$${(playerWallet[selectedItem.currency] / 100).toFixed(2)}`
                      : playerWallet[selectedItem.currency].toLocaleString()
                    }
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={confirmPurchase}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  ✅ Confirm Purchase
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Purchase Success Component
export function PurchaseSuccess({ 
  item, 
  onClose 
}: { 
  item: PurchaseItem; 
  onClose: () => void; 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-lg p-8 max-w-md w-full mx-4 text-center border border-white/20">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-white font-bold text-2xl mb-2">Purchase Successful!</h2>
        <p className="text-green-100 mb-4">
          You've successfully purchased <strong>{item.name}</strong>
        </p>
        <div className="text-4xl mb-4">{item.icon}</div>
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Continue Playing
        </button>
      </div>
    </div>
  );
}