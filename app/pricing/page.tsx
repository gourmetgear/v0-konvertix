"use client"

import { useState } from "react"
import { Check, BadgePercent, Zap, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  const [tab, setTab] = useState<"paid" | "seo" | "full">("paid")

  const plansByTab: Record<typeof tab, Array<{ title: string; price: string; items: string[]; highlight?: boolean; badge?: string }>> = {
    paid: [
      {
        title: "Basic plan",
        price: "$10/mth",
        items: [
          "Access to all basic features",
          "Basic reporting and analytics",
          "Up to 10 individual users",
          "20GB individual data each user",
          "Basic chat and email support",
        ],
      },
      {
        title: "Business plan",
        price: "$20/mth",
        highlight: true,
        badge: "Best Value",
        items: [
          "200+ integrations",
          "Advanced reporting and analytics",
          "Up to 20 individual users",
          "40GB individual data each user",
          "Priority chat and email support",
          "Cancel anytime",
          "14- day free trial",
          "24/7 Support",
        ],
      },
      {
        title: "Enterprise plan",
        price: "$40/mth",
        items: [
          "Advanced custom fields",
          "Audit log and data history",
          "Unlimited individual users",
          "Unlimited individual data",
          "Personalised+priority service",
        ],
      },
    ],
    seo: [
      {
        title: "Starter SEO",
        price: "$15/mth",
        items: [
          "Keyword tracking (50 keywords)",
          "Basic site audit",
          "Monthly ranking report",
          "Email support",
        ],
      },
      {
        title: "Pro SEO",
        price: "$30/mth",
        highlight: true,
        badge: "Best Value",
        items: [
          "Keyword tracking (250 keywords)",
          "Advanced site audit + fixes",
          "Backlink monitoring",
          "Content recommendations",
          "Weekly ranking reports",
          "Priority support",
        ],
      },
      {
        title: "Enterprise SEO",
        price: "$60/mth",
        items: [
          "Unlimited keyword tracking",
          "Technical SEO concierge",
          "Custom dashboards",
          "Dedicated success manager",
          "SLA support",
        ],
      },
    ],
    full: [
      {
        title: "Growth Starter",
        price: "$25/mth",
        items: [
          "Paid Ads + SEO lite",
          "Automation templates",
          "Reporting dashboard",
          "Email support",
        ],
      },
      {
        title: "Growth Suite",
        price: "$45/mth",
        highlight: true,
        badge: "Best Value",
        items: [
          "Paid Ads + SEO + Automation",
          "Multichannel attribution",
          "Advanced reporting",
          "Priority support",
        ],
      },
      {
        title: "Growth Enterprise",
        price: "$90/mth",
        items: [
          "Custom playbooks",
          "Full-funnel reporting",
          "Unlimited users & workspaces",
          "Dedicated success manager",
        ],
      },
    ],
  }

  const TabButton = ({ value, label }: { value: typeof tab; label: string }) => (
    <button
      onClick={() => setTab(value)}
      className={`px-6 py-2 rounded-md text-sm border border-[#2b2b2b] transition-colors ${
        tab === value
          ? "text-white bg-gradient-to-r from-[#a545b6] to-[#cd4f9d]"
          : "text-[#afafaf] hover:text-white"
      }`}
    >
      {label}
    </button>
  )

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6">
          <span className="inline-block rounded-full border border-[#2b2b2b] bg-[#171226] px-3 py-1 text-xs text-white/90">
            Pricing
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          Choose the Plan That Fits You Best
        </h1>

        {/* Tabs */}
        <div className="mb-12 flex items-center gap-2">
          <TabButton value="paid" label="Paid Ads" />
          <TabButton value="seo" label="SEO" />
          <TabButton value="full" label="Full services" />
        </div>

        {/* Cards (switch with tab) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plansByTab[tab].map((p, idx) => (
            <PlanCard
              key={`${tab}-${idx}`}
              icon={idx === 0 ? <Zap className="w-6 h-6" /> : idx === 1 ? <BadgePercent className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
              title={p.title}
              price={p.price}
              cta="Get started"
              items={p.items}
              highlight={p.highlight}
              badge={p.badge}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <Button variant="outline" className="w-full max-w-xs border-[#3f3f3f] text-white bg-transparent hover:bg-[#3f3f3f]">
            Get started
          </Button>
        </div>
      </div>
    </main>
  )
}

function PlanCard({
  title,
  price,
  items,
  cta,
  icon,
  highlight,
  badge,
}: {
  title: string
  price: string
  items: string[]
  cta: string
  icon: React.ReactNode
  highlight?: boolean
  badge?: string
}) {
  return (
    <div
      className={`relative rounded-2xl border ${
        highlight ? "bg-[#cd4f9d] border-[#cd4f9d]" : "bg-[#1b1527] border-[#2b2b2b]"
      } p-6 flex flex-col`}
    >
      <div
        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
          highlight ? "bg-white/20 text-white" : "bg-white/10 text-white"
        }`}
      >
        {icon}
      </div>
      <h3 className={`text-center text-xl font-semibold ${highlight ? "text-white" : "text-white"}`}>{title}</h3>
      {highlight && badge && (
        <span className="absolute right-4 top-4 rounded-md bg-white/20 px-2 py-1 text-xs text-white">{badge}</span>
      )}
      <div className="my-4 text-center">
        <div className="text-4xl font-extrabold">{price}</div>
        <div className="text-white/70 text-sm mt-1">Billed annually.</div>
      </div>
      <ul className="space-y-3 text-white/90 text-sm">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2">
            <span className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${highlight ? "bg-white/25" : "bg-white/10"}`}>
              <Check className="h-3.5 w-3.5" />
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button
          className={`w-full ${
            highlight
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
          }`}
        >
          {cta}
        </Button>
      </div>
    </div>
  )
}
