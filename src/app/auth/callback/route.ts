import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/'

  // Handle auth errors
  if (error) {
    const errorParams = new URLSearchParams({
      error,
      error_description: errorDescription || 'Authentication failed'
    })
    return NextResponse.redirect(`${origin}?${errorParams.toString()}`)
  }

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      // Handle exchange errors
      const errorParams = new URLSearchParams({
        error: 'access_denied',
        error_description: exchangeError.message || 'Failed to authenticate'
      })
      return NextResponse.redirect(`${origin}?${errorParams.toString()}`)
    }
  }

  // No code or error provided
  const errorParams = new URLSearchParams({
    error: 'access_denied',
    error_description: 'Invalid authentication request'
  })
  return NextResponse.redirect(`${origin}?${errorParams.toString()}`)
} 