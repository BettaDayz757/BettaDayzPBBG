import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COMMUNITY_ORGANIZATIONS = [
  {
    id: 'nsu_business',
    name: 'Norfolk State University Business School',
    type: 'education',
    influence: 8,
    connections: ['students', 'professors', 'alumni']
  },
  {
    id: 'civic_league',
    name: 'Norfolk Civic League',
    type: 'community',
    influence: 7,
    connections: ['community_leaders', 'residents', 'activists']
  },
  {
    id: 'black_chamber',
    name: 'Black Chamber of Commerce',
    type: 'business',
    influence: 9,
    connections: ['business_owners', 'investors', 'mentors']
  },
  {
    id: 'youth_center',
    name: 'Norfolk Youth Development Center',
    type: 'youth',
    influence: 6,
    connections: ['youth', 'parents', 'educators']
  }
];

export const CommunityHub = ({ player, onInteraction }) => {
  const [activeOrgs, setActiveOrgs] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [relationships, setRelationships] = useState(new Map());

  useEffect(() => {
    loadCommunityData();
    generateEvents();
  }, []);

  const loadCommunityData = () => {
    setActiveOrgs(COMMUNITY_ORGANIZATIONS);
    // Initialize relationships
    const initialRelationships = new Map();
    COMMUNITY_ORGANIZATIONS.forEach(org => {
      initialRelationships.set(org.id, {
        level: 1,
        trust: 0,
        lastInteraction: null
      });
    });
    setRelationships(initialRelationships);
  };

  const generateEvents = () => {
    const events = [
      {
        id: 'mentorship',
        title: 'Youth Mentorship Program',
        organization: 'youth_center',
        requirement: { reputation: 20 },
        reward: {
          reputation: 15,
          connections: ['youth_leaders', 'educators'],
          skills: { leadership: 2, communication: 1 }
        }
      },
      {
        id: 'workshop',
        title: 'Business Workshop Series',
        organization: 'black_chamber',
        requirement: { level: 3 },
        reward: {
          reputation: 10,
          connections: ['business_mentors'],
          skills: { business: 2, networking: 2 }
        }
      }
    ];
    setCurrentEvents(events);
  };

  const handleEventParticipation = (eventId) => {
    const event = currentEvents.find(e => e.id === eventId);
    if (!event) return;

    // Update relationship with organization
    const orgRelationship = relationships.get(event.organization);
    if (orgRelationship) {
      relationships.set(event.organization, {
        ...orgRelationship,
        trust: orgRelationship.trust + 10,
        lastInteraction: new Date()
      });
    }

    // Apply rewards
    onInteraction({
      type: 'event_completed',
      data: {
        eventId,
        rewards: event.reward
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Norfolk Community Hub</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Community Organizations</h3>
          {activeOrgs.map(org => {
            const relationship = relationships.get(org.id);
            return (
              <motion.div
                key={org.id}
                whileHover={{ scale: 1.02 }}
                className="border-b last:border-0 p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{org.name}</h4>
                    <p className="text-sm text-gray-600">Influence Level: {org.influence}</p>
                    {relationship && (
                      <div className="mt-2">
                        <div className="text-sm">Trust Level: {relationship.trust}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${relationship.trust}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onInteraction({
                      type: 'connect_organization',
                      data: { orgId: org.id }
                    })}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Connect
                  </button>
                </div>
              </motion.div>
            );
          })}
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Community Events</h3>
          {currentEvents.map(event => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              className="border-b last:border-0 p-4"
            >
              <h4 className="font-bold">{event.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Hosted by: {activeOrgs.find(org => org.id === event.organization)?.name}
              </p>
              <div className="mt-2">
                <h5 className="font-semibold text-sm">Rewards:</h5>
                <ul className="text-sm text-gray-600">
                  {event.reward.reputation && (
                    <li>• Reputation: +{event.reward.reputation}</li>
                  )}
                  {event.reward.skills && Object.entries(event.reward.skills).map(([skill, level]) => (
                    <li key={skill}>• {skill.charAt(0).toUpperCase() + skill.slice(1)}: +{level}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleEventParticipation(event.id)}
                className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Participate
              </button>
            </motion.div>
          ))}
        </section>
      </div>

      <section className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Community Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-bold">Local Employment</h4>
            <p className="text-2xl font-bold text-green-600">
              {player.businesses.reduce((total, b) => total + b.employees.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Jobs Created</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-bold">Community Events</h4>
            <p className="text-2xl font-bold text-blue-600">
              {player.eventHistory ? player.eventHistory.length : 0}
            </p>
            <p className="text-sm text-gray-600">Events Participated</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-bold">Youth Programs</h4>
            <p className="text-2xl font-bold text-purple-600">
              {player.youthPrograms ? player.youthPrograms : 0}
            </p>
            <p className="text-sm text-gray-600">Programs Supported</p>
          </div>
        </div>
      </section>
    </div>
  );
};