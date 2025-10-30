'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Car {
  id: string;
  name: string;
  brand: string;
  type: 'exotic' | 'sports' | 'luxury' | 'muscle';
  speed: number;
  acceleration: number;
  handling: number;
  condition: number; // 0-100
  mileage: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  purchaseDate: string;
  modifications: string[];
  races_won: number;
  races_total: number;
}

interface GarageStats {
  totalCars: number;
  totalValue: number;
  favoriteType: string;
  totalRacesWon: number;
  totalMileage: number;
}

const mockCars: Car[] = [
  {
    id: 'lambo-aventador',
    name: 'Aventador SVJ',
    brand: 'Lamborghini',
    type: 'exotic',
    speed: 95,
    acceleration: 92,
    handling: 88,
    condition: 98,
    mileage: 1250,
    rarity: 'legendary',
    image: '/cars/lamborghini-aventador.jpg',
    purchaseDate: '2024-10-15',
    modifications: ['Performance Exhaust', 'Carbon Fiber Body Kit', 'Racing Suspension'],
    races_won: 15,
    races_total: 18
  },
  {
    id: 'ferrari-f8',
    name: 'F8 Tributo',
    brand: 'Ferrari',
    type: 'exotic',
    speed: 90,
    acceleration: 95,
    handling: 93,
    condition: 92,
    mileage: 2100,
    rarity: 'epic',
    image: '/cars/ferrari-f8.jpg',
    purchaseDate: '2024-09-20',
    modifications: ['Turbo Upgrade', 'Racing Tires'],
    races_won: 12,
    races_total: 15
  }
];

