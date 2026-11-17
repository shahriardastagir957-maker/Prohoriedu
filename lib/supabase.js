import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key')
export const ytId = (u = '') => (u.match(/(?:v=|youtu\.be\/|live\/|embed\/)([\w-]{11})/) || [])[1]
