import type { MetaFunction } from '@remix-run/node';
import { useState, useEffect } from 'react';
import { GameContainer } from '~/components/GameContainer';

export const meta: MetaFunction = () => {
  return [
    { title: 'BettaDayz - Norfolk Business Empire' },
    {
      name: 'description',
      content:
        'Build your business empire in Norfolk, VA. A life simulation game combining elements of BitLife, IMVU, and Torn.com.',
    },
    { name: 'keywords', content: 'business simulation, Norfolk VA, PBBG, life simulation, entrepreneur game' },
    { property: 'og:title', content: 'BettaDayz - Norfolk Business Empire' },
    {
      property: 'og:description',
      content:
        "Experience the journey of an African American entrepreneur building their legacy in Norfolk's diverse business landscape.",
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://bettadayz.store' },
  ];
};

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setGameReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h1 className="mt-8 text-4xl font-bold text-white">BettaDayz</h1>
          <p className="mt-2 text-xl text-blue-200">Norfolk Business Empire</p>
          <p className="mt-4 text-sm text-blue-300">Loading your entrepreneurial journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">BettaDayz</h1>
                <p className="text-sm text-gray-500">Norfolk Business Empire</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Build your legacy in Norfolk, VA</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{gameReady && <GameContainer />}</main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">© 2024 BettaDayz. Building Norfolk's entrepreneurial future.</div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                About
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Community
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
