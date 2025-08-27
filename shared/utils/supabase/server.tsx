import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// 타입 정의
export interface Event {
  id: number
  name: string
  status: 'team_selection' | 'active' | 'finished'
  duration_seconds: number
  started_at: string | null
  finished_at: string | null
  created_at: string
}

export interface Team {
  id: number
  event_id: number
  name: string
  color: string
  cheer_count: number
  created_at: string
}

export interface Participant {
  id: number
  event_id: number
  team_id: number
  session_id: string
  is_winner: boolean
  joined_at: string
}