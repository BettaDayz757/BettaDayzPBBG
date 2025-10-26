import React from 'react';

interface StatsTabProps {
  player?: {
    level?: number;
    experience?: number;
    money?: number;
    reputation?: number;
    health?: number;
    energy?: number;
  };
}

const StatsTab: React.FC<StatsTabProps> = ({ player = {} }) => {
  const {
    level = 1,
    experience = 0,
    money = 1000,
    reputation = 0,
    health = 100,
    energy = 100
  } = player;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Player Statistics</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Character Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Level:</span>
              <span className="text-blue-400">{level}</span>
            </div>
            <div className="flex justify-between">
              <span>Experience:</span>
              <span className="text-green-400">{experience.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Health:</span>
              <span className="text-red-400">{health}%</span>
            </div>
            <div className="flex justify-between">
              <span>Energy:</span>
              <span className="text-yellow-400">{energy}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Financial Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Money:</span>
              <span className="text-green-400">${money.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Reputation:</span>
              <span className="text-purple-400">{reputation}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Progress Bars</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span>Health</span>
              <span>{health}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${health}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span>Energy</span>
              <span>{energy}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${energy}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;