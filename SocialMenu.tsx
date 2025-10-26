import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  relationship: 'friend' | 'family' | 'romantic' | 'business' | 'enemy';
  relationshipLevel: number; // 0-100
  lastSeen: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  location?: string;
  occupation?: string;
  messages?: Message[];
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'location' | 'money';
  read: boolean;
}

interface SocialMenuProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  playerMoney: number;
}

const norfolkContacts: Contact[] = [
  {
    id: 'sarah_jones',
    name: 'Sarah Jones',
    avatar: '👩‍💼',
    relationship: 'business',
    relationshipLevel: 65,
    lastSeen: '2 hours ago',
    status: 'online',
    location: 'Downtown Norfolk',
    occupation: 'Business Owner',
    messages: [
      {
        id: '1',
        senderId: 'sarah_jones',
        content: 'Hey! I heard you\'re looking for business opportunities. Want to grab coffee?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        read: false
      }
    ]
  },
  {
    id: 'mike_rodriguez',
    name: 'Mike Rodriguez',
    avatar: '👨‍🔧',
    relationship: 'friend',
    relationshipLevel: 78,
    lastSeen: '30 minutes ago',
    status: 'online',
    location: 'Ghent District',
    occupation: 'Mechanic',
    messages: [
      {
        id: '2',
        senderId: 'mike_rodriguez',
        content: 'Yo! Got some sweet rides at the shop if you\'re interested. Friend discount! 😉',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        read: false
      }
    ]
  },
  {
    id: 'emma_wilson',
    name: 'Emma Wilson',
    avatar: '👩‍🎨',
    relationship: 'romantic',
    relationshipLevel: 85,
    lastSeen: 'online',
    status: 'online',
    location: 'Norfolk Arts District',
    occupation: 'Artist',
    messages: [
      {
        id: '3',
        senderId: 'emma_wilson',
        content: 'Missing you! Want to check out the new gallery opening tonight? ❤️',
        timestamp: new Date(Date.now() - 900000),
        type: 'text',
        read: false
      }
    ]
  },
  {
    id: 'tony_soprano',
    name: 'Tony "The Fish" Soprano',
    avatar: '👨‍💼',
    relationship: 'business',
    relationshipLevel: 45,
    lastSeen: '1 day ago',
    status: 'busy',
    location: 'Norfolk Harbor',
    occupation: 'Import/Export',
    messages: [
      {
        id: '4',
        senderId: 'tony_soprano',
        content: 'I got a proposition for you. Meet me at the docks. Come alone.',
        timestamp: new Date(Date.now() - 86400000),
        type: 'text',
        read: true
      }
    ]
  },
  {
    id: 'jessica_kim',
    name: 'Jessica Kim',
    avatar: '👩‍⚕️',
    relationship: 'friend',
    relationshipLevel: 72,
    lastSeen: '4 hours ago',
    status: 'away',
    location: 'Norfolk General Hospital',
    occupation: 'Doctor',
    messages: []
  },
  {
    id: 'carlos_mendez',
    name: 'Carlos Mendez',
    avatar: '👨‍🍳',
    relationship: 'friend',
    relationshipLevel: 68,
    lastSeen: '1 hour ago',
    status: 'online',
    location: 'Colley Avenue',
    occupation: 'Restaurant Owner',
    messages: [
      {
        id: '5',
        senderId: 'carlos_mendez',
        content: 'New restaurant opening next week! You should come by for the grand opening!',
        timestamp: new Date(Date.now() - 7200000),
        type: 'text',
        read: false
      }
    ]
  }
];

const socialActivities = [
  {
    id: 'coffee_date',
    name: 'Coffee Date',
    description: 'Meet someone for coffee and conversation',
    cost: 25,
    relationshipBoost: 5,
    duration: '30 minutes',
    icon: '☕'
  },
  {
    id: 'dinner_date',
    name: 'Dinner Date',
    description: 'Take someone out for a nice dinner',
    cost: 80,
    relationshipBoost: 12,
    duration: '2 hours',
    icon: '🍽️'
  },
  {
    id: 'movie_night',
    name: 'Movie Night',
    description: 'Watch a movie together',
    cost: 40,
    relationshipBoost: 8,
    duration: '3 hours',
    icon: '🎬'
  },
  {
    id: 'shopping_trip',
    name: 'Shopping Trip',
    description: 'Go shopping together',
    cost: 150,
    relationshipBoost: 10,
    duration: '2 hours',
    icon: '🛍️'
  },
  {
    id: 'club_night',
    name: 'Club Night',
    description: 'Hit the nightclub scene',
    cost: 120,
    relationshipBoost: 15,
    duration: '4 hours',
    icon: '🕺'
  },
  {
    id: 'beach_day',
    name: 'Beach Day',
    description: 'Spend the day at Virginia Beach',
    cost: 60,
    relationshipBoost: 18,
    duration: '6 hours',
    icon: '🏖️'
  }
];

