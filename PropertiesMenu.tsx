import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  value: number;
  monthlyIncome: number;
  maintenanceCost: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  icon: string;
  image?: string;
}

interface PropertiesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  playerMoney: number;
  onPurchase: (property: Property) => void;
}

const availableProperties: Property[] = [
  {
    id: 'ghent_apartment',
    name: 'Ghent District Apartment',
    type: 'Apartment',
    location: 'Ghent',
    value: 150000,
    monthlyIncome: 1200,
    maintenanceCost: 200,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 900,
    icon: '🏠',
    image: '🏙️'
  },
  {
    id: 'oceanview_condo',
    name: 'Ocean View Condo',
    type: 'Condominium',
    location: 'Ocean View',
    value: 250000,
    monthlyIncome: 2000,
    maintenanceCost: 300,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    icon: '🌊',
    image: '🏖️'
  },
  {
    id: 'downtown_penthouse',
    name: 'Downtown Penthouse',
    type: 'Penthouse',
    location: 'Downtown Norfolk',
    value: 500000,
    monthlyIncome: 4000,
    maintenanceCost: 600,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    icon: '🏢',
    image: '🌃'
  },
  {
    id: 'suburban_house',
    name: 'Suburban Family Home',
    type: 'House',
    location: 'Berkley',
    value: 200000,
    monthlyIncome: 1500,
    maintenanceCost: 250,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    icon: '🏡',
    image: '🌳'
  },
  {
    id: 'luxury_mansion',
    name: 'Luxury Waterfront Mansion',
    type: 'Mansion',
    location: 'Norfolk Botanical Garden Area',
    value: 1000000,
    monthlyIncome: 8000,
    maintenanceCost: 1200,
    bedrooms: 6,
    bathrooms: 5,
    sqft: 5000,
    icon: '🏰',
    image: '🌺'
  },
  {
    id: 'commercial_building',
    name: 'Commercial Office Building',
    type: 'Commercial',
    location: 'Military Circle',
    value: 750000,
    monthlyIncome: 6000,
    maintenanceCost: 800,
    sqft: 10000,
    icon: '🏢',
    image: '💼'
  },
  {
    id: 'warehouse',
    name: 'Industrial Warehouse',
    type: 'Industrial',
    location: 'Portsmouth',
    value: 300000,
    monthlyIncome: 2500,
    maintenanceCost: 400,
    sqft: 15000,
    icon: '🏭',
    image: '📦'
  },
  {
    id: 'retail_space',
    name: 'Prime Retail Space',
    type: 'Retail',
    location: 'MacArthur Center Area',
    value: 400000,
    monthlyIncome: 3200,
    maintenanceCost: 500,
    sqft: 2000,
    icon: '🛍️',
    image: '🛒'
  }
];

