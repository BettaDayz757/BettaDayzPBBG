import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, useAnimations, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Character3DProps {
  position?: [number, number, number];
  isPlayer?: boolean;
  characterData?: {
    name: string;
    level: number;
    health: number;
    outfit: string;
    skinTone: string;
    hairStyle: string;
    accessories: string[];
  };
  onInteract?: () => void;
}

export default function Character3D({ 
  position = [0, 0, 0], 
  isPlayer = false, 
  characterData,
  onInteract 
}: Character3DProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState(0);
  
  // Character customization state
  const [customization, setCustomization] = useState({
    skinTone: characterData?.skinTone || '#8B4513',
    hairColor: '#2C1810',
    outfitColor: '#1E40AF',
    accessoryColor: '#FFD700'
  });

  // Simple character geometry (we'll use basic shapes for now)
  const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 4, 8);
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const armGeometry = new THREE.CapsuleGeometry(0.1, 0.6, 4, 8);
  const legGeometry = new THREE.CapsuleGeometry(0.12, 0.8, 4, 8);

  // Materials
  const skinMaterial = new THREE.MeshLambertMaterial({ color: customization.skinTone });
  const outfitMaterial = new THREE.MeshLambertMaterial({ color: customization.outfitColor });
  const hairMaterial = new THREE.MeshLambertMaterial({ color: customization.hairColor });

  // Animation state
  const [animationState, setAnimationState] = useState<'idle' | 'walking' | 'running' | 'jumping'>('idle');

  useFrame((state, delta) => {
    if (!group.current) return;

    // Simple walking animation
    if (isWalking) {
      const time = state.clock.elapsedTime;
      
      // Bob up and down
      group.current.position.y = position[1] + Math.sin(time * 8) * 0.05;
      
      // Rotate arms and legs
      const leftArm = group.current.children.find(child => child.userData.name === 'leftArm');
      const rightArm = group.current.children.find(child => child.userData.name === 'rightArm');
      const leftLeg = group.current.children.find(child => child.userData.name === 'leftLeg');
      const rightLeg = group.current.children.find(child => child.userData.name === 'rightLeg');

      if (leftArm && rightArm && leftLeg && rightLeg) {
        leftArm.rotation.x = Math.sin(time * 8) * 0.5;
        rightArm.rotation.x = -Math.sin(time * 8) * 0.5;
        leftLeg.rotation.x = -Math.sin(time * 8) * 0.3;
        rightLeg.rotation.x = Math.sin(time * 8) * 0.3;
      }
    }

    // Player movement controls
    if (isPlayer) {
      // This would be connected to input system
      // For now, just idle animation
      const time = state.clock.elapsedTime;
      group.current.rotation.y += Math.sin(time * 0.5) * 0.01;
    }
  });

  // Handle keyboard input for player character
  useEffect(() => {
    if (!isPlayer) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setIsWalking(true);
          setDirection(0);
          break;
        case 's':
        case 'arrowdown':
          setIsWalking(true);
          setDirection(Math.PI);
          break;
        case 'a':
        case 'arrowleft':
          setIsWalking(true);
          setDirection(Math.PI / 2);
          break;
        case 'd':
        case 'arrowright':
          setIsWalking(true);
          setDirection(-Math.PI / 2);
          break;
        case ' ':
          setAnimationState('jumping');
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) {
        setIsWalking(false);
        setAnimationState('idle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlayer]);

  return (
    <group 
      ref={group} 
      position={position}
      rotation={[0, direction, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onInteract}
    >
      {/* Body */}
      <mesh position={[0, 0.6, 0]} material={outfitMaterial} geometry={bodyGeometry} />
      
      {/* Head */}
      <mesh position={[0, 1.5, 0]} material={skinMaterial} geometry={headGeometry} />
      
      {/* Hair */}
      <mesh position={[0, 1.7, 0]} material={hairMaterial}>
        <sphereGeometry args={[0.28, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
      </mesh>
      
      {/* Arms */}
      <mesh 
        position={[-0.4, 0.8, 0]} 
        rotation={[0, 0, 0.2]} 
        material={skinMaterial} 
        geometry={armGeometry}
        userData={{ name: 'leftArm' }}
      />
      <mesh 
        position={[0.4, 0.8, 0]} 
        rotation={[0, 0, -0.2]} 
        material={skinMaterial} 
        geometry={armGeometry}
        userData={{ name: 'rightArm' }}
      />
      
      {/* Legs */}
      <mesh 
        position={[-0.15, -0.2, 0]} 
        material={outfitMaterial} 
        geometry={legGeometry}
        userData={{ name: 'leftLeg' }}
      />
      <mesh 
        position={[0.15, -0.2, 0]} 
        material={outfitMaterial} 
        geometry={legGeometry}
        userData={{ name: 'rightLeg' }}
      />

      {/* Character nameplate for NPCs */}
      {!isPlayer && characterData && (
        <Html position={[0, 2.2, 0]} center>
          <div className={`bg-black/80 text-white px-2 py-1 rounded text-xs transition-opacity ${
            hovered ? 'opacity-100' : 'opacity-70'
          }`}>
            <div className="font-bold">{characterData.name}</div>
            <div className="text-green-400">Level {characterData.level}</div>
            <div className="w-16 bg-gray-600 rounded-full h-1 mt-1">
              <div 
                className="bg-red-500 h-1 rounded-full transition-all"
                style={{ width: `${characterData.health}%` }}
              />
            </div>
          </div>
        </Html>
      )}

      {/* Player status indicator */}
      {isPlayer && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-xs font-bold">
            👤 YOU
          </div>
        </Html>
      )}

      {/* Interaction indicator */}
      {hovered && !isPlayer && (
        <Html position={[0, -1.2, 0]} center>
          <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold animate-bounce">
            Press E to interact
          </div>
        </Html>
      )}

      {/* Shadow */}
      <mesh position={[0, -0.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshBasicMaterial color="black" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

// Character Customization Component
export function CharacterCustomizer({ 
  onCustomizationChange 
}: { 
  onCustomizationChange: (customization: {
    skinTone: string;
    hairColor: string;
    outfitColor: string;
    accessoryColor: string;
  }) => void 
}) {
  const [customization, setCustomization] = useState({
    skinTone: '#8B4513',
    hairColor: '#2C1810',
    outfitColor: '#1E40AF',
    accessoryColor: '#FFD700'
  });

  const skinTones = [
    '#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#5C4033'
  ];

  const hairColors = [
    '#2C1810', '#8B4513', '#D2691E', '#FFD700', '#FF6347', '#9400D3'
  ];

  const outfitColors = [
    '#1E40AF', '#DC2626', '#059669', '#7C2D12', '#4C1D95', '#BE185D'
  ];

  const handleChange = (category: string, value: string) => {
    const newCustomization = { ...customization, [category]: value };
    setCustomization(newCustomization);
    onCustomizationChange(newCustomization);
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm p-4 rounded-lg border border-white/20">
      <h3 className="text-white font-bold mb-4">Character Customization</h3>
      
      {/* Skin Tone */}
      <div className="mb-4">
        <label className="text-white text-sm mb-2 block">Skin Tone</label>
        <div className="flex space-x-2">
          {skinTones.map((color) => (
            <button
              key={color}
              onClick={() => handleChange('skinTone', color)}
              className={`w-8 h-8 rounded-full border-2 ${
                customization.skinTone === color ? 'border-white' : 'border-gray-500'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div className="mb-4">
        <label className="text-white text-sm mb-2 block">Hair Color</label>
        <div className="flex space-x-2">
          {hairColors.map((color) => (
            <button
              key={color}
              onClick={() => handleChange('hairColor', color)}
              className={`w-8 h-8 rounded-full border-2 ${
                customization.hairColor === color ? 'border-white' : 'border-gray-500'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Outfit Color */}
      <div className="mb-4">
        <label className="text-white text-sm mb-2 block">Outfit Color</label>
        <div className="flex space-x-2">
          {outfitColors.map((color) => (
            <button
              key={color}
              onClick={() => handleChange('outfitColor', color)}
              className={`w-8 h-8 rounded-full border-2 ${
                customization.outfitColor === color ? 'border-white' : 'border-gray-500'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}