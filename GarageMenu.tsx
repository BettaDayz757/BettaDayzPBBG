import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  speed: number;
  acceleration: number;
  handling: number;
  durability: number;
  icon: string;
  color: string;
  customizations?: {
    paint?: string;
    wheels?: string;
    spoiler?: boolean;
    tint?: string;
    engine?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface GarageMenuProps {
  isOpen: boolean;
  onClose: () => void;
  playerMoney: number;
  onPurchase: (vehicle: Vehicle) => void;
}

const availableVehicles: Vehicle[] = [
  {
    id: 'compact_car',
    name: 'City Cruiser',
    type: 'Compact',
    brand: 'EconoMax',
    model: 'Compact 2024',
    year: 2024,
    price: 15000,
    speed: 65,
    acceleration: 60,
    handling: 75,
    durability: 70,
    icon: '🚗',
    color: 'blue'
  },
  {
    id: 'sports_car',
    name: 'Lightning Bolt',
    type: 'Sports',
    brand: 'SpeedTech',
    model: 'Lightning GT',
    year: 2024,
    price: 85000,
    speed: 95,
    acceleration: 90,
    handling: 85,
    durability: 60,
    icon: '🏎️',
    color: 'red'
  },
  {
    id: 'suv',
    name: 'Urban Explorer',
    type: 'SUV',
    brand: 'RoadMaster',
    model: 'Explorer XL',
    year: 2024,
    price: 45000,
    speed: 70,
    acceleration: 65,
    handling: 70,
    durability: 90,
    icon: '🚙',
    color: 'black'
  },
  {
    id: 'motorcycle',
    name: 'Street Demon',
    type: 'Motorcycle',
    brand: 'ThunderBike',
    model: 'Demon 1000',
    year: 2024,
    price: 25000,
    speed: 90,
    acceleration: 95,
    handling: 80,
    durability: 50,
    icon: '🏍️',
    color: 'orange'
  },
  {
    id: 'luxury_sedan',
    name: 'Executive Elite',
    type: 'Luxury',
    brand: 'LuxuryLine',
    model: 'Elite S-Class',
    year: 2024,
    price: 120000,
    speed: 80,
    acceleration: 75,
    handling: 80,
    durability: 85,
    icon: '🚘',
    color: 'silver'
  },
  {
    id: 'truck',
    name: 'Heavy Hauler',
    type: 'Truck',
    brand: 'WorkForce',
    model: 'Hauler 3500',
    year: 2024,
    price: 55000,
    speed: 60,
    acceleration: 50,
    handling: 55,
    durability: 95,
    icon: '🚚',
    color: 'white'
  },
  {
    id: 'supercar',
    name: 'Apex Predator',
    type: 'Supercar',
    brand: 'HyperSpeed',
    model: 'Predator X1',
    year: 2024,
    price: 250000,
    speed: 100,
    acceleration: 100,
    handling: 95,
    durability: 70,
    icon: '🏁',
    color: 'yellow'
  },
  {
    id: 'electric_car',
    name: 'Eco Thunder',
    type: 'Electric',
    brand: 'GreenTech',
    model: 'Thunder EV',
    year: 2024,
    price: 65000,
    speed: 85,
    acceleration: 88,
    handling: 82,
    durability: 80,
    icon: '⚡',
    color: 'green'
  }
];

const customizationOptions = {
  paint: [
    { name: 'Metallic Red', price: 2000, color: 'red' },
    { name: 'Pearl White', price: 2500, color: 'white' },
    { name: 'Matte Black', price: 3000, color: 'black' },
    { name: 'Electric Blue', price: 2200, color: 'blue' },
    { name: 'Sunset Orange', price: 2300, color: 'orange' },
    { name: 'Racing Yellow', price: 2100, color: 'yellow' },
    { name: 'Forest Green', price: 2400, color: 'green' },
    { name: 'Royal Purple', price: 2800, color: 'purple' }
  ],
  wheels: [
    { name: 'Sport Alloys', price: 1500, boost: { handling: 5 } },
    { name: 'Racing Rims', price: 3000, boost: { handling: 10, speed: 2 } },
    { name: 'Chrome Classics', price: 2000, boost: { durability: 3 } },
    { name: 'Carbon Fiber', price: 5000, boost: { handling: 15, acceleration: 5 } }
  ],
  engine: [
    { name: 'Turbo Kit', price: 8000, boost: { acceleration: 15, speed: 10 } },
    { name: 'Supercharger', price: 12000, boost: { acceleration: 20, speed: 15 } },
    { name: 'Nitrous System', price: 15000, boost: { acceleration: 25, speed: 20 } },
    { name: 'Racing Engine', price: 25000, boost: { acceleration: 30, speed: 25, handling: 10 } }
  ],
  other: [
    { name: 'Spoiler Kit', price: 1200, boost: { handling: 8 } },
    { name: 'Window Tint', price: 500, boost: { durability: 2 } },
    { name: 'Sound System', price: 2000, boost: {} },
    { name: 'LED Lights', price: 800, boost: {} }
  ]
};

export default function GarageMenu({ isOpen, onClose, playerMoney, onPurchase }: GarageMenuProps) {
  const [selectedTab, setSelectedTab] = useState<'owned' | 'dealership' | 'customize'>('owned');
  const [ownedVehicles, setOwnedVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [customizingVehicle, setCustomizingVehicle] = useState<Vehicle | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const vehicleTypes = ['all', 'Compact', 'Sports', 'SUV', 'Motorcycle', 'Luxury', 'Truck', 'Supercar', 'Electric'];

  const filteredVehicles = filterType === 'all' 
    ? availableVehicles.filter(v => !ownedVehicles.find(owned => owned.id === v.id))
    : availableVehicles.filter(v => v.type === filterType && !ownedVehicles.find(owned => owned.id === v.id));

  const handlePurchaseVehicle = (vehicle: Vehicle) => {
    if (playerMoney >= vehicle.price) {
      setOwnedVehicles([...ownedVehicles, { ...vehicle, customizations: {} }]);
      onPurchase(vehicle);
      setSelectedVehicle(null);
    }
  };

  const sellVehicle = (vehicleId: string) => {
    const vehicle = ownedVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      const sellPrice = Math.floor(vehicle.price * 0.6); // Sell for 60% of original price
      setOwnedVehicles(prev => prev.filter(v => v.id !== vehicleId));
      // Add sell price to player money (would need to be handled by parent component)
    }
  };

  const applyCustomization = (vehicleId: string, customType: string, customization: any) => {
    if (playerMoney >= customization.price) {
      setOwnedVehicles(prev => prev.map(vehicle => {
        if (vehicle.id === vehicleId) {
          const updatedVehicle = { ...vehicle };
          
          // Apply visual customization
          if (!updatedVehicle.customizations) updatedVehicle.customizations = {};
          updatedVehicle.customizations[customType] = customization.name;
          
          // Apply stat boosts
          if (customization.boost) {
            Object.keys(customization.boost).forEach(stat => {
              updatedVehicle[stat] = Math.min(100, updatedVehicle[stat] + customization.boost[stat]);
            });
          }
          
          return updatedVehicle;
        }
        return vehicle;
      }));
    }
  };

  const getStatColor = (value: number) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 70) return 'text-yellow-400';
    if (value >= 50) return 'text-orange-400';
    return 'text-red-400';
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
            className="bg-gray-900 rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-400">Garage</h2>
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
                My Vehicles ({ownedVehicles.length})
              </button>
              <button
                onClick={() => setSelectedTab('dealership')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'dealership'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Dealership
              </button>
              <button
                onClick={() => setSelectedTab('customize')}
                disabled={ownedVehicles.length === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'customize'
                    ? 'bg-blue-600 text-white'
                    : ownedVehicles.length === 0
                    ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Customize
              </button>
            </div>

            {selectedTab === 'owned' ? (
              <div className="space-y-4">
                {ownedVehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚗</div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Vehicles Yet</h3>
                    <p className="text-gray-400">Visit the dealership to buy your first ride!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ownedVehicles.map(vehicle => (
                      <div key={vehicle.id} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">{vehicle.icon}</span>
                            <div>
                              <h4 className="text-lg font-semibold text-white">{vehicle.name}</h4>
                              <p className="text-sm text-gray-400">{vehicle.brand} {vehicle.model}</p>
                            </div>
                          </div>
                          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                            {vehicle.type}
                          </span>
                        </div>

                        {/* Vehicle Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-gray-700 rounded p-2">
                            <div className="text-xs text-gray-400">Speed</div>
                            <div className={`font-medium ${getStatColor(vehicle.speed)}`}>{vehicle.speed}</div>
                          </div>
                          <div className="bg-gray-700 rounded p-2">
                            <div className="text-xs text-gray-400">Acceleration</div>
                            <div className={`font-medium ${getStatColor(vehicle.acceleration)}`}>{vehicle.acceleration}</div>
                          </div>
                          <div className="bg-gray-700 rounded p-2">
                            <div className="text-xs text-gray-400">Handling</div>
                            <div className={`font-medium ${getStatColor(vehicle.handling)}`}>{vehicle.handling}</div>
                          </div>
                          <div className="bg-gray-700 rounded p-2">
                            <div className="text-xs text-gray-400">Durability</div>
                            <div className={`font-medium ${getStatColor(vehicle.durability)}`}>{vehicle.durability}</div>
                          </div>
                        </div>

                        {/* Customizations */}
                        {vehicle.customizations && Object.keys(vehicle.customizations).length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs text-gray-400 mb-2">Customizations:</div>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(vehicle.customizations).map(([type, value]) => (
                                <span key={type} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                  {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCustomizingVehicle(vehicle);
                              setSelectedTab('customize');
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                          >
                            Customize
                          </button>
                          <button
                            onClick={() => sellVehicle(vehicle.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : selectedTab === 'dealership' ? (
              <div className="space-y-6">
                {/* Filter */}
                <div className="flex flex-wrap gap-2">
                  {vehicleTypes.map(type => (
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

                {/* Available Vehicles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVehicles.map(vehicle => (
                    <div key={vehicle.id} className="bg-gray-800 border border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{vehicle.icon}</span>
                          <div>
                            <h4 className="text-lg font-semibold text-white">{vehicle.name}</h4>
                            <p className="text-sm text-gray-400">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
                          </div>
                        </div>
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                          {vehicle.type}
                        </span>
                      </div>

                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-yellow-400">
                          ${vehicle.price.toLocaleString()}
                        </div>
                      </div>

                      {/* Vehicle Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-700 rounded p-2">
                          <div className="text-xs text-gray-400">Speed</div>
                          <div className={`font-medium ${getStatColor(vehicle.speed)}`}>{vehicle.speed}</div>
                        </div>
                        <div className="bg-gray-700 rounded p-2">
                          <div className="text-xs text-gray-400">Acceleration</div>
                          <div className={`font-medium ${getStatColor(vehicle.acceleration)}`}>{vehicle.acceleration}</div>
                        </div>
                        <div className="bg-gray-700 rounded p-2">
                          <div className="text-xs text-gray-400">Handling</div>
                          <div className={`font-medium ${getStatColor(vehicle.handling)}`}>{vehicle.handling}</div>
                        </div>
                        <div className="bg-gray-700 rounded p-2">
                          <div className="text-xs text-gray-400">Durability</div>
                          <div className={`font-medium ${getStatColor(vehicle.durability)}`}>{vehicle.durability}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchaseVehicle(vehicle)}
                        disabled={playerMoney < vehicle.price}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          playerMoney >= vehicle.price
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {playerMoney >= vehicle.price ? 'Purchase' : 'Insufficient Funds'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Vehicle Selection for Customization */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Select Vehicle to Customize</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {ownedVehicles.map(vehicle => (
                      <button
                        key={vehicle.id}
                        onClick={() => setCustomizingVehicle(vehicle)}
                        className={`p-4 rounded-lg border transition-colors text-left ${
                          customizingVehicle?.id === vehicle.id
                            ? 'border-blue-500 bg-blue-900/30'
                            : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{vehicle.icon}</span>
                          <div>
                            <div className="text-white font-medium">{vehicle.name}</div>
                            <div className="text-sm text-gray-400">{vehicle.type}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customization Options */}
                {customizingVehicle && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">
                      Customizing: {customizingVehicle.name}
                    </h3>

                    {/* Paint Options */}
                    <div>
                      <h4 className="text-lg font-medium text-yellow-400 mb-3">Paint Jobs</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {customizationOptions.paint.map(paint => (
                          <button
                            key={paint.name}
                            onClick={() => applyCustomization(customizingVehicle.id, 'paint', paint)}
                            disabled={playerMoney < paint.price}
                            className={`p-3 rounded-lg border transition-colors ${
                              playerMoney >= paint.price
                                ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                                : 'border-gray-700 bg-gray-900 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className={`w-full h-8 rounded mb-2 bg-${paint.color}-500`}></div>
                            <div className="text-white text-sm font-medium">{paint.name}</div>
                            <div className="text-yellow-400 text-xs">${paint.price.toLocaleString()}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Wheels */}
                    <div>
                      <h4 className="text-lg font-medium text-yellow-400 mb-3">Wheels</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {customizationOptions.wheels.map(wheel => (
                          <button
                            key={wheel.name}
                            onClick={() => applyCustomization(customizingVehicle.id, 'wheels', wheel)}
                            disabled={playerMoney < wheel.price}
                            className={`p-3 rounded-lg border transition-colors text-left ${
                              playerMoney >= wheel.price
                                ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                                : 'border-gray-700 bg-gray-900 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-white font-medium">{wheel.name}</div>
                              <div className="text-yellow-400">${wheel.price.toLocaleString()}</div>
                            </div>
                            <div className="text-sm text-gray-400">
                              {Object.entries(wheel.boost).map(([stat, value]) => (
                                <span key={stat} className="mr-2">+{value} {stat}</span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Engine Upgrades */}
                    <div>
                      <h4 className="text-lg font-medium text-yellow-400 mb-3">Engine Upgrades</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {customizationOptions.engine.map(engine => (
                          <button
                            key={engine.name}
                            onClick={() => applyCustomization(customizingVehicle.id, 'engine', engine)}
                            disabled={playerMoney < engine.price}
                            className={`p-3 rounded-lg border transition-colors text-left ${
                              playerMoney >= engine.price
                                ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                                : 'border-gray-700 bg-gray-900 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-white font-medium">{engine.name}</div>
                              <div className="text-yellow-400">${engine.price.toLocaleString()}</div>
                            </div>
                            <div className="text-sm text-gray-400">
                              {Object.entries(engine.boost).map(([stat, value]) => (
                                <span key={stat} className="mr-2">+{value} {stat}</span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
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