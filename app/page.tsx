import { headers } from 'next/headers';

export default async function Home() {
  const headersList = await headers();
  const domain = headersList.get('host') || '';
  const isStoreDomain = domain.includes('bettadayz.store');

  if (isStoreDomain) {
    // Redirect to store page
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to BettaDayz Store</h1>
          <p className="text-xl mb-8">Loading your store experience...</p>
          <script dangerouslySetInnerHTML={{
            __html: "window.location.href = '/store';"
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            BettaDayz PBBG
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Welcome to the ultimate persistent browser-based gaming experience
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/game"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🎮 Enter Game Hub
            </a>
            <a
              href="/play"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Playing
            </a>
            <a
              href="https://bettadayz.store"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Buy BettaBuckz
            </a>
          </div>
        </header>

        {/* Game Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Player Stats</h2>
            <div className="space-y-2 text-blue-200">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="text-yellow-400 font-bold">1</span>
              </div>
              <div className="flex justify-between">
                <span>Experience:</span>
                <span className="text-green-400">0 / 100</span>
              </div>
              <div className="flex justify-between">
                <span>BettaBuckz:</span>
                <span className="text-purple-400 font-bold">0</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                Explore World
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                Manage Inventory
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                Visit Market
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-2 text-blue-200 text-sm">
              <p>• Welcome to BettaDayz PBBG!</p>
              <p>• Character created</p>
              <p>• Tutorial available</p>
            </div>
          </div>
        </div>

        <footer className="text-center mt-16 text-blue-200">
          <p>&copy; 2024 BettaDayz. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <a href="/help" className="hover:text-white transition-colors">Help</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            <a href="https://bettadayz.store" className="hover:text-white transition-colors">Store</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
