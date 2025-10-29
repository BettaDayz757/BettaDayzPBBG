import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Server-side Supabase client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types for BettaDayz PBBG
export interface Player {
  id: string
  user_id: string
  username: string
  email: string
  level: number
  experience: number
  coins: number
  premium_currency: number
  energy: number
  max_energy: number
  health: number
  max_health: number
  created_at: string
  updated_at: string
  last_login: string
  is_active: boolean
}

export interface GameSession {
  id: string
  player_id: string
  session_token: string
  domain: 'shop' | 'store'
  ip_address?: string
  user_agent?: string
  started_at: string
  ended_at?: string
  is_active: boolean
}

export interface PlayerInventory {
  id: string
  player_id: string
  item_type: string
  item_id: string
  quantity: number
  acquired_at: string
}

export interface GameActivity {
  id: string
  player_id: string
  activity_type: string
  activity_data?: any
  domain: 'shop' | 'store'
  experience_gained: number
  coins_gained: number
  created_at: string
}

// Helper functions for common operations
export const gameOperations = {
  // Get player by user ID
  async getPlayer(userId: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching player:', error)
      return null
    }
    return data
  },

  // Create new player
  async createPlayer(userData: {
    user_id: string
    username: string
    email: string
  }): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .insert([{
        user_id: userData.user_id,
        username: userData.username,
        email: userData.email,
        level: 1,
        experience: 0,
        coins: 1000,
        energy: 100,
        health: 100
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating player:', error)
      return null
    }
    return data
  },

  // Update player stats
  async updatePlayer(playerId: string, updates: Partial<Player>): Promise<boolean> {
    const { error } = await supabase
      .from('players')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', playerId)

    if (error) {
      console.error('Error updating player:', error)
      return false
    }
    return true
  },

  // Add experience to player
  async addExperience(playerId: string, amount: number): Promise<any> {
    const { data, error } = await supabaseAdmin
      .rpc('add_experience', {
        player_uuid: playerId,
        exp_amount: amount
      })

    if (error) {
      console.error('Error adding experience:', error)
      return null
    }
    return data
  },

  // Consume player energy
  async consumeEnergy(playerId: string, amount: number): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .rpc('consume_energy', {
        player_uuid: playerId,
        energy_cost: amount
      })

    if (error) {
      console.error('Error consuming energy:', error)
      return false
    }
    return data
  },

  // Log game activity
  async logActivity(activity: {
    player_id: string
    activity_type: string
    activity_data?: any
    domain: 'shop' | 'store'
    experience_gained?: number
    coins_gained?: number
  }): Promise<boolean> {
    const { error } = await supabase
      .from('game_activities')
      .insert([{
        player_id: activity.player_id,
        activity_type: activity.activity_type,
        activity_data: activity.activity_data || {},
        domain: activity.domain,
        experience_gained: activity.experience_gained || 0,
        coins_gained: activity.coins_gained || 0
      }])

    if (error) {
      console.error('Error logging activity:', error)
      return false
    }
    return true
  },

  // Get player inventory
  async getInventory(playerId: string): Promise<PlayerInventory[]> {
    const { data, error } = await supabase
      .from('player_inventory')
      .select('*')
      .eq('player_id', playerId)
      .order('acquired_at', { ascending: false })

    if (error) {
      console.error('Error fetching inventory:', error)
      return []
    }
    return data || []
  },

  // Add item to inventory
  async addInventoryItem(item: {
    player_id: string
    item_type: string
    item_id: string
    quantity?: number
  }): Promise<boolean> {
    const { error } = await supabase
      .from('player_inventory')
      .upsert([{
        player_id: item.player_id,
        item_type: item.item_type,
        item_id: item.item_id,
        quantity: item.quantity || 1
      }], {
        onConflict: 'player_id,item_type,item_id'
      })

    if (error) {
      console.error('Error adding inventory item:', error)
      return false
    }
    return true
  }
}

// JWT Secret for server-side operations
export const JWT_SECRET = process.env.JWT_SECRET || '9=N6H//qQ]?g+BDV'