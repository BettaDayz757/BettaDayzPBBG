import React, { useState } from 'react';
import type { Character } from './Dashboard';

const careers = [
  { title: 'Teacher', salary: 30000, smartsRequired: 60, icon: '📚' },
  { title: 'Doctor', salary: 80000, smartsRequired: 85, icon: '⚕️' },
  { title: 'Artist', salary: 20000, smartsRequired: 40, icon: '🎨' },
  { title: 'Engineer', salary: 75000, smartsRequired: 80, icon: '⚙️' },
  { title: 'Lawyer', salary: 90000, smartsRequired: 90, icon: '⚖️' },
  { title: 'Chef', salary: 35000, smartsRequired: 50, icon: '👨‍🍳' },
  { title: 'Programmer', salary: 85000, smartsRequired: 75, icon: '💻' },
  { title: 'Musician', salary: 25000, smartsRequired: 30, icon: '🎵' },
];

interface CareerTabProps {
  character: Character;
  updateCharacter: (character: Character) => void;
}

export default function CareerTab({ character, updateCharacter }: CareerTabProps) {
  const [message, setMessage] = useState('');

  const applyCareer = (career: typeof careers[0]) => {
    if (character.stats.smarts >= career.smartsRequired) {
      updateCharacter({ ...character, career });
      setMessage(`🎉 Congratulations! You are now a ${career.title}!`);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`❌ You need ${career.smartsRequired} smarts to become a ${career.title}. You currently have ${character.stats.smarts}.`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const quitJob = () => {
    updateCharacter({ ...character, career: undefined });
    setMessage('You have quit your job. Time to find a new career!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Career</h2>
      
      {character.career ? (
        <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-green-400">Current Job</h3>
              <p className="text-lg">{character.career.title} {careers.find(c => c.title === character.career?.title)?.icon}</p>
              <p className="text-green-300">Salary: ${character.career.salary.toLocaleString()}/year</p>
            </div>
            <button
              onClick={quitJob}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Quit Job
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Available Careers</h3>
            <p className="text-gray-300 mb-4">Your current smarts: {character.stats.smarts}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careers.map(career => (
              <div
                key={career.title}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  character.stats.smarts >= career.smartsRequired
                    ? 'border-green-500 bg-green-900/20 hover:bg-green-900/30'
                    : 'border-red-500 bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-2xl">{career.icon}</span>
                    {career.title}
                  </h4>
                  <span className="text-sm text-gray-400">
                    {career.smartsRequired} smarts
                  </span>
                </div>
                <p className="text-yellow-400 mb-3">
                  ${career.salary.toLocaleString()}/year
                </p>
                <button
                  onClick={() => applyCareer(career)}
                  disabled={character.stats.smarts < career.smartsRequired}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                    character.stats.smarts >= career.smartsRequired
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {character.stats.smarts >= career.smartsRequired ? 'Apply' : 'Not Qualified'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.includes('❌') 
            ? 'bg-red-900/30 border-red-500 text-red-300'
            : 'bg-green-900/30 border-green-500 text-green-300'
        }`}>
          <p className="font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}