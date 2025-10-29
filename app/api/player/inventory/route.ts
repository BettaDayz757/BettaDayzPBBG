import { NextRequest, NextResponse } from 'next/server'
import { gameOperations } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const playerId = request.nextUrl.searchParams.get('playerId')
    
    if (!userId || !playerId) {
      return NextResponse.json(
        { error: 'User ID and Player ID are required' },
        { status: 401 }
      )
    }

    const inventory = await gameOperations.getInventory(playerId)

    return NextResponse.json({
      success: true,
      inventory
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const itemData = await request.json()

    if (!userId || !itemData.player_id) {
      return NextResponse.json(
        { error: 'User ID and Player ID are required' },
        { status: 401 }
      )
    }

    const success = await gameOperations.addInventoryItem(itemData)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to add item to inventory' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to inventory successfully'
    })
  } catch (error) {
    console.error('Error adding inventory item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
