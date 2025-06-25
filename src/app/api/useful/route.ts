import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { asset_id } = body

    if (!asset_id) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      )
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('useful_votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('asset_id', asset_id)
      .single()

    if (existingVote) {
      // Remove vote
      const { error } = await supabase
        .from('useful_votes')
        .delete()
        .eq('user_id', user.id)
        .eq('asset_id', asset_id)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to remove vote' },
          { status: 500 }
        )
      }

      return NextResponse.json({ action: 'removed' })
    } else {
      // Add vote
      const { error } = await supabase
        .from('useful_votes')
        .insert({
          user_id: user.id,
          asset_id
        })

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to add vote' },
          { status: 500 }
        )
      }

      return NextResponse.json({ action: 'added' })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 