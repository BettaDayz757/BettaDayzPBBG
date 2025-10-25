import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function CityBlock({ x, z }) {
  const colors = ['#c4c4c4', '#b0b0b0', '#909090', '#d0c090']
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[6, 1, 6]} />
        <meshStandardMaterial color={colors[Math.abs(x + z) % colors.length]} />
      </mesh>
    </group>
  )
}

export default function OpenWorldMap({ size = 5 }) {
  const blocks = []
  const range = size
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      blocks.push([i * 8, j * 8])
    }
  }

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <Canvas camera={{ position: [0, 30, 60], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[40, 100, 20]} intensity={1} />
        {blocks.map((b, idx) => (
          <CityBlock key={idx} x={b[0]} z={b[1]} />
        ))}
        {/* Simple ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2000, 2000]} />
          <meshStandardMaterial color="#2b2b2b" />
        </mesh>
        <OrbitControls />
      </Canvas>
      <div style={{ padding: 8 }}>
        <small>Open-world map demo: low-poly blocks as placeholders. Replace with real city tiles / streaming assets for production.</small>
      </div>
    </div>
  )
}
