import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Text, 
  Box, 
  Sphere, 
  Plane,
  useTexture,
  Html,
  PerspectiveCamera,
  Sky
} from '@react-three/drei';
import * as THREE from 'three';
import Character3D from './Character3D';
import OpenWorld from './OpenWorld';

// NPC Data
const npcs = [
  {
    id: 1,
    name: "Marcus Johnson",
    level: 15,
    health: 100,
    position: [5, 0, 3] as [number, number, number],
    outfit: "business",
    skinTone: "#8B4513",
    hairStyle: "short",
    accessories: ["watch", "glasses"]
  },
  {
    id: 2,
    name: "Sarah Williams",
    level: 22,
    health: 85,
    position: [-3, 0, 5] as [number, number, number],
    outfit: "casual",
    skinTone: "#D2691E",
    hairStyle: "long",
    accessories: ["earrings"]
  },
  {
    id: 3,
    name: "DJ Rodriguez",
    level: 8,
    health: 95,
    position: [8, 0, -2] as [number, number, number],
    outfit: "street",
    skinTone: "#C68642",
    hairStyle: "fade",
    accessories: ["chain", "cap"]
  },
  {
    id: 4,
    name: "Officer Thompson",
    level: 30,
    health: 100,
    position: [-5, 0, -4] as [number, number, number],
    outfit: "uniform",
    skinTone: "#FDBCB4",
    hairStyle: "buzz",
    accessories: ["badge", "radio"]
  }
];

