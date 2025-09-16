"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, ChevronDown, BarChart3, TrendingUp, Users, Target, FileText, Download, ImageIcon, Pencil, Trash2, Maximize2, X } from "lucide-react"
import Sidebar from "@/components/nav/Sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

type FileRow = {
  name: string
  updated_at?: string
  created_at?: string
  last_accessed_at?: string
  metadata?: { size?: number; mimetype?: string }
}

const BUCKET = (process.env.NEXT_PUBLIC_ASSETS_BUCKET || "assets").trim()
const PREFIX_MODE = (process.env.NEXT_PUBLIC_STORAGE_PREFIX || "user").trim() // 'user' | 'account'
const DEFAULT_ACCOUNT_ID = (process.env.NEXT_PUBLIC_ACCOUNT_ID || "").trim()
const EDGE_UPLOAD_FN = (process.env.NEXT_PUBLIC_SUPABASE_UPLOAD_FN || "upload-private").trim()
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
const SUPABASE_ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()

function formatBytes(bytes?: number) {
  if (bytes === undefined || bytes === null) return "?"
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)}${sizes[i]}`
}

function isImage(name: string, mimetype?: string) {
  if (mimetype?.startsWith("image/")) return true
  return /(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg)$/i.test(name)
}

// We'll prefer signed URLs so private buckets work. Public buckets will also work with signed URLs.
async function createSignedUrls(paths: string[], expiresInSeconds = 3600) {
  if (paths.length === 0) return {}
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(paths, expiresInSeconds)
  if (error) throw error
  const map: Record<string, string> = {}
  for (const item of data) {
    if (!item || !("path" in item) || !(item as any).signedUrl) continue
    map[(item as any).path as string] = (item as any).signedUrl as string
  }
  return map
}

export default function DocumentsPage() {
  const [files, setFiles] = useState<FileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [userPrefix, setUserPrefix] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [signedUrlMap, setSignedUrlMap] = useState<Record<string, string>>({})
  const [accountId, setAccountId] = useState<string>("")
  const [pending, setPending] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [query, setQuery] = useState("")
  const [dateRange, setDateRange] = useState<"all" | "24h" | "7d" | "30d" | "90d">("all")
  const [docType, setDocType] = useState<"all" | "image" | "other">("all")
  const [generating, setGenerating] = useState(false)
  const [showGenModal, setShowGenModal] = useState(false)
  const [genPrompt, setGenPrompt] = useState("")
  const [genCount, setGenCount] = useState(2)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [quotaLimit, setQuotaLimit] = useState(100)
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null)
  const [quotaUsed, setQuotaUsed] = useState<number | null>(null)

  const refresh = async (prefix: string) => {
    if (PREFIX_MODE === "account") {
      // Use server route to list with service role (private bucket, account prefix)
      const res = await fetch("/api/list-private", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefix, limit: 200, expiresIn: 3600 }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(`List failed: ${res.status} ${t}`)
      }
      const { rows, signedUrlMap: map } = (await res.json()) as {
        rows: FileRow[]
        signedUrlMap: Record<string, string>
      }
      setFiles(rows || [])
      setSignedUrlMap(map || {})
      return rows?.length || 0
    } else {
      const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
        limit: 200,
        sortBy: { column: "updated_at", order: "desc" },
      })
      if (error) throw error
      const rows = (data || []) as FileRow[]
      setFiles(rows)
      const paths = rows.map((f) => `${prefix}${f.name}`)
      try {
        const map = await createSignedUrls(paths, 3600)
        setSignedUrlMap(map)
      } catch {
        setSignedUrlMap({})
      }
      return rows.length
    }
  }

  async function fetchQuota() {
    try {
      const { data: sessionRes } = await supabase.auth.getSession()
      const token = sessionRes.session?.access_token
      const res = await fetch("/api/generation-quota", {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      })
      if (!res.ok) return
      const json = await res.json()
      setQuotaLimit(json.limit ?? 100)
      setQuotaUsed(json.used ?? 0)
      setQuotaRemaining(json.remaining ?? null)
    } catch {}
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const { data: userRes } = await supabase.auth.getUser()
        const uid = userRes.user?.id
        if (!uid) {
          setError("Please log in to view your documents.")
          setFiles([])
          setUserPrefix("")
          return
        }
        if (PREFIX_MODE === "account") {
          let prefix = ""
          if (DEFAULT_ACCOUNT_ID) {
            prefix = `${DEFAULT_ACCOUNT_ID}/`
            setAccountId(DEFAULT_ACCOUNT_ID)
          } else {
            try {
              const { data: acct } = await supabase
                .from("my_accounts")
                .select("id")
                .limit(1)
                .maybeSingle()
              if (acct?.id) {
                prefix = `${acct.id}/`
                setAccountId(acct.id as string)
              }
            } catch {
              // ignore; will show guidance below
            }
          }
          if (!prefix) {
            setError(
              "Account prefix enabled but no account id found. Set NEXT_PUBLIC_ACCOUNT_ID in .env.local or make public.my_accounts readable to authenticated users."
            )
            setFiles([])
            setUserPrefix("")
            return
          }
          setUserPrefix(prefix)
          await refresh(prefix)
          await fetchQuota()
        } else {
          // Default: user-id prefix under assets/private/{uid}/
          const prefix = `private/${uid}/`
          setUserPrefix(prefix)
          await refresh(prefix)
          await fetchQuota()
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load documents from storage.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const uploadViaEdge = async (file: File) => {
    const { data: sessionRes } = await supabase.auth.getSession()
    const token = sessionRes.session?.access_token
    if (!token) throw new Error("Not authenticated")
    if (!SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
    if (!EDGE_UPLOAD_FN) throw new Error("Missing NEXT_PUBLIC_SUPABASE_UPLOAD_FN")
    if (!accountId) throw new Error("Missing account id for upload")

    const url = `/api/${EDGE_UPLOAD_FN}`
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      } as any,
      body: JSON.stringify({ account_id: accountId, filename: file.name, contentType: file.type }),
    }
    const res = await fetch(url, init)
    if (!res.ok) {
      const t = await res.text()
      throw new Error(`Edge init failed: ${res.status} ${t}`)
    }
    const { uploadUrl, token: uploadToken } = await res.json()
    if (!uploadUrl || !uploadToken) {
      throw new Error("Invalid upload init response")
    }
    const up = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type, Authorization: `Bearer ${uploadToken}`, "x-upsert": "true" },
      body: file,
    })
    if (!up.ok) {
      const t = await up.text()
      throw new Error(`Signed upload failed: ${up.status} ${t}`)
    }
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget
    const list = inputEl?.files
    if (!list || list.length === 0 || !userPrefix) return
    setUploading(true)
    setError("")
    try {
      for (let i = 0; i < list.length; i++) {
        const f = list.item(i)
        if (f) await uploadSingle(f)
      }
      await refresh(userPrefix)
    } catch (err: any) {
      setError(err?.message || "Upload failed")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      else if (inputEl) inputEl.value = ""
    }
  }

  async function uploadSingle(file: File) {
    if (PREFIX_MODE === "account") {
      await uploadViaEdge(file)
    } else {
      const path = `${userPrefix}${file.name}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        upsert: true,
        cacheControl: "3600",
      })
      if (error) throw error
    }
  }

  // Drag & drop handlers
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userPrefix || uploading) return
    setIsDragging(true)
  }
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userPrefix || uploading) return
    // indicate drop is allowed
    e.dataTransfer.dropEffect = "copy"
    setIsDragging(true)
  }
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (!userPrefix || uploading) return
    const list = e.dataTransfer?.files
    if (!list || list.length === 0) return
    setUploading(true)
    setError("")
    try {
      // Upload sequentially to keep things simple
      for (let i = 0; i < list.length; i++) {
        const f = list.item(i)
        if (f) await uploadSingle(f)
      }
      await refresh(userPrefix)
    } catch (err: any) {
      setError(err?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const filteredFiles = useMemo(() => {
    // Compute earliest allowed date
    let since: number | null = null
    const now = Date.now()
    if (dateRange === "24h") since = now - 24 * 60 * 60 * 1000
    else if (dateRange === "7d") since = now - 7 * 24 * 60 * 60 * 1000
    else if (dateRange === "30d") since = now - 30 * 24 * 60 * 60 * 1000
    else if (dateRange === "90d") since = now - 90 * 24 * 60 * 60 * 1000

    const q = query.trim().toLowerCase()

    return files.filter((f) => {
      // name filter
      if (q && !f.name.toLowerCase().includes(q)) return false
      // type filter
      const img = isImage(f.name, f.metadata?.mimetype)
      if (docType === "image" && !img) return false
      if (docType === "other" && img) return false
      // date filter (use updated_at then created_at)
      if (since) {
        const ts = f.updated_at || f.created_at || f.last_accessed_at
        if (!ts) return false
        const t = new Date(ts).getTime()
        if (isNaN(t) || t < since) return false
      }
      return true
    })
  }, [files, query, dateRange, docType])

  const imageItems = useMemo(() => {
    return filteredFiles
      .filter((f) => isImage(f.name, f.metadata?.mimetype))
      .map((f) => {
        const fullPath = `${userPrefix}${f.name}`
        const url = signedUrlMap[fullPath]
        return { name: f.name, url, updated_at: f.updated_at, size: f.metadata?.size }
      })
      .filter((i) => !!i.url)
  }, [filteredFiles, userPrefix, signedUrlMap])

  const genericItems = useMemo(() =>
    filteredFiles
      .filter((f) => !isImage(f.name, f.metadata?.mimetype))
      .map((f) => ({ name: f.name, updated_at: f.updated_at, size: f.metadata?.size })),
  [filteredFiles])

  // sidebar is shared component now

  async function handleDelete(name: string) {
    if (!userPrefix) return
    if (!confirm(`Delete ${name}?`)) return
    setPending(name)
    try {
      const res = await fetch("/api/storage-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `${userPrefix}${name}` }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(`Delete failed: ${res.status} ${t}`)
      }
      await refresh(userPrefix)
    } catch (e: any) {
      setError(e?.message || "Delete failed")
    } finally {
      setPending(null)
    }
  }

  async function handleRename(name: string) {
    if (!userPrefix) return
    const next = prompt("Rename file", name)
    if (!next || next === name) return
    setPending(name)
    try {
      const res = await fetch("/api/storage-rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromPath: `${userPrefix}${name}`, toPath: `${userPrefix}${next}` }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(`Rename failed: ${res.status} ${t}`)
      }
      await refresh(userPrefix)
    } catch (e: any) {
      setError(e?.message || "Rename failed")
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Documents Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Documents</h1>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents"
                className="pl-10 bg-[#2b2b2b] border-[#3f3f3f] text-white placeholder-[#afafaf]"
              />
            </div>
            <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
              <SelectTrigger className="w-40 bg-[#2b2b2b] border-[#3f3f3f] text-white">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent className="bg-[#2b2b2b] text-white border-[#3f3f3f]">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={docType} onValueChange={(v: any) => setDocType(v)}>
              <SelectTrigger className="w-48 bg-[#2b2b2b] border-[#3f3f3f] text-white">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#2b2b2b] text-white border-[#3f3f3f]">
                <SelectItem value="all">Document Type: All</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => userPrefix && refresh(userPrefix)} className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
              Search
            </Button>
            <Button
              disabled={!userPrefix}
              onClick={() => {
                setGenPrompt(query && query.trim().length ? query.trim() : "banana mascot")
                setGenCount(2)
                setShowGenModal(true)
              }}
              className="bg-gradient-to-r from-[#6fbf3a] to-[#38a169] hover:from-[#6fbf3a]/90 hover:to-[#38a169]/90"
            >
              Generate Images
            </Button>
            {quotaRemaining !== null && (
              <Badge className="bg-[#4b5563] text-white ml-2">Remaining: {quotaRemaining}/{quotaLimit}</Badge>
            )}
          </div>

          {/* File Upload Area */}
          <Card
            className={`bg-[#2b2b2b] border-2 border-dashed ${
              isDragging ? "border-white/80 bg-[#2b2b2b]/60" : "border-[#a545b6]"
            }`}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <CardContent className="flex flex-col items-center justify-center py-16 select-none">
              <FileText className="h-16 w-16 text-[#afafaf] mb-4" />
              <p className="text-lg text-[#afafaf] mb-2">
                {isDragging ? "Release to upload" : "Drop your documents here, or select"}
              </p>
              <input id="file-input" type="file" multiple className="hidden" onChange={onUpload} ref={fileInputRef} />
              <label htmlFor="file-input">
                <Button asChild disabled={!userPrefix || uploading} variant="ghost" className="text-white hover:text-[#a545b6] font-semibold">
                  <span>{uploading ? "Uploading..." : "Click to Browse"}</span>
                </Button>
              </label>
            </CardContent>
          </Card>

          {/* Generate Images Modal */}
          <GenerateModal
            open={showGenModal}
            onClose={() => setShowGenModal(false)}
            prompt={genPrompt}
            setPrompt={setGenPrompt}
            count={genCount}
            setCount={setGenCount}
            busy={generating}
            limit={quotaLimit}
            remaining={quotaRemaining ?? 0}
            onConfirm={async () => {
              if (!userPrefix) return
              setGenerating(true)
              setError("")
              try {
                const { data: sessionRes } = await supabase.auth.getSession()
                const token = sessionRes.session?.access_token
                const payload: any = { prompt: genPrompt || "banana mascot", n: genCount }
                if (PREFIX_MODE === "account") payload.account_id = accountId
                else payload.prefix = userPrefix
                const res = await fetch("/api/generate-images", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                  body: JSON.stringify(payload),
                })
                if (!res.ok) {
                  const t = await res.text()
                  throw new Error(`Generate failed: ${res.status} ${t}`)
                }
                setShowGenModal(false)
                await refresh(userPrefix)
                await fetchQuota()
              } catch (e: any) {
                setError(e?.message || "Image generation failed")
              } finally {
                setGenerating(false)
              }
            }}
          />

          {/* Preview Grid (Google Drive-like) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Files</h2>
              {loading && <span className="text-[#afafaf]">Loading...</span>}
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            {!loading && files.length === 0 && !error && (
              <div className="text-[#afafaf]">No files found in bucket "{BUCKET}" at "{userPrefix}".</div>
            )}

            {/* Card grid for all files with edit/delete */}
            {(imageItems.length > 0 || genericItems.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {imageItems.map((item) => (
                  <div key={item.name} className="group relative overflow-hidden rounded-lg border border-[#3f3f3f] bg-[#1f1b2a]">
                    <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1 rounded bg-black/50 hover:bg-black/70"
                        title="Full screen"
                        onClick={() => setPreviewUrl(item.url)}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 rounded bg-black/50 hover:bg-black/70"
                        title="Rename"
                        onClick={() => handleRename(item.name)}
                        disabled={pending === item.name}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 rounded bg-black/50 hover:bg-black/70"
                        title="Delete"
                        onClick={() => handleDelete(item.name)}
                        disabled={pending === item.name}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="aspect-[4/3] overflow-hidden bg-[#2b2b2b]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2">
                      <div className="truncate text-sm">{item.name}</div>
                      <div className="text-xs text-[#afafaf]">{formatBytes(item.size)}</div>
                    </div>
                  </div>
                ))}

                {genericItems.map((item) => (
                  <div key={item.name} className="group relative overflow-hidden rounded-lg border border-[#3f3f3f] bg-[#1f1b2a]">
                    <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1 rounded bg-black/50 hover:bg-black/70"
                        title="Rename"
                        onClick={() => handleRename(item.name)}
                        disabled={pending === item.name}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 rounded bg-black/50 hover:bg-black/70"
                        title="Delete"
                        onClick={() => handleDelete(item.name)}
                        disabled={pending === item.name}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="aspect-[4/3] overflow-hidden bg-[#2b2b2b] flex items-center justify-center">
                      <FileText className="w-10 h-10 text-[#afafaf]" />
                    </div>
                    <div className="p-2">
                      <div className="truncate text-sm">{item.name}</div>
                      <div className="text-xs text-[#afafaf]">{formatBytes(item.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen preview modal */}
          {previewUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/80" onClick={() => setPreviewUrl(null)} />
              <div className="relative max-w-[95vw] max-h-[95vh]">
                <button
                  className="absolute -top-10 right-0 p-2 rounded bg-white/10 hover:bg-white/20"
                  onClick={() => setPreviewUrl(null)}
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="rounded-md max-w-[95vw] max-h-[95vh] object-contain" />
              </div>
            </div>
          )}

          {/* File List Table (hidden) */}
          {false && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">File List Table</h2>
              <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>

            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#3f3f3f]">
                        <th className="text-left p-4 text-[#afafaf] font-medium">FILE NAME</th>
                        <th className="text-left p-4 text-[#afafaf] font-medium">TYPE</th>
                        <th className="text-left p-4 text-[#afafaf] font-medium">DATE UPDATED</th>
                        <th className="text-left p-4 text-[#afafaf] font-medium">SIZE</th>
                        <th className="text-left p-4 text-[#afafaf] font-medium">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((f) => {
                        const type = isImage(f.name, f.metadata?.mimetype) ? "Image" : (f.metadata?.mimetype || "File")
                        const Icon = isImage(f.name, f.metadata?.mimetype) ? ImageIcon : FileText
                        const path = `${userPrefix}${f.name}`
                        const url = signedUrlMap[path]
                        return (
                          <tr key={path} className="border-b border-[#3f3f3f] hover:bg-[#3f3f3f]/20">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Icon className="h-5 w-5 text-[#afafaf]" />
                              <span className="text-white">{f.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-[#a545b6] hover:bg-[#a545b6]/90 text-white">{type}</Badge>
                          </td>
                          <td className="p-4 text-[#afafaf]">{f.updated_at ? new Date(f.updated_at).toLocaleString() : "?"}</td>
                          <td className="p-4 text-[#afafaf]">{formatBytes(f.metadata?.size)}</td>
                          <td className="p-4">
                            <a href={url ? `${url}&download=1` : undefined} target="_blank" rel="noreferrer">
                              <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </a>
                          </td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Modal component co-located for simplicity
function GenerateModal(props: {
  open: boolean
  onClose: () => void
  prompt: string
  setPrompt: (v: string) => void
  count: number
  setCount: (n: number) => void
  onConfirm: () => void
  busy?: boolean
  limit?: number
  remaining?: number
}) {
  const { open, onClose, prompt, setPrompt, count, setCount, onConfirm, busy, limit = 100, remaining = 0 } = props

  // Form fields for detailed prompt generation
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [imageAngle, setImageAngle] = useState("")
  const [backgroundSetting, setBackgroundSetting] = useState("")
  const [lightingStyle, setLightingStyle] = useState("")
  const [moodStyle, setMoodStyle] = useState("")
  const [additionalElements, setAdditionalElements] = useState("")
  const [imageQuality, setImageQuality] = useState("")

  // Generate full prompt from form fields
  const generateFullPrompt = () => {
    const parts = []
    if (productName) parts.push(productName)
    if (productDescription) parts.push(`(${productDescription})`)
    if (imageAngle) parts.push(`${imageAngle} angle`)
    if (backgroundSetting) parts.push(`${backgroundSetting} background`)
    if (lightingStyle) parts.push(`${lightingStyle} lighting`)
    if (moodStyle) parts.push(`${moodStyle} style`)
    if (additionalElements) parts.push(additionalElements)
    if (imageQuality) parts.push(imageQuality)

    const fullPrompt = parts.join(", ")
    setPrompt(fullPrompt)
    return fullPrompt
  }

  const handleConfirm = () => {
    const fullPrompt = generateFullPrompt()
    if (fullPrompt.trim()) {
      onConfirm()
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={() => (!busy ? onClose() : undefined)} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-[#3f3f3f] bg-[#201b2d] p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Generate Product Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#afafaf] mb-1">Name of Product *</label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="bg-[#2b2b2b] border-[#3f3f3f] text-white"
                placeholder="e.g. Minimalist ceramic coffee mug"
              />
            </div>

            <div>
              <label className="block text-sm text-[#afafaf] mb-1">Description of Product</label>
              <Textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={3}
                className="bg-[#2b2b2b] border-[#3f3f3f] text-white"
                placeholder="materials, color, size, special features"
              />
            </div>

            <div>
              <label className="block text-sm text-[#afafaf] mb-1">Angle of Image</label>
              <Select value={imageAngle} onValueChange={setImageAngle}>
                <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                  <SelectValue placeholder="Choose angle" />
                </SelectTrigger>
                <SelectContent className="bg-[#2b2b2b] text-white border-[#3f3f3f]">
                  <SelectItem value="front view">Front view</SelectItem>
                  <SelectItem value="side view">Side view</SelectItem>
                  <SelectItem value="top-down">Top-down</SelectItem>
                  <SelectItem value="45° three-quarter">45° three-quarter</SelectItem>
                  <SelectItem value="diagonal">Diagonal</SelectItem>
                  <SelectItem value="bird's eye">Bird's eye</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-[#afafaf] mb-1">Background / Setting</label>
              <Select value={backgroundSetting} onValueChange={setBackgroundSetting}>
                <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                  <SelectValue placeholder="Choose background" />
                </SelectTrigger>
                <SelectContent className="bg-[#2b2b2b] text-white border-[#3f3f3f]">
                  <SelectItem value="plain white">Plain white</SelectItem>
                  <SelectItem value="lifestyle scene">Lifestyle scene</SelectItem>
                  <SelectItem value="studio lighting">Studio lighting</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="wooden table">Wooden table</SelectItem>
                  <SelectItem value="marble surface">Marble surface</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#afafaf] mb-1">Lighting Style</label>
              <Select value={lightingStyle} onValueChange={setLightingStyle}>
                <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                  <SelectValue placeholder="Choose lighting" />
                </SelectTrigger>
                <SelectContent className="bg-[#2b2b2b] text-white border-[#3f3f3f]">
                  <SelectItem value="soft daylight">Soft daylight</SelectItem>
                  <SelectItem value="dramatic shadows">Dramatic shadows</SelectItem>
                  <SelectItem value="neon glow">Neon glow</SelectItem>
                  <SelectItem value="flat catalog-style">Flat catalog-style</SelectItem>
                  <SelectItem value="warm ambient">Warm ambient</SelectItem>
                  <SelectItem value="bright studio">Bright studio</SelectItem>
                  <SelectItem value="golden hour">Golden hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-[#afafaf] mb-1">Mood / Style</label>
              <Select value={moodStyle} onValueChange={setMoodStyle}>
                <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                  <SelectValue placeholder="Choose mood" />
                </SelectTrigger>
                <SelectContent className="bg-[#2b2b2b] text-white border-[#3f3f3f]">
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                  <SelectItem value="futuristic">Futuristic</SelectItem>
                  <SelectItem value="rustic">Rustic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-[#afafaf] mb-1">Additional Elements</label>
              <Input
                value={additionalElements}
                onChange={(e) => setAdditionalElements(e.target.value)}
                className="bg-[#2b2b2b] border-[#3f3f3f] text-white"
                placeholder="props, human hand holding, scale objects"
              />
            </div>

            <div>
              <label className="block text-sm text-[#afafaf] mb-1">Image Quality Specs</label>
              <Select value={imageQuality} onValueChange={setImageQuality}>
                <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                  <SelectValue placeholder="Choose quality" />
                </SelectTrigger>
                <SelectContent className="bg-[#2b2b2b] text-white border-[#3f3f3f]">
                  <SelectItem value="high resolution, photorealistic">High resolution, photorealistic</SelectItem>
                  <SelectItem value="8k, hyper-detailed">8K, hyper-detailed</SelectItem>
                  <SelectItem value="4k, ultra-sharp">4K, ultra-sharp</SelectItem>
                  <SelectItem value="professional photography">Professional photography</SelectItem>
                  <SelectItem value="commercial grade">Commercial grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Generated Prompt Preview */}
        <div className="mt-4">
          <label className="block text-sm text-[#afafaf] mb-1">Generated Prompt Preview</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="bg-[#2b2b2b] border-[#3f3f3f] text-white"
            placeholder="Your generated prompt will appear here..."
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-[#afafaf] border-[#3f3f3f]"
            onClick={generateFullPrompt}
          >
            Update Preview
          </Button>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-[#afafaf] mb-1">Number of images (1-8)</label>
          <Input
            type="number"
            min={1}
            max={8}
            value={count}
            onChange={(e) => {
              const v = parseInt(e.target.value || "2", 10)
              if (!Number.isNaN(v)) setCount(Math.max(1, Math.min(8, v)))
            }}
            className="bg-[#2b2b2b] border-[#3f3f3f] text-white w-32"
          />
          <div className="text-xs text-[#afafaf] mt-1">Remaining this month: {remaining}/{limit}</div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" className="text-[#afafaf]" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={busy || count > remaining || !productName.trim()} className="bg-gradient-to-r from-[#6fbf3a] to-[#38a169]">
            {busy ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  )
}
