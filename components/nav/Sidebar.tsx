"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, TrendingUp, Users, Target, Search, Wrench, Briefcase, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"

type Item = { name: string; href: string; icon: any }

const items: Item[] = [
  { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { name: "Reports", icon: TrendingUp, href: "/reports" },
  { name: "Documents", icon: Users, href: "/documents" },
  { name: "Campaigns", icon: Target, href: "/campaigns" },
  { name: "SEO", icon: Search, href: "/seo" },
  { name: "Tools", icon: Wrench, href: "/tools" },
  { name: "Support", icon: Users, href: "/support" },
  { name: "Services", icon: Briefcase, href: "/services" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      router.push("/auth/login")
    }
  }

  return (
    <div className="w-64 bg-[#201b2d] border-r border-[#2b2b2b] p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">K</span>
        </div>
        <span className="text-xl font-bold">Konvertix</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href}>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                  active
                    ? "bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] text-white"
                    : "text-[#afafaf] hover:text-white hover:bg-[#2b2b2b]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="pt-6">
        <Button variant="ghost" className="w-full justify-start text-[#afafaf] hover:text-white" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  )
}

