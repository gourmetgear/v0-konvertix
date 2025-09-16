"use client"
import Sidebar from "@/components/nav/Sidebar"
import ComprehensiveMetricsDashboard from "@/components/ComprehensiveMetricsDashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
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
  Eye,
  Download,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const performanceData = [
  { month: "Jan", value1: 100, value2: 80 },
  { month: "Feb", value1: 120, value2: 90 },
  { month: "Mar", value1: 180, value2: 140 },
  { month: "Apr", value1: 160, value2: 180 },
  { month: "May", value1: 90, value2: 120 },
  { month: "Jun", value1: 140, value2: 160 },
  { month: "Jul", value1: 180, value2: 140 },
  { month: "Aug", value1: 160, value2: 180 },
  { month: "Sep", value1: 140, value2: 160 },
  { month: "Oct", value1: 120, value2: 100 },
  { month: "Nov", value1: 100, value2: 80 },
  { month: "Dec", value1: 160, value2: 140 },
]

const campaigns = [
  { name: "Summer Sale 2025", spend: "27,800", revenue: "1,25,000", roas: "4.5", conversions: "320", status: "Active" },
  {
    name: "Back-to-School Promo",
    spend: "27,800",
    revenue: "27,800",
    roas: "4.5",
    conversions: "320",
    status: "Paused",
  },
  { name: "Festive Offers", spend: "27,800", revenue: "1,25,000", roas: "4.5", conversions: "320", status: "Active" },
  {
    name: "New Arrivals Campaign",
    spend: "27,800",
    revenue: "1,25,000",
    roas: "3.8",
    conversions: "320",
    status: "Active",
  },
  {
    name: "Loyalty Members Special",
    spend: "27,800",
    revenue: "1,25,000",
    roas: "3.8",
    conversions: "320",
    status: "Paused",
  },
]

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      // Check onboarding first
      const onboardingData = localStorage.getItem("konvertix-onboarding")
      if (!onboardingData) {
        window.location.href = "/onboarding"
        return
      }
      
      try {
        const parsedData = JSON.parse(onboardingData)
        if (!parsedData.completed) {
          window.location.href = "/onboarding"
          return
        }
      } catch (e) {
        window.location.href = "/onboarding"
        return
      }

      // Get current user
      try {
        const { data: userRes } = await supabase.auth.getUser()
        if (userRes.user) {
          setUserId(userRes.user.id)
        }
      } catch (error) {
        console.error('Failed to get user:', error)
      }
      
      setLoading(false)
    }

    loadUserData()
  }, [])


  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#afafaf] mb-1">Hi User,</h1>
              <h2 className="text-3xl font-bold">Welcome to Konvertix!</h2>
            </div>
            <div className="text-[#afafaf]">📅 28 June -31 August 2025</div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-[#5e2e6c] to-[#401958] border-[#2b2b2b]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-[#f8c140]" />
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Total Spend</CardTitle>
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
                <p className="text-xs text-[#afafaf] mt-1">Total ad spend this month</p>
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
                <p className="text-xs text-[#afafaf] mt-1">Total ad spend this month</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-[#f8c140]" />
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Return on Ad Spend</CardTitle>
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
                <p className="text-xs text-[#afafaf] mt-1">Revenue earned per $1 spent</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-[#f73c3c]" />
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Conversions</CardTitle>
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
                <p className="text-xs text-[#afafaf] mt-1">Total conversions tracked</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <Card className="lg:col-span-2 bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white">Performance Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                      <XAxis dataKey="month" stroke="#afafaf" />
                      <YAxis stroke="#afafaf" />
                      <Line
                        type="monotone"
                        dataKey="value1"
                        stroke="#f8c140"
                        strokeWidth={3}
                        dot={{ fill: "#f8c140", strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value2"
                        stroke="#a545b6"
                        strokeWidth={3}
                        dot={{ fill: "#a545b6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Performance */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Campaign performance</CardTitle>
                <Button variant="ghost" className="text-[#afafaf] hover:text-white">
                  Last 7 Days
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">₹5,10,000</span>
                  <Badge className="bg-[#03ba2b] text-white">+5.4%</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#afafaf]">• Summer Sale 2025</span>
                      <span className="text-sm text-white">1,25,000</span>
                    </div>
                    <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-xs text-[#afafaf]">4.5 ROAS</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#afafaf]">• Back-to-School</span>
                      <span className="text-sm text-white">1,25,000</span>
                    </div>
                    <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#03ba2b] to-[#377e36] h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-xs text-[#afafaf]">4.5 ROAS</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#afafaf]">• Festive offers</span>
                      <span className="text-sm text-white">1,25,000</span>
                    </div>
                    <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#f8c140] to-[#f6cf7d] h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-xs text-[#afafaf]">4.5 ROAS</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#afafaf]">• New Arrival Campaign</span>
                      <span className="text-sm text-white">1,25,000</span>
                    </div>
                    <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#4a48ff] to-[#697be9] h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-xs text-[#afafaf]">4.5 ROAS</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best Performing Campaigns Table */}
          <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Best Performing Campaigns</CardTitle>
              <Button variant="ghost" className="text-[#afafaf] hover:text-white">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#3f3f3f]">
                      <th className="text-left py-3 px-4 text-[#afafaf] font-medium">CAMPAIGN NAME</th>
                      <th className="text-left py-3 px-4 text-[#afafaf] font-medium">SPEND (₹)</th>
                      <th className="text-left py-3 px-4 text-[#afafaf] font-medium">REVENUE (₹)</th>
                      <th className="text-left py-3 px-4 text-[#afafaf] font-medium">ROAS</th>
                      <th className="text-left py-3 px-4 text-[#afafaf] font-medium">CONVERSIONS</th>
                      <th className="text-left py-3 px-4 text-[#afafaf] font-medium">STATUS</th>
                      <th className="text-left py-3 px-4 text-[#afafaf] font-medium">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign, index) => (
                      <tr key={index} className="border-b border-[#3f3f3f] hover:bg-[#3f3f3f]/30">
                        <td className="py-4 px-4 text-white">{campaign.name}</td>
                        <td className="py-4 px-4 text-white">{campaign.spend}</td>
                        <td className="py-4 px-4 text-white">{campaign.revenue}</td>
                        <td className="py-4 px-4 text-white">{campaign.roas}</td>
                        <td className="py-4 px-4 text-white">{campaign.conversions}</td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              campaign.status === "Active" ? "bg-[#03ba2b] text-white" : "bg-[#f73c3c] text-white"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#afafaf] hover:text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <span className="text-[#afafaf]">View</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#afafaf] hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Metrics Dashboard */}
          {userId && (
            <div className="space-y-6">
              <ComprehensiveMetricsDashboard userId={userId} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
