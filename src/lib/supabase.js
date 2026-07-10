import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY

function isValidSupabaseUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co')
  } catch {
    return false
  }
}

const hasSupabaseUrl = Boolean(supabaseUrl)
const hasSupabasePublishableKey = Boolean(supabasePublishableKey)
const hasValidSupabaseUrl = hasSupabaseUrl && isValidSupabaseUrl(supabaseUrl)

export const isSupabaseConfigured = Boolean(
  hasSupabaseUrl &&
  hasSupabasePublishableKey &&
  hasValidSupabaseUrl
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null

export const supabaseConfigMessage = (() => {
  if (!hasSupabaseUrl && !hasSupabasePublishableKey) {
    return 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel Project Settings, then redeploy.'
  }

  if (!hasSupabaseUrl) {
    return 'Supabase URL is missing. Add VITE_SUPABASE_URL in Vercel Project Settings, then redeploy.'
  }

  if (!hasSupabasePublishableKey) {
    return 'Supabase publishable key is missing. Add VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY in Vercel Project Settings, then redeploy.'
  }

  if (!hasValidSupabaseUrl) {
    return 'Supabase URL is invalid. It must be your project URL, for example https://your-project-ref.supabase.co.'
  }

  return 'Supabase is not configured correctly. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel Project Settings.'
})()

export function isSupabaseFetchError(error) {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`.toLowerCase()
  return (
    text.includes('failed to fetch') ||
    text.includes('fetch failed') ||
    text.includes('network error') ||
    text.includes('networkerror') ||
    text.includes('cors')
  )
}

export function getSupabaseErrorMessage(error) {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`.trim()
  if (!text) return 'Unable to fetch data from Supabase.'

  if (text.includes('ENOTFOUND') || isSupabaseFetchError(error)) {
    return 'Unable to reach the Supabase backend. If this happens only on Vercel, verify VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in Vercel Project Settings and redeploy.'
  }

  if (text.toLowerCase().includes('row-level security')) {
    return 'Supabase blocked this action with Row Level Security. Run supabase-dashboard-setup.sql in the Supabase SQL Editor to allow dashboard writes.'
  }

  if (text.toLowerCase().includes('bucket not found')) {
    return 'Supabase Storage bucket was not found. Run supabase-dashboard-setup.sql or create the required Storage bucket.'
  }

  return error?.message || 'Unable to fetch data from Supabase.'
}
