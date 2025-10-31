// app/api/canva/publish/route.ts
// Publish Canva design to domain(s)

import { NextRequest, NextResponse } from 'next/server';
import { createCanvaClient } from '@/lib/canva/client';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { designId, targetDomain, publishPath, exportOptions } = body;

    // Validate required fields
    if (!designId || !targetDomain || !publishPath || !exportOptions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user's Canva credentials
    const { data: credentials, error: credError } = await supabase
      .from('canva_credentials')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (credError || !credentials) {
      return NextResponse.json(
        { error: 'Canva not connected' },
        { status: 400 }
      );
    }

    // Initialize Canva client with access token
    const canvaClient = createCanvaClient();
    canvaClient.setAccessToken(credentials.access_token);

    // Execute publish workflow
    const result = await canvaClient.publishWorkflow({
      designId,
      targetDomain,
      publishPath,
      exportOptions,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Publish failed' },
        { status: 500 }
      );
    }

    // Sync design metadata to Supabase
    await canvaClient.syncDesignToSupabase(designId, user.id);

    return NextResponse.json({
      success: true,
      message: 'Design published successfully',
      urls: result.urls,
    });
  } catch (error) {
    console.error('Error publishing design:', error);
    return NextResponse.json(
      { error: 'Failed to publish design' },
      { status: 500 }
    );
  }
}
