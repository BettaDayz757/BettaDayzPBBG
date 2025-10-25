import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky, useGLTF } from '@react-three/drei'
import { Physics, useBox, useRaycastVehicle } from '@react-three/cannon'

// Simple keyboard helper
function useKeyboard() {
  const keys = useRef({})
  useEffect(() => {
    const down = e => (keys.current[e.code] = true)
    const up = e => (keys.current[e.code] = false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])
  return keys
}

function Chassis({ position = [0, 1, 0], args = [2, 0.6, 4] }) {
  const ref = useRef()
  useBox(() => ({ mass: 150, args, position, ref }))
  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#222" />
    </mesh>
  )
}

function VehicleController() {
  const keys = useKeyboard()
  // Very small demo: apply forces to chassis via useFrame
  // This demo does not implement full vehicle wheel suspension/drive; use as a starting point.
  const chassisRef = useRef()
  useFrame(() => {
    const k = keys.current
    if (!chassisRef.current) return
    // read transform and apply simple velocity changes
    if (k['KeyW']) chassisRef.current.position.z -= 0.2
    if (k['KeyS']) chassisRef.current.position.z += 0.12
    if (k['KeyA']) chassisRef.current.rotation.y += 0.03
    if (k['KeyD']) chassisRef.current.rotation.y -= 0.03
  })
  return <mesh ref={chassisRef} />
}

export default function VehicleSimulation() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Canvas shadows camera={{ position: [0, 6, 12], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight castShadow position={[10, 10, 5]} intensity={1} />
        <Sky sunPosition={[100, 20, 100]} />
        <Physics broadphase="SAP">
          <Chassis />
          {/* placeholder ground */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}> 
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="#6b8f8f" />
          </mesh>
        </Physics>
        <OrbitControls />
        <VehicleController />
      </Canvas>
      <div style={{ padding: 8 }}>
        <small>Controls: W / A / S / D to drive (simple demo). Replace models with glTF cars and add full vehicle physics via <code>@react-three/cannon</code>.</small>
      </div>
    </div>
  )
}
