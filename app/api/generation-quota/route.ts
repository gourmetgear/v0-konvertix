import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { cookies, headers as nextHeaders } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function GET(_req: NextRequest) {
  const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
  const SUPABASE_ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()
  const LIMIT = 100

  if (!supabaseAdmin) {
    return new Response(JSON.stringify({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }

  // Resolve user id from cookie or Authorization header
  let userId: string | null = null
  try {
    const supa = createRouteHandlerClient({ cookies }) as any
    const { data } = await supa.auth.getUser()
    userId = data?.user?.id ?? null
  } catch {}
  if (!userId && SUPABASE_URL && SUPABASE_ANON) {
    const authHeader = nextHeaders().get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""
    if (token) {
      const pub = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON)
      const { data } = await pub.auth.getUser(token)
      userId = data?.user?.id ?? null
    }
  }
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    })
  }

  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const monthDate = monthStart.toISOString().slice(0, 10)

  const { data, error } = await supabaseAdmin
    .from("generation_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("month_start", monthDate)
    .maybeSingle()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }

  const used = data?.count ?? 0
  const remaining = Math.max(0, LIMIT - used)
  return new Response(JSON.stringify({ limit: LIMIT, used, remaining }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

