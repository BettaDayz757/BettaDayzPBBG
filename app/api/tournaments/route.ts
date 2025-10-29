// API Route: Tournament management
// /app/api/tournaments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authManager } from '@/lib/auth/EnhancedAuthManager';
import { supabaseHelper } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('id');
    const status = searchParams.get('status');
    const gameType = searchParams.get('gameType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (tournamentId) {
      // Get specific tournament details
      const { data: tournament, error } = await supabaseHelper.client
        .from('tournaments')
        .select(`
          *,
          tournament_participants (
            user_id,
            score,
            rank,
            joined_at,
            user_profiles (username, display_name, avatar, level)
          )
        `)
        .eq('id', tournamentId)
        .single();

      if (error || !tournament) {
        return NextResponse.json(
          { error: 'Tournament not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, tournament });
    }

    // Get tournaments list with filters
    let query = supabaseHelper.client
      .from('tournaments')
      .select(`
        *,
        tournament_participants (count)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    const { data: tournaments, error, count } = await query
      .order('starts_at', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch tournaments' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tournaments: tournaments || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Tournament GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournament data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await authManager.authenticateRequest(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { action, tournamentId } = await request.json();

    if (action === 'join') {
      if (!tournamentId) {
        return NextResponse.json(
          { error: 'Tournament ID is required' },
          { status: 400 }
        );
      }

      // Get tournament details
      const { data: tournament, error: tournamentError } = await supabaseHelper.client
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (tournamentError || !tournament) {
        return NextResponse.json(
          { error: 'Tournament not found' },
          { status: 404 }
        );
      }

      // Check if tournament is joinable
      if (tournament.status !== 'upcoming') {
        return NextResponse.json(
          { error: 'Tournament is not available for registration' },
          { status: 400 }
        );
      }

      // Check if user is already registered
      const { data: existingParticipant } = await supabaseHelper.client
        .from('tournament_participants')
        .select('id')
        .eq('tournament_id', tournamentId)
        .eq('user_id', auth.user.id)
        .single();

      if (existingParticipant) {
        return NextResponse.json(
          { error: 'Already registered for this tournament' },
          { status: 400 }
        );
      }

      // Check participant limit
      const { count } = await supabaseHelper.client
        .from('tournament_participants')
        .select('*', { count: 'exact', head: true })
        .eq('tournament_id', tournamentId);

      if (count && count >= tournament.max_participants) {
        return NextResponse.json(
          { error: 'Tournament is full' },
          { status: 400 }
        );
      }

      // Check entry fee
      if (tournament.entry_fee > 0) {
        // Verify user has enough BettaBuckZ
        const userProfile = await supabaseHelper.getUserProfile(auth.user.id);
        if (!userProfile.success || (userProfile.profile?.betta_buckz || 0) < tournament.entry_fee) {
          return NextResponse.json(
            { error: 'Insufficient BettaBuckZ for entry fee' },
            { status: 400 }
          );
        }

        // Deduct entry fee
        const feeResult = await supabaseHelper.processBettaBuckZTransaction(
          auth.user.id,
          'tournament_entry',
          -tournament.entry_fee,
          'tournament_fee',
          `Entry fee for ${tournament.name}`,
          tournamentId
        );

        if (!feeResult.success) {
          return NextResponse.json(
            { error: 'Failed to process entry fee' },
            { status: 500 }
          );
        }
      }

      // Register participant
      const { error: participantError } = await supabaseHelper.client
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          user_id: auth.user.id,
          joined_at: new Date().toISOString(),
          score: 0,
          rank: null
        });

      if (participantError) {
        // Rollback entry fee if participant creation fails
        if (tournament.entry_fee > 0) {
          await supabaseHelper.processBettaBuckZTransaction(
            auth.user.id,
            'tournament_refund',
            tournament.entry_fee,
            'tournament_refund',
            `Refund for ${tournament.name}`,
            tournamentId
          );
        }

        return NextResponse.json(
          { error: 'Failed to register for tournament' },
          { status: 500 }
        );
      }

      // Award achievement for first tournament participation
      await supabaseHelper.awardAchievementProgress(
        auth.user.id,
        'ach_015', // Tournament Competitor achievement
        1
      );

      return NextResponse.json({
        success: true,
        message: 'Successfully registered for tournament'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Tournament POST error:', error);
    return NextResponse.json(
      { error: 'Tournament operation failed' },
      { status: 500 }
    );
  }
}