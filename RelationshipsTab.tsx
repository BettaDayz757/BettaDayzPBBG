import React, { useState } from 'react';
import type { Character } from './Dashboard';

interface Relationship {
  name: string;
  type: 'friend' | 'partner' | 'sibling' | 'family';
  happiness: number;
  dateAdded?: string;
}

interface RelationshipsTabProps {
  character: Character;
  updateCharacter: (character: Character) => void;
}

const relationshipIcons: { [key: string]: string } = {
  friend: '👥',
  partner: '💕',
  sibling: '👫',
  family: '👨‍👩‍👧‍👦'
};

export default function RelationshipsTab({ character, updateCharacter }: RelationshipsTabProps) {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'friend' | 'partner' | 'sibling' | 'family'>('friend');
  const [sortBy, setSortBy] = useState<'name' | 'happiness' | 'type'>('name');
  const [message, setMessage] = useState('');

  const addRelationship = () => {
    if (!newName.trim()) {
      setMessage('❌ Please enter a name');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const existingRelationship = character.relationships.find(
      rel => rel.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingRelationship) {
      setMessage('❌ This person is already in your relationships');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const newRelationship: Relationship = {
      name: newName.trim(),
      type: newType,
      happiness: 50,
      dateAdded: new Date().toLocaleDateString()
    };

    const updated = {
      ...character,
      relationships: [...character.relationships, newRelationship],
    };
    
    updateCharacter(updated);
    setNewName('');
    setMessage(`✅ Added ${newName} as a ${newType}!`);
    setTimeout(() => setMessage(''), 2000);
  };

  const interact = (index: number, action: 'gift' | 'argue' | 'hangout' | 'breakup' | 'makeup') => {
    const updated = { ...character };
    const rel = updated.relationships[index];
    
    switch (action) {
      case 'gift':
        rel.happiness = Math.min(100, rel.happiness + 15);
        setMessage(`🎁 You gave ${rel.name} a gift! (+15 happiness)`);
        break;
      case 'argue':
        rel.happiness = Math.max(0, rel.happiness - 20);
        setMessage(`😠 You argued with ${rel.name}! (-20 happiness)`);
        break;
      case 'hangout':
        rel.happiness = Math.min(100, rel.happiness + 10);
        setMessage(`🎉 You spent quality time with ${rel.name}! (+10 happiness)`);
        break;
      case 'breakup':
        if (rel.type === 'partner') {
          rel.type = 'friend';
          rel.happiness = Math.max(0, rel.happiness - 30);
          setMessage(`💔 You broke up with ${rel.name}. They're now just a friend.`);
        }
        break;
      case 'makeup':
        if (rel.type === 'friend' && rel.happiness > 70) {
          rel.type = 'partner';
          rel.happiness = Math.min(100, rel.happiness + 20);
          setMessage(`💕 You and ${rel.name} are now partners!`);
        } else {
          setMessage(`❌ ${rel.name} needs to be happier to become your partner.`);
        }
        break;
    }
    
    updateCharacter(updated);
    setTimeout(() => setMessage(''), 3000);
  };

  const removeRelationship = (index: number) => {
    const updated = { ...character };
    const removedName = updated.relationships[index].name;
    updated.relationships.splice(index, 1);
    updateCharacter(updated);
    setMessage(`👋 Removed ${removedName} from your relationships`);
    setTimeout(() => setMessage(''), 2000);
  };

  const sortedRelationships = [...character.relationships].sort((a, b) => {
    switch (sortBy) {
      case 'happiness':
        return b.happiness - a.happiness;
      case 'type':
        return a.type.localeCompare(b.type);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const getHappinessColor = (happiness: number) => {
    if (happiness >= 80) return 'text-green-400';
    if (happiness >= 60) return 'text-yellow-400';
    if (happiness >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHappinessLabel = (happiness: number) => {
    if (happiness >= 90) return 'Ecstatic';
    if (happiness >= 80) return 'Very Happy';
    if (happiness >= 70) return 'Happy';
    if (happiness >= 60) return 'Content';
    if (happiness >= 50) return 'Neutral';
    if (happiness >= 40) return 'Unhappy';
    if (happiness >= 30) return 'Sad';
    if (happiness >= 20) return 'Very Sad';
    return 'Miserable';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Relationships</h2>
      
      {/* Add New Relationship */}
      <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">Add New Relationship</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Enter person's name"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            onKeyPress={e => e.key === 'Enter' && addRelationship()}
          />
          <select
            value={newType}
            onChange={e => setNewType(e.target.value as any)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          >
            <option value="friend">Friend 👥</option>
            <option value="partner">Partner 💕</option>
            <option value="sibling">Sibling 👫</option>
            <option value="family">Family 👨‍👩‍👧‍👦</option>
          </select>
          <button
            onClick={addRelationship}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            Add
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      {character.relationships.length > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:border-yellow-500"
          >
            <option value="name">Name</option>
            <option value="happiness">Happiness</option>
            <option value="type">Type</option>
          </select>
        </div>
      )}

      {/* Relationships List */}
      {sortedRelationships.length > 0 ? (
        <div className="space-y-3">
          {sortedRelationships.map((rel, i) => {
            const originalIndex = character.relationships.findIndex(r => r === rel);
            return (
              <div key={`${rel.name}-${i}`} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{relationshipIcons[rel.type]}</span>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{rel.name}</h4>
                      <p className="text-sm text-gray-400 capitalize">{rel.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getHappinessColor(rel.happiness)}`}>
                      {rel.happiness}/100
                    </div>
                    <div className={`text-sm ${getHappinessColor(rel.happiness)}`}>
                      {getHappinessLabel(rel.happiness)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      rel.happiness >= 80 ? 'bg-green-500' :
                      rel.happiness >= 60 ? 'bg-yellow-500' :
                      rel.happiness >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${rel.happiness}%` }}
                  ></div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => interact(originalIndex, 'gift')}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors duration-200"
                  >
                    🎁 Gift
                  </button>
                  <button
                    onClick={() => interact(originalIndex, 'hangout')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors duration-200"
                  >
                    🎉 Hang Out
                  </button>
                  <button
                    onClick={() => interact(originalIndex, 'argue')}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors duration-200"
                  >
                    😠 Argue
                  </button>
                  
                  {rel.type === 'partner' && (
                    <button
                      onClick={() => interact(originalIndex, 'breakup')}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors duration-200"
                    >
                      💔 Break Up
                    </button>
                  )}
                  
                  {rel.type === 'friend' && rel.happiness > 70 && (
                    <button
                      onClick={() => interact(originalIndex, 'makeup')}
                      className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded-md transition-colors duration-200"
                    >
                      💕 Become Partners
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeRelationship(originalIndex)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors duration-200"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg">No relationships yet.</p>
          <p className="text-sm">Add someone above to get started!</p>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`p-3 rounded-lg border ${
          message.includes('❌') 
            ? 'bg-red-900/30 border-red-500 text-red-300'
            : message.includes('💔')
            ? 'bg-purple-900/30 border-purple-500 text-purple-300'
            : 'bg-green-900/30 border-green-500 text-green-300'
        }`}>
          <p className="font-medium">{message}</p>
        </div>
      )}

      {/* Relationship Stats */}
      {character.relationships.length > 0 && (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">Relationship Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{character.relationships.length}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {character.relationships.filter(r => r.happiness >= 70).length}
              </div>
              <div className="text-sm text-gray-400">Happy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">
                {character.relationships.filter(r => r.type === 'partner').length}
              </div>
              <div className="text-sm text-gray-400">Partners</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(character.relationships.reduce((sum, r) => sum + r.happiness, 0) / character.relationships.length) || 0}
              </div>
              <div className="text-sm text-gray-400">Avg Happiness</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}