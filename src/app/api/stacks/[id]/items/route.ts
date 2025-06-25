import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Parse the stack id from the URL
    const url = new URL(request.url)
    const idMatch = url.pathname.match(/\/api\/stacks\/([^/]+)\/items/)
    const stackId = idMatch ? idMatch[1] : null

    if (!stackId) {
      return NextResponse.json({ error: 'Stack ID is required in the URL' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { asset_id, action = 'add' } = body

    if (!asset_id) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      )
    }

    // Verify user owns the stack
    const { data: stack } = await supabase
      .from('stacks')
      .select('owner_id')
      .eq('id', stackId)
      .single()

    if (!stack || stack.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to modify this stack' },
        { status: 403 }
      )
    }

    if (action === 'add') {
      // Add asset to stack
      const { error } = await supabase
        .from('stack_items')
        .insert({
          stack_id: stackId,
          asset_id
        })

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to add asset to stack' },
          { status: 500 }
        )
      }

      return NextResponse.json({ action: 'added' })
    } else if (action === 'remove') {
      // Remove asset from stack
      const { error } = await supabase
        .from('stack_items')
        .delete()
        .eq('stack_id', stackId)
        .eq('asset_id', asset_id)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to remove asset from stack' },
          { status: 500 }
        )
      }

      return NextResponse.json({ action: 'removed' })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "add" or "remove"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 