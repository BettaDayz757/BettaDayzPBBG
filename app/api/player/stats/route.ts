import { NextRequest, NextResponse } from 'next/server'
import { gameOperations } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    const player = await gameOperations.getPlayer(userId)

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      player
    })
  } catch (error) {
    console.error('Error fetching player stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const { playerId, updates } = await request.json()

    if (!userId || !playerId) {
      return NextResponse.json(
        { error: 'User ID and Player ID are required' },
        { status: 401 }
      )
    }

    const success = await gameOperations.updatePlayer(playerId, updates)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update player' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Player updated successfully'
    })
  } catch (error) {
    console.error('Error updating player stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
