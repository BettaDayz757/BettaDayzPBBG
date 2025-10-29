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

// Enhanced Supabase Helper Class
export class SupabaseHelper {
  public client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  // User Profile Management
  async getUserProfile(userId: string) {
    const { data, error } = await this.client
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error, success: !error };
  }

  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await this.client
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    return { data, error, success: !error };
  }

  // BettaBuckZ Management
  async getBettaBuckZBalance(userId: string) {
    const { data, error } = await this.client
      .from('user_profiles')
      .select('bettabuckz_balance')
      .eq('id', userId)
      .single();

    return { balance: data?.bettabuckz_balance || 0, error, success: !error };
  }

  async processBettaBuckZTransaction(
    userId: string,
    type: string,
    amount: number,
    category: string,
    description: string,
    relatedUserId?: string
  ) {
    try {
      const { data: transaction, error: transactionError } = await this.client
        .from('bettabuckz_transactions')
        .insert({
          user_id: userId,
          type,
          amount,
          category,
          description,
          related_user_id: relatedUserId,
          status: 'completed',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (transactionError) {
        throw transactionError;
      }

      return { data: transaction, error: null, success: true };
    } catch (error) {
      return { data: null, error, success: false };
    }
  }

  // Generic query methods
  async query(table: string, options: any = {}) {
    let query = this.client.from(table).select(options.select || '*');

    if (options.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value as any);
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending });
    }

    const { data, error } = await query;
    return { data, error, success: !error };
  }
}

// Create and export the helper instance
export const supabaseHelper = new SupabaseHelper();

export default supabase;