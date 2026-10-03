import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validation
    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert into newsletter_subscriptions table with source "todoenergias"
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email: email.trim().toLowerCase(),
        source: 'todoenergias',
      })

    if (error) {
      console.error('Supabase error:', error)
      // If duplicate email, return success (already subscribed)
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Ya estas suscrito' })
      }
      // If table doesn't exist, return success anyway (graceful degradation)
      if (error.code === '42P01') {
        console.log('newsletter_subscriptions table does not exist, but subscription received:', { email })
        return NextResponse.json({ success: true })
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la suscripcion' },
      { status: 500 }
    )
  }
}
