/**
 * Example usage patterns for Supabase helpers
 * These examples demonstrate how to use the Supabase clients and helper functions
 * in the BettaDayz PBBG application.
 */

import { supabase, supabaseAdmin, gameOperations } from '../supabase';
import { supabaseHelper } from './client';

// ============================================
// CLIENT-SIDE EXAMPLES (Browser/React Components)
// ============================================

/**
 * Example: Fetch player data in a React component
 */
export async function exampleGetPlayer(userId: string) {
  const player = await gameOperations.getPlayer(userId);
  
  if (player) {
    console.log(`Player: ${player.username}, Level: ${player.level}`);
    return player;
  } else {
    console.error('Player not found');
    return null;
  }
}

/**
 * Example: Create a new player account
 */
export async function exampleCreatePlayer(
  userId: string,
  username: string,
  email: string
) {
  const newPlayer = await gameOperations.createPlayer({
    user_id: userId,
    username,
    email
  });
  
  if (newPlayer) {
    console.log('Player created successfully:', newPlayer.id);
    return newPlayer;
  } else {
    console.error('Failed to create player');
    return null;
  }
}

/**
 * Example: Update player stats after completing an activity
 */
export async function exampleCompleteQuest(
  playerId: string,
  questName: string,
  xpReward: number,
  coinReward: number
) {
  // Add experience
  await gameOperations.addExperience(playerId, xpReward);
  
  // Log the activity
  await gameOperations.logActivity({
    player_id: playerId,
    activity_type: 'quest_complete',
    activity_data: { quest_name: questName },
    domain: 'shop',
    experience_gained: xpReward,
    coins_gained: coinReward
  });
  
  console.log(`Quest "${questName}" completed!`);
}

/**
 * Example: Manage player inventory
 */
export async function exampleManageInventory(playerId: string) {
  // Get current inventory
  const inventory = await gameOperations.getInventory(playerId);
  console.log('Current inventory:', inventory);
  
  // Add a new item
  await gameOperations.addInventoryItem({
    player_id: playerId,
    item_type: 'weapon',
    item_id: 'pistol_01',
    quantity: 1
  });
  
  console.log('Item added to inventory');
}

/**
 * Example: Process BettaBuckZ transaction
 */
export async function exampleProcessTransaction(userId: string) {
  const result = await supabaseHelper.processBettaBuckZTransaction(
    userId,
    'earn',
    100,
    'daily_reward',
    'Daily login bonus'
  );
  
  if (result.success) {
    console.log('Transaction completed:', result.data);
  } else {
    console.error('Transaction failed:', result.error);
  }
}

// ============================================
// SERVER-SIDE EXAMPLES (API Routes/Server Components)
// ============================================

/**
 * Example: Server-side admin operation
 * Use this pattern in API routes or server components
 */
export async function exampleServerSideOperation(playerId: string) {
  // Using admin client for privileged operations
  const { data, error } = await supabaseAdmin
    .from('players')
    .update({ premium_currency: 1000 })
    .eq('id', playerId)
    .select()
    .single();
  
  if (error) {
    console.error('Admin operation failed:', error);
    return null;
  }
  
  return data;
}

/**
 * Example: Consume player energy for an action
 */
export async function exampleConsumeEnergy(playerId: string, actionCost: number) {
  const success = await gameOperations.consumeEnergy(playerId, actionCost);
  
  if (success) {
    console.log(`Energy consumed: ${actionCost}`);
    return true;
  } else {
    console.error('Not enough energy or operation failed');
    return false;
  }
}

// ============================================
// REAL-TIME EXAMPLES
// ============================================

/**
 * Example: Subscribe to player updates in real-time
 */
export function exampleRealtimeSubscription(playerId: string, onUpdate: (player: any) => void) {
  const channel = supabase
    .channel(`player:${playerId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'players',
        filter: `id=eq.${playerId}`
      },
      (payload) => {
        console.log('Player updated:', payload.new);
        onUpdate(payload.new);
      }
    )
    .subscribe();
  
  // Return cleanup function
  return () => {
    channel.unsubscribe();
  };
}

// ============================================
// AUTHENTICATION EXAMPLES
// ============================================

/**
 * Example: Sign up a new user
 */
export async function exampleSignUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) {
    console.error('Sign up failed:', error);
    return null;
  }
  
  console.log('User signed up:', data.user?.id);
  return data;
}

/**
 * Example: Sign in an existing user
 */
export async function exampleSignIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Sign in failed:', error);
    return null;
  }
  
  console.log('User signed in:', data.user?.id);
  return data;
}

/**
 * Example: Get current session
 */
export async function exampleGetSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Failed to get session:', error);
    return null;
  }
  
  return session;
}

/**
 * Example: Sign out
 */
export async function exampleSignOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Sign out failed:', error);
    return false;
  }
  
  console.log('User signed out');
  return true;
}
