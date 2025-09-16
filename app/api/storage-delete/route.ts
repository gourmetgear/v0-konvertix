import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return new Response(
      JSON.stringify({ error: "Server missing SUPABASE_SERVICE_ROLE_KEY" }),
      { status: 500, headers: { "content-type": "application/json" } }
    )
  }

  const BUCKET = (process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_BUCKET || "documents").trim()

  type Body = { path?: string }
  let body: Body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const path = (body.path || "").replace(/\\/g, "/").replace(/^\/+/, "")
  if (!path) {
    return new Response(JSON.stringify({ error: "Missing path" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path])
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

