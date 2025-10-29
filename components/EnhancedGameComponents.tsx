// Enhanced React Components for Dual Domain PBBG System
// UI Components for IAP, guilds, tournaments, achievements, and cross-domain features

import React, { useState, useEffect } from 'react';
import { EnhancedIAPManager, PurchasePackage, Subscription } from '../lib/iap/EnhancedIAPManager';
import { EnhancedPBBGManager, Guild, Tournament, Achievement } from '../lib/features/EnhancedPBBGManager';
import { EnhancedDomainManager } from '../lib/domain/EnhancedDomainManager';
import { BettaBuckZManager } from '../lib/currency/BettaBuckZManager';

// IAP Store Component
export const IAPStore: React.FC = () => {
  const [packages, setPackages] = useState<PurchasePackage[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const iapManager = EnhancedIAPManager.getInstance();

  useEffect(() => {
    loadStoreData();
  }, [selectedCategory]);

  const loadStoreData = async () => {
    setLoading(true);
    try {
      const [pkgs, subs] = await Promise.all([
        iapManager.getPurchasePackages(selectedCategory === 'all' ? undefined : selectedCategory),
        iapManager.getSubscriptionPlans()
      ]);
      setPackages(pkgs);
      setSubscriptions(subs);
    } catch (error) {
      console.error('Error loading store data:', error);
    }
    setLoading(false);
  };

  const handlePurchase = async (packageId: string) => {
    try {
      const result = await iapManager.createPurchaseIntent('user_id', packageId);
      if (result.success) {
        // Redirect to Stripe checkout or handle payment
        console.log('Payment intent created:', result.clientSecret);
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'currency', name: 'BettaBuckZ' },
    { id: 'starter', name: 'Starter Packs' },
    { id: 'premium', name: 'Premium' },
    { id: 'cosmetic', name: 'Cosmetics' },
    { id: 'boost', name: 'Boosts' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">BettaDayz Store</h1>
        <p className="text-xl text-gray-600">Enhance your gaming experience with premium packages</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Subscription Plans */}
      {selectedCategory === 'all' || selectedCategory === 'premium' ? (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Premium Memberships</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className={`bg-white rounded-lg shadow-lg p-6 border-2 ${
                  subscription.popularPlan ? 'border-blue-500 transform scale-105' : 'border-gray-200'
                }`}
              >
                {subscription.popularPlan && (
                  <div className="bg-blue-500 text-white text-center py-2 px-4 rounded-t-lg -mx-6 -mt-6 mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-center mb-2">{subscription.name}</h3>
                <p className="text-gray-600 text-center mb-4">{subscription.description}</p>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600">
                    {EnhancedIAPManager.formatPrice(subscription.price.monthly)}
                  </div>
                  <div className="text-sm text-gray-500">per month</div>
                  <div className="mt-2 text-sm">
                    <span className="text-green-600 font-medium">
                      Save {subscription.savings.yearly}% yearly
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {subscription.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-medium">{benefit.name}</div>
                        <div className="text-sm text-gray-600">{benefit.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    subscription.popularPlan
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  Subscribe Now
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Purchase Packages */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Purchase Packages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg shadow-lg p-6 border-2 ${
                pkg.isBestValue ? 'border-yellow-500' : pkg.isPopular ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {(pkg.isBestValue || pkg.isPopular) && (
                <div className={`text-white text-center py-1 px-3 rounded-full text-sm font-medium mb-4 ${
                  pkg.isBestValue ? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  {pkg.isBestValue ? 'Best Value' : 'Popular'}
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600">{pkg.price.displayPrice}</div>
                {pkg.bonusPercentage && (
                  <div className="text-sm text-green-600 font-medium">
                    +{pkg.bonusPercentage}% Bonus!
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                {pkg.value.bettaBuckZ && (
                  <div className="flex justify-between">
                    <span>BettaBuckZ:</span>
                    <span className="font-bold text-blue-600">{pkg.value.bettaBuckZ.toLocaleString()}</span>
                  </div>
                )}
                {pkg.value.gameMoney && (
                  <div className="flex justify-between">
                    <span>Game Money:</span>
                    <span className="font-bold text-green-600">${pkg.value.gameMoney.toLocaleString()}</span>
                  </div>
                )}
                {pkg.value.items && pkg.value.items.length > 0 && (
                  <div>
                    <div className="font-medium mb-1">Bonus Items:</div>
                    <ul className="text-sm text-gray-600">
                      {pkg.value.items.map((item, index) => (
                        <li key={index}>• {item.quantity}x {item.itemId}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => handlePurchase(pkg.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Purchase Now
              </button>

              {pkg.isLimitedTime && pkg.expiresAt && (
                <div className="mt-2 text-center text-sm text-red-600">
                  Limited time! Expires {pkg.expiresAt.toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Guild Management Component
export const GuildManagement: React.FC = () => {
  const [userGuild, setUserGuild] = useState<Guild | null>(null);
  const [availableGuilds, setAvailableGuilds] = useState<Guild[]>([]);
  const [showCreateGuild, setShowCreateGuild] = useState(false);
  const [loading, setLoading] = useState(true);

  const pbbgManager = EnhancedPBBGManager.getInstance();

  useEffect(() => {
    loadGuildData();
  }, []);

  const loadGuildData = async () => {
    setLoading(true);
    try {
      // Load user's current guild and available guilds
      // Implementation would fetch from database
    } catch (error) {
      console.error('Error loading guild data:', error);
    }
    setLoading(false);
  };

  const handleCreateGuild = async (name: string, tag: string, description: string) => {
    try {
      const result = await pbbgManager.createGuild('user_id', name, tag, description);
      if (result.success) {
        setUserGuild(result.guild!);
        setShowCreateGuild(false);
      }
    } catch (error) {
      console.error('Error creating guild:', error);
    }
  };

  const handleJoinGuild = async (guildId: string) => {
    try {
      const result = await pbbgManager.joinGuild('user_id', guildId);
      if (result.success) {
        loadGuildData();
      }
    } catch (error) {
      console.error('Error joining guild:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Guild Management</h1>

      {userGuild ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">[{userGuild.tag}] {userGuild.name}</h2>
              <p className="text-gray-600">Level {userGuild.level} • {userGuild.memberCount}/{userGuild.maxMembers} members</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Treasury</div>
              <div className="font-bold">{userGuild.treasury.bettaBuckZ.toLocaleString()} BB</div>
              <div className="font-bold">${userGuild.treasury.gameMoney.toLocaleString()}</div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{userGuild.description}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Guild Perks</h3>
              <ul className="space-y-1">
                {userGuild.perks.map((perk) => (
                  <li key={perk.id} className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${perk.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {perk.name} (Level {perk.level})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Settings</h3>
              <ul className="space-y-1 text-sm">
                <li>Recruiting: {userGuild.settings.isRecruiting ? 'Open' : 'Closed'}</li>
                <li>Minimum Level: {userGuild.settings.minimumLevel}</li>
                <li>Applications: {userGuild.settings.applicationRequired ? 'Required' : 'Not Required'}</li>
                <li>Visibility: {userGuild.settings.isPublic ? 'Public' : 'Private'}</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Join a Guild</h2>
          <p className="text-gray-600 mb-4">You're not currently in a guild. Join one to access exclusive features!</p>
          
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateGuild(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Create Guild
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium">
              Browse Guilds
            </button>
          </div>
        </div>
      )}

      {/* Available Guilds */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableGuilds.map((guild) => (
          <div key={guild.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">[{guild.tag}] {guild.name}</h3>
              <span className="text-sm text-gray-600">Level {guild.level}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guild.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Members: {guild.memberCount}/{guild.maxMembers}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                guild.settings.isRecruiting ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {guild.settings.isRecruiting ? 'Recruiting' : 'Closed'}
              </span>
            </div>
            
            {guild.settings.isRecruiting && (
              <button
                onClick={() => handleJoinGuild(guild.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Request to Join
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Guild Modal */}
      {showCreateGuild && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Guild</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateGuild(
                formData.get('name') as string,
                formData.get('tag') as string,
                formData.get('description') as string
              );
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Guild Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter guild name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Guild Tag (3-4 characters)</label>
                  <input
                    name="tag"
                    type="text"
                    required
                    maxLength={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="TAG"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Describe your guild..."
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Create Guild
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateGuild(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Tournament Hub Component
export const TournamentHub: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);

  const pbbgManager = EnhancedPBBGManager.getInstance();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      // Implementation would load tournaments from database
    } catch (error) {
      console.error('Error loading tournaments:', error);
    }
  };

  const handleRegister = async (tournamentId: string) => {
    try {
      const result = await pbbgManager.registerForTournament('user_id', tournamentId);
      if (result.success) {
        setUserRegistrations([...userRegistrations, tournamentId]);
      }
    } catch (error) {
      console.error('Error registering for tournament:', error);
    }
  };

  const getTournamentStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'registration': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tournament Hub</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tournament List */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
                    <p className="text-gray-600 mb-2">{tournament.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Type: {tournament.type}</span>
                      <span>•</span>
                      <span>Participants: {tournament.participants.length}/{tournament.maxParticipants || '∞'}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTournamentStatusColor(tournament.status)}`}>
                    {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Schedule</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Registration: {tournament.registrationStart.toLocaleDateString()} - {tournament.registrationEnd.toLocaleDateString()}</li>
                      <li>Duration: {tournament.startDate.toLocaleDateString()} - {tournament.endDate.toLocaleDateString()}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tournament.requirements.minimumLevel && <li>Min Level: {tournament.requirements.minimumLevel}</li>}
                      {tournament.requirements.maximumLevel && <li>Max Level: {tournament.requirements.maximumLevel}</li>}
                      {tournament.requirements.guildRequired && <li>Guild membership required</li>}
                      {tournament.requirements.entryFee && (
                        <li>Entry Fee: {tournament.requirements.entryFee.bettaBuckZ ? `${tournament.requirements.entryFee.bettaBuckZ} BB` : `$${tournament.requirements.entryFee.gameMoney}`}</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Prizes</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {tournament.prizes.slice(0, 3).map((prize) => (
                      <div key={prize.rank} className="bg-gray-50 p-2 rounded text-center">
                        <div className="font-bold text-gray-900">#{prize.rank}</div>
                        {prize.rewards.bettaBuckZ && <div className="text-blue-600">{prize.rewards.bettaBuckZ} BB</div>}
                        {prize.rewards.gameMoney && <div className="text-green-600">${prize.rewards.gameMoney}</div>}
                        {prize.rewards.title && <div className="text-purple-600">"{prize.rewards.title}"</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  {tournament.status === 'registration' && !userRegistrations.includes(tournament.id) ? (
                    <button
                      onClick={() => handleRegister(tournament.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Register
                    </button>
                  ) : userRegistrations.includes(tournament.id) ? (
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                      Registered
                    </span>
                  ) : null}
                  
                  <button
                    onClick={() => setSelectedTournament(tournament)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Details Sidebar */}
        <div>
          {selectedTournament ? (
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">{selectedTournament.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Rules</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedTournament.rules.map((rule, index) => (
                      <li key={index}>• {rule}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Leaderboard</h4>
                  <div className="space-y-2">
                    {selectedTournament.participants
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 10)
                      .map((participant, index) => (
                        <div key={participant.userId} className="flex justify-between text-sm">
                          <span>#{index + 1} User {participant.userId.slice(-4)}</span>
                          <span className="font-medium">{participant.score.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
              Select a tournament to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Achievements Display Component
export const AchievementsDisplay: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAchievements();
  }, [selectedCategory]);

  const loadAchievements = async () => {
    try {
      // Implementation would load achievements from database
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'business', name: 'Business' },
    { id: 'social', name: 'Social' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'collection', name: 'Collection' },
    { id: 'progression', name: 'Progression' },
    { id: 'special', name: 'Special' }
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getDifficultyIcon = (difficulty: Achievement['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '★';
      case 'medium': return '★★';
      case 'hard': return '★★★';
      case 'legendary': return '★★★★';
      default: return '★';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Achievements</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const userProgress = userAchievements.find(ua => ua.achievementId === achievement.id);
          const isCompleted = userProgress?.isCompleted || false;
          const progress = userProgress?.progress || 0;

          return (
            <div
              key={achievement.id}
              className={`border-2 rounded-lg p-6 transition-all ${getRarityColor(achievement.rarity)} ${
                isCompleted ? 'ring-2 ring-green-400' : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="text-right">
                  <div className="text-sm text-yellow-600 font-medium">
                    {getDifficultyIcon(achievement.difficulty)}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">{achievement.rarity}</div>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2">{achievement.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>

              {!achievement.isHidden && (
                <div className="space-y-2 mb-4">
                  {achievement.requirements.map((req, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>{req.description}</span>
                        <span className="font-medium">{req.current || 0}/{req.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(((req.current || 0) / req.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Rewards</h4>
                <div className="space-y-1 text-sm">
                  {achievement.rewards.map((reward, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="capitalize">{reward.type}:</span>
                      <span className="font-medium">
                        {reward.type === 'bettaBuckZ' && `${reward.amount} BB`}
                        {reward.type === 'gameMoney' && `$${reward.amount}`}
                        {reward.type === 'experience' && `${reward.amount} XP`}
                        {reward.type === 'item' && reward.itemId}
                        {reward.type === 'title' && `"${reward.itemId}"`}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1 border-t">
                    <span>Points:</span>
                    <span className="font-bold text-blue-600">{achievement.points}</span>
                  </div>
                </div>
              </div>

              {isCompleted && (
                <div className="mt-3 text-center">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Completed
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default {
  IAPStore,
  GuildManagement,
  TournamentHub,
  AchievementsDisplay
};