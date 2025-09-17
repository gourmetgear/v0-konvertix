import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

// Same-origin route that creates a signed upload URL for private bucket
// using the Supabase service role. The client will upload directly
// with the returned signed URL + token.

export async function OPTIONS() {
  return new Response("ok")
}

export async function POST(req: NextRequest) {
  const BUCKET = (process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_BUCKET || "documents").trim()
  if (!supabaseAdmin) {
    return new Response(
      JSON.stringify({
        error: "Server is missing SUPABASE_SERVICE_ROLE_KEY. Set it in your .env.local (server-only).",
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    )
  }

  let payload: { account_id?: string; filename?: string; contentType?: string }
  try {
    payload = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const accountId = (payload.account_id || "").trim()
  const filename = (payload.filename || "").trim()
  const contentType = (payload.contentType || "application/octet-stream").trim()

  console.log('Upload API Debug - Received payload:', payload)
  console.log('Upload API Debug - accountId:', accountId, 'filename:', filename)

  if (!accountId || !filename) {
    return new Response(
      JSON.stringify({ error: "Missing account_id or filename" }),
      { status: 400, headers: { "content-type": "application/json" } }
    )
  }

  // Basic filename normalization (avoid path traversal)
  const safeName = filename.replace(/\\/g, "/").split("/").pop() || "upload.bin"
  const objectPath = `assets/private/${accountId}/${safeName}`

  console.log('Upload API Debug - Generated objectPath:', objectPath)

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUploadUrl(objectPath, 60) // expires in 60s

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: error?.message || "Failed to create signed upload URL" }),
      { status: 500, headers: { "content-type": "application/json" } }
    )
  }

  // Return URL and token; client must use both
  return new Response(
    JSON.stringify({ uploadUrl: data.signedUrl, token: data.token, path: objectPath, contentType }),
    { status: 200, headers: { "content-type": "application/json" } }
  )
}
