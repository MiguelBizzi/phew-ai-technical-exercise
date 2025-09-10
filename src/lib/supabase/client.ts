import { createBrowserClient } from '@supabase/ssr'
import { supabaseConfig } from '@/lib/env'

export function createClient() {
  return createBrowserClient(
    supabaseConfig.url!,
    supabaseConfig.publishableKey!,
  )
}
