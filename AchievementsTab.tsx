import React from 'react';
import type { Character } from './Dashboard';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  dateUnlocked?: string;
  progress?: number;
  maxProgress?: number;
  category: 'life' | 'career' | 'wealth' | 'social' | 'special';
}

interface AchievementsTabProps {
  character: Character;
}

export default function AchievementsTab({ character }: AchievementsTabProps) {
  const calculateAchievements = (): Achievement[] => {
    const achievements: Achievement[] = [
      // Life Achievements
      {
        id: 'age_18',
        title: 'Coming of Age',
        description: 'Reach 18 years old',
        icon: '🎂',
        unlocked: character.age >= 18,
        dateUnlocked: character.age >= 18 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.age, 18),
        maxProgress: 18,
        category: 'life'
      },
      {
        id: 'age_30',
        title: 'Thirty and Thriving',
        description: 'Reach 30 years old',
        icon: '🎉',
        unlocked: character.age >= 30,
        dateUnlocked: character.age >= 30 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.age, 30),
        maxProgress: 30,
        category: 'life'
      },
      {
        id: 'age_50',
        title: 'Half Century',
        description: 'Reach 50 years old',
        icon: '🏆',
        unlocked: character.age >= 50,
        dateUnlocked: character.age >= 50 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.age, 50),
        maxProgress: 50,
        category: 'life'
      },
      {
        id: 'perfect_health',
        title: 'Peak Performance',
        description: 'Maintain 100% health',
        icon: '💪',
        unlocked: character.stats.health >= 100,
        dateUnlocked: character.stats.health >= 100 ? new Date().toLocaleDateString() : undefined,
        progress: character.stats.health,
        maxProgress: 100,
        category: 'life'
      },

      // Wealth Achievements
      {
        id: 'first_thousand',
        title: 'First Grand',
        description: 'Earn your first $1,000',
        icon: '💵',
        unlocked: character.stats.money >= 1000,
        dateUnlocked: character.stats.money >= 1000 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.stats.money, 1000),
        maxProgress: 1000,
        category: 'wealth'
      },
      {
        id: 'ten_thousand',
        title: 'Five Figures',
        description: 'Accumulate $10,000',
        icon: '💰',
        unlocked: character.stats.money >= 10000,
        dateUnlocked: character.stats.money >= 10000 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.stats.money, 10000),
        maxProgress: 10000,
        category: 'wealth'
      },
      {
        id: 'hundred_thousand',
        title: 'Six-Figure Club',
        description: 'Reach $100,000 in wealth',
        icon: '🏦',
        unlocked: character.stats.money >= 100000,
        dateUnlocked: character.stats.money >= 100000 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.stats.money, 100000),
        maxProgress: 100000,
        category: 'wealth'
      },
      {
        id: 'millionaire',
        title: 'Millionaire Status',
        description: 'Become a millionaire',
        icon: '💎',
        unlocked: character.stats.money >= 1000000,
        dateUnlocked: character.stats.money >= 1000000 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.stats.money, 1000000),
        maxProgress: 1000000,
        category: 'wealth'
      },

      // Career Achievements
      {
        id: 'first_job',
        title: 'Career Starter',
        description: 'Get your first job',
        icon: '👔',
        unlocked: !!character.career,
        dateUnlocked: character.career ? new Date().toLocaleDateString() : undefined,
        category: 'career'
      },
      {
        id: 'doctor',
        title: 'Medical Marvel',
        description: 'Become a doctor',
        icon: '⚕️',
        unlocked: character.career?.title === 'Doctor',
        dateUnlocked: character.career?.title === 'Doctor' ? new Date().toLocaleDateString() : undefined,
        category: 'career'
      },
      {
        id: 'high_salary',
        title: 'Big Earner',
        description: 'Get a job paying $75,000+',
        icon: '💼',
        unlocked: (character.career?.salary || 0) >= 75000,
        dateUnlocked: (character.career?.salary || 0) >= 75000 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.career?.salary || 0, 75000),
        maxProgress: 75000,
        category: 'career'
      },

      // Social Achievements
      {
        id: 'first_friend',
        title: 'Social Starter',
        description: 'Make your first friend',
        icon: '👋',
        unlocked: character.relationships.length >= 1,
        dateUnlocked: character.relationships.length >= 1 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.relationships.length, 1),
        maxProgress: 1,
        category: 'social'
      },
      {
        id: 'social_butterfly',
        title: 'Social Butterfly',
        description: 'Have 5 or more relationships',
        icon: '🦋',
        unlocked: character.relationships.length >= 5,
        dateUnlocked: character.relationships.length >= 5 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.relationships.length, 5),
        maxProgress: 5,
        category: 'social'
      },
      {
        id: 'loved_one',
        title: 'True Love',
        description: 'Find a partner',
        icon: '💕',
        unlocked: character.relationships.some(r => r.type === 'partner'),
        dateUnlocked: character.relationships.some(r => r.type === 'partner') ? new Date().toLocaleDateString() : undefined,
        category: 'social'
      },
      {
        id: 'popular',
        title: 'Mr./Ms. Popular',
        description: 'Have 10 relationships with 80+ happiness',
        icon: '⭐',
        unlocked: character.relationships.filter(r => r.happiness >= 80).length >= 10,
        dateUnlocked: character.relationships.filter(r => r.happiness >= 80).length >= 10 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.relationships.filter(r => r.happiness >= 80).length, 10),
        maxProgress: 10,
        category: 'social'
      },

      // Special Achievements
      {
        id: 'genius',
        title: 'Genius Level',
        description: 'Reach 95+ smarts',
        icon: '🧠',
        unlocked: character.stats.smarts >= 95,
        dateUnlocked: character.stats.smarts >= 95 ? new Date().toLocaleDateString() : undefined,
        progress: Math.min(character.stats.smarts, 95),
        maxProgress: 95,
        category: 'special'
      },
      {
        id: 'perfect_happiness',
        title: 'Pure Bliss',
        description: 'Achieve 100% happiness',
        icon: '😊',
        unlocked: character.stats.happiness >= 100,
        dateUnlocked: character.stats.happiness >= 100 ? new Date().toLocaleDateString() : undefined,
        progress: character.stats.happiness,
        maxProgress: 100,
        category: 'special'
      },
      {
        id: 'well_rounded',
        title: 'Well Rounded',
        description: 'Have all stats above 75',
        icon: '🌟',
        unlocked: Object.values(character.stats).every(stat => stat >= 75),
        dateUnlocked: Object.values(character.stats).every(stat => stat >= 75) ? new Date().toLocaleDateString() : undefined,
        category: 'special'
      }
    ];

    return achievements;
  };

  const achievements = calculateAchievements();
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'life': return 'border-green-500 bg-green-900/20';
      case 'career': return 'border-blue-500 bg-blue-900/20';
      case 'wealth': return 'border-yellow-500 bg-yellow-900/20';
      case 'social': return 'border-pink-500 bg-pink-900/20';
      case 'special': return 'border-purple-500 bg-purple-900/20';
      default: return 'border-gray-500 bg-gray-900/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'life': return '🌱';
      case 'career': return '💼';
      case 'wealth': return '💰';
      case 'social': return '👥';
      case 'special': return '✨';
      default: return '🏆';
    }
  };

  const categories = ['life', 'career', 'wealth', 'social', 'special'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-yellow-400">Achievements</h2>
        <div className="text-right">
          <div className="text-lg font-semibold text-green-400">
            {unlockedAchievements.length} / {achievements.length}
          </div>
          <div className="text-sm text-gray-400">Unlocked</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Progress Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(category => {
            const categoryAchievements = achievements.filter(a => a.category === category);
            const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
            const percentage = Math.round((unlockedInCategory / categoryAchievements.length) * 100);
            
            return (
              <div key={category} className="text-center">
                <div className="text-2xl mb-1">{getCategoryIcon(category)}</div>
                <div className="text-sm font-medium text-white capitalize">{category}</div>
                <div className="text-lg font-bold text-yellow-400">{unlockedInCategory}/{categoryAchievements.length}</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-4">🏆 Unlocked Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map(achievement => (
              <div
                key={achievement.id}
                className={`border rounded-lg p-4 ${getCategoryColor(achievement.category)} border-opacity-50`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{achievement.title}</h4>
                      <p className="text-sm text-gray-300">{achievement.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-400 font-medium">✓ UNLOCKED</span>
                </div>
                {achievement.dateUnlocked && (
                  <div className="text-xs text-gray-400 mt-2">
                    Unlocked: {achievement.dateUnlocked}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-400 mb-4">🔒 Locked Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="border border-gray-600 bg-gray-800/50 rounded-lg p-4 opacity-75"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl grayscale">{achievement.icon}</span>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-300">{achievement.title}</h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">🔒 LOCKED</span>
                </div>
                
                {/* Progress Bar for trackable achievements */}
                {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress} / {achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Achievements Message */}
      {achievements.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg">No achievements available yet.</p>
          <p className="text-sm">Keep playing to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}