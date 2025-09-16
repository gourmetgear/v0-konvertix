import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { cookies, headers as nextHeaders } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const FAL_KEY = (process.env.FAL_KEY || process.env.FAL_API_KEY || "").trim()
  const BUCKET = (process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_BUCKET || "documents").trim()
  const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
  const SUPABASE_ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()
  if (!FAL_KEY) {
    return new Response(JSON.stringify({ error: "Missing FAL_KEY in env" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
  if (!supabaseAdmin) {
    return new Response(JSON.stringify({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }

  type Body = { prompt?: string; n?: number; account_id?: string; prefix?: string }
  let body: Body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const prompt = (body.prompt || "banana").slice(0, 500)
  const n = Math.min(Math.max(body.n ?? 2, 1), 8)
  const basePath = body.account_id ? `${body.account_id.replace(/\\/g, "/")}/` : (body.prefix || "")

  try {
    // Resolve the authenticated user (cookie or Authorization header)
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

    // Enforce monthly quota: max 100 images per user
    const now = new Date()
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    const monthDate = monthStart.toISOString().slice(0, 10) // YYYY-MM-DD

    // Try to reserve the quota before generating
    const { error: quotaErr } = await supabaseAdmin.rpc("increment_generation_usage", {
      p_user: userId,
      p_month: monthDate,
      p_inc: n,
    })
    if (quotaErr) {
      if ((quotaErr as any).message?.toLowerCase().includes("quota exceeded")) {
        return new Response(JSON.stringify({ error: "Monthly generation limit reached (100)." }), {
          status: 429,
          headers: { "content-type": "application/json" },
        })
      }
      return new Response(JSON.stringify({ error: quotaErr.message || "Quota check failed" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      })
    }

    // Lazy import on server and normalize export shape across versions
    const mod: any = await import("@fal-ai/serverless-client")
    const maybeFal = mod?.fal ?? mod?.default?.fal ?? mod?.default ?? mod
    const client: any = maybeFal?.subscribe ? maybeFal : maybeFal?.fal ?? maybeFal
    if (!client || typeof client.subscribe !== "function") {
      throw new Error("fal.ai client not available")
    }
    if (typeof client.config === "function") {
      client.config({ credentials: FAL_KEY })
    }

    // Call nano-banana model
    const result: any = await client.subscribe("fal-ai/nano-banana", {
      input: {
        prompt,
        num_images: n,
      },
      logs: false,
      pollInterval: 2000,
    })

    const images: string[] =
      result?.images?.map((i: any) => i.url) ||
      result?.output?.images?.map((i: any) => i.url) ||
      []

    const uploaded: string[] = []
    for (let i = 0; i < Math.min(images.length, n); i++) {
      const url = images[i]
      if (!url) continue
      const r = await fetch(url)
      if (!r.ok) continue
      const buf = Buffer.from(await r.arrayBuffer())
      const ct = r.headers.get("content-type") || "image/png"
      const name = `generated-${Date.now()}-${i + 1}.${ct.includes("jpeg") ? "jpg" : ct.includes("png") ? "png" : "img"}`
      const fullPath = `${basePath}${name}`
      const { error } = await supabaseAdmin.storage.from(BUCKET).upload(fullPath, buf, {
        contentType: ct,
        upsert: true,
      })
      if (!error) uploaded.push(fullPath)
    }

    return new Response(
      JSON.stringify({ ok: true, uploadedCount: uploaded.length, paths: uploaded }),
      { status: 200, headers: { "content-type": "application/json" } }
    )
  } catch (e: any) {
    try {
      // Best-effort rollback of reserved quota if something failed
      const now = new Date()
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      const monthDate = monthStart.toISOString().slice(0, 10)
      const authHeader = nextHeaders().get("authorization") || ""
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""
      let uid: string | null = null
      if (SUPABASE_URL && SUPABASE_ANON && token) {
        const pub = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON)
        const { data } = await pub.auth.getUser(token)
        uid = data?.user?.id ?? null
      }
      if (uid) {
        await supabaseAdmin.rpc("increment_generation_usage", { p_user: uid, p_month: monthDate, p_inc: -1 * (typeof n === 'number' ? n : 1) })
      }
    } catch {}
    return new Response(JSON.stringify({ error: e?.message || "Generation failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
