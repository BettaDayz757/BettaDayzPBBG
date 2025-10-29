// Enhanced Supabase Client with Helper Functions
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const createClient = createSupabaseClient;

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, any>;
        Returns: any;
      };
    };
  };
}

export class SupabaseHelper {
  public client: SupabaseClient;

  constructor() {
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  // User Profile Management
  async getUserProfile(userId: string): Promise<{
    success: boolean;
    profile?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await this.client
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, profile: data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch user profile' };
    }
  }

  async updateUserProfile(userId: string, updates: Record<string, any>): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await this.client
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update user profile' };
    }
  }

  async createUserProfile(profileData: any): Promise<{
    success: boolean;
    profile?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await this.client
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, profile: data };
    } catch (error) {
      return { success: false, error: 'Failed to create user profile' };
    }
  }

  // BettaBuckZ Management
  async getBettaBuckZBalance(userId: string): Promise<number> {
    try {
      const { data } = await this.client
        .from('user_profiles')
        .select('betta_buckz')
        .eq('id', userId)
        .single();

      return data?.betta_buckz || 0;
    } catch (error) {
      console.error('Error getting BettaBuckZ balance:', error);
      return 0;
    }
  }

  async processBettaBuckZTransaction(
    userId: string,
    transactionType: string,
    amount: number,
    source: string,
    description: string,
    relatedId: string | null
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.client.rpc('process_bettabuckz_transaction', {
        p_user_id: userId,
        p_transaction_type: transactionType,
        p_amount: amount,
        p_source: source,
        p_description: description,
        p_related_id: relatedId
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Transaction processing failed' };
    }
  }

  // Guild Management
  async createGuild(guildData: any): Promise<{
    success: boolean;
    guild?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await this.client
        .from('guilds')
        .insert(guildData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, guild: data };
    } catch (error) {
      return { success: false, error: 'Failed to create guild' };
    }
  }

  async joinGuild(userId: string, guildId: string, role: string = 'member'): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await this.client
        .from('guild_members')
        .insert({
          guild_id: guildId,
          user_id: userId,
          role,
          joined_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to join guild' };
    }
  }

  async updateGuild(guildId: string, updates: Record<string, any>): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await this.client
        .from('guilds')
        .update(updates)
        .eq('id', guildId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update guild' };
    }
  }

  async leaveGuild(userId: string, guildId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await this.client
        .from('guild_members')
        .delete()
        .eq('guild_id', guildId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to leave guild' };
    }
  }

  // Tournament Management
  async createTournament(tournamentData: any): Promise<{
    success: boolean;
    tournament?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await this.client
        .from('tournaments')
        .insert(tournamentData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, tournament: data };
    } catch (error) {
      return { success: false, error: 'Failed to create tournament' };
    }
  }

  async joinTournament(userId: string, tournamentId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await this.client
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          user_id: userId,
          joined_at: new Date().toISOString(),
          score: 0
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to join tournament' };
    }
  }

  // Achievement Management
  async getUserAchievements(userId: string): Promise<{
    success: boolean;
    achievements?: any[];
    error?: string;
  }> {
    try {
      const { data, error } = await this.client
        .from('user_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, achievements: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch achievements' };
    }
  }

  async getAchievementById(achievementId: string): Promise<any> {
    try {
      const { data } = await this.client
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single();

      return data;
    } catch (error) {
      console.error('Error getting achievement:', error);
      return null;
    }
  }

  async awardAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.client.rpc('award_achievement_progress', {
        p_user_id: userId,
        p_achievement_id: achievementId,
        p_progress: progress
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to award achievement progress' };
    }
  }

  // Store Management
  async getStoreItems(categoryId?: string): Promise<{
    success: boolean;
    items?: any[];
    error?: string;
  }> {
    try {
      let query = this.client
        .from('store_items')
        .select('*')
        .eq('active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, items: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch store items' };
    }
  }

  async getUserInventory(userId: string): Promise<{
    success: boolean;
    inventory?: any[];
    error?: string;
  }> {
    try {
      const { data, error } = await this.client
        .from('user_inventory')
        .select(`
          *,
          store_items (*)
        `)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, inventory: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch inventory' };
    }
  }

  // Purchase Management
  async createPurchase(purchaseData: any): Promise<{
    success: boolean;
    purchase?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await this.client
        .from('purchases')
        .insert(purchaseData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, purchase: data };
    } catch (error) {
      return { success: false, error: 'Failed to create purchase' };
    }
  }

  async updatePurchaseStatus(purchaseId: string, status: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await this.client
        .from('purchases')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', purchaseId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update purchase status' };
    }
  }

  // Subscription Management
  async createSubscription(subscriptionData: any): Promise<{
    success: boolean;
    subscription?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await this.client
        .from('user_subscriptions')
        .insert(subscriptionData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, subscription: data };
    } catch (error) {
      return { success: false, error: 'Failed to create subscription' };
    }
  }

  // Crypto Payment Management
  async createCryptoPayment(cryptoData: any): Promise<{
    success: boolean;
    payment?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await this.client
        .from('crypto_payments')
        .insert(cryptoData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, payment: data };
    } catch (error) {
      return { success: false, error: 'Failed to create crypto payment' };
    }
  }

  async updateCryptoPaymentStatus(
    purchaseId: string,
    status: string,
    confirmations?: number,
    transactionHash?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (confirmations !== undefined) {
        updateData.confirmations = confirmations;
      }

      if (transactionHash) {
        updateData.transaction_hash = transactionHash;
      }

      const { error } = await this.client
        .from('crypto_payments')
        .update(updateData)
        .eq('purchase_id', purchaseId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update crypto payment status' };
    }
  }
}

export const supabaseHelper = new SupabaseHelper();