export default function PersonalGarage() {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'condition' | 'speed' | 'rarity'>('name');
  const [filterType, setFilterType] = useState<string>('all');

  const garageStats: GarageStats = {
    totalCars: cars.length,
    totalValue: cars.reduce((sum, car) => sum + (car.speed * car.acceleration * car.handling * 100), 0),
    favoriteType: 'exotic',
    totalRacesWon: cars.reduce((sum, car) => sum + car.races_won, 0),
    totalMileage: cars.reduce((sum, car) => sum + car.mileage, 0)
  };

  const sortedAndFilteredCars = cars
    .filter(car => filterType === 'all' || car.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'condition': return b.condition - a.condition;
        case 'speed': return b.speed - a.speed;
        case 'rarity': 
          const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        default: return a.name.localeCompare(b.name);
      }
    });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      case 'epic': return 'text-purple-400 border-purple-400 bg-purple-400/10';
      case 'rare': return 'text-blue-400 border-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 border-gray-400 bg-gray-400/10';
    }
  };

  const getConditionColor = (condition: number) => {
    if (condition >= 90) return 'text-green-400';
    if (condition >= 70) return 'text-yellow-400';
    if (condition >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const performMaintenance = (carId: string) => {
    setCars(prev => prev.map(car => 
      car.id === carId 
        ? { ...car, condition: Math.min(100, car.condition + 20) }
        : car
    ));
  };

  const addModification = (carId: string, modification: string) => {
    setCars(prev => prev.map(car => 
      car.id === carId 
        ? { ...car, modifications: [...car.modifications, modification] }
        : car
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🏎️ Personal Garage
          </h1>
          <p className="text-gray-400 text-lg">Manage and customize your exotic car collection</p>
        </motion.div>

        {/* Garage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-blue-400 text-2xl mb-2">🚗</div>
            <div className="text-white font-bold text-xl">{garageStats.totalCars}</div>
            <div className="text-gray-400 text-sm">Cars Owned</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-green-400 text-2xl mb-2">💰</div>
            <div className="text-white font-bold text-xl">${(garageStats.totalValue / 1000000).toFixed(1)}M</div>
            <div className="text-gray-400 text-sm">Total Value</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-yellow-400 text-2xl mb-2">🏆</div>
            <div className="text-white font-bold text-xl">{garageStats.totalRacesWon}</div>
            <div className="text-gray-400 text-sm">Races Won</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-purple-400 text-2xl mb-2">📊</div>
            <div className="text-white font-bold text-xl">{(garageStats.totalMileage / 1000).toFixed(1)}K</div>
            <div className="text-gray-400 text-sm">Miles Driven</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-red-400 text-2xl mb-2">⭐</div>
            <div className="text-white font-bold text-xl">{garageStats.favoriteType}</div>
            <div className="text-gray-400 text-sm">Favorite Type</div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <div className="flex gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'
                }`}
              >
                List
              </button>
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600"
            >
              <option value="all">All Types</option>
              <option value="exotic">Exotic</option>
              <option value="sports">Sports</option>
              <option value="luxury">Luxury</option>
              <option value="muscle">Muscle</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600"
            >
              <option value="name">Name</option>
              <option value="condition">Condition</option>
              <option value="speed">Speed</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>
        </div>

        {/* Car Display */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {sortedAndFilteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    bg-gray-800 rounded-xl overflow-hidden border-2 cursor-pointer
                    transform transition-all duration-300 hover:scale-105
                    ${getRarityColor(car.rarity)}
                  `}
                  onClick={() => setSelectedCar(car)}
                >
                  <div className="relative">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x200/333/fff?text=${car.brand}+${car.name}`;
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-full px-2 py-1">
                      <span className={`text-sm font-bold ${getConditionColor(car.condition)}`}>
                        {car.condition}%
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {car.brand} {car.name}
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                      <div className="text-center">
                        <div className="text-red-400">⚡ {car.speed}</div>
                        <div className="text-xs text-gray-500">Speed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400">🚀 {car.acceleration}</div>
                        <div className="text-xs text-gray-500">Accel</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400">🎯 {car.handling}</div>
                        <div className="text-xs text-gray-500">Handle</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">{car.mileage.toLocaleString()} miles</span>
                      <span className="text-green-400">{car.races_won}/{car.races_total} wins</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {sortedAndFilteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    bg-gray-800 rounded-lg border-l-4 cursor-pointer
                    transform transition-all duration-300 hover:bg-gray-750
                    ${getRarityColor(car.rarity)}
                  `}
                  onClick={() => setSelectedCar(car)}
                >
                  <div className="flex items-center p-4">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/64x64/333/fff?text=${car.brand.charAt(0)}`;
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">
                        {car.brand} {car.name}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Condition: <span className={getConditionColor(car.condition)}>{car.condition}%</span></span>
                        <span>Mileage: {car.mileage.toLocaleString()}</span>
                        <span>Wins: {car.races_won}/{car.races_total}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">⚡{car.speed} 🚀{car.acceleration} 🎯{car.handling}</div>
                      <div className="text-sm text-gray-400">{car.type}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Car Detail Modal */}
        {selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCar(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-90vh overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/800x300/333/fff?text=${selectedCar.brand}+${selectedCar.name}`;
                  }}
                />
                <button
                  onClick={() => setSelectedCar(null)}
                  className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {selectedCar.brand} {selectedCar.name}
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-2">Performance Stats</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-red-400 text-xl">⚡ {selectedCar.speed}</div>
                            <div className="text-sm text-gray-400">Speed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 text-xl">🚀 {selectedCar.acceleration}</div>
                            <div className="text-sm text-gray-400">Acceleration</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 text-xl">🎯 {selectedCar.handling}</div>
                            <div className="text-sm text-gray-400">Handling</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-2">Vehicle Info</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Condition:</span>
                            <span className={getConditionColor(selectedCar.condition)}>
                              {selectedCar.condition}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Mileage:</span>
                            <span className="text-white">{selectedCar.mileage.toLocaleString()} miles</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Race Record:</span>
                            <span className="text-white">{selectedCar.races_won}/{selectedCar.races_total} wins</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Purchase Date:</span>
                            <span className="text-white">{selectedCar.purchaseDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-white mb-2">Modifications</h3>
                      <div className="space-y-2">
                        {selectedCar.modifications.map((mod, index) => (
                          <div key={index} className="bg-gray-600 rounded-lg p-2 text-sm text-white">
                            🔧 {mod}
                          </div>
                        ))}
                        <button
                          onClick={() => addModification(selectedCar.id, 'Nitrous System')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 text-sm transition-colors"
                        >
                          + Add Modification
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-white mb-2">Actions</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => performMaintenance(selectedCar.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg p-3 transition-colors"
                        >
                          🔧 Perform Maintenance (+20% Condition)
                        </button>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-3 transition-colors">
                          🏁 Enter Race
                        </button>
                        <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg p-3 transition-colors">
                          📸 Photo Mode
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}