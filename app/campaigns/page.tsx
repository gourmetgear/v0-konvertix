"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Plus,
  Filter,
  Download,
  Play,
  Pause,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CampaignsPage() {
  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Reports", icon: TrendingUp, href: "/reports" },
    { name: "Documents", icon: Users, href: "/documents" },
    { name: "Campaigns", icon: Target, href: "/campaigns", active: true },
    { name: "SEO", icon: Search, href: "/seo" }, // Fixed to use Search icon from lucide-react
    { name: "Support", icon: HeadphonesIcon, href: "/support" },
    { name: "Services", icon: Users, href: "/services" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ]

  const campaigns = [
    {
      id: 1,
      name: "Summer Sale 2025",
      status: "Active",
      budget: "$5,000",
      spent: "$3,200",
      impressions: "125,000",
      clicks: "2,450",
      conversions: "89",
      ctr: "1.96%",
      cpc: "$1.31",
      roas: "4.2x",
      startDate: "Aug 1, 2025",
      endDate: "Aug 31, 2025",
    },
    {
      id: 2,
      name: "Back-to-School Promo",
      status: "Paused",
      budget: "$3,500",
      spent: "$2,100",
      impressions: "89,000",
      clicks: "1,780",
      conversions: "45",
      ctr: "2.00%",
      cpc: "$1.18",
      roas: "3.8x",
      startDate: "Jul 15, 2025",
      endDate: "Sep 15, 2025",
    },
    {
      id: 3,
      name: "Holiday Collection",
      status: "Draft",
      budget: "$8,000",
      spent: "$0",
      impressions: "0",
      clicks: "0",
      conversions: "0",
      ctr: "0%",
      cpc: "$0",
      roas: "0x",
      startDate: "Dec 1, 2025",
      endDate: "Dec 31, 2025",
    },
    {
      id: 4,
      name: "New Product Launch",
      status: "Active",
      budget: "$4,200",
      spent: "$2,800",
      impressions: "98,500",
      clicks: "1,970",
      conversions: "67",
      ctr: "2.00%",
      cpc: "$1.42",
      roas: "3.9x",
      startDate: "Aug 10, 2025",
      endDate: "Sep 10, 2025",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
      case "Paused":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Paused</Badge>
      case "Draft":
        return <Badge className="bg-gray-600 hover:bg-gray-700">Draft</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

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

        {/* Campaigns Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Link href="/campaigns/create">
                  <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </Link>
              </div>
            </div>

            {/* Campaign Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Total Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-green-500">+2 this month</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-green-500">+1 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Total Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,100</div>
                  <p className="text-xs text-red-500">-5.2% vs last month</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Avg ROAS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.97x</div>
                  <p className="text-xs text-green-500">+8.1% vs last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-10 bg-[#2b2b2b] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                    Status: All
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <DropdownMenuItem className="text-white hover:bg-[#3f3f3f]">All</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#3f3f3f]">Active</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#3f3f3f]">Paused</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#3f3f3f]">Draft</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Campaigns Table */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                      <TableHead className="text-[#afafaf]">Campaign Name</TableHead>
                      <TableHead className="text-[#afafaf]">Status</TableHead>
                      <TableHead className="text-[#afafaf]">Budget</TableHead>
                      <TableHead className="text-[#afafaf]">Spent</TableHead>
                      <TableHead className="text-[#afafaf]">Impressions</TableHead>
                      <TableHead className="text-[#afafaf]">Clicks</TableHead>
                      <TableHead className="text-[#afafaf]">CTR</TableHead>
                      <TableHead className="text-[#afafaf]">CPC</TableHead>
                      <TableHead className="text-[#afafaf]">ROAS</TableHead>
                      <TableHead className="text-[#afafaf]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                        <TableCell className="font-medium text-white">{campaign.name}</TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell className="text-white">{campaign.budget}</TableCell>
                        <TableCell className="text-white">{campaign.spent}</TableCell>
                        <TableCell className="text-white">{campaign.impressions}</TableCell>
                        <TableCell className="text-white">{campaign.clicks}</TableCell>
                        <TableCell className="text-white">{campaign.ctr}</TableCell>
                        <TableCell className="text-white">{campaign.cpc}</TableCell>
                        <TableCell className="text-white">{campaign.roas}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {campaign.status === "Active" ? (
                              <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : campaign.status === "Paused" ? (
                              <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                                <Play className="h-4 w-4" />
                              </Button>
                            ) : null}
                            <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                                <DropdownMenuItem className="text-white hover:bg-[#3f3f3f]">
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-[#3f3f3f]">Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:bg-[#3f3f3f]">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
