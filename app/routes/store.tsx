import React from 'react'
import InAppStore from '~/components/InAppStore'
import { Link } from '@remix-run/react'

export default function StoreRoute() {
  return (
    <div style={{ padding: 12 }}>
      <h1>Game Store</h1>
      <p>Purchase passes, skins and other cosmetics. Payments are simulated in this demo — configure a real payment provider before going live.</p>
      <InAppStore />
      <p style={{ marginTop: 16 }}>Back to <Link to="/pve">PvE</Link>.</p>
    </div>
  )
}
