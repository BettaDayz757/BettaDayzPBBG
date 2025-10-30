'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RaceTrack {
  id: string;
  name: string;
  location: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  length: number; // in miles
  terrain: 'City' | 'Highway' | 'Mountain' | 'Track';
  entryFee: number;
  prizes: {
    first: number;
    second: number;
    third: number;
  };
  requirements: {
    minSpeed: number;
    minHandling: number;
  };
  image: string;
  description: string;
}

interface RaceResult {
  position: number;
  time: string;
  prize: number;
  experience: number;
}

const raceTracks: RaceTrack[] = [
  {
    id: 'neon-nights',
    name: 'Neon Nights Circuit',
    location: 'Tokyo, Japan',
    difficulty: 'Easy',
    length: 2.5,
    terrain: 'City',
    entryFee: 5000,
    prizes: { first: 25000, second: 15000, third: 8000 },
    requirements: { minSpeed: 60, minHandling: 60 },
    image: '/tracks/tokyo-circuit.jpg',
    description: 'Street racing through Tokyo\'s neon-lit districts'
  },
  {
    id: 'alpine-challenge',
    name: 'Alpine Challenge',
    location: 'Swiss Alps',
    difficulty: 'Medium',
    length: 8.2,
    terrain: 'Mountain',
    entryFee: 15000,
    prizes: { first: 75000, second: 45000, third: 25000 },
    requirements: { minSpeed: 75, minHandling: 80 },
    image: '/tracks/alpine-roads.jpg',
    description: 'Treacherous mountain roads with breathtaking views'
  },
  {
    id: 'monaco-grand-prix',
    name: 'Monaco Grand Prix',
    location: 'Monte Carlo, Monaco',
    difficulty: 'Hard',
    length: 3.3,
    terrain: 'Track',
    entryFee: 50000,
    prizes: { first: 250000, second: 150000, third: 75000 },
    requirements: { minSpeed: 85, minHandling: 90 },
    image: '/tracks/monaco-circuit.jpg',
    description: 'The most prestigious racing circuit in the world'
  },
  {
    id: 'autobahn-rush',
    name: 'Autobahn Rush',
    location: 'Germany',
    difficulty: 'Expert',
    length: 15.0,
    terrain: 'Highway',
    entryFee: 100000,
    prizes: { first: 500000, second: 300000, third: 150000 },
    requirements: { minSpeed: 95, minHandling: 85 },
    image: '/tracks/autobahn.jpg',
    description: 'High-speed racing on the legendary German Autobahn'
  },
  {
    id: 'desert-storm',
    name: 'Desert Storm Rally',
    location: 'Nevada, USA',
    difficulty: 'Hard',
    length: 12.7,
    terrain: 'Mountain',
    entryFee: 75000,
    prizes: { first: 375000, second: 225000, third: 100000 },
    requirements: { minSpeed: 80, minHandling: 95 },
    image: '/tracks/desert-rally.jpg',
    description: 'Challenging off-road racing through desert canyons'
  }
];

interface SelectedCar {
  id: string;
  name: string;
  brand: string;
  speed: number;
  acceleration: number;
  handling: number;
  condition: number;
}

const mockPlayerCars: SelectedCar[] = [
  {
    id: 'lambo-aventador',
    name: 'Aventador SVJ',
    brand: 'Lamborghini',
    speed: 95,
    acceleration: 92,
    handling: 88,
    condition: 98
  },
  {
    id: 'ferrari-f8',
    name: 'F8 Tributo',
    brand: 'Ferrari',
    speed: 90,
    acceleration: 95,
    handling: 93,
    condition: 92
  }
];

