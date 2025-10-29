// API Route: Store and marketplace
// /app/api/store/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authManager } from '@/lib/auth/EnhancedAuthManager';
import { supabaseHelper } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get store items with filters
    let query = supabaseHelper.client
      .from('store_items')
      .select(`
        *,
        store_categories (name, description)
      `, { count: 'exact' });

    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Add sorting
    const validSortFields = ['name', 'price', 'created_at', 'popularity'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder === 'asc' ? { ascending: true } : { ascending: false };

    const { data: items, error, count } = await query
      .eq('active', true)
      .order(sortField, order)
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch store items' },
        { status: 500 }
      );
    }

    // Get categories for filtering
    const { data: categories } = await supabaseHelper.client
      .from('store_categories')
      .select('*')
      .eq('active', true)
      .order('name');

    return NextResponse.json({
      success: true,
      items: items || [],
      categories: categories || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Store GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store data' },
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

    const { action, itemId, quantity = 1 } = await request.json();

    if (action === 'purchase') {
      if (!itemId) {
        return NextResponse.json(
          { error: 'Item ID is required' },
          { status: 400 }
        );
      }

      // Get item details
      const { data: item, error: itemError } = await supabaseHelper.client
        .from('store_items')
        .select('*')
        .eq('id', itemId)
        .eq('active', true)
        .single();

      if (itemError || !item) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      // Check if item is in stock (if applicable)
      if (item.stock !== null && item.stock < quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }

      const totalCost = item.price * quantity;

      // Check user's BettaBuckZ balance
      const userProfile = await supabaseHelper.getUserProfile(auth.user.id);
      if (!userProfile.success || (userProfile.profile?.betta_buckz || 0) < totalCost) {
        return NextResponse.json(
          { error: 'Insufficient BettaBuckZ' },
          { status: 400 }
        );
      }

      // Process purchase transaction
      const purchaseResult = await supabaseHelper.processBettaBuckZTransaction(
        auth.user.id,
        'store_purchase',
        -totalCost,
        'store_purchase',
        `Purchased ${quantity}x ${item.name}`,
        itemId
      );

      if (!purchaseResult.success) {
        return NextResponse.json(
          { error: 'Purchase transaction failed' },
          { status: 500 }
        );
      }

      // Add item to user inventory
      const { error: inventoryError } = await supabaseHelper.client
        .from('user_inventory')
        .upsert({
          user_id: auth.user.id,
          item_id: itemId,
          quantity: quantity
        });

      if (inventoryError) {
        // Rollback the purchase transaction
        await supabaseHelper.processBettaBuckZTransaction(
          auth.user.id,
          'purchase_refund',
          totalCost,
          'refund',
          `Refund for ${item.name}`,
          itemId
        );

        return NextResponse.json(
          { error: 'Failed to add item to inventory' },
          { status: 500 }
        );
      }

      // Update item stock if applicable
      if (item.stock !== null) {
        await supabaseHelper.client
          .from('store_items')
          .update({ stock: item.stock - quantity })
          .eq('id', itemId);
      }

      // Update item popularity
      await supabaseHelper.client
        .from('store_items')
        .update({ popularity: (item.popularity || 0) + quantity })
        .eq('id', itemId);

      // Award achievements
      await supabaseHelper.awardAchievementProgress(
        auth.user.id,
        'ach_003', // First Purchase achievement
        1
      );

      return NextResponse.json({
        success: true,
        message: `Successfully purchased ${quantity}x ${item.name}`,
        totalCost,
        remainingBalance: (userProfile.profile?.betta_buckz || 0) - totalCost
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Store POST error:', error);
    return NextResponse.json(
      { error: 'Store operation failed' },
      { status: 500 }
    );
  }
}