export default function PropertiesMenu({ isOpen, onClose, playerMoney, onPurchase }: PropertiesMenuProps) {
  const [selectedTab, setSelectedTab] = useState<'owned' | 'available'>('owned');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [ownedProperties, setOwnedProperties] = useState<Property[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  const propertyTypes = ['all', 'Apartment', 'House', 'Condominium', 'Penthouse', 'Mansion', 'Commercial', 'Industrial', 'Retail'];

  const filteredProperties = filterType === 'all' 
    ? availableProperties.filter(p => !ownedProperties.find(owned => owned.id === p.id))
    : availableProperties.filter(p => p.type === filterType && !ownedProperties.find(owned => owned.id === p.id));

  const handlePurchaseProperty = (property: Property) => {
    if (playerMoney >= property.value) {
      setOwnedProperties([...ownedProperties, property]);
      onPurchase(property);
      setSelectedProperty(null);
    }
  };

  const sellProperty = (propertyId: string) => {
    const property = ownedProperties.find(p => p.id === propertyId);
    if (property) {
      const sellPrice = Math.floor(property.value * 0.8); // Sell for 80% of value
      setOwnedProperties(prev => prev.filter(p => p.id !== propertyId));
      // Add sell price to player money (would need to be handled by parent component)
    }
  };

  const totalMonthlyIncome = ownedProperties.reduce((sum, property) => sum + property.monthlyIncome, 0);
  const totalMaintenanceCost = ownedProperties.reduce((sum, property) => sum + property.maintenanceCost, 0);
  const netMonthlyIncome = totalMonthlyIncome - totalMaintenanceCost;

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
            className="bg-gray-900 rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-400">Real Estate Portfolio</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-red-400 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Portfolio Summary */}
            {ownedProperties.length > 0 && (
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Portfolio Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{ownedProperties.length}</div>
                    <div className="text-sm text-gray-400">Properties Owned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">${totalMonthlyIncome.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Monthly Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">${totalMaintenanceCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Monthly Costs</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${netMonthlyIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${netMonthlyIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Net Monthly</div>
                  </div>
                </div>
              </div>
            )}

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
                My Properties ({ownedProperties.length})
              </button>
              <button
                onClick={() => setSelectedTab('available')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'available'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Available Properties
              </button>
            </div>

            {selectedTab === 'owned' ? (
              <div className="space-y-4">
                {ownedProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Properties Yet</h3>
                    <p className="text-gray-400">Start building your real estate empire!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ownedProperties.map(property => (
                      <div key={property.id} className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{property.icon}</span>
                              <div>
                                <h4 className="text-lg font-semibold text-white">{property.name}</h4>
                                <p className="text-sm text-gray-400">{property.location}</p>
                              </div>
                            </div>
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                              {property.type}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Value:</span>
                              <span className="text-white">${property.value.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-green-400">Monthly Income:</span>
                              <span className="text-green-400">+${property.monthlyIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-red-400">Maintenance:</span>
                              <span className="text-red-400">-${property.maintenanceCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium border-t border-gray-600 pt-2">
                              <span className="text-white">Net Income:</span>
                              <span className="text-yellow-400">
                                ${(property.monthlyIncome - property.maintenanceCost).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {property.bedrooms && (
                            <div className="flex justify-between text-xs text-gray-400 mb-4">
                              <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                              <span>{property.sqft?.toLocaleString()} sq ft</span>
                            </div>
                          )}

                          <button
                            onClick={() => sellProperty(property.id)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
                          >
                            Sell (${Math.floor(property.value * 0.8).toLocaleString()})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Filter */}
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type}
                    </button>
                  ))}
                </div>

                {/* Available Properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProperties.map(property => (
                    <div key={property.id} className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{property.icon}</span>
                            <div>
                              <h4 className="text-lg font-semibold text-white">{property.name}</h4>
                              <p className="text-sm text-gray-400">{property.location}</p>
                            </div>
                          </div>
                          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                            {property.type}
                          </span>
                        </div>

                        <div className="text-center mb-4">
                          <div className="text-3xl mb-2">{property.image}</div>
                          <div className="text-2xl font-bold text-yellow-400">
                            ${property.value.toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-400">Monthly Income:</span>
                            <span className="text-green-400">+${property.monthlyIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-red-400">Maintenance:</span>
                            <span className="text-red-400">-${property.maintenanceCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm font-medium border-t border-gray-600 pt-2">
                            <span className="text-white">Net Income:</span>
                            <span className="text-yellow-400">
                              ${(property.monthlyIncome - property.maintenanceCost).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {property.bedrooms && (
                          <div className="flex justify-between text-xs text-gray-400 mb-4">
                            <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                            <span>{property.sqft?.toLocaleString()} sq ft</span>
                          </div>
                        )}

                        <button
                          onClick={() => handlePurchaseProperty(property)}
                          disabled={playerMoney < property.value}
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${
                            playerMoney >= property.value
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {playerMoney >= property.value ? 'Purchase' : 'Insufficient Funds'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}