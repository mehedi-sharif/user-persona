import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn("Supabase credentials missing. Client will not be functional.")
    // We return a client that will fail on actual calls but won't crash during build
    return createBrowserClient(
      url || "http://placeholder.url",
      key || "placeholder-key"
    )
  }

  return createBrowserClient(url, key)
}
