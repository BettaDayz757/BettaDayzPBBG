import React, { useState } from 'react';
import StatsTab from './StatsTab';
import CareerTab from './CareerTab';
import RelationshipsTab from './RelationshipsTab';
import AchievementsTab from './AchievementsTab';

const tabs = ['Stats', 'Career', 'Relationships', 'Achievements'];

interface Character {
  age: number;
  stats: {
    smarts: number;
    money: number;
    health: number;
    happiness: number;
  };
  career?: {
    title: string;
    salary: number;
    smartsRequired: number;
  };
  relationships: Array<{
    name: string;
    type: 'friend' | 'partner' | 'sibling' | 'family';
    happiness: number;
  }>;
}

interface DashboardProps {
  character: Character;
  updateCharacter: (character: Character) => void;
}

export default function Dashboard({ character, updateCharacter }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('Stats');

  const renderTab = () => {
    switch (activeTab) {
      case 'Stats': return <StatsTab character={character} />;
      case 'Career': return <CareerTab character={character} updateCharacter={updateCharacter} />;
      case 'Relationships': return <RelationshipsTab character={character} updateCharacter={updateCharacter} />;
      case 'Achievements': return <AchievementsTab character={character} />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-2xl max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">Character Dashboard</h1>
      
      <nav className="mb-6">
        <div className="flex space-x-2 bg-gray-800 p-2 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-yellow-500 text-black shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>
      
      <div className="bg-gray-800 p-6 rounded-lg min-h-96">
        {renderTab()}
      </div>
    </div>
  );
}

export type { Character };