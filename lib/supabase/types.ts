// Supabase Database Types
// Auto-generated TypeScript types for the database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          category: 'business' | 'social' | 'gaming' | 'collection' | 'progression' | 'special'
          type: 'progress' | 'milestone' | 'secret' | 'timed' | 'social'
          difficulty: 'easy' | 'medium' | 'hard' | 'legendary'
          requirements: Json
          rewards: Json
          is_hidden: boolean
          is_repeatable: boolean
          points: number
          rarity: 'common' | 'rare' | 'epic' | 'legendary'
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: 'business' | 'social' | 'gaming' | 'collection' | 'progression' | 'special'
          type: 'progress' | 'milestone' | 'secret' | 'timed' | 'social'
          difficulty: 'easy' | 'medium' | 'hard' | 'legendary'
          requirements: Json
          rewards: Json
          is_hidden?: boolean
          is_repeatable?: boolean
          points?: number
          rarity?: 'common' | 'rare' | 'epic' | 'legendary'
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: 'business' | 'social' | 'gaming' | 'collection' | 'progression' | 'special'
          type?: 'progress' | 'milestone' | 'secret' | 'timed' | 'social'
          difficulty?: 'easy' | 'medium' | 'hard' | 'legendary'
          requirements?: Json
          rewards?: Json
          is_hidden?: boolean
          is_repeatable?: boolean
          points?: number
          rarity?: 'common' | 'rare' | 'epic' | 'legendary'
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      auction_bids: {
        Row: {
          id: string
          auction_id: string
          bidder_id: string
          amount: number
          is_autobid: boolean
          created_at: string
        }
        Insert: {
          id?: string
          auction_id: string
          bidder_id: string
          amount: number
          is_autobid?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          auction_id?: string
          bidder_id?: string
          amount?: number
          is_autobid?: boolean
          created_at?: string
        }
      }
      auctions: {
        Row: {
          id: string
          seller_id: string
          item_id: string
          quantity: number
          starting_bid: number
          current_bid: number | null
          buyout_price: number | null
          bid_increment: number
          start_time: string
          end_time: string
          status: 'active' | 'completed' | 'cancelled' | 'expired'
          winner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          item_id: string
          quantity?: number
          starting_bid: number
          current_bid?: number | null
          buyout_price?: number | null
          bid_increment?: number
          start_time?: string
          end_time: string
          status?: 'active' | 'completed' | 'cancelled' | 'expired'
          winner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          item_id?: string
          quantity?: number
          starting_bid?: number
          current_bid?: number | null
          buyout_price?: number | null
          bid_increment?: number
          start_time?: string
          end_time?: string
          status?: 'active' | 'completed' | 'cancelled' | 'expired'
          winner_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bettabuckz_transactions: {
        Row: {
          id: string
          user_id: string
          wallet_id: string
          type: 'earn' | 'spend' | 'transfer_in' | 'transfer_out' | 'purchase' | 'refund'
          amount: number
          source: string
          description: string | null
          reference_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wallet_id: string
          type: 'earn' | 'spend' | 'transfer_in' | 'transfer_out' | 'purchase' | 'refund'
          amount: number
          source: string
          description?: string | null
          reference_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wallet_id?: string
          type?: 'earn' | 'spend' | 'transfer_in' | 'transfer_out' | 'purchase' | 'refund'
          amount?: number
          source?: string
          description?: string | null
          reference_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      bettabuckz_wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
          total_earned: number
          total_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
          total_earned?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
          total_earned?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      btc_transfer_fees: {
        Row: {
          id: string
          user_id: string
          amount_btc: number
          fee_percentage: number
          fee_btc: number
          fee_usd_cents: number | null
          destination_address: string
          transaction_hash: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount_btc: number
          fee_percentage?: number
          fee_btc: number
          fee_usd_cents?: number | null
          destination_address: string
          transaction_hash?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount_btc?: number
          fee_percentage?: number
          fee_btc?: number
          fee_usd_cents?: number | null
          destination_address?: string
          transaction_hash?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      cross_domain_integrations: {
        Row: {
          id: string
          user_id: string
          shop_profile: Json
          store_profile: Json
          sync_settings: Json
          linked_at: string
          last_sync_at: string
        }
        Insert: {
          id?: string
          user_id: string
          shop_profile?: Json
          store_profile?: Json
          sync_settings?: Json
          linked_at?: string
          last_sync_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          shop_profile?: Json
          store_profile?: Json
          sync_settings?: Json
          linked_at?: string
          last_sync_at?: string
        }
      }
      crypto_payments: {
        Row: {
          id: string
          user_id: string
          purchase_id: string
          crypto_type: 'bitcoin' | 'cashapp'
          wallet_address: string | null
          amount_crypto: number | null
          amount_usd_cents: number | null
          exchange_rate: number | null
          transaction_hash: string | null
          confirmation_count: number
          required_confirmations: number
          status: 'pending' | 'confirming' | 'confirmed' | 'failed'
          expires_at: string | null
          confirmed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          purchase_id: string
          crypto_type: 'bitcoin' | 'cashapp'
          wallet_address?: string | null
          amount_crypto?: number | null
          amount_usd_cents?: number | null
          exchange_rate?: number | null
          transaction_hash?: string | null
          confirmation_count?: number
          required_confirmations?: number
          status?: 'pending' | 'confirming' | 'confirmed' | 'failed'
          expires_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          purchase_id?: string
          crypto_type?: 'bitcoin' | 'cashapp'
          wallet_address?: string | null
          amount_crypto?: number | null
          amount_usd_cents?: number | null
          exchange_rate?: number | null
          transaction_hash?: string | null
          confirmation_count?: number
          required_confirmations?: number
          status?: 'pending' | 'confirming' | 'confirmed' | 'failed'
          expires_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      guild_members: {
        Row: {
          id: string
          user_id: string
          guild_id: string
          role: 'leader' | 'officer' | 'member' | 'recruit'
          permissions: string[]
          joined_at: string
          contribution_bettabuckz: number
          contribution_game_money: number
          contribution_experience: number
        }
        Insert: {
          id?: string
          user_id: string
          guild_id: string
          role?: 'leader' | 'officer' | 'member' | 'recruit'
          permissions?: string[]
          joined_at?: string
          contribution_bettabuckz?: number
          contribution_game_money?: number
          contribution_experience?: number
        }
        Update: {
          id?: string
          user_id?: string
          guild_id?: string
          role?: 'leader' | 'officer' | 'member' | 'recruit'
          permissions?: string[]
          joined_at?: string
          contribution_bettabuckz?: number
          contribution_game_money?: number
          contribution_experience?: number
        }
      }
      guild_perks: {
        Row: {
          id: string
          guild_id: string
          perk_type: 'experience_boost' | 'money_boost' | 'member_capacity' | 'treasury_capacity'
          name: string
          description: string | null
          level: number
          cost: number
          effect: number
          is_active: boolean
          unlocked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          guild_id: string
          perk_type: 'experience_boost' | 'money_boost' | 'member_capacity' | 'treasury_capacity'
          name: string
          description?: string | null
          level?: number
          cost: number
          effect: number
          is_active?: boolean
          unlocked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          guild_id?: string
          perk_type?: 'experience_boost' | 'money_boost' | 'member_capacity' | 'treasury_capacity'
          name?: string
          description?: string | null
          level?: number
          cost?: number
          effect?: number
          is_active?: boolean
          unlocked_at?: string | null
          created_at?: string
        }
      }
      guilds: {
        Row: {
          id: string
          name: string
          tag: string
          description: string | null
          leader_id: string | null
          level: number
          experience: number
          member_count: number
          max_members: number
          treasury_bettabuckz: number
          treasury_game_money: number
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          tag: string
          description?: string | null
          leader_id?: string | null
          level?: number
          experience?: number
          member_count?: number
          max_members?: number
          treasury_bettabuckz?: number
          treasury_game_money?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          tag?: string
          description?: string | null
          leader_id?: string | null
          level?: number
          experience?: number
          member_count?: number
          max_members?: number
          treasury_bettabuckz?: number
          treasury_game_money?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      leaderboards: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'global' | 'weekly' | 'monthly' | 'seasonal' | 'all_time'
          category: 'level' | 'money' | 'bettaBuckZ' | 'achievements' | 'social' | 'business'
          season: string | null
          entries: Json
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'global' | 'weekly' | 'monthly' | 'seasonal' | 'all_time'
          category: 'level' | 'money' | 'bettaBuckZ' | 'achievements' | 'social' | 'business'
          season?: string | null
          entries?: Json
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'global' | 'weekly' | 'monthly' | 'seasonal' | 'all_time'
          category?: 'level' | 'money' | 'bettaBuckZ' | 'achievements' | 'social' | 'business'
          season?: string | null
          entries?: Json
          last_updated?: string
          created_at?: string
        }
      }
      purchase_packages: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'one_time' | 'subscription' | 'bundle'
          category: 'currency' | 'premium' | 'boost' | 'cosmetic' | 'starter' | 'vip'
          price_usd_cents: number
          price_eur_cents: number
          value: Json
          bonus_percentage: number | null
          is_popular: boolean
          is_best_value: boolean
          is_limited_time: boolean
          expires_at: string | null
          image_url: string | null
          tags: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'one_time' | 'subscription' | 'bundle'
          category: 'currency' | 'premium' | 'boost' | 'cosmetic' | 'starter' | 'vip'
          price_usd_cents: number
          price_eur_cents: number
          value: Json
          bonus_percentage?: number | null
          is_popular?: boolean
          is_best_value?: boolean
          is_limited_time?: boolean
          expires_at?: string | null
          image_url?: string | null
          tags?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'one_time' | 'subscription' | 'bundle'
          category?: 'currency' | 'premium' | 'boost' | 'cosmetic' | 'starter' | 'vip'
          price_usd_cents?: number
          price_eur_cents?: number
          value?: Json
          bonus_percentage?: number | null
          is_popular?: boolean
          is_best_value?: boolean
          is_limited_time?: boolean
          expires_at?: string | null
          image_url?: string | null
          tags?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          package_id: string | null
          subscription_id: string | null
          type: 'package' | 'subscription' | 'renewal'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          amount_cents: number
          currency: string
          payment_method: string
          payment_provider: string
          external_payment_id: string | null
          items: Json
          metadata: Json
          purchased_at: string
          processed_at: string | null
          refunded_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          package_id?: string | null
          subscription_id?: string | null
          type: 'package' | 'subscription' | 'renewal'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          amount_cents: number
          currency?: string
          payment_method: string
          payment_provider?: string
          external_payment_id?: string | null
          items?: Json
          metadata?: Json
          purchased_at?: string
          processed_at?: string | null
          refunded_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          package_id?: string | null
          subscription_id?: string | null
          type?: 'package' | 'subscription' | 'renewal'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          amount_cents?: number
          currency?: string
          payment_method?: string
          payment_provider?: string
          external_payment_id?: string | null
          items?: Json
          metadata?: Json
          purchased_at?: string
          processed_at?: string | null
          refunded_at?: string | null
          created_at?: string
        }
      }
      seasonal_events: {
        Row: {
          id: string
          name: string
          description: string | null
          theme: 'halloween' | 'christmas' | 'summer' | 'valentine' | 'easter' | 'new_year' | 'custom'
          type: 'limited_time' | 'seasonal' | 'holiday' | 'anniversary'
          status: 'upcoming' | 'active' | 'ended'
          start_date: string
          end_date: string
          activities: Json
          rewards: Json
          special_shop: Json
          leaderboard: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          theme: 'halloween' | 'christmas' | 'summer' | 'valentine' | 'easter' | 'new_year' | 'custom'
          type: 'limited_time' | 'seasonal' | 'holiday' | 'anniversary'
          status?: 'upcoming' | 'active' | 'ended'
          start_date: string
          end_date: string
          activities?: Json
          rewards?: Json
          special_shop?: Json
          leaderboard?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          theme?: 'halloween' | 'christmas' | 'summer' | 'valentine' | 'easter' | 'new_year' | 'custom'
          type?: 'limited_time' | 'seasonal' | 'holiday' | 'anniversary'
          status?: 'upcoming' | 'active' | 'ended'
          start_date?: string
          end_date?: string
          activities?: Json
          rewards?: Json
          special_shop?: Json
          leaderboard?: Json
          created_at?: string
          updated_at?: string
        }
      }
      social_activities: {
        Row: {
          id: string
          user_id: string
          type: 'achievement' | 'level_up' | 'purchase' | 'guild_join' | 'tournament_win'
          description: string
          metadata: Json
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'achievement' | 'level_up' | 'purchase' | 'guild_join' | 'tournament_win'
          description: string
          metadata?: Json
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'achievement' | 'level_up' | 'purchase' | 'guild_join' | 'tournament_win'
          description?: string
          metadata?: Json
          is_public?: boolean
          created_at?: string
        }
      }
      social_connections: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted' | 'blocked'
          initiated_by: string
          created_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: 'pending' | 'accepted' | 'blocked'
          initiated_by: string
          created_at?: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'pending' | 'accepted' | 'blocked'
          initiated_by?: string
          created_at?: string
          accepted_at?: string | null
        }
      }
      store_items: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          type: 'boost' | 'cosmetic' | 'currency' | 'premium' | 'equipment'
          rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
          price_bettabuckz: number | null
          price_game_money: number | null
          price_usd_cents: number | null
          effects: Json
          is_tradeable: boolean
          is_limited: boolean
          stock: number | null
          image_url: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          type: 'boost' | 'cosmetic' | 'currency' | 'premium' | 'equipment'
          rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
          price_bettabuckz?: number | null
          price_game_money?: number | null
          price_usd_cents?: number | null
          effects?: Json
          is_tradeable?: boolean
          is_limited?: boolean
          stock?: number | null
          image_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          type?: 'boost' | 'cosmetic' | 'currency' | 'premium' | 'equipment'
          rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
          price_bettabuckz?: number | null
          price_game_money?: number | null
          price_usd_cents?: number | null
          effects?: Json
          is_tradeable?: boolean
          is_limited?: boolean
          stock?: number | null
          image_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          tier: 'basic' | 'premium' | 'ultimate'
          price_monthly_cents: number
          price_quarterly_cents: number
          price_yearly_cents: number
          benefits: Json
          savings: Json
          is_popular: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          tier: 'basic' | 'premium' | 'ultimate'
          price_monthly_cents: number
          price_quarterly_cents: number
          price_yearly_cents: number
          benefits?: Json
          savings?: Json
          is_popular?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          tier?: 'basic' | 'premium' | 'ultimate'
          price_monthly_cents?: number
          price_quarterly_cents?: number
          price_yearly_cents?: number
          benefits?: Json
          savings?: Json
          is_popular?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tournament_participants: {
        Row: {
          id: string
          tournament_id: string
          user_id: string
          guild_id: string | null
          registered_at: string
          score: number
          rank: number | null
          is_disqualified: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          tournament_id: string
          user_id: string
          guild_id?: string | null
          registered_at?: string
          score?: number
          rank?: number | null
          is_disqualified?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          tournament_id?: string
          user_id?: string
          guild_id?: string | null
          registered_at?: string
          score?: number
          rank?: number | null
          is_disqualified?: boolean
          metadata?: Json
        }
      }
      tournaments: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'pvp' | 'business' | 'racing' | 'achievement' | 'guild_war'
          status: 'upcoming' | 'registration' | 'active' | 'completed' | 'cancelled'
          registration_start: string
          registration_end: string
          start_date: string
          end_date: string
          requirements: Json
          prizes: Json
          rules: string[]
          max_participants: number | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'pvp' | 'business' | 'racing' | 'achievement' | 'guild_war'
          status?: 'upcoming' | 'registration' | 'active' | 'completed' | 'cancelled'
          registration_start: string
          registration_end: string
          start_date: string
          end_date: string
          requirements?: Json
          prizes?: Json
          rules?: string[]
          max_participants?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'pvp' | 'business' | 'racing' | 'achievement' | 'guild_war'
          status?: 'upcoming' | 'registration' | 'active' | 'completed' | 'cancelled'
          registration_start?: string
          registration_end?: string
          start_date?: string
          end_date?: string
          requirements?: Json
          prizes?: Json
          rules?: string[]
          max_participants?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trade_offers: {
        Row: {
          id: string
          initiator_id: string
          target_id: string
          initiator_items: Json
          initiator_currency: Json
          target_items: Json
          target_currency: Json
          status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired'
          message: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          initiator_id: string
          target_id: string
          initiator_items?: Json
          initiator_currency?: Json
          target_items?: Json
          target_currency?: Json
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired'
          message?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          initiator_id?: string
          target_id?: string
          initiator_items?: Json
          initiator_currency?: Json
          target_items?: Json
          target_currency?: Json
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired'
          message?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          progress: number
          is_completed: boolean
          completed_at: string | null
          is_notified: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          progress?: number
          is_completed?: boolean
          completed_at?: string | null
          is_notified?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          progress?: number
          is_completed?: boolean
          completed_at?: string | null
          is_notified?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_event_progress: {
        Row: {
          id: string
          user_id: string
          event_id: string
          activity_id: string
          progress: number
          is_completed: boolean
          completed_at: string | null
          rewards_claimed: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          activity_id: string
          progress?: number
          is_completed?: boolean
          completed_at?: string | null
          rewards_claimed?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          activity_id?: string
          progress?: number
          is_completed?: boolean
          completed_at?: string | null
          rewards_claimed?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_inventory: {
        Row: {
          id: string
          user_id: string
          item_id: string
          quantity: number
          acquired_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          quantity?: number
          acquired_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          quantity?: number
          acquired_at?: string
          metadata?: Json
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          title: string | null
          level: number
          experience: number
          total_playtime: number
          join_date: string
          last_active: string
          is_premium: boolean
          premium_expires_at: string | null
          privacy_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          title?: string | null
          level?: number
          experience?: number
          total_playtime?: number
          join_date?: string
          last_active?: string
          is_premium?: boolean
          premium_expires_at?: string | null
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          title?: string | null
          level?: number
          experience?: number
          total_playtime?: number
          join_date?: string
          last_active?: string
          is_premium?: boolean
          premium_expires_at?: string | null
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_shops: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          is_active: boolean
          commission_rate: number
          total_sales: number
          reputation_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          is_active?: boolean
          commission_rate?: number
          total_sales?: number
          reputation_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          commission_rate?: number
          total_sales?: number
          reputation_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          subscription_plan_id: string
          status: 'active' | 'cancelled' | 'expired' | 'paused'
          start_date: string
          end_date: string
          auto_renew: boolean
          external_subscription_id: string | null
          benefits: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_plan_id: string
          status?: 'active' | 'cancelled' | 'expired' | 'paused'
          start_date?: string
          end_date: string
          auto_renew?: boolean
          external_subscription_id?: string | null
          benefits?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_plan_id?: string
          status?: 'active' | 'cancelled' | 'expired' | 'paused'
          start_date?: string
          end_date?: string
          auto_renew?: boolean
          external_subscription_id?: string | null
          benefits?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_achievement_progress: {
        Args: {
          p_user_id: string
          p_achievement_id: string
          p_progress_increment?: number
        }
        Returns: boolean
      }
      process_bettabuckz_transaction: {
        Args: {
          p_user_id: string
          p_type: string
          p_amount: number
          p_source: string
          p_description?: string
          p_reference_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}