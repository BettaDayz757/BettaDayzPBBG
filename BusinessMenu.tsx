import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Business {
  id: string;
  name: string;
  type: string;
  location: string;
  revenue: number;
  expenses: number;
  profit: number;
  level: number;
  employees: number;
  icon: string;
}

interface BusinessMenuProps {
  isOpen: boolean;
  onClose: () => void;
  playerMoney: number;
  onPurchase: (business: Business) => void;
}

const norfolkLocations = [
  { id: 'military_circle', name: 'Military Circle', cost: 5000, traffic: 'Medium', icon: '🏪' },
  { id: 'downtown', name: 'Downtown Norfolk', cost: 15000, traffic: 'High', icon: '🏢' },
  { id: 'ghent', name: 'Ghent District', cost: 12000, traffic: 'High', icon: '🎨' },
  { id: 'oceanview', name: 'Ocean View', cost: 8000, traffic: 'Medium', icon: '🌊' },
  { id: 'berkley', name: 'Berkley', cost: 4000, traffic: 'Growing', icon: '🏘️' },
  { id: 'norfolk_botanical', name: 'Norfolk Botanical Garden Area', cost: 10000, traffic: 'Tourist', icon: '🌺' }
];

const businessTypes = [
  { 
    id: 'restaurant', 
    name: 'Restaurant', 
    baseCost: 25000, 
    baseRevenue: 5000, 
    icon: '🍽️',
    description: 'Serve delicious food to Norfolk residents'
  },
  { 
    id: 'tech_startup', 
    name: 'Tech Startup', 
    baseCost: 50000, 
    baseRevenue: 8000, 
    icon: '💻',
    description: 'Innovative technology solutions'
  },
  { 
    id: 'retail_store', 
    name: 'Retail Store', 
    baseCost: 20000, 
    baseRevenue: 4000, 
    icon: '🛍️',
    description: 'Sell products to local customers'
  },
  { 
    id: 'fitness_center', 
    name: 'Fitness Center', 
    baseCost: 35000, 
    baseRevenue: 6000, 
    icon: '💪',
    description: 'Help Norfolk stay healthy and fit'
  },
  { 
    id: 'auto_shop', 
    name: 'Auto Shop', 
    baseCost: 40000, 
    baseRevenue: 7000, 
    icon: '🔧',
    description: 'Vehicle repair and maintenance'
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment Venue', 
    baseCost: 60000, 
    baseRevenue: 10000, 
    icon: '🎭',
    description: 'Nightlife and entertainment for the city'
  }
];

