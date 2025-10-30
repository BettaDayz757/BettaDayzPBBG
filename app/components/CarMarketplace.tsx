'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: 'Sports' | 'Luxury' | 'Classic' | 'Hypercar' | 'Electric' | 'Tuner';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  stats: {
    speed: number;
    acceleration: number;
    handling: number;
    braking: number;
  };
  image: string;
  description: string;
  features: string[];
  condition: number;
  mileage: number;
  previousOwners: number;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
  };
  availability: 'Available' | 'Sold' | 'Reserved' | 'Auction';
  timeLeft?: string; // for auctions
}

const marketplaceCars: Car[] = [
  {
    id: 'tesla-roadster-2024',
    brand: 'Tesla',
    model: 'Roadster',
    year: 2024,
    price: 200000,
    category: 'Electric',
    rarity: 'Epic',
    stats: { speed: 95, acceleration: 100, handling: 85, braking: 90 },
    image: '/cars/tesla-roadster.jpg',
    description: 'Revolutionary electric hypercar with SpaceX thrusters',
    features: ['Cold Gas Thrusters', 'Autopilot', '620mi Range', '0-60 in 1.9s'],
    condition: 100,
    mileage: 0,
    previousOwners: 0,
    seller: { name: 'Tesla Motors', rating: 5.0, verified: true },
    availability: 'Available'
  },
  {
    id: 'porsche-911-gt3-rs',
    brand: 'Porsche',
    model: '911 GT3 RS',
    year: 2023,
    price: 245000,
    category: 'Sports',
    rarity: 'Epic',
    stats: { speed: 92, acceleration: 88, handling: 98, braking: 95 },
    image: '/cars/porsche-gt3-rs.jpg',
    description: 'Track-focused precision engineering at its finest',
    features: ['PDK Transmission', 'Ceramic Brakes', 'Roll Cage', 'Aero Package'],
    condition: 98,
    mileage: 1200,
    previousOwners: 1,
    seller: { name: 'Porsche Center', rating: 4.9, verified: true },
    availability: 'Available'
  },
  {
    id: 'mclaren-765lt',
    brand: 'McLaren',
    model: '765LT',
    year: 2022,
    price: 385000,
    category: 'Hypercar',
    rarity: 'Legendary',
    stats: { speed: 98, acceleration: 96, handling: 94, braking: 92 },
    image: '/cars/mclaren-765lt.jpg',
    description: 'Longtail aerodynamics meet raw performance',
    features: ['Active Aero', 'Carbon Fiber Body', 'Track Telemetry', '755hp'],
    condition: 95,
    mileage: 3500,
    previousOwners: 1,
    seller: { name: 'McLaren Beverly Hills', rating: 4.8, verified: true },
    availability: 'Available'
  },
  {
    id: 'ferrari-250-gto',
    brand: 'Ferrari',
    model: '250 GTO',
    year: 1962,
    price: 55000000,
    category: 'Classic',
    rarity: 'Legendary',
    stats: { speed: 75, acceleration: 70, handling: 85, braking: 60 },
    image: '/cars/ferrari-250-gto.jpg',
    description: 'One of only 36 ever made - the holy grail of collectors',
    features: ['Matching Numbers', 'Race History', 'Concours Condition', 'Provenance'],
    condition: 92,
    mileage: 45000,
    previousOwners: 4,
    seller: { name: 'Heritage Classics', rating: 5.0, verified: true },
    availability: 'Auction',
    timeLeft: '2d 14h 32m'
  },
  {
    id: 'rolls-royce-cullinan',
    brand: 'Rolls-Royce',
    model: 'Cullinan Black Badge',
    year: 2023,
    price: 425000,
    category: 'Luxury',
    rarity: 'Epic',
    stats: { speed: 78, acceleration: 75, handling: 70, braking: 85 },
    image: '/cars/rolls-cullinan.jpg',
    description: 'The pinnacle of luxury SUV craftsmanship',
    features: ['Starlight Headliner', 'Bespoke Interior', 'Air Suspension', 'Champagne Cooler'],
    condition: 99,
    mileage: 800,
    previousOwners: 1,
    seller: { name: 'Rolls-Royce Motor Cars', rating: 5.0, verified: true },
    availability: 'Available'
  },
  {
    id: 'nissan-gtr-r35',
    brand: 'Nissan',
    model: 'GT-R NISMO',
    year: 2021,
    price: 185000,
    category: 'Tuner',
    rarity: 'Rare',
    stats: { speed: 89, acceleration: 94, handling: 91, braking: 88 },
    image: '/cars/nissan-gtr.jpg',
    description: 'Godzilla unleashed with NISMO performance upgrades',
    features: ['AWD System', 'Launch Control', 'Turbo V6', 'Carbon Fiber'],
    condition: 96,
    mileage: 8500,
    previousOwners: 1,
    seller: { name: 'JDM Specialists', rating: 4.7, verified: true },
    availability: 'Available'
  },
  {
    id: 'aston-martin-db11',
    brand: 'Aston Martin',
    model: 'DB11 V12',
    year: 2022,
    price: 275000,
    category: 'Luxury',
    rarity: 'Epic',
    stats: { speed: 87, acceleration: 85, handling: 88, braking: 86 },
    image: '/cars/aston-db11.jpg',
    description: 'British elegance meets V12 performance',
    features: ['V12 Twin-Turbo', 'Adaptive Dampers', 'Premium Audio', 'Bespoke Options'],
    condition: 97,
    mileage: 2100,
    previousOwners: 1,
    seller: { name: 'Aston Martin Dallas', rating: 4.8, verified: true },
    availability: 'Reserved'
  }
];

