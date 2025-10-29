import { NextRequest, NextResponse } from 'next/server'
import { gameOperations } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const activityData = await request.json()

    if (!userId || !activityData.player_id) {
      return NextResponse.json(
        { error: 'User ID and Player ID are required' },
        { status: 401 }
      )
    }

    // Get domain from request headers or body
    const domain = (request.headers.get('x-domain') || activityData.domain || 'shop') as 'shop' | 'store'

    const success = await gameOperations.logActivity({
      player_id: activityData.player_id,
      activity_type: activityData.activity_type,
      activity_data: activityData.activity_data,
      domain,
      experience_gained: activityData.experience_gained || 0,
      coins_gained: activityData.coins_gained || 0
    })

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to log activity' },
        { status: 400 }
      )
    }

    // If activity grants experience, add it to player
    if (activityData.experience_gained && activityData.experience_gained > 0) {
      const expResult = await gameOperations.addExperience(
        activityData.player_id,
        activityData.experience_gained
      )

      return NextResponse.json({
        success: true,
        message: 'Activity logged successfully',
        experience: expResult
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully'
    })
  } catch (error) {
    console.error('Error logging activity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