export default function BusinessMenu({ isOpen, onClose, playerMoney, onPurchase }: BusinessMenuProps) {
  const [selectedTab, setSelectedTab] = useState<'owned' | 'available'>('owned');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('');
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>([]);

  const handlePurchaseBusiness = () => {
    if (!selectedLocation || !selectedBusinessType) return;

    const location = norfolkLocations.find(l => l.id === selectedLocation);
    const businessType = businessTypes.find(b => b.id === selectedBusinessType);
    
    if (!location || !businessType) return;

    const totalCost = location.cost + businessType.baseCost;
    
    if (playerMoney >= totalCost) {
      const newBusiness: Business = {
        id: `${selectedBusinessType}_${selectedLocation}_${Date.now()}`,
        name: `${businessType.name} - ${location.name}`,
        type: businessType.name,
        location: location.name,
        revenue: businessType.baseRevenue,
        expenses: Math.floor(businessType.baseRevenue * 0.3),
        profit: Math.floor(businessType.baseRevenue * 0.7),
        level: 1,
        employees: 1,
        icon: businessType.icon
      };

      setOwnedBusinesses([...ownedBusinesses, newBusiness]);
      onPurchase(newBusiness);
      setSelectedLocation('');
      setSelectedBusinessType('');
    }
  };

  const upgradeBusiness = (businessId: string) => {
    setOwnedBusinesses(prev => prev.map(business => {
      if (business.id === businessId) {
        const upgradeCost = business.level * 10000;
        if (playerMoney >= upgradeCost) {
          return {
            ...business,
            level: business.level + 1,
            revenue: Math.floor(business.revenue * 1.2),
            expenses: Math.floor(business.expenses * 1.1),
            profit: Math.floor(business.revenue * 1.2) - Math.floor(business.expenses * 1.1),
            employees: business.employees + 1
          };
        }
      }
      return business;
    }));
  };

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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-400">Business Empire</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-red-400 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSelectedTab('owned')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'owned'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                My Businesses ({ownedBusinesses.length})
              </button>
              <button
                onClick={() => setSelectedTab('available')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'available'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Start New Business
              </button>
            </div>

            {selectedTab === 'owned' ? (
              <div className="space-y-4">
                {ownedBusinesses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏢</div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Businesses Yet</h3>
                    <p className="text-gray-400">Start your first business to begin building your empire!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ownedBusinesses.map(business => (
                      <div key={business.id} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">{business.icon}</span>
                            <div>
                              <h4 className="text-lg font-semibold text-white">{business.name}</h4>
                              <p className="text-sm text-gray-400">{business.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Level {business.level}</div>
                            <div className="text-sm text-gray-400">{business.employees} employees</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                          <div className="bg-green-900/30 border border-green-500 rounded p-2 text-center">
                            <div className="text-green-400 font-medium">Revenue</div>
                            <div className="text-white">${business.revenue.toLocaleString()}</div>
                          </div>
                          <div className="bg-red-900/30 border border-red-500 rounded p-2 text-center">
                            <div className="text-red-400 font-medium">Expenses</div>
                            <div className="text-white">${business.expenses.toLocaleString()}</div>
                          </div>
                          <div className="bg-blue-900/30 border border-blue-500 rounded p-2 text-center">
                            <div className="text-blue-400 font-medium">Profit</div>
                            <div className="text-white">${business.profit.toLocaleString()}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => upgradeBusiness(business.id)}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-medium transition-colors"
                        >
                          Upgrade (${(business.level * 10000).toLocaleString()})
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Location Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Choose Location</h3>
                    <div className="space-y-2">
                      {norfolkLocations.map(location => (
                        <button
                          key={location.id}
                          onClick={() => setSelectedLocation(location.id)}
                          className={`w-full p-3 rounded-lg border transition-colors text-left ${
                            selectedLocation === location.id
                              ? 'border-blue-500 bg-blue-900/30'
                              : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{location.icon}</span>
                              <div>
                                <div className="text-white font-medium">{location.name}</div>
                                <div className="text-sm text-gray-400">Traffic: {location.traffic}</div>
                              </div>
                            </div>
                            <div className="text-yellow-400 font-medium">
                              ${location.cost.toLocaleString()}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Business Type Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Choose Business Type</h3>
                    <div className="space-y-2">
                      {businessTypes.map(business => (
                        <button
                          key={business.id}
                          onClick={() => setSelectedBusinessType(business.id)}
                          className={`w-full p-3 rounded-lg border transition-colors text-left ${
                            selectedBusinessType === business.id
                              ? 'border-green-500 bg-green-900/30'
                              : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{business.icon}</span>
                              <div>
                                <div className="text-white font-medium">{business.name}</div>
                                <div className="text-sm text-gray-400">Revenue: ${business.baseRevenue.toLocaleString()}/month</div>
                              </div>
                            </div>
                            <div className="text-yellow-400 font-medium">
                              ${business.baseCost.toLocaleString()}
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{business.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Purchase Summary */}
                {selectedLocation && selectedBusinessType && (
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Purchase Summary</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Location Cost</div>
                        <div className="text-white">${norfolkLocations.find(l => l.id === selectedLocation)?.cost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Business Cost</div>
                        <div className="text-white">${businessTypes.find(b => b.id === selectedBusinessType)?.baseCost.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="border-t border-gray-600 pt-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total Cost</span>
                        <span className="text-xl font-bold text-yellow-400">
                          ${((norfolkLocations.find(l => l.id === selectedLocation)?.cost || 0) + 
                             (businessTypes.find(b => b.id === selectedBusinessType)?.baseCost || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handlePurchaseBusiness}
                      disabled={playerMoney < ((norfolkLocations.find(l => l.id === selectedLocation)?.cost || 0) + 
                                              (businessTypes.find(b => b.id === selectedBusinessType)?.baseCost || 0))}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        playerMoney >= ((norfolkLocations.find(l => l.id === selectedLocation)?.cost || 0) + 
                                       (businessTypes.find(b => b.id === selectedBusinessType)?.baseCost || 0))
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {playerMoney >= ((norfolkLocations.find(l => l.id === selectedLocation)?.cost || 0) + 
                                      (businessTypes.find(b => b.id === selectedBusinessType)?.baseCost || 0))
                        ? 'Start Business'
                        : 'Insufficient Funds'
                      }
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}