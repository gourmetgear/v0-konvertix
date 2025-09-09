"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Bell,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  BarChart3,
  Download,
  Wrench,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import Link from "next/link"

const spendData = [
  { day: "Sun", spend: 2400 },
  { day: "Mon", spend: 2200 },
  { day: "Tue", spend: 2100 },
  { day: "Wed", spend: 2300 },
  { day: "Thu", spend: 2500 },
  { day: "Fri", spend: 2800 },
  { day: "Sat", spend: 2600 },
]

const ctrData = [
  { campaign: "Summer Sale 2025", ctr: 800 },
  { campaign: "Back to school", ctr: 600 },
  { campaign: "New arrival", ctr: 400 },
  { campaign: "Festive offer", ctr: 650 },
  { campaign: "Back to school", ctr: 700 },
]

const roasData = [
  { campaign: "Summer sale 2025", roas: 5.8 },
  { campaign: "Festive offer", roas: 4.2 },
  { campaign: "New arrival", roas: 3.5 },
  { campaign: "Back to school", roas: 4.8 },
  { campaign: "Festive offer", roas: 2.1 },
  { campaign: "Festive offer", roas: 1.8 },
]

const revenueData = [
  { day: "Sun", revenue: 2400 },
  { day: "Mon", revenue: 1800 },
  { day: "Tue", revenue: 3200 },
  { day: "Wed", revenue: 2100 },
  { day: "Thu", revenue: 2800 },
  { day: "Fri", revenue: 3600 },
  { day: "Sat", revenue: 1200 },
]

export default function ReportsPage() {
  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Reports", icon: TrendingUp, href: "/reports", active: true },
    { name: "Documents", icon: Users, href: "/documents" },
    { name: "Campaigns", icon: Target, href: "/campaigns" },
    { name: "SEO", icon: Search, href: "/seo" },
    { name: "Tools", icon: Wrench, href: "/tools" },
    { name: "Support", icon: Users, href: "/support" },
    { name: "Services", icon: Users, href: "/services" },
    { name: "Settings", icon: Users, href: "/settings" },
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

        <div className="mt-auto pt-6"></div>
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
              <div className="w-8 h-8 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Reports Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Reports</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-[#afafaf] hover:text-white">
                Last 7 Days
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-[#5e2e6c] to-[#401958] border-[#2b2b2b]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-[#f8c140]" />
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Spend</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4 text-[#afafaf]" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$12,450</div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-[#03ba2b]" />
                  <span className="text-[#03ba2b]">+8.12%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-[#f73c3c]" />
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Revenue</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4 text-[#afafaf]" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$58,320</div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingDown className="h-3 w-3 text-[#f73c3c]" />
                  <span className="text-[#f73c3c]">-2.15%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-[#f8c140]" />
                  <CardTitle className="text-sm font-medium text-[#afafaf]">RAOS</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4 text-[#afafaf]" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">4.7x</div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-[#03ba2b]" />
                  <span className="text-[#03ba2b]">+8.12%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-[#f73c3c]" />
                  <CardTitle className="text-sm font-medium text-[#afafaf]">CTR</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4 text-[#afafaf]" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">3,215</div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingDown className="h-3 w-3 text-[#f73c3c]" />
                  <span className="text-[#f73c3c]">-2.15%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Spend Chart */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white">Total spend</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-[#afafaf]">
                  <span>Spend</span>
                  <span className="text-white font-semibold">2,678</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                      <XAxis dataKey="day" stroke="#afafaf" />
                      <YAxis stroke="#afafaf" />
                      <Line
                        type="monotone"
                        dataKey="spend"
                        stroke="#a545b6"
                        strokeWidth={3}
                        dot={{ fill: "#a545b6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-[#afafaf] text-center mt-2">Weeks</div>
              </CardContent>
            </Card>

            {/* Click-Through Rate Chart */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white">Click-Through Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ctrData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                      <XAxis type="number" stroke="#afafaf" />
                      <YAxis dataKey="campaign" type="category" stroke="#afafaf" width={100} />
                      <Bar dataKey="ctr" fill="#a545b6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-[#afafaf] text-center mt-2">Campaign names</div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RAOS Chart */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white">RAOS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roasData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#afafaf]">{item.campaign}</span>
                      </div>
                      <div className="w-full bg-[#3f3f3f] rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] h-3 rounded-full"
                          style={{ width: `${(item.roas / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-[#afafaf] mt-4">
                  <span>1.0x</span>
                  <span>2.8x</span>
                  <span>3.5x</span>
                  <span>4.2x</span>
                  <span>5.8x</span>
                </div>
                <div className="text-xs text-[#afafaf] text-center mt-2">RAOS values</div>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white">Revenue</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-[#afafaf]">
                  <span>Revenue</span>
                  <span className="text-white font-semibold">2,678</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                      <XAxis dataKey="day" stroke="#afafaf" />
                      <YAxis stroke="#afafaf" />
                      <Bar dataKey="revenue" fill="#a545b6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-[#afafaf] text-center mt-2">Week</div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
