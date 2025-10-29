// API Route: Guild management
// /app/api/guilds/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authManager } from '@/lib/auth/EnhancedAuthManager';
import { supabaseHelper } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guildId = searchParams.get('id');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (guildId) {
      // Get specific guild details
      const { data: guild, error } = await supabaseHelper.client
        .from('guilds')
        .select(`
          *,
          guild_members (
            user_id,
            role,
            joined_at,
            user_profiles (username, display_name, avatar, level)
          ),
          guild_activities (
            id,
            activity_type,
            description,
            created_at,
            user_profiles (username, display_name)
          )
        `)
        .eq('id', guildId)
        .single();

      if (error || !guild) {
        return NextResponse.json(
          { error: 'Guild not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, guild });
    }

    // Get guilds list with pagination and search
    let query = supabaseHelper.client
      .from('guilds')
      .select(`
        *,
        guild_members (count),
        _count: guild_members (count)
      `, { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: guilds, error, count } = await query
      .eq('active', true)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch guilds' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      guilds: guilds || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Guild GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guild data' },
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

    const { name, description, isPrivate, maxMembers } = await request.json();

    if (!name || name.length < 3 || name.length > 50) {
      return NextResponse.json(
        { error: 'Guild name must be between 3-50 characters' },
        { status: 400 }
      );
    }

    // Check if user can create guild (not already owner/leader of another)
    const { data: existingGuilds } = await supabaseHelper.client
      .from('guild_members')
      .select('guild_id, role')
      .eq('user_id', auth.user.id)
      .in('role', ['owner', 'leader']);

    if (existingGuilds && existingGuilds.length > 0) {
      return NextResponse.json(
        { error: 'You can only own/lead one guild at a time' },
        { status: 400 }
      );
    }

    // Create guild
    const { data: guild, error: guildError } = await supabaseHelper.client
      .from('guilds')
      .insert({
        name,
        description: description || '',
        owner_id: auth.user.id,
        is_private: isPrivate || false,
        max_members: Math.min(maxMembers || 50, 100), // Cap at 100
        active: true
      })
      .select()
      .single();

    if (guildError || !guild) {
      return NextResponse.json(
        { error: guildError?.message || 'Failed to create guild' },
        { status: 500 }
      );
    }

    // Add creator as owner
    const { error: memberError } = await supabaseHelper.client
      .from('guild_members')
      .insert({
        guild_id: guild.id,
        user_id: auth.user.id,
        role: 'owner',
        joined_at: new Date().toISOString()
      });

    if (memberError) {
      // Rollback guild creation
      await supabaseHelper.client
        .from('guilds')
        .delete()
        .eq('id', guild.id);

      return NextResponse.json(
        { error: 'Failed to add guild owner' },
        { status: 500 }
      );
    }

    // Award guild creation achievement
    await supabaseHelper.awardAchievementProgress(
      auth.user.id,
      'ach_012', // Guild Creator achievement
      1
    );

    return NextResponse.json({
      success: true,
      guild,
      message: 'Guild created successfully'
    });

  } catch (error) {
    console.error('Guild creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create guild' },
      { status: 500 }
    );
  }
}