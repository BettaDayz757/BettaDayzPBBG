'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [currentDomain, setCurrentDomain] = useState('bettadayz.shop');

  useEffect(() => {
    const domain = typeof window !== 'undefined' ? window.location.hostname : 'bettadayz.shop';
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCurrentDomain(domain);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-16">
          <div className="text-3xl font-bold">
            BettaDayz<span className="text-yellow-400">PBBG</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
              {currentDomain}
            </span>
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition">
              Play Now
            </button>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your Empire in
            <span className="block text-yellow-400">Norfolk, VA</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            A life simulation game celebrating African American and minority culture,
            HBCU excellence, and Norfolk{"'"}s rich history
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="bg-purple-700/50 px-4 py-2 rounded-full">🎮 IMVU-Style Social</span>
            <span className="bg-purple-700/50 px-4 py-2 rounded-full">📊 BitLife Life Sim</span>
            <span className="bg-purple-700/50 px-4 py-2 rounded-full">⚔️ Torn.com Competition</span>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Game Features</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <FeatureCard
            icon="🏢"
            title="Norfolk Locations"
            description="Military Circle, Downtown, Ghent, Ocean View, Berkley, Park Place, and NSU District"
          />
          <FeatureCard
            icon="🎓"
            title="HBCU Integration"
            description="Partner with Norfolk State, Hampton University, and Virginia State. Build the next generation."
          />
          <FeatureCard
            icon="✊🏾"
            title="Cultural Heritage"
            description="Experience authentic African American culture, from soul food to barbershops to music studios"
          />
          <FeatureCard
            icon="💼"
            title="Business Empire"
            description="Tech, retail, soul food, barbershops, music studios, real estate, and more"
          />
          <FeatureCard
            icon="🤝"
            title="Social Network"
            description="Build crews, network at events, mentor youth, and create lasting connections"
          />
          <FeatureCard
            icon="📈"
            title="Life Simulation"
            description="Age from 18 to 85, make life choices, build generational wealth and legacy"
          />
          <FeatureCard
            icon="🏆"
            title="Competition"
            description="Control territories, compete for contracts, build your reputation"
          />
          <FeatureCard
            icon="🎨"
            title="Character Customization"
            description="Afro, locs, braids, waves, streetwear, business attire - express yourself"
          />
          <FeatureCard
            icon="🌊"
            title="Real Norfolk Events"
            description="Harborfest, Soul Food Festival, HBCU Job Fairs, Community Initiatives"
          />
        </div>
      </section>

      {/* Norfolk Locations */}
      <section className="bg-black/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Explore Norfolk</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LocationCard
              name="Downtown Norfolk"
              description="Historic Black Wall Street revival area"
              demographic="35% African American"
            />
            <LocationCard
              name="Norfolk State District"
              description="Premier HBCU campus and innovation hub"
              demographic="85% African American"
            />
            <LocationCard
              name="Berkley"
              description="Historic African American neighborhood renaissance"
              demographic="70% African American"
            />
            <LocationCard
              name="Ocean View"
              description="Historic beach community with rich heritage"
              demographic="50% African American"
            />
          </div>
        </div>
      </section>

      {/* Cultural Icons */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-8">Inspired By Norfolk Legends</h2>
        <p className="text-center text-xl mb-12 text-gray-300">
          Follow in the footsteps of Norfolk{"'"}s cultural icons
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-3">🎵</div>
            <h3 className="font-bold text-xl mb-2">Pharrell Williams</h3>
            <p className="text-gray-400">Music, Fashion, Innovation</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🎤</div>
            <h3 className="font-bold text-xl mb-2">Missy Elliott</h3>
            <p className="text-gray-400">Hip-hop Pioneer</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🎹</div>
            <h3 className="font-bold text-xl mb-2">Timbaland</h3>
            <p className="text-gray-400">Legendary Producer</p>
          </div>
        </div>
      </section>

      {/* Dual Domain Notice */}
      <section className="bg-gradient-to-r from-yellow-600 to-orange-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Dual Domain Support</h2>
          <p className="text-xl mb-6">
            Play on <strong>bettadayz.shop</strong> or <strong>bettadayz.store</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://bettadayz.shop" 
              className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Visit bettadayz.shop
            </a>
            <a 
              href="https://bettadayz.store" 
              className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Visit bettadayz.store
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            A persistent browser-based game celebrating Norfolk, VA culture and HBCU excellence
          </p>
          <p className="text-sm text-gray-500">
            Built with ❤️ in Norfolk, VA • © 2025 BettaDayz PBBG
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function LocationCard({ name, description, demographic }: { name: string; description: string; demographic: string }) {
  return (
    <div className="bg-gradient-to-br from-purple-800 to-indigo-800 p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-gray-300 mb-3 text-sm">{description}</p>
      <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{demographic}</span>
    </div>
  );
}
