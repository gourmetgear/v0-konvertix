"use client"

import { Suspense } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/nav/Sidebar"
import AppHeader from "@/components/layout/AppHeader"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide app chrome on public/marketing and auth pages
  const isLanding =
    pathname === "/" ||
    pathname === "/pricing" ||
    pathname === "/contact" ||
    pathname === "/onboarding" ||
    pathname === "/help-center" ||
    pathname === "/faq" ||
    (pathname && pathname.startsWith("/auth")) ||
    (pathname && pathname.startsWith("/legal"))

  if (isLanding) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <div className="flex-1">
          <Suspense fallback={null}>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}
