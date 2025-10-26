import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SKIN_TONES = [
  { id: 'deep', name: 'Deep', value: '#3E2723' },
  { id: 'dark', name: 'Dark', value: '#4E342E' },
  { id: 'medium-dark', name: 'Medium Dark', value: '#5D4037' },
  { id: 'medium', name: 'Medium', value: '#6D4C41' },
  { id: 'medium-light', name: 'Medium Light', value: '#795548' }
];

const FACIAL_FEATURES = {
  EYES: ['almond', 'round', 'narrow'],
  NOSE: ['broad', 'narrow', 'medium'],
  LIPS: ['full', 'medium', 'thin'],
  FACIAL_HAIR: ['clean', 'beard', 'goatee', 'mustache']
};

const HAIRSTYLES = [
  { id: 'natural', name: 'Natural', description: 'Natural afro texture' },
  { id: 'dreads', name: 'Dreadlocks', description: 'Classic dreadlocks' },
  { id: 'fade', name: 'Fade', description: 'Clean fade cut' },
  { id: 'waves', name: 'Waves', description: '360 waves' },
  { id: 'twist', name: 'Twists', description: 'Twisted style' }
];

const CLOTHING_STYLES = [
  { id: 'business', name: 'Business Professional', items: ['suit', 'tie', 'dress_shoes'] },
  { id: 'casual', name: 'Business Casual', items: ['blazer', 'slacks', 'loafers'] },
  { id: 'creative', name: 'Creative Professional', items: ['designer_shirt', 'chinos', 'sneakers'] },
  { id: 'tech', name: 'Tech Entrepreneur', items: ['premium_tee', 'designer_jeans', 'limited_sneakers'] }
];

export const CharacterCustomization = ({ onCharacterCreated }) => {
  const [character, setCharacter] = useState({
    skinTone: SKIN_TONES[0].id,
    facialFeatures: {
      eyes: FACIAL_FEATURES.EYES[0],
      nose: FACIAL_FEATURES.NOSE[0],
      lips: FACIAL_FEATURES.LIPS[0],
      facialHair: FACIAL_FEATURES.FACIAL_HAIR[0]
    },
    hairstyle: HAIRSTYLES[0].id,
    clothing: CLOTHING_STYLES[0].id,
    attributes: {
      charisma: 5,
      business_acumen: 5,
      tech_savvy: 5,
      creativity: 5
    },
    background: {
      education: 'Norfolk State University',
      hometown: 'Norfolk',
      specialization: 'Technology'
    }
  });

  const handleAttributeChange = (attribute, value) => {
    setCharacter(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attribute]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6">Create Your Entrepreneur</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-bold mb-4">Appearance</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Skin Tone</label>
                <div className="flex space-x-2 mt-2">
                  {SKIN_TONES.map(tone => (
                    <motion.div
                      key={tone.id}
                      whileHover={{ scale: 1.1 }}
                      className={`w-8 h-8 rounded-full cursor-pointer ${
                        character.skinTone === tone.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: tone.value }}
                      onClick={() => setCharacter(prev => ({ ...prev, skinTone: tone.id }))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Hairstyle</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={character.hairstyle}
                  onChange={(e) => setCharacter(prev => ({ ...prev, hairstyle: e.target.value }))}
                >
                  {HAIRSTYLES.map(style => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Style</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={character.clothing}
                  onChange={(e) => setCharacter(prev => ({ ...prev, clothing: e.target.value }))}
                >
                  {CLOTHING_STYLES.map(style => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">Background</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Education</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={character.background.education}
                  onChange={(e) => setCharacter(prev => ({
                    ...prev,
                    background: { ...prev.background, education: e.target.value }
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Specialization</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={character.background.specialization}
                  onChange={(e) => setCharacter(prev => ({
                    ...prev,
                    background: { ...prev.background, specialization: e.target.value }
                  }))}
                >
                  <option value="Technology">Technology</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Retail">Retail</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-bold mb-4">Attributes</h3>
            <div className="space-y-4">
              {Object.entries(character.attributes).map(([attr, value]) => (
                <div key={attr}>
                  <label className="block text-sm font-medium capitalize">
                    {attr.replace('_', ' ')}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => handleAttributeChange(attr, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">Preview</h3>
            <div className="bg-gray-100 rounded-lg p-4 min-h-[200px]">
              {/* Character preview visualization would go here */}
              <div className="text-center text-gray-500">
                Character Preview
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => onCharacterCreated(character)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};