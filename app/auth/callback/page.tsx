"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthCallbackPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [status, setStatus] = useState<"checking" | "error" | "ok">("checking")
  const [message, setMessage] = useState("Signing you in...")

  useEffect(() => {
    const handle = async () => {
      try {
        const code = search.get("code")
        // If a PKCE/magic link code is present, exchange it for a session
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            setStatus("error")
            setMessage(error.message)
            return
          }
        }

        // detectSessionInUrl will also auto-recover sessions from URL hash
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setStatus("ok")
          router.replace("/onboarding")
        } else {
          setStatus("error")
          setMessage("Could not complete sign-in from link.")
        }
      } catch (e) {
        setStatus("error")
        setMessage("Unexpected error while completing sign-in.")
      }
    }
    handle()
  }, [router, search])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Authenticating…</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "error" && (
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/auth/login">Back to login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

