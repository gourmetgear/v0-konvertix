import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import AppShell from "@/components/layout/AppShell"
import "./globals.css"

export const metadata: Metadata = {
  title: "Konvertix - Marketing Analytics Platform",
  description: "AI-powered marketing analytics for smarter growth and faster scaling",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AppShell>
          {children}
        </AppShell>
        <Analytics />
      </body>
    </html>
  )
}
