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

  const BUCKET = "assets-private" // Use assets-private bucket specifically for images

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

  console.log('Listing images from bucket:', BUCKET, 'with prefix:', prefix)

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).list(prefix, {
    limit,
    sortBy: { column: "updated_at", order: "desc" },
  })

  if (error) {
    console.error('Storage list error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }

  console.log('Found files:', data?.length || 0)

  const rows = data || []

  // Filter for image files only
  const imageFiles = rows.filter(file =>
    file.name &&
    file.name !== '.emptyFolderPlaceholder' &&
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
  )

  console.log('Filtered image files:', imageFiles.length)

  // Create paths for signed URLs
  const paths = imageFiles.map((f) => `${prefix}${f.name}`)
  const signedMap: Record<string, string> = {}

  if (paths.length > 0) {
    console.log('Creating signed URLs for paths:', paths)
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrls(paths, expiresIn)

    if (signErr) {
      console.error('Signed URL error:', signErr)
    } else if (signed) {
      console.log('Created signed URLs:', signed.length)
      for (const item of signed) {
        signedMap[item.path] = item.signedUrl
        console.log('Signed URL created:', item.path, '→', item.signedUrl ? 'SUCCESS' : 'FAILED')
      }
    }
  }

  return new Response(
    JSON.stringify({ rows: imageFiles, signedUrlMap: signedMap }),
    { status: 200, headers: { "content-type": "application/json" } }
  )
}