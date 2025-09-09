"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
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
  SearchIcon,
  Wrench,
  Link2,
  Calculator,
  Hash,
  Calendar,
  Zap,
  Copy,
  ExternalLink,
  Download,
  RefreshCw,
  Wand2,
} from "lucide-react"
import Link from "next/link"

export default function ToolsPage() {
  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Reports", icon: TrendingUp, href: "/reports" },
    { name: "Documents", icon: Users, href: "/documents" },
    { name: "Campaigns", icon: Target, href: "/campaigns" },
    { name: "SEO", icon: SearchIcon, href: "/seo" },
    { name: "Tools", icon: Wrench, href: "/tools", active: true },
    { name: "Support", icon: HeadphonesIcon, href: "/support" },
    { name: "Services", icon: Users, href: "/services" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ]

  const tools = [
    {
      title: "URL Shortener",
      description: "Create short, trackable links for your campaigns",
      icon: Link2,
      category: "Link Management",
    },
    {
      title: "UTM Builder",
      description: "Generate UTM parameters for campaign tracking",
      icon: Hash,
      category: "Analytics",
    },
    {
      title: "ROI Calculator",
      description: "Calculate return on investment for your campaigns",
      icon: Calculator,
      category: "Finance",
    },
    {
      title: "A/B Test Calculator",
      description: "Determine statistical significance of your tests",
      icon: BarChart3,
      category: "Testing",
    },
    {
      title: "Social Media Scheduler",
      description: "Schedule and manage social media posts",
      icon: Calendar,
      category: "Social Media",
    },
    {
      title: "Conversion Rate Optimizer",
      description: "Analyze and optimize conversion funnels",
      icon: Zap,
      category: "Optimization",
    },
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

        {/* Tools Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Marketing Tools</h1>
              <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/tools/ad-generator">
                <Card className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6] transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <Wand2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Ad Generator</CardTitle>
                        <Badge variant="secondary" className="bg-[#3f3f3f] text-[#afafaf] text-xs">
                          AI-Powered
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#afafaf] mb-4">Create perfect Facebook product ads with AI assistance</p>
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      Launch Tool
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/target-audience-analyzer">
                <Card className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6] transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Target Audience Analyzer</CardTitle>
                        <Badge variant="secondary" className="bg-[#3f3f3f] text-[#afafaf] text-xs">
                          AI-Powered
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#afafaf] mb-4">Discover optimal audiences with ChatGPT analysis</p>
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      Launch Tool
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/competitor-analysis">
                <Card className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6] transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Competitor Analysis</CardTitle>
                        <Badge variant="secondary" className="bg-[#3f3f3f] text-[#afafaf] text-xs">
                          AI-Powered
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#afafaf] mb-4">Analyze competitors and discover market opportunities</p>
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      Launch Tool
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              {tools.map((tool, index) => (
                <Card
                  key={index}
                  className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6] transition-colors cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <tool.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{tool.title}</CardTitle>
                        <Badge variant="secondary" className="bg-[#3f3f3f] text-[#afafaf] text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#afafaf] mb-4">{tool.description}</p>
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      Launch Tool
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Featured Tools Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* URL Shortener Tool */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Link2 className="h-5 w-5 mr-2" />
                    URL Shortener
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="long-url" className="text-[#afafaf]">
                      Long URL
                    </Label>
                    <Input
                      id="long-url"
                      placeholder="https://example.com/very-long-url"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-alias" className="text-[#afafaf]">
                      Custom Alias (Optional)
                    </Label>
                    <Input
                      id="custom-alias"
                      placeholder="my-campaign"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                    <Link2 className="h-4 w-4 mr-2" />
                    Shorten URL
                  </Button>
                  <div className="p-3 bg-[#3f3f3f] rounded-lg flex items-center justify-between">
                    <span className="text-white text-sm">knvx.co/abc123</span>
                    <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* UTM Builder Tool */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Hash className="h-5 w-5 mr-2" />
                    UTM Builder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website-url" className="text-[#afafaf]">
                      Website URL
                    </Label>
                    <Input
                      id="website-url"
                      placeholder="https://example.com"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="utm-source" className="text-[#afafaf]">
                        Source
                      </Label>
                      <Input
                        id="utm-source"
                        placeholder="google"
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utm-medium" className="text-[#afafaf]">
                        Medium
                      </Label>
                      <Input
                        id="utm-medium"
                        placeholder="cpc"
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="utm-campaign" className="text-[#afafaf]">
                      Campaign
                    </Label>
                    <Input
                      id="utm-campaign"
                      placeholder="summer-sale-2024"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                    <Hash className="h-4 w-4 mr-2" />
                    Generate UTM URL
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* ROI Calculator */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investment" className="text-[#afafaf]">
                      Investment ($)
                    </Label>
                    <Input
                      id="investment"
                      type="number"
                      placeholder="10000"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue" className="text-[#afafaf]">
                      Revenue ($)
                    </Label>
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="15000"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">ROI</Label>
                    <div className="p-3 bg-[#3f3f3f] rounded-lg">
                      <span className="text-green-500 font-bold text-lg">50%</span>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Calculate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
