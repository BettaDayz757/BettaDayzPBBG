'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Battle {
  id: string
  player1: string
  player2: string
  winner: string
  created_at: string
}

export default function PvP() {
  const [battles, setBattles] = useState<Battle[]>([])
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')

  const supabase = createClient()

  useEffect(() => {
    // Fetch initial battles
    const fetchBattles = async () => {
      const { data, error } = await supabase
        .from('pvp_battles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) console.error('Error fetching battles:', error)
      else setBattles(data || [])
    }

    fetchBattles()

    // Subscribe to new battles
    const channel = supabase
      .channel('pvp_battles')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'pvp_battles'
      }, (payload) => {
        setBattles(prev => [payload.new as Battle, ...prev.slice(0, 9)])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const startBattle = async () => {
    if (!player1.trim() || !player2.trim()) return

    // Simulate battle result
    const winner = Math.random() > 0.5 ? player1 : player2

    const { error } = await supabase
      .from('pvp_battles')
      .insert([{ player1, player2, winner }])

    if (error) console.error('Error starting battle:', error)
    else {
      setPlayer1('')
      setPlayer2('')
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-red-600 mb-2">Recent Battles</h2>
      <div className="bg-gray-100 rounded-lg p-4 h-48 overflow-y-auto mb-2">
        {battles.map((battle) => (
          <div key={battle.id} className="mb-1">
            <strong>{battle.player1}</strong> vs <strong>{battle.player2}</strong> - Winner: <strong>{battle.winner}</strong>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          placeholder="Player 1"
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
        <input
          type="text"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          placeholder="Player 2"
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
        <button
          onClick={startBattle}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Battle!
        </button>
      </div>
    </div>
  )
}