import { createClient } from "@supabase/supabase-js"

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
const serviceRole = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()

if (!url) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL for admin client")
}

if (!serviceRole) {
  // We don't throw immediately to allow importing; the route will check and error nicely.
}

export const supabaseAdmin = serviceRole
  ? createClient(url, serviceRole, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null