export default function RacingSystem() {
  const [selectedTrack, setSelectedTrack] = useState<RaceTrack | null>(null);
  const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null);
  const [isRacing, setIsRacing] = useState(false);
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);
  const [playerMoney, setPlayerMoney] = useState(250000);
  const [playerExperience, setPlayerExperience] = useState(1250);
  const [raceHistory, setRaceHistory] = useState<any[]>([]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 border-green-400';
      case 'Medium': return 'text-yellow-400 border-yellow-400';
      case 'Hard': return 'text-orange-400 border-orange-400';
      case 'Expert': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTerrainIcon = (terrain: string) => {
    switch (terrain) {
      case 'City': return '🏙️';
      case 'Highway': return '🛣️';
      case 'Mountain': return '⛰️';
      case 'Track': return '🏁';
      default: return '🏁';
    }
  };

  const canRaceOnTrack = (track: RaceTrack, car: SelectedCar | null) => {
    if (!car) return false;
    return car.speed >= track.requirements.minSpeed && 
           car.handling >= track.requirements.minHandling &&
           playerMoney >= track.entryFee;
  };

  const calculateRaceResult = (track: RaceTrack, car: SelectedCar): RaceResult => {
    // Simple race simulation based on car stats, track requirements, and some randomness
    const carScore = (car.speed + car.acceleration + car.handling) / 3;
    const trackDemand = (track.requirements.minSpeed + track.requirements.minHandling) / 2;
    const conditionBonus = car.condition / 100;
    const randomFactor = Math.random() * 0.3 + 0.85; // 0.85 to 1.15
    
    const finalScore = (carScore / trackDemand) * conditionBonus * randomFactor;
    
    let position: number;
    let prize: number;
    let experience: number;
    
    if (finalScore >= 1.1) {
      position = 1;
      prize = track.prizes.first;
      experience = 100;
    } else if (finalScore >= 0.95) {
      position = 2;
      prize = track.prizes.second;
      experience = 75;
    } else if (finalScore >= 0.8) {
      position = 3;
      prize = track.prizes.third;
      experience = 50;
    } else {
      position = Math.floor(Math.random() * 5) + 4; // 4th to 8th place
      prize = 0;
      experience = 25;
    }
    
    const baseTime = track.length * 2; // Base time in minutes
    const timeVariation = (1 / finalScore) * baseTime;
    const raceTime = `${Math.floor(timeVariation)}:${String(Math.floor((timeVariation % 1) * 60)).padStart(2, '0')}`;
    
    return {
      position,
      time: raceTime,
      prize,
      experience
    };
  };

  const startRace = async () => {
    if (!selectedTrack || !selectedCar) return;
    
    setIsRacing(true);
    setPlayerMoney(prev => prev - selectedTrack.entryFee);
    
    // Simulate race duration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const result = calculateRaceResult(selectedTrack, selectedCar);
    
    setRaceResult(result);
    setPlayerMoney(prev => prev + result.prize);
    setPlayerExperience(prev => prev + result.experience);
    setRaceHistory(prev => [...prev, {
      track: selectedTrack.name,
      car: `${selectedCar.brand} ${selectedCar.name}`,
      position: result.position,
      prize: result.prize,
      date: new Date().toLocaleDateString()
    }]);
    
    setIsRacing(false);
  };

  const resetRace = () => {
    setSelectedTrack(null);
    setSelectedCar(null);
    setRaceResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🏁 Racing Circuit
          </h1>
          <div className="flex justify-center items-center gap-6 text-xl">
            <div className="text-green-400 font-bold">
              💰 ${playerMoney.toLocaleString()}
            </div>
            <div className="text-blue-400">
              ⭐ {playerExperience} XP
            </div>
            <div className="text-purple-400">
              🏆 {raceHistory.filter(r => r.position <= 3).length} Podiums
            </div>
          </div>
        </motion.div>

        {!isRacing && !raceResult && (
          <>
            {/* Track Selection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Choose Your Track</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {raceTracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      bg-gray-800 rounded-xl overflow-hidden border-2 cursor-pointer
                      transform transition-all duration-300 hover:scale-105
                      ${selectedTrack?.id === track.id ? 'border-blue-400 bg-blue-900/30' : 'border-gray-600'}
                      ${getDifficultyColor(track.difficulty)}
                    `}
                    onClick={() => setSelectedTrack(track)}
                  >
                    <div className="relative">
                      <img
                        src={track.image}
                        alt={track.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/400x200/333/fff?text=${track.name}`;
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-black bg-opacity-75 rounded-lg px-2 py-1">
                        <span className={`text-sm font-bold ${getDifficultyColor(track.difficulty)}`}>
                          {track.difficulty}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-lg px-2 py-1">
                        <span className="text-white text-sm">
                          {getTerrainIcon(track.terrain)} {track.terrain}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white mb-2">{track.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{track.location}</p>
                      <p className="text-gray-300 text-sm mb-4">{track.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Length:</span>
                          <span className="text-white">{track.length} miles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Entry Fee:</span>
                          <span className="text-red-400">${track.entryFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">1st Prize:</span>
                          <span className="text-green-400">${track.prizes.first.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Requirements:</span>
                          <span className="text-blue-400">
                            ⚡{track.requirements.minSpeed} 🎯{track.requirements.minHandling}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Car Selection */}
            {selectedTrack && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-6">Select Your Car</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockPlayerCars.map((car) => {
                    const canRace = canRaceOnTrack(selectedTrack, car);
                    return (
                      <motion.div
                        key={car.id}
                        className={`
                          bg-gray-800 rounded-xl p-6 border-2 cursor-pointer
                          transform transition-all duration-300 hover:scale-105
                          ${selectedCar?.id === car.id ? 'border-blue-400 bg-blue-900/30' : 'border-gray-600'}
                          ${!canRace ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        onClick={() => canRace && setSelectedCar(car)}
                      >
                        <h3 className="text-xl font-bold text-white mb-4">
                          {car.brand} {car.name}
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className={`text-xl ${car.speed >= selectedTrack.requirements.minSpeed ? 'text-green-400' : 'text-red-400'}`}>
                              ⚡ {car.speed}
                            </div>
                            <div className="text-xs text-gray-400">Speed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 text-xl">🚀 {car.acceleration}</div>
                            <div className="text-xs text-gray-400">Accel</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-xl ${car.handling >= selectedTrack.requirements.minHandling ? 'text-green-400' : 'text-red-400'}`}>
                              🎯 {car.handling}
                            </div>
                            <div className="text-xs text-gray-400">Handle</div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-blue-400 font-bold">Condition: {car.condition}%</div>
                          {!canRace && (
                            <div className="text-red-400 text-sm mt-2">
                              {car.speed < selectedTrack.requirements.minSpeed || car.handling < selectedTrack.requirements.minHandling
                                ? 'Requirements not met'
                                : 'Insufficient funds'
                              }
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Race Button */}
            {selectedTrack && selectedCar && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <button
                  onClick={startRace}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-2xl px-12 py-6 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  🏁 START RACE 🏁
                </button>
                <p className="text-gray-400 mt-4">
                  Racing {selectedCar.brand} {selectedCar.name} on {selectedTrack.name}
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Racing Animation */}
        {isRacing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-8xl mb-8"
            >
              🏎️
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Racing in Progress...</h2>
            <div className="flex justify-center">
              <div className="w-64 bg-gray-700 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-full bg-gradient-to-r from-red-500 to-yellow-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Race Results */}
        {raceResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className={`text-8xl mb-8 ${
                raceResult.position === 1 ? '🥇' : 
                raceResult.position === 2 ? '🥈' : 
                raceResult.position === 3 ? '🥉' : '🏁'
              }`}
            >
              {raceResult.position === 1 ? '🥇' : 
               raceResult.position === 2 ? '🥈' : 
               raceResult.position === 3 ? '🥉' : '🏁'}
            </motion.div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              {raceResult.position === 1 ? 'Victory!' : 
               raceResult.position <= 3 ? 'Podium Finish!' : 
               'Good Effort!'}
            </h2>
            
            <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto mb-8">
              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-400">Position:</span>
                  <span className="text-white font-bold">{raceResult.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white">{raceResult.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prize Money:</span>
                  <span className="text-green-400 font-bold">
                    +${raceResult.prize.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-blue-400 font-bold">+{raceResult.experience} XP</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={resetRace}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-4 rounded-xl transform transition-all duration-300 hover:scale-105"
            >
              Race Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}