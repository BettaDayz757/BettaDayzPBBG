import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Plane, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// Building Component
function Building({ 
  position, 
  size, 
  color = '#666666', 
  type = 'residential',
  name,
  onInteract 
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  type?: 'residential' | 'commercial' | 'office' | 'special';
  name?: string;
  onInteract?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const buildingRef = useRef<THREE.Mesh>(null);

  const getBuildingIcon = () => {
    switch (type) {
      case 'residential': return '🏠';
      case 'commercial': return '🏪';
      case 'office': return '🏢';
      case 'special': return '🏛️';
      default: return '🏢';
    }
  };

  return (
    <group position={position}>
      <Box
        ref={buildingRef}
        args={size}
        position={[0, size[1] / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onInteract}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={hovered ? '#ff6b6b' : color} 
          transparent
          opacity={hovered ? 0.8 : 1}
        />
      </Box>
      
      {/* Building Details */}
      {size[1] > 3 && (
        <>
          {/* Windows */}
          {Array.from({ length: Math.floor(size[1] / 2) }).map((_, floor) => (
            <group key={floor}>
              {Array.from({ length: Math.floor(size[0] / 2) }).map((_, window) => (
                <Box
                  key={`${floor}-${window}`}
                  args={[0.3, 0.4, 0.05]}
                  position={[
                    -size[0] / 2 + 0.5 + window * 1.5,
                    1 + floor * 2,
                    size[2] / 2 + 0.03
                  ]}
                >
                  <meshStandardMaterial color="#87CEEB" emissive="#001122" />
                </Box>
              ))}
            </group>
          ))}
        </>
      )}

      {/* Building Name/Type Display */}
      {hovered && name && (
        <Html position={[0, size[1] + 1, 0]} center>
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getBuildingIcon()}</span>
              <div>
                <div className="font-bold">{name}</div>
                <div className="text-xs text-gray-300 capitalize">{type}</div>
              </div>
            </div>
            <div className="text-xs text-yellow-400 mt-1">Click to enter</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Vehicle Component
function Vehicle({ 
  position, 
  type = 'car',
  color = '#ff0000',
  onInteract 
}: {
  position: [number, number, number];
  type?: 'car' | 'truck' | 'motorcycle' | 'bus';
  color?: string;
  onInteract?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const vehicleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (vehicleRef.current && hovered) {
      vehicleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const getVehicleSize = () => {
    switch (type) {
      case 'car': return [2, 0.8, 4];
      case 'truck': return [2.5, 1.5, 6];
      case 'motorcycle': return [0.8, 1, 2];
      case 'bus': return [2.5, 2, 8];
      default: return [2, 0.8, 4];
    }
  };

  const size = getVehicleSize();

  return (
    <group 
      ref={vehicleRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onInteract}
    >
      {/* Vehicle Body */}
      <Box args={size} position={[0, size[1] / 2, 0]} castShadow>
        <meshStandardMaterial color={hovered ? '#ffff00' : color} metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Wheels */}
      <Cylinder args={[0.3, 0.3, 0.2]} position={[-0.8, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.2]} position={[0.8, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.2]} position={[-0.8, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.2]} position={[0.8, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#333333" />
      </Cylinder>

      {/* Vehicle Info */}
      {hovered && (
        <Html position={[0, size[1] + 1, 0]} center>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
            <div className="font-bold capitalize">{type}</div>
            <div className="text-yellow-400">Press F to drive</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Street Light Component
function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <Cylinder args={[0.1, 0.1, 4]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#444444" />
      </Cylinder>
      
      {/* Light */}
      <Box args={[0.3, 0.3, 0.3]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#ffff88" emissive="#ffff44" />
      </Box>
      
      {/* Light source */}
      <pointLight position={[0, 4, 0]} intensity={0.5} distance={10} color="#ffff88" />
    </group>
  );
}

// Traffic Light Component
function TrafficLight({ position }: { position: [number, number, number] }) {
  const [currentLight, setCurrentLight] = useState<'red' | 'yellow' | 'green'>('red');
  
  useFrame((state) => {
    const time = Math.floor(state.clock.elapsedTime / 3) % 3;
    const lights: ('red' | 'yellow' | 'green')[] = ['red', 'yellow', 'green'];
    setCurrentLight(lights[time]);
  });

  return (
    <group position={position}>
      {/* Pole */}
      <Cylinder args={[0.05, 0.05, 3]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      
      {/* Traffic Light Box */}
      <Box args={[0.3, 0.8, 0.2]} position={[0, 3.2, 0]}>
        <meshStandardMaterial color="#222222" />
      </Box>
      
      {/* Lights */}
      <Cylinder args={[0.08, 0.08, 0.05]} position={[0, 3.5, 0.11]}>
        <meshStandardMaterial 
          color={currentLight === 'red' ? '#ff0000' : '#440000'} 
          emissive={currentLight === 'red' ? '#ff0000' : '#000000'}
        />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.05]} position={[0, 3.2, 0.11]}>
        <meshStandardMaterial 
          color={currentLight === 'yellow' ? '#ffff00' : '#444400'} 
          emissive={currentLight === 'yellow' ? '#ffff00' : '#000000'}
        />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.05]} position={[0, 2.9, 0.11]}>
        <meshStandardMaterial 
          color={currentLight === 'green' ? '#00ff00' : '#004400'} 
          emissive={currentLight === 'green' ? '#00ff00' : '#000000'}
        />
      </Cylinder>
    </group>
  );
}

// Road Component
function Road({ start, end, width = 4 }: { start: [number, number]; end: [number, number]; width?: number }) {
  const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[1] + end[1]) / 2;

  return (
    <group position={[midX, 0.01, midZ]} rotation={[0, angle, 0]}>
      <Plane args={[length, width]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#333333" />
      </Plane>
      
      {/* Road markings */}
      <Plane args={[length, 0.2]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <meshStandardMaterial color="#ffff00" />
      </Plane>
    </group>
  );
}

// Main Open World Component
export default function OpenWorld({ onBuildingInteract, onVehicleInteract }: {
  onBuildingInteract?: (buildingName: string) => void;
  onVehicleInteract?: (vehicleType: string) => void;
}) {
  // Building data
  const buildings = [
    { name: "Norfolk City Hall", type: "special" as const, position: [0, 0, 0] as [number, number, number], size: [4, 6, 4] as [number, number, number], color: "#8B4513" },
    { name: "BettaDayz HQ", type: "office" as const, position: [10, 0, 5] as [number, number, number], size: [6, 8, 6] as [number, number, number], color: "#4169E1" },
    { name: "Corner Store", type: "commercial" as const, position: [-8, 0, 3] as [number, number, number], size: [3, 4, 3] as [number, number, number], color: "#32CD32" },
    { name: "Apartment Complex", type: "residential" as const, position: [15, 0, -10] as [number, number, number], size: [8, 12, 6] as [number, number, number], color: "#CD853F" },
    { name: "Police Station", type: "special" as const, position: [-15, 0, -5] as [number, number, number], size: [5, 5, 5] as [number, number, number], color: "#000080" },
    { name: "Hospital", type: "special" as const, position: [5, 0, -15] as [number, number, number], size: [7, 6, 8] as [number, number, number], color: "#FF6347" },
    { name: "Bank", type: "commercial" as const, position: [-5, 0, 8] as [number, number, number], size: [4, 5, 4] as [number, number, number], color: "#FFD700" },
    { name: "Gym", type: "commercial" as const, position: [12, 0, 12] as [number, number, number], size: [5, 4, 6] as [number, number, number], color: "#FF4500" },
  ];

  // Vehicle data
  const vehicles = [
    { type: "car" as const, position: [3, 0, 2] as [number, number, number], color: "#ff0000" },
    { type: "truck" as const, position: [-10, 0, -2] as [number, number, number], color: "#0000ff" },
    { type: "motorcycle" as const, position: [7, 0, -5] as [number, number, number], color: "#000000" },
    { type: "bus" as const, position: [-3, 0, 10] as [number, number, number], color: "#ffff00" },
  ];

  return (
    <group>
      {/* Ground/Terrain */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <meshStandardMaterial color="#2d5a27" />
      </Plane>

      {/* Roads */}
      <Road start={[-20, -20]} end={[20, -20]} />
      <Road start={[-20, 0]} end={[20, 0]} />
      <Road start={[-20, 20]} end={[20, 20]} />
      <Road start={[-20, -20]} end={[-20, 20]} />
      <Road start={[0, -20]} end={[0, 20]} />
      <Road start={[20, -20]} end={[20, 20]} />

      {/* Buildings */}
      {buildings.map((building, index) => (
        <Building
          key={index}
          position={building.position}
          size={building.size}
          color={building.color}
          type={building.type}
          name={building.name}
          onInteract={() => onBuildingInteract?.(building.name)}
        />
      ))}

      {/* Vehicles */}
      {vehicles.map((vehicle, index) => (
        <Vehicle
          key={index}
          position={vehicle.position}
          type={vehicle.type}
          color={vehicle.color}
          onInteract={() => onVehicleInteract?.(vehicle.type)}
        />
      ))}

      {/* Street Lights */}
      <StreetLight position={[5, 0, 5]} />
      <StreetLight position={[-5, 0, 5]} />
      <StreetLight position={[5, 0, -5]} />
      <StreetLight position={[-5, 0, -5]} />
      <StreetLight position={[15, 0, 0]} />
      <StreetLight position={[-15, 0, 0]} />

      {/* Traffic Lights */}
      <TrafficLight position={[0, 0, 0]} />
      <TrafficLight position={[10, 0, 10]} />
      <TrafficLight position={[-10, 0, -10]} />

      {/* Environmental Details */}
      {/* Trees */}
      {Array.from({ length: 20 }).map((_, i) => (
        <group key={`tree-${i}`} position={[
          (Math.random() - 0.5) * 80,
          0,
          (Math.random() - 0.5) * 80
        ]}>
          {/* Tree trunk */}
          <Cylinder args={[0.2, 0.3, 3]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          {/* Tree leaves */}
          <Box args={[2, 2, 2]} position={[0, 3.5, 0]}>
            <meshStandardMaterial color="#228B22" />
          </Box>
        </group>
      ))}

      {/* Benches */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`bench-${i}`} position={[
          (Math.random() - 0.5) * 30,
          0,
          (Math.random() - 0.5) * 30
        ]}>
          <Box args={[1.5, 0.1, 0.4]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          <Box args={[0.1, 0.4, 0.4]} position={[-0.7, 0.2, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          <Box args={[0.1, 0.4, 0.4]} position={[0.7, 0.2, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
        </group>
      ))}
    </group>
  );
}