"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Settings,
  HeadphonesIcon,
  Upload,
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Reports", icon: TrendingUp, href: "/reports" },
    { name: "Documents", icon: Users, href: "/documents" },
    { name: "Campaigns", icon: Target, href: "/campaigns" },
    { name: "SEO", icon: Search, href: "/seo" },
    { name: "Tools", icon: Users, href: "/tools" },
    { name: "Support", icon: HeadphonesIcon, href: "/support" },
    { name: "Services", icon: Users, href: "/services" },
    { name: "Settings", icon: Settings, href: "/settings", active: true },
  ]

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#201b2d] border-r border-[#2b2b2b] p-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-xl font-bold">Konvertix</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                  item.active
                    ? "bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] text-white"
                    : "text-[#afafaf] hover:text-white hover:bg-[#2b2b2b]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#201b2d] border-b border-[#2b2b2b] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-[#2b2b2b] border-[#3f3f3f] text-white placeholder-[#afafaf] w-80"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-[#afafaf] hover:text-white">
                Select Business Manager
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl space-y-8">
            {/* Page Header */}
            <h1 className="text-3xl font-bold">Settings</h1>

            {/* Personal Profile Section */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Personal Profile</h2>

                {/* Profile Picture Upload */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#3f3f3f] rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-[#afafaf]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Upload Profile</p>
                    <p className="text-xs text-[#afafaf]">Min 600x600.PNG, JPEG</p>
                  </div>
                  <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                    Upload
                  </Button>
                </div>

                {/* Name and Email Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      placeholder="Name"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      placeholder="Mail id"
                      type="email"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="password"
                      value="••••••••••"
                      readOnly
                      className="flex-1 bg-[#3f3f3f] border-[#4f4f4f] text-white"
                    />
                    <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                      Change
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info Section */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Company Info</h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="password"
                        value="••••••••••"
                        readOnly
                        className="flex-1 bg-[#3f3f3f] border-[#4f4f4f] text-white"
                      />
                      <Button
                        variant="outline"
                        className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                      >
                        Upload
                      </Button>
                    </div>
                  </div>

                  {/* Website Address */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Website address</label>
                    <Input
                      placeholder="https://"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals & Budgets Section */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Goals & Budgets</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Desired ROAS</label>
                    <Input
                      placeholder="ROAS"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Daily Spend</label>
                    <Input
                      placeholder="Spend"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Button */}
            <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90 px-8">
              Edit Profile
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
