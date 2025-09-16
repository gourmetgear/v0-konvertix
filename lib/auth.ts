import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = createClientComponentClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      console.error('Error getting user:', error)
      return null
    }

    return user.id
  } catch (error) {
    console.error('Error in getCurrentUserId:', error)
    return null
  }
}