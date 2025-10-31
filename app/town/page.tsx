'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TownPage() {
  const [currentDomain, setCurrentDomain] = useState('bettadayz.shop');

  useEffect(() => {
    const domain = typeof window !== 'undefined' ? window.location.hostname : 'bettadayz.shop';
    setCurrentDomain(domain);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            BettaDayz<span className="text-yellow-400">PBBG</span>
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
              {currentDomain}
            </span>
            <Link 
              href="/"
              className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
            >
              Home
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Norfolk Town Center</h1>
          <p className="text-xl text-gray-300 mb-12">
            Explore the vibrant neighborhoods and business opportunities across Norfolk, VA
          </p>

          {/* Locations Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <LocationCard
              name="Downtown Norfolk"
              description="Historic Black Wall Street revival area with prime business opportunities"
              demographic="35% African American"
              businesses={['Tech Startups', 'Fashion Boutiques', 'Soul Food Restaurants']}
            />
            <LocationCard
              name="Norfolk State District"
              description="Premier HBCU campus and innovation hub"
              demographic="85% African American"
              businesses={['Student Services', 'Tech Innovation', 'Community Programs']}
            />
            <LocationCard
              name="Berkley Historic District"
              description="Historic African American neighborhood renaissance"
              demographic="70% African American"
              businesses={['Music Studios', 'Barbershops', 'Community Centers']}
            />
            <LocationCard
              name="Ocean View Beach"
              description="Beach community with rich cultural heritage"
              demographic="50% African American"
              businesses={['Tourism', 'Restaurants', 'Retail Shops']}
            />
            <LocationCard
              name="Military Circle"
              description="Commercial hub near Naval Station Norfolk"
              demographic="45% African American"
              businesses={['Retail', 'Services', 'Entertainment']}
            />
            <LocationCard
              name="Ghent Arts District"
              description="Arts and culture district with creative opportunities"
              demographic="30% African American"
              businesses={['Art Galleries', 'Creative Studios', 'Cafes']}
            />
            <LocationCard
              name="Park Place"
              description="Family business community center"
              demographic="65% African American"
              businesses={['Family Services', 'Education', 'Local Shops']}
            />
            <LocationCard
              name="Churchland"
              description="Spiritual and community gathering place"
              demographic="55% African American"
              businesses={['Community Services', 'Faith Organizations', 'Youth Programs']}
            />
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Empire?</h2>
            <p className="text-xl mb-6">
              Start your journey in Norfolk and create your legacy
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                href="/todos"
                className="bg-black/30 backdrop-blur-sm px-8 py-3 rounded-full font-semibold hover:bg-black/40 transition"
              >
                View Tasks
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">
            Norfolk Business Empire • PBBG
          </p>
          <p className="text-sm text-gray-500">
            Built with ❤️ in Norfolk, VA • © 2025 BettaDayz PBBG
          </p>
        </div>
      </footer>
    </div>
  );
}

function LocationCard({ 
  name, 
  description, 
  demographic,
  businesses 
}: { 
  name: string; 
  description: string; 
  demographic: string;
  businesses: string[];
}) {
  return (
    <div className="bg-gradient-to-br from-purple-800 to-indigo-800 p-6 rounded-xl hover:scale-105 transition-transform">
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-gray-300 mb-3">{description}</p>
      <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{demographic}</span>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm font-semibold mb-2">Business Opportunities:</p>
        <div className="flex flex-wrap gap-2">
          {businesses.map((business, idx) => (
            <span key={idx} className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded">
              {business}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
