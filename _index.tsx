import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { GameContainer } from "~/components/GameContainer.jsx";
import Game3D from "~/components/Game3D";
import GTAStyleUI from "~/components/GTAStyleUI";
import InGamePurchases, { PurchaseSuccess } from "~/components/InGamePurchases";
import GamepadSupport, { useGamepadControls } from "~/components/GamepadSupport";
import Dashboard from "~/components/Dashboard";
import BusinessMenu from "~/components/BusinessMenu";
import PropertiesMenu from "~/components/PropertiesMenu";
import GarageMenu from "~/components/GarageMenu";
import SocialMenu from "~/components/SocialMenu";
import SettingsMenu from "~/components/SettingsMenu";

export const meta: MetaFunction = () => {
  return [
    { title: "BettaDayz - 3D Life Simulation Game" },
    { name: "description", content: "Experience immersive 3D life simulation like never before with BettaDayz PBBG" },
    { property: "og:title", content: "BettaDayz - 3D Life Simulation Game" },
    { property: "og:description", content: "Experience immersive 3D life simulation like never before with BettaDayz PBBG" },
    { property: "og:image", content: "/og-image.jpg" },
    { property: "og:url", content: "https://bettadayz.store" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "BettaDayz - 3D Life Simulation Game" },
    { name: "twitter:description", content: "Experience immersive 3D life simulation like never before with BettaDayz PBBG" },
    { name: "twitter:image", content: "/og-image.jpg" },
  ];
};

export default function Index() {
  const [gameMode, setGameMode] = useState<'classic' | '3d'>('3d');
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchases, setShowPurchases] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [showGarage, setShowGarage] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<{ id: string; name: string; price: number; currency: 'coins' | 'gems' | 'cash'; category: string } | null>(null);
  
  // Player stats and wallet
  const [playerStats, setPlayerStats] = useState({
    level: 15,
    respect: 75,
    health: 100,
    armor: 80,
    wanted: 2,
    money: 125000,
    experience: 8500,
    maxExperience: 10000
  });

  const [playerWallet, setPlayerWallet] = useState({
    coins: 25000,
    gems: 150,
    cash: 1999 // in cents
  });

  // Character data for Dashboard
  const [character, setCharacter] = useState({
    name: "Player",
    age: 25,
    stats: {
      health: playerStats.health,
      happiness: 75,
      smarts: 65,
      looks: 70,
      money: playerStats.money
    },
    career: {
      title: "Software Developer",
      salary: 75000,
      requirements: { smarts: 60 }
    },
    relationships: [
      { id: "1", name: "Alex", type: "friend" as const, happiness: 85 },
      { id: "2", name: "Sarah", type: "partner" as const, happiness: 92 },
      { id: "3", name: "Mike", type: "friend" as const, happiness: 70 }
    ]
  });

  // Gamepad controls
  const {
    controls,
    gamepadConnected,
    handleControlsUpdate,
    handleGamepadConnect,
    handleGamepadDisconnect
  } = useGamepadControls();

  // Purchase system handlers
  const handlePurchase = (item: { id: string; name: string; price: number; currency: 'coins' | 'gems' | 'cash'; category: string }) => {
    // Check if player can afford the item
    if (playerWallet[item.currency] >= item.price) {
      // Deduct cost from wallet
      setPlayerWallet(prev => ({
        ...prev,
        [item.currency]: prev[item.currency] - item.price
      }));

      // Add item to player inventory (you can expand this)
      console.log('Purchased:', item.name);
      
      // Show success message
      setPurchaseSuccess(item);
      setShowPurchases(false);
      
      // Update player stats if it's a currency purchase
      if (item.category === 'currency') {
        if (item.id.includes('coins')) {
          const coinsToAdd = parseInt(item.name.replace(/[^0-9]/g, ''));
          setPlayerWallet(prev => ({
            ...prev,
            coins: prev.coins + coinsToAdd
          }));
        }
      }
    }
  };

  // Handle gamepad menu actions
  useEffect(() => {
    if (controls.actions.menu && !showPurchases) {
      setShowPurchases(true);
    }
  }, [controls.actions.menu, showPurchases]);

  useEffect(() => {
    // Simulate game loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleMenuAction = (action: string) => {
    console.log('Menu action:', action);
    
    switch (action) {
      case 'shop':
        setShowPurchases(true);
        break;
      case 'dashboard':
      case 'stats':
        setShowDashboard(true);
        break;
      case 'business':
        setShowBusiness(true);
        break;
      case 'properties':
        setShowProperties(true);
        break;
      case 'garage':
        setShowGarage(true);
        break;
      case 'social':
        setShowSocial(true);
        break;
      case 'settings':
        setShowSettings(true);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-8"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-2xl">🎮</div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            BettaDayz 3D
          </h1>
          <p className="text-xl text-gray-300 mb-4">Loading your immersive world...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Game Mode Toggle */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-white/20">
          <div className="flex space-x-2">
            <button
              onClick={() => setGameMode('3d')}
              className={`px-4 py-2 rounded transition-all ${
                gameMode === '3d' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🌍 3D Mode
            </button>
            <button
              onClick={() => setGameMode('classic')}
              className={`px-4 py-2 rounded transition-all ${
                gameMode === 'classic' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📱 Classic Mode
            </button>
          </div>
        </div>
      </div>

      {/* Game Content */}
      {gameMode === '3d' ? (
        <div className="relative w-full h-full">
          {/* 3D Game Scene */}
          <Game3D gamepadControls={controls} />
          
          {/* GTA-Style UI Overlay */}
          <GTAStyleUI 
            playerStats={playerStats}
            onMenuAction={handleMenuAction}
            gamepadConnected={gamepadConnected}
          />

          {/* Gamepad Support */}
          <GamepadSupport
            onControlsUpdate={handleControlsUpdate}
            onGamepadConnect={handleGamepadConnect}
            onGamepadDisconnect={handleGamepadDisconnect}
          />

          {/* In-Game Purchases */}
          {showPurchases && (
            <InGamePurchases
              playerWallet={playerWallet}
              onPurchase={handlePurchase}
              onClose={() => setShowPurchases(false)}
            />
          )}

          {/* Purchase Success Modal */}
          {purchaseSuccess && (
            <PurchaseSuccess
              item={purchaseSuccess}
              onClose={() => setPurchaseSuccess(null)}
            />
          )}

          {/* Character Dashboard */}
          {showDashboard && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-gray-600 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-600">
                  <h2 className="text-2xl font-bold text-yellow-400">Character Dashboard</h2>
                  <button
                    onClick={() => setShowDashboard(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                  <Dashboard character={character} />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-screen">
          <GameContainer />
        </div>
      )}
    </div>
  );
}