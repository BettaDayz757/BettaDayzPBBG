import { Metadata } from 'next';
import { headers } from 'next/headers';
import BettaBuckzStore from './components/BettaBuckzStore';

export const metadata: Metadata = {
  title: 'BettaDayz Store - Buy BettaBuckz Currency',
  description: 'Purchase BettaBuckz, the premium currency for BettaDayz PBBG. Buy with Cash App or Bitcoin.',
  keywords: ['BettaBuckz', 'cryptocurrency', 'gaming currency', 'Cash App', 'Bitcoin', 'BTC'],
};

export default async function StorePage() {
  const headersList = await headers();
  const domain = headersList.get('host') || '';
  const isStoreDomain = domain.includes('bettadayz.store');

  if (!isStoreDomain) {
    // Redirect to proper store domain
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Redirecting to Store...</h1>
          <p className="text-xl">Taking you to bettadayz.store</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            BettaDayz Store
          </h1>
          <p className="text-xl text-blue-200">
            Purchase BettaBuckz - The Premium Currency for BettaDayz PBBG
          </p>
        </header>

        <BettaBuckzStore />

        <footer className="text-center mt-16 text-blue-200">
          <p>&copy; 2024 BettaDayz. All rights reserved.</p>
          <p className="mt-2">
            <a href="https://bettadayz.shop" className="text-blue-300 hover:text-white transition-colors">
              ← Back to Game
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}