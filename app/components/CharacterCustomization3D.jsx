import React, { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, Environment } from '@react-three/drei'

// This component demonstrates how to load a GLTF character and swap clothing materials.
// It is an extensible sample: replace the demo model URL with your own glTF/GLB file (preferably PBR material).

function CharacterModel({ url, clothingMaterial }) {
  const { scene } = useGLTF(url)
  // Walk the scene and apply clothingMaterial to meshes whose name contains "Cloth" as an example
  scene.traverse(child => {
    if (child.isMesh && /cloth|jacket|shirt|pants|hat/i.test(child.name)) {
      child.material = clothingMaterial
    }
  })
  return <primitive object={scene} scale={1.2} />
}

export default function CharacterCustomization3D() {
  const [color, setColor] = useState('#ffffff')
  const materialRef = useRef()

  const clothingMaterial = {
    // Minimal PBR-like material using standard approach — for highest realism use glTF with PBR textures (albedo, normal, roughness, metalness)
    color,
    roughness: 0.6,
    metalness: 0.1
  }

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <Canvas camera={{ position: [0, 1.6, 3], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          {/* Replace the URL below with your trained/filter-licensed character model (glTF). This demo uses a placeholder path. */}
          <CharacterModel url="/public/models/character.glb" clothingMaterial={clothingMaterial} />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} />
      </Canvas>

      <div style={{ padding: 12 }}>
        <label>
          Clothing color:{' '}
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </label>
        <p style={{ marginTop: 8 }}>
          Notes: For photorealism, use high-quality PBR textures (albedo/baseColor, normal map, roughness, metalness, ao). Use retargeted animations (GLB with skin/skeleton) and mix shape keys/morph targets for facial expressions.
        </p>
      </div>
    </div>
  )
}
