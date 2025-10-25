import React from 'react'
import { Link } from '@remix-run/react'
import OpenWorldMap from '~/components/OpenWorldMap'
import VehicleSimulation from '~/components/VehicleSimulation'
import CharacterCustomization3D from '~/components/CharacterCustomization3D'

export default function PVE() {
  return (
    <div style={{ padding: 12 }}>
      <h1>PvE Open World (Prototype)</h1>
      <p>
        This page brings the open-world map, driving demo and character customization together. This is a prototyping
        environment — replace placeholder assets with high-quality GLB models and streaming data for production.
      </p>

      <section style={{ marginTop: 16 }}>
        <h2>World Map</h2>
        <OpenWorldMap size={5} />
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>Vehicle Demo</h2>
        <VehicleSimulation />
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>Character Customization 3D</h2>
        <CharacterCustomization3D />
      </section>

      <p style={{ marginTop: 20 }}>
        Want upgrades and skins? Visit the <Link to="/store">store</Link>.
      </p>
    </div>
  )
}
