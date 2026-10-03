import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de solo lectura para contenido público (sin cookies).
 * Permite que las páginas se rendericen con ISR en lugar de forzar render dinámico.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
