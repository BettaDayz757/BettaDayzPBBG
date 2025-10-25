import React, { useState, useEffect } from 'react';
import { PaymentInterface } from './PaymentInterface';
import { CharacterCustomization } from './CharacterCustomization';
import { GameMain } from './GameMain';
import { CommunityHub } from './CommunityHub';
import BusinessSimulation from '../game/business-simulation';

export const GameContainer = () => {
  const [gameState, setGameState] = useState('character'); // character, main, community
  const [player, setPlayer] = useState(null);
  const [businessSim, setBusinessSim] = useState(null);

  useEffect(() => {
    if (player) {
      const sim = new BusinessSimulation(player);
      setBusinessSim(sim);
    }
  }, [player]);

  const handleCharacterCreation = (character) => {
    setPlayer({
      ...character,
      money: 10000, // Starting capital
      businesses: [],
      reputation: 0,
      level: 1,
      inventory: [],
      achievements: [],
      eventHistory: []
    });
    setGameState('main');
  };

  const handleBusinessAction = (action, data) => {
    if (!businessSim) return;

    switch (action) {
      case 'START_BUSINESS':
        const newBusiness = businessSim.startBusiness(data);
        setPlayer(prev => ({
          ...prev,
          businesses: [...prev.businesses, newBusiness],
          money: prev.money - data.initialInvestment
        }));
        break;

      case 'UPGRADE_BUSINESS':
        const upgradedBusiness = businessSim.upgradeProperty(data.businessId, data.upgradeType);
        updatePlayerBusinesses(upgradedBusiness);
        break;

      case 'HIRE_EMPLOYEE':
        const updatedBusiness = businessSim.hireEmployee(data.businessId, data.employee);
        updatePlayerBusinesses(updatedBusiness);
        break;
    }
  };

  const updatePlayerBusinesses = (updatedBusiness) => {
    setPlayer(prev => ({
      ...prev,
      businesses: prev.businesses.map(b => 
        b.id === updatedBusiness.id ? updatedBusiness : b
      )
    }));
  };

  const handleCommunityInteraction = (interaction) => {
    switch (interaction.type) {
      case 'event_completed':
        setPlayer(prev => ({
          ...prev,
          reputation: prev.reputation + interaction.data.rewards.reputation,
          skills: applySkillsUpdate(prev.skills, interaction.data.rewards.skills),
          eventHistory: [...prev.eventHistory, {
            ...interaction.data,
            timestamp: new Date()
          }]
        }));
        break;

      case 'connect_organization':
        // Handle new organization connections
        break;
    }
  };

  const applySkillsUpdate = (currentSkills, newSkills) => {
    const updated = { ...currentSkills };
    Object.entries(newSkills).forEach(([skill, increase]) => {
      updated[skill] = (updated[skill] || 0) + increase;
    });
    return updated;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {gameState === 'character' && (
        <CharacterCustomization onSave={handleCharacterCreation} />
      )}

      {gameState === 'main' && player && (
        <div>
          <nav className="bg-white shadow-md p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Norfolk Business Empire</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setGameState('main')}
                  className={`px-4 py-2 rounded ${gameState === 'main' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Business
                </button>
                <button
                  onClick={() => setGameState('community')}
                  className={`px-4 py-2 rounded ${gameState === 'community' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Community
                </button>
              </div>
            </div>
          </nav>

          {gameState === 'main' && (
            <GameMain
              player={player}
              onBusinessAction={handleBusinessAction}
            />
          )}

          {gameState === 'community' && (
            <CommunityHub
              player={player}
              onInteraction={handleCommunityInteraction}
            />
          )}

          <PaymentInterface
            userId={player.id}
            onSuccess={(transaction) => {
              setPlayer(prev => ({
                ...prev,
                money: prev.money + transaction.amount
              }));
            }}
          />
        </div>
      )}
    </div>
  );
};