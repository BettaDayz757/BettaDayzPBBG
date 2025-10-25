import React, { useState } from 'react'
import items from '../data/store-items.json'

export default function InAppStore() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  async function purchase(itemId, method) {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, method })
      })
      const data = await res.json()
      if (res.ok) setStatus({ ok: true, msg: data.message || 'Purchase completed', data })
      else setStatus({ ok: false, msg: data.message || 'Purchase failed', data })
    } catch (err) {
      setStatus({ ok: false, msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>In-App Store</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map(it => (
          <div key={it.id} style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
            <h3>{it.title}</h3>
            <p>{it.description}</p>
            <p>
              Price: ${it.price_usd} • {it.price_btc} BTC
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button disabled={loading} onClick={() => purchase(it.id, 'card')}>Pay with Card</button>
              <button disabled={loading} onClick={() => purchase(it.id, 'cashapp')}>Cash App</button>
              <button disabled={loading} onClick={() => purchase(it.id, 'bitcoin')}>Pay in BTC</button>
            </div>
          </div>
        ))}
      </div>

      {loading && <p>Processing...</p>}
      {status && (
        <div style={{ marginTop: 12, padding: 8, borderRadius: 6, background: status.ok ? '#e6ffed' : '#ffe6e6' }}>
          <strong>{status.ok ? 'Success' : 'Error'}</strong>
          <div>{status.msg}</div>
          {status.data && status.data.tx && <div>Transaction: {status.data.tx}</div>}
        </div>
      )}
    </div>
  )
}
