'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ExoticCar {
  id: string;
  name: string;
  brand: string;
  price: number;
  speed: number;
  acceleration: number;
  handling: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  description: string;
  owned: boolean;
}

const exoticCars: ExoticCar[] = [
  {
    id: 'lambo-aventador',
    name: 'Aventador SVJ',
    brand: 'Lamborghini',
    price: 450000,
    speed: 95,
    acceleration: 92,
    handling: 88,
    rarity: 'legendary',
    image: '/cars/lamborghini-aventador.jpg',
    description: 'The ultimate expression of Lamborghini\'s V12 legacy',
    owned: false
  },
  {
    id: 'ferrari-f8',
    name: 'F8 Tributo',
    brand: 'Ferrari',
    price: 280000,
    speed: 90,
    acceleration: 95,
    handling: 93,
    rarity: 'epic',
    image: '/cars/ferrari-f8.jpg',
    description: 'Mid-rear-engined sports car with twin-turbo V8',
    owned: false
  },
  {
    id: 'mclaren-720s',
    name: '720S',
    brand: 'McLaren',
    price: 300000,
    speed: 93,
    acceleration: 97,
    handling: 95,
    rarity: 'epic',
    image: '/cars/mclaren-720s.jpg',
    description: 'Carbon fiber monocoque with active aerodynamics',
    owned: false
  },
  {
    id: 'bugatti-chiron',
    name: 'Chiron',
    brand: 'Bugatti',
    price: 3000000,
    speed: 100,
    acceleration: 98,
    handling: 85,
    rarity: 'legendary',
    image: '/cars/bugatti-chiron.jpg',
    description: 'Quad-turbocharged W16 masterpiece',
    owned: false
  },
  {
    id: 'porsche-911',
    name: '911 Turbo S',
    brand: 'Porsche',
    price: 200000,
    speed: 85,
    acceleration: 88,
    handling: 98,
    rarity: 'rare',
    image: '/cars/porsche-911.jpg',
    description: 'The benchmark for sports car excellence',
    owned: false
  },
  {
    id: 'koenigsegg-regera',
    name: 'Regera',
    brand: 'Koenigsegg',
    price: 2000000,
    speed: 98,
    acceleration: 96,
    handling: 90,
    rarity: 'legendary',
    image: '/cars/koenigsegg-regera.jpg',
    description: 'Revolutionary hybrid drivetrain technology',
    owned: false
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'text-yellow-400 border-yellow-400';
    case 'epic': return 'text-purple-400 border-purple-400';
    case 'rare': return 'text-blue-400 border-blue-400';
    default: return 'text-gray-400 border-gray-400';
  }
};

const getRarityGlow = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'shadow-lg shadow-yellow-400/30';
    case 'epic': return 'shadow-lg shadow-purple-400/30';
    case 'rare': return 'shadow-lg shadow-blue-400/30';
    default: return 'shadow-lg shadow-gray-400/30';
  }
};

export default function ExoticCarShowroom() {
  const [selectedCar, setSelectedCar] = useState<ExoticCar | null>(null);
  const [userCoins, setUserCoins] = useState(500000); // Starting coins
  const [ownedCars, setOwnedCars] = useState<string[]>([]);
  const [filterRarity, setFilterRarity] = useState<string>('all');

  const filteredCars = exoticCars.filter(car => 
    filterRarity === 'all' || car.rarity === filterRarity
  );

  const purchaseCar = (car: ExoticCar) => {
    if (userCoins >= car.price && !ownedCars.includes(car.id)) {
      setUserCoins(prev => prev - car.price);
      setOwnedCars(prev => [...prev, car.id]);
      // Here you would typically save to backend/Supabase
    }
  };

  const isOwned = (carId: string) => ownedCars.includes(carId);
  const canAfford = (price: number) => userCoins >= price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🏎️ Exotic Car Showroom
          </h1>
          <div className="flex justify-center items-center gap-6 text-xl">
            <div className="text-green-400 font-bold">
              💰 ${userCoins.toLocaleString()}
            </div>
            <div className="text-blue-400">
              🏁 Cars Owned: {ownedCars.length}
            </div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex justify-center gap-4 mb-8">
          {['all', 'common', 'rare', 'epic', 'legendary'].map(rarity => (
            <button
              key={rarity}
              onClick={() => setFilterRarity(rarity)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filterRarity === rarity
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                bg-gray-800 rounded-xl overflow-hidden border-2 
                ${getRarityColor(car.rarity)} ${getRarityGlow(car.rarity)}
                cursor-pointer transform transition-all duration-300 hover:scale-105
                ${isOwned(car.id) ? 'bg-green-900 border-green-400' : ''}
              `}
              onClick={() => setSelectedCar(car)}
            >
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    e.currentTarget.src = `https://via.placeholder.com/400x200/333/fff?text=${car.brand}+${car.name}`;
                  }}
                />
                {isOwned(car.id) && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    OWNED
                  </div>
                )}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold uppercase ${getRarityColor(car.rarity)}`}>
                  {car.rarity}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  {car.brand} {car.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{car.description}</p>
                
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

                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-bold text-lg">
                    ${car.price.toLocaleString()}
                  </span>
                  {!isOwned(car.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        purchaseCar(car);
                      }}
                      disabled={!canAfford(car.price)}
                      className={`
                        px-4 py-2 rounded-lg font-medium transition-all duration-300
                        ${canAfford(car.price)
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {canAfford(car.price) ? 'Buy' : 'Too Expensive'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
              className={`
                bg-gray-800 rounded-xl max-w-2xl w-full max-h-90vh overflow-y-auto
                border-2 ${getRarityColor(selectedCar.rarity)} ${getRarityGlow(selectedCar.rarity)}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/600x300/333/fff?text=${selectedCar.brand}+${selectedCar.name}`;
                  }}
                />
                <button
                  onClick={() => setSelectedCar(null)}
                  className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                >
                  ✕
                </button>
                {isOwned(selectedCar.id) && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
                    OWNED
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedCar.brand} {selectedCar.name}
                </h2>
                <p className="text-gray-400 mb-4">{selectedCar.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-red-400 text-2xl mb-2">⚡</div>
                    <div className="text-white font-bold text-xl">{selectedCar.speed}</div>
                    <div className="text-gray-400 text-sm">Top Speed</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-yellow-400 text-2xl mb-2">🚀</div>
                    <div className="text-white font-bold text-xl">{selectedCar.acceleration}</div>
                    <div className="text-gray-400 text-sm">Acceleration</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-blue-400 text-2xl mb-2">🎯</div>
                    <div className="text-white font-bold text-xl">{selectedCar.handling}</div>
                    <div className="text-gray-400 text-sm">Handling</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-green-400 font-bold text-2xl">
                    ${selectedCar.price.toLocaleString()}
                  </div>
                  {!isOwned(selectedCar.id) && (
                    <button
                      onClick={() => {
                        purchaseCar(selectedCar);
                        setSelectedCar(null);
                      }}
                      disabled={!canAfford(selectedCar.price)}
                      className={`
                        px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
                        ${canAfford(selectedCar.price)
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {canAfford(selectedCar.price) ? '🛒 Purchase Car' : '💰 Insufficient Funds'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}