import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function OPTIONS() {
  return new Response("ok")
}

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return new Response(
      JSON.stringify({ error: "Server missing SUPABASE_SERVICE_ROLE_KEY" }),
      { status: 500, headers: { "content-type": "application/json" } }
    )
  }

  const BUCKET = (process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_BUCKET || "documents").trim()

  type Body = { prefix?: string; limit?: number; expiresIn?: number }
  let body: Body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const prefix = (body.prefix || "").trim()
  const limit = Math.min(Math.max(body.limit ?? 200, 1), 1000)
  const expiresIn = Math.min(Math.max(body.expiresIn ?? 3600, 60), 60 * 60 * 24)

  if (!prefix) {
    return new Response(
      JSON.stringify({ error: "Missing prefix" }),
      { status: 400, headers: { "content-type": "application/json" } }
    )
  }

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).list(prefix, {
    limit,
    sortBy: { column: "updated_at", order: "desc" },
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }

  const rows = data || []
  const paths = rows.map((f) => `${prefix}${f.name}`)
  const signedMap: Record<string, string> = {}
  if (paths.length > 0) {
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrls(paths, expiresIn)
    if (!signErr && signed) {
      for (const item of signed) signedMap[item.path] = item.signedUrl
    }
  }

  return new Response(
    JSON.stringify({ rows, signedUrlMap: signedMap }),
    { status: 200, headers: { "content-type": "application/json" } }
  )
}