export default function SocialMenu({ isOpen, onClose, playerName, playerMoney }: SocialMenuProps) {
  const [selectedTab, setSelectedTab] = useState<'contacts' | 'messages' | 'activities' | 'dating'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>(norfolkContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [filterRelationship, setFilterRelationship] = useState<string>('all');

  const relationshipTypes = ['all', 'friend', 'family', 'romantic', 'business', 'enemy'];

  const filteredContacts = filterRelationship === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.relationship === filterRelationship);

  const unreadMessages = contacts.reduce((total, contact) => {
    return total + (contact.messages?.filter(msg => !msg.read && msg.senderId !== 'player').length || 0);
  }, 0);

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'friend': return 'text-blue-400';
      case 'family': return 'text-green-400';
      case 'romantic': return 'text-pink-400';
      case 'business': return 'text-yellow-400';
      case 'enemy': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const sendMessage = (contactId: string, content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'player',
      content: content.trim(),
      timestamp: new Date(),
      type: 'text',
      read: true
    };

    setContacts(prev => prev.map(contact => {
      if (contact.id === contactId) {
        return {
          ...contact,
          messages: [...(contact.messages || []), newMessage]
        };
      }
      return contact;
    }));

    setMessageText('');

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out!",
        "Sounds good to me!",
        "Let me think about it...",
        "I'm busy right now, maybe later?",
        "That's interesting!",
        "Sure, let's do it!",
        "I'll get back to you on that."
      ];

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: contactId,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text',
        read: false
      };

      setContacts(prev => prev.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            messages: [...(contact.messages || []), responseMessage]
          };
        }
        return contact;
      }));
    }, 2000 + Math.random() * 3000);
  };

  const planActivity = (contactId: string, activityId: string) => {
    const activity = socialActivities.find(a => a.id === activityId);
    const contact = contacts.find(c => c.id === contactId);
    
    if (!activity || !contact || playerMoney < activity.cost) return;

    // Increase relationship level
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        return {
          ...c,
          relationshipLevel: Math.min(100, c.relationshipLevel + activity.relationshipBoost)
        };
      }
      return c;
    }));

    // Add activity message
    const activityMessage: Message = {
      id: Date.now().toString(),
      senderId: 'system',
      content: `You and ${contact.name} went on a ${activity.name}! Relationship improved by ${activity.relationshipBoost} points.`,
      timestamp: new Date(),
      type: 'text',
      read: true
    };

    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        return {
          ...c,
          messages: [...(c.messages || []), activityMessage]
        };
      }
      return c;
    }));
  };

  const markMessagesAsRead = (contactId: string) => {
    setContacts(prev => prev.map(contact => {
      if (contact.id === contactId) {
        return {
          ...contact,
          messages: contact.messages?.map(msg => ({ ...msg, read: true })) || []
        };
      }
      return contact;
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-400">Social Hub</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-red-400 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSelectedTab('contacts')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'contacts'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Contacts ({contacts.length})
              </button>
              <button
                onClick={() => setSelectedTab('messages')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors relative ${
                  selectedTab === 'messages'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Messages
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>
              <button
                onClick={() => setSelectedTab('activities')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'activities'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Activities
              </button>
              <button
                onClick={() => setSelectedTab('dating')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'dating'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Dating
              </button>
            </div>

            {selectedTab === 'contacts' ? (
              <div className="space-y-4">
                {/* Filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {relationshipTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterRelationship(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterRelationship === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Contacts List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredContacts.map(contact => (
                    <div key={contact.id} className="bg-gray-800 border border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <span className="text-3xl">{contact.avatar}</span>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(contact.status)}`}></div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">{contact.name}</h4>
                            <p className="text-sm text-gray-400">{contact.occupation}</p>
                            <p className="text-xs text-gray-500">{contact.location}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${getRelationshipColor(contact.relationship)} bg-gray-700`}>
                          {contact.relationship}
                        </span>
                      </div>

                      {/* Relationship Level */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Relationship</span>
                          <span className="text-white">{contact.relationshipLevel}/100</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${contact.relationshipLevel}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 mb-3">
                        Last seen: {contact.lastSeen}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setSelectedTab('messages');
                            markMessagesAsRead(contact.id);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors relative"
                        >
                          Message
                          {contact.messages?.some(msg => !msg.read && msg.senderId !== 'player') && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              !
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setSelectedTab('activities');
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                        >
                          Hang Out
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedTab === 'messages' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                {/* Contact List */}
                <div className="bg-gray-800 rounded-lg p-4 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-white mb-4">Conversations</h3>
                  <div className="space-y-2">
                    {contacts.filter(c => c.messages && c.messages.length > 0).map(contact => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          setSelectedContact(contact);
                          markMessagesAsRead(contact.id);
                        }}
                        className={`w-full p-3 rounded-lg text-left transition-colors relative ${
                          selectedContact?.id === contact.id
                            ? 'bg-blue-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{contact.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium truncate">{contact.name}</div>
                            <div className="text-sm text-gray-300 truncate">
                              {contact.messages?.[contact.messages.length - 1]?.content || 'No messages'}
                            </div>
                          </div>
                          {contact.messages?.some(msg => !msg.read && msg.senderId !== 'player') && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2 bg-gray-800 rounded-lg flex flex-col">
                  {selectedContact ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{selectedContact.avatar}</span>
                          <div>
                            <h4 className="text-lg font-semibold text-white">{selectedContact.name}</h4>
                            <p className="text-sm text-gray-400">{selectedContact.status}</p>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {selectedContact.messages?.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === 'player' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.senderId === 'player'
                                  ? 'bg-blue-600 text-white'
                                  : message.senderId === 'system'
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-gray-700 text-white'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-700">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                sendMessage(selectedContact.id, messageText);
                              }
                            }}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => sendMessage(selectedContact.id, messageText)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">Select a Conversation</h3>
                        <p className="text-gray-400">Choose a contact to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedTab === 'activities' ? (
              <div className="space-y-6">
                {selectedContact && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Plan Activity with {selectedContact.name}
                    </h3>
                    <p className="text-gray-400">
                      Relationship Level: {selectedContact.relationshipLevel}/100
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {socialActivities.map(activity => (
                    <div key={activity.id} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{activity.icon}</div>
                        <h4 className="text-lg font-semibold text-white">{activity.name}</h4>
                        <p className="text-sm text-gray-400">{activity.description}</p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Cost:</span>
                          <span className="text-yellow-400">${activity.cost}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-white">{activity.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Relationship Boost:</span>
                          <span className="text-green-400">+{activity.relationshipBoost}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => selectedContact && planActivity(selectedContact.id, activity.id)}
                        disabled={!selectedContact || playerMoney < activity.cost}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          selectedContact && playerMoney >= activity.cost
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {!selectedContact 
                          ? 'Select Contact First' 
                          : playerMoney >= activity.cost 
                          ? 'Plan Activity' 
                          : 'Insufficient Funds'
                        }
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💕</div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Dating Feature</h3>
                  <p className="text-gray-400 mb-4">Find love in Norfolk! Meet new people and build romantic relationships.</p>
                  <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg inline-block">
                    Coming Soon - Dating App Integration
                  </div>
                </div>

                {/* Romantic Contacts */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Current Romantic Interests</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contacts.filter(c => c.relationship === 'romantic').map(contact => (
                      <div key={contact.id} className="bg-gray-800 border border-pink-500 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-3xl">{contact.avatar}</span>
                          <div>
                            <h4 className="text-lg font-semibold text-white">{contact.name}</h4>
                            <p className="text-sm text-pink-400">Romantic Interest</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Romance Level</span>
                            <span className="text-pink-400">{contact.relationshipLevel}/100</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full"
                              style={{ width: `${contact.relationshipLevel}%` }}
                            ></div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setSelectedTab('activities');
                          }}
                          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium transition-colors"
                        >
                          Plan Date
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}