// 3D Character Component (Legacy - replaced by Character3D)
function LegacyCharacter({ position, color = '#4F46E5' }: { position: [number, number, number], color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Body */}
      <mesh ref={meshRef} position={[0, 1, 0]}>
        <capsuleGeometry args={[0.3, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="#FDBCB4" />
      </mesh>
      {/* Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5]} />
        <meshBasicMaterial color="black" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

// 3D Building Component
function Building({ position = [0, 0, 0], size = [2, 4, 2], color = "#8b5cf6" }: {
  position?: [number, number, number];
  size?: [number, number, number];
  color?: string;
}) {
  const [clicked, setClicked] = useState(false);
  
  return (
    <Box
      position={position}
      args={size}
      onClick={() => setClicked(!clicked)}
    >
      <meshStandardMaterial 
        color={clicked ? "#f59e0b" : color}
        transparent
        opacity={0.8}
      />
    </Box>
  );
}

// Ground Component
function Ground() {
  return (
    <Plane
      args={[50, 50]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
    >
      <meshStandardMaterial color="#2d5a27" />
    </Plane>
  );
}

// City Environment
function CityEnvironment() {
  const buildings = [
    { pos: [5, 2, 5] as [number, number, number], size: [2, 4, 2] as [number, number, number], color: "#8b5cf6" },
    { pos: [-5, 1.5, 5] as [number, number, number], size: [1.5, 3, 1.5] as [number, number, number], color: "#ef4444" },
    { pos: [8, 3, -3] as [number, number, number], size: [2.5, 6, 2.5] as [number, number, number], color: "#3b82f6" },
    { pos: [-8, 2.5, -2] as [number, number, number], size: [2, 5, 2] as [number, number, number], color: "#10b981" },
    { pos: [0, 1, 10] as [number, number, number], size: [3, 2, 3] as [number, number, number], color: "#f59e0b" },
    { pos: [12, 4, 0] as [number, number, number], size: [2, 8, 2] as [number, number, number], color: "#ec4899" },
    { pos: [-12, 2, 8] as [number, number, number], size: [1.8, 4, 1.8] as [number, number, number], color: "#6366f1" },
  ];

  return (
    <>
      {buildings.map((building, index) => (
        <Building
          key={index}
          position={building.pos}
          size={building.size}
          color={building.color}
        />
      ))}
    </>
  );
}

// HUD Component
function GameHUD() {
  const [money, setMoney] = useState(1000);
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(100);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg pointer-events-auto">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">💰</span>
            <span>${money.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">⭐</span>
            <span>Level {level}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-400">❤️</span>
            <div className="w-20 h-2 bg-gray-700 rounded">
              <div 
                className="h-full bg-red-500 rounded transition-all"
                style={{ width: `${health}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Minimap */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-black/80 rounded-lg border-2 border-white/20 pointer-events-auto">
        <div className="relative w-full h-full">
          <div className="absolute inset-2 bg-green-900 rounded">
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-red-400 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-yellow-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2 pointer-events-auto">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          🏪 Shop
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
          💼 Business
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          👥 Social
        </button>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm pointer-events-auto">
        <div className="space-y-1">
          <div>WASD - Move Camera</div>
          <div>Mouse - Look Around</div>
          <div>Click - Interact</div>
        </div>
      </div>
    </div>
  );
}

// Camera Controller
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

// Main 3D Game Component
export default function Game3D({ gamepadControls }: { gamepadControls?: any }) {
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [selectedNPC, setSelectedNPC] = useState<number | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const handleNPCInteraction = (npcId: number) => {
    setSelectedNPC(npcId);
    console.log(`Interacting with NPC ${npcId}`);
  };

  const handleBuildingInteraction = (buildingName: string) => {
    setSelectedBuilding(buildingName);
    console.log(`Entering building: ${buildingName}`);
  };

  const handleVehicleInteraction = (vehicleType: string) => {
    setSelectedVehicle(vehicleType);
    console.log(`Interacting with vehicle: ${vehicleType}`);
  };

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-blue-400 to-blue-600">
      <GameHUD />
      
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 75 }}
        className="w-full h-full"
      >
        <CameraController />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        {/* Sky */}
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0}
          azimuth={0.25}
        />

        {/* Environment */}
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          {/* Open World Environment */}
          <OpenWorld 
            onBuildingInteract={handleBuildingInteraction}
            onVehicleInteract={handleVehicleInteraction}
          />
          
          {/* Player Character */}
          <Character3D
            position={playerPosition}
            isPlayer={true}
            characterData={{
              name: "Player",
              level: 1,
              health: 100,
              outfit: "casual",
              skinTone: "#8B4513",
              hairStyle: "medium",
              accessories: []
            }}
          />

          {/* NPCs */}
          {npcs.map((npc) => (
            <Character3D
              key={npc.id}
              position={npc.position}
              isPlayer={false}
              characterData={npc}
              onInteract={() => handleNPCInteraction(npc.id)}
            />
          ))}
          
          {/* Interactive Elements */}
          <Text
            position={[0, 6, -5]}
            fontSize={1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Welcome to BettaDayz 3D!
          </Text>
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
          target={playerPosition}
        />
      </Canvas>

      {/* NPC Interaction Panel */}
      {selectedNPC && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-black/90 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-md">
            <h3 className="text-white font-bold text-xl mb-4">
              {npcs.find(npc => npc.id === selectedNPC)?.name}
            </h3>
            <p className="text-gray-300 mb-4">
              "Hey there! Welcome to Norfolk. I'm level {npcs.find(npc => npc.id === selectedNPC)?.level}. 
              Want to do some business together?"
            </p>
            <div className="flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                💼 Business
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                🤝 Social
              </button>
              <button 
                onClick={() => setSelectedNPC(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Building Interaction Panel */}
      {selectedBuilding && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-black/90 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-md">
            <h3 className="text-white font-bold text-xl mb-4">
              {selectedBuilding}
            </h3>
            <p className="text-gray-300 mb-4">
              Welcome to {selectedBuilding}. What would you like to do here?
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                🚪 Enter
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                💰 Shop
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
                ℹ️ Info
              </button>
              <button 
                onClick={() => setSelectedBuilding(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Interaction Panel */}
      {selectedVehicle && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-black/90 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-md">
            <h3 className="text-white font-bold text-xl mb-4 capitalize">
              {selectedVehicle}
            </h3>
            <p className="text-gray-300 mb-4">
              This {selectedVehicle} looks ready to drive. What would you like to do?
            </p>
            <div className="flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                🚗 Drive
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                💰 Buy
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors">
                🔧 Customize
              </button>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}