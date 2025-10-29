'use client'

import { useEffect, useState } from 'react'
import { supabase, gameOperations, type Player } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface PlayerContextType {
  user: User | null
  player: Player | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, username: string) => Promise<boolean>
  signOut: () => Promise<void>
  updatePlayerStats: (updates: Partial<Player>) => Promise<boolean>
  addExperience: (amount: number) => Promise<any>
  consumeEnergy: (amount: number) => Promise<boolean>
  logActivity: (activityType: string, data?: any, expGain?: number, coinGain?: number) => Promise<boolean>
}

// Hook for managing player state and authentication
export function usePlayer(): PlayerContextType {
  const [user, setUser] = useState<User | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Determine current domain (shop or store)
  const getCurrentDomain = (): 'shop' | 'store' => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      return hostname.includes('store') ? 'store' : 'shop'
    }
    return 'shop'
  }

  // Initialize session and player data
  useEffect(() => {
    async function initializeAuth() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (currentSession) {
          setSession(currentSession)
          setUser(currentSession.user)
          
          // Fetch or create player data
          let playerData = await gameOperations.getPlayer(currentSession.user.id)
          
          if (!playerData) {
            // Create new player if doesn't exist
            const username = currentSession.user.email?.split('@')[0] || 'Player'
            playerData = await gameOperations.createPlayer({
              user_id: currentSession.user.id,
              username,
              email: currentSession.user.email || ''
            })
          }
          
          setPlayer(playerData)
          
          // Update last login
          if (playerData) {
            await gameOperations.updatePlayer(playerData.id, {
              last_login: new Date().toISOString()
            })
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        
        if (event === 'SIGNED_IN' && currentSession) {
          // Fetch player data on sign in
          const playerData = await gameOperations.getPlayer(currentSession.user.id)
          setPlayer(playerData)
          
          if (playerData) {
            await gameOperations.updatePlayer(playerData.id, {
              last_login: new Date().toISOString()
            })
          }
        } else if (event === 'SIGNED_OUT') {
          setPlayer(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error.message)
        return false
      }

      return true
    } catch (error) {
      console.error('Sign in error:', error)
      return false
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      })

      if (error) {
        console.error('Sign up error:', error.message)
        return false
      }

      return true
    } catch (error) {
      console.error('Sign up error:', error)
      return false
    }
  }

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Update player stats
  const updatePlayerStats = async (updates: Partial<Player>): Promise<boolean> => {
    if (!player) return false

    const success = await gameOperations.updatePlayer(player.id, updates)
    
    if (success) {
      setPlayer(prev => prev ? { ...prev, ...updates } : null)
    }
    
    return success
  }

  // Add experience to player
  const addExperience = async (amount: number): Promise<any> => {
    if (!player) return null

    const result = await gameOperations.addExperience(player.id, amount)
    
    if (result) {
      // Update local player state
      const updatedPlayer = await gameOperations.getPlayer(player.user_id)
      setPlayer(updatedPlayer)
    }
    
    return result
  }

  // Consume player energy
  const consumeEnergy = async (amount: number): Promise<boolean> => {
    if (!player) return false

    const success = await gameOperations.consumeEnergy(player.id, amount)
    
    if (success) {
      // Update local energy
      setPlayer(prev => prev ? {
        ...prev,
        energy: Math.max(0, prev.energy - amount)
      } : null)
    }
    
    return success
  }

  // Log game activity
  const logActivity = async (
    activityType: string,
    data?: any,
    expGain: number = 0,
    coinGain: number = 0
  ): Promise<boolean> => {
    if (!player) return false

    const success = await gameOperations.logActivity({
      player_id: player.id,
      activity_type: activityType,
      activity_data: data,
      domain: getCurrentDomain(),
      experience_gained: expGain,
      coins_gained: coinGain
    })

    // If activity gave rewards, update player stats
    if (success && (expGain > 0 || coinGain > 0)) {
      if (expGain > 0) {
        await addExperience(expGain)
      }
      
      if (coinGain > 0) {
        await updatePlayerStats({
          coins: player.coins + coinGain
        })
      }
    }

    return success
  }

  return {
    user,
    player,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updatePlayerStats,
    addExperience,
    consumeEnergy,
    logActivity
  }
}

// Hook for real-time game updates
export function useGameUpdates(playerId?: string) {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    if (!playerId) return

    // Subscribe to real-time player updates
    const playerSubscription = supabase
      .channel('player-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `id=eq.${playerId}`
      }, (payload) => {
        console.log('Player updated:', payload)
        // Handle player updates in real-time
      })
      .subscribe()

    // Subscribe to new activities
    const activitySubscription = supabase
      .channel('activity-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_activities',
        filter: `player_id=eq.${playerId}`
      }, (payload) => {
        console.log('New activity:', payload)
        setActivities(prev => [payload.new, ...prev.slice(0, 49)]) // Keep last 50
      })
      .subscribe()

    return () => {
      playerSubscription.unsubscribe()
      activitySubscription.unsubscribe()
    }
  }, [playerId])

  return { activities }
}

// Hook for inventory management
export function useInventory(playerId?: string) {
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInventory() {
      if (!playerId) return

      try {
        const items = await gameOperations.getInventory(playerId)
        setInventory(items)
      } catch (error) {
        console.error('Error fetching inventory:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [playerId])

  const addItem = async (itemType: string, itemId: string, quantity: number = 1) => {
    if (!playerId) return false

    const success = await gameOperations.addInventoryItem({
      player_id: playerId,
      item_type: itemType,
      item_id: itemId,
      quantity
    })

    if (success) {
      // Refresh inventory
      const items = await gameOperations.getInventory(playerId)
      setInventory(items)
    }

    return success
  }

  return { inventory, loading, addItem }
}