export default function CarMarketplace() {
  const [cars, setCars] = useState<Car[]>(marketplaceCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [playerMoney, setPlayerMoney] = useState(2500000);
  const [ownedCars, setOwnedCars] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: 'All',
    rarity: 'All',
    priceRange: 'All',
    availability: 'All'
  });
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'speed' | 'newest' | 'rarity'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 border-gray-400';
      case 'Uncommon': return 'text-green-400 border-green-400';
      case 'Rare': return 'text-blue-400 border-blue-400';
      case 'Epic': return 'text-purple-400 border-purple-400';
      case 'Legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sports': return '🏎️';
      case 'Luxury': return '💎';
      case 'Classic': return '🏛️';
      case 'Hypercar': return '🚀';
      case 'Electric': return '⚡';
      case 'Tuner': return '🔧';
      default: return '🚗';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'text-green-400';
      case 'Sold': return 'text-red-400';
      case 'Reserved': return 'text-yellow-400';
      case 'Auction': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  useEffect(() => {
    let filtered = cars;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(car => 
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(car => car.category === filters.category);
    }

    // Rarity filter
    if (filters.rarity !== 'All') {
      filtered = filtered.filter(car => car.rarity === filters.rarity);
    }

    // Price range filter
    if (filters.priceRange !== 'All') {
      const ranges = {
        'Under 100K': [0, 100000],
        '100K-500K': [100000, 500000],
        '500K-1M': [500000, 1000000],
        'Over 1M': [1000000, Infinity]
      };
      const range = ranges[filters.priceRange as keyof typeof ranges];
      if (range) {
        filtered = filtered.filter(car => car.price >= range[0] && car.price <= range[1]);
      }
    }

    // Availability filter
    if (filters.availability !== 'All') {
      filtered = filtered.filter(car => car.availability === filters.availability);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'speed':
          return b.stats.speed - a.stats.speed;
        case 'newest':
          return b.year - a.year;
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5 };
          return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder];
        default:
          return 0;
      }
    });

    setFilteredCars(filtered);
  }, [cars, filters, sortBy, searchTerm]);

  const purchaseCar = (car: Car) => {
    if (playerMoney >= car.price && !ownedCars.includes(car.id)) {
      setPlayerMoney(prev => prev - car.price);
      setOwnedCars(prev => [...prev, car.id]);
      setCars(prev => prev.map(c => 
        c.id === car.id ? { ...c, availability: 'Sold' } : c
      ));
      setShowPurchaseModal(false);
      setSelectedCar(null);
    }
  };

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
            🏪 Car Marketplace
          </h1>
          <div className="flex justify-center items-center gap-6 text-xl">
            <div className="text-green-400 font-bold">
              💰 ${playerMoney.toLocaleString()}
            </div>
            <div className="text-blue-400">
              🚗 {ownedCars.length} Cars Owned
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
            />
            
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Sports">Sports</option>
              <option value="Luxury">Luxury</option>
              <option value="Classic">Classic</option>
              <option value="Hypercar">Hypercar</option>
              <option value="Electric">Electric</option>
              <option value="Tuner">Tuner</option>
            </select>

            <select
              value={filters.rarity}
              onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              <option value="All">All Rarities</option>
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              <option value="All">All Prices</option>
              <option value="Under 100K">Under $100K</option>
              <option value="100K-500K">$100K - $500K</option>
              <option value="500K-1M">$500K - $1M</option>
              <option value="Over 1M">Over $1M</option>
            </select>

            <select
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Auction">Auction</option>
              <option value="Reserved">Reserved</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="speed">Top Speed</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>

          <div className="text-white">
            Showing {filteredCars.length} of {cars.length} cars
          </div>
        </motion.div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                bg-gray-800 rounded-xl overflow-hidden border-2 cursor-pointer
                transform transition-all duration-300 hover:scale-105
                ${getRarityColor(car.rarity)}
                ${car.availability === 'Sold' ? 'opacity-50' : ''}
              `}
              onClick={() => setSelectedCar(car)}
            >
              <div className="relative">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x200/333/fff?text=${car.brand}+${car.model}`;
                  }}
                />
                
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 rounded-lg px-2 py-1">
                  <span className={`text-sm font-bold ${getRarityColor(car.rarity)}`}>
                    {car.rarity}
                  </span>
                </div>
                
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-lg px-2 py-1">
                  <span className="text-white text-sm">
                    {getCategoryIcon(car.category)} {car.category}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 rounded-lg px-2 py-1">
                  <span className={`text-sm font-bold ${getAvailabilityColor(car.availability)}`}>
                    {car.availability}
                    {car.timeLeft && ` (${car.timeLeft})`}
                  </span>
                </div>

                {ownedCars.includes(car.id) && (
                  <div className="absolute bottom-2 right-2 bg-green-600 bg-opacity-90 rounded-lg px-2 py-1">
                    <span className="text-white text-sm font-bold">OWNED</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  {car.year} {car.brand} {car.model}
                </h3>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-green-400 font-bold text-lg">
                    ${car.price.toLocaleString()}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    ⭐ {car.seller.rating}
                    {car.seller.verified && <span className="text-blue-400 ml-1">✓</span>}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4 text-sm">
                  <div className="text-center">
                    <div className="text-red-400 font-bold">⚡ {car.stats.speed}</div>
                    <div className="text-gray-400">Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold">🚀 {car.stats.acceleration}</div>
                    <div className="text-gray-400">Accel</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold">🎯 {car.stats.handling}</div>
                    <div className="text-gray-400">Handle</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold">🛑 {car.stats.braking}</div>
                    <div className="text-gray-400">Brake</div>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-400">
                  <div>📏 {car.mileage.toLocaleString()} miles</div>
                  <div>🔧 {car.condition}% condition</div>
                  <div>👥 {car.previousOwners} previous owners</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl text-white mb-2">No cars found</h2>
            <p className="text-gray-400">Try adjusting your search filters</p>
          </div>
        )}

        {/* Car Detail Modal */}
        <AnimatePresence>
          {selectedCar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedCar(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={selectedCar.image}
                    alt={`${selectedCar.brand} ${selectedCar.model}`}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/800x300/333/fff?text=${selectedCar.brand}+${selectedCar.model}`;
                    }}
                  />
                  <button
                    onClick={() => setSelectedCar(null)}
                    className="absolute top-4 right-4 bg-black bg-opacity-75 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-100"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {selectedCar.year} {selectedCar.brand} {selectedCar.model}
                      </h2>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full border ${getRarityColor(selectedCar.rarity)} text-sm`}>
                          {selectedCar.rarity}
                        </span>
                        <span className="text-gray-400">
                          {getCategoryIcon(selectedCar.category)} {selectedCar.category}
                        </span>
                        <span className={`font-bold ${getAvailabilityColor(selectedCar.availability)}`}>
                          {selectedCar.availability}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        ${selectedCar.price.toLocaleString()}
                      </div>
                      <div className="text-gray-400">
                        Seller: {selectedCar.seller.name} ⭐ {selectedCar.seller.rating}
                        {selectedCar.seller.verified && <span className="text-blue-400 ml-1">✓</span>}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">{selectedCar.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-white font-bold mb-4">Performance Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">⚡ Speed:</span>
                          <span className="text-red-400 font-bold">{selectedCar.stats.speed}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">🚀 Acceleration:</span>
                          <span className="text-yellow-400 font-bold">{selectedCar.stats.acceleration}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">🎯 Handling:</span>
                          <span className="text-blue-400 font-bold">{selectedCar.stats.handling}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">🛑 Braking:</span>
                          <span className="text-purple-400 font-bold">{selectedCar.stats.braking}/100</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-white font-bold mb-4">Vehicle Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">📏 Mileage:</span>
                          <span className="text-white">{selectedCar.mileage.toLocaleString()} miles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">🔧 Condition:</span>
                          <span className="text-green-400">{selectedCar.condition}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">👥 Previous Owners:</span>
                          <span className="text-white">{selectedCar.previousOwners}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">📅 Year:</span>
                          <span className="text-white">{selectedCar.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-white font-bold mb-4">Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCar.features.map((feature, index) => (
                        <div key={index} className="bg-gray-700 rounded-lg px-3 py-2">
                          <span className="text-gray-300">✓ {feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedCar.availability === 'Available' && !ownedCars.includes(selectedCar.id) && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowPurchaseModal(true)}
                        disabled={playerMoney < selectedCar.price}
                        className={`
                          flex-1 py-3 px-6 rounded-lg font-bold text-lg
                          ${playerMoney >= selectedCar.price
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        {playerMoney >= selectedCar.price ? 'Buy Now' : 'Insufficient Funds'}
                      </button>
                      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">
                        Make Offer
                      </button>
                    </div>
                  )}

                  {ownedCars.includes(selectedCar.id) && (
                    <div className="bg-green-600 text-white text-center py-3 rounded-lg font-bold">
                      ✓ You own this car
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Purchase Confirmation Modal */}
        <AnimatePresence>
          {showPurchaseModal && selectedCar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold text-white mb-4">Confirm Purchase</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to buy the {selectedCar.year} {selectedCar.brand} {selectedCar.model} for ${selectedCar.price.toLocaleString()}?
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => purchaseCar(selectedCar)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"
                  >
                    Confirm Purchase
                  </button>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}