"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
  ArrowLeft,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateCampaignPage() {
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    type: "",
    platform: "",
    budget: "",
    dailyBudget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    objectives: "",
    bidStrategy: "",
    status: "draft",
  })

  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Reports", icon: TrendingUp, href: "/reports" },
    { name: "Documents", icon: Users, href: "/documents" },
    { name: "Campaigns", icon: Target, href: "/campaigns", active: true },
    { name: "Support", icon: HeadphonesIcon, href: "/support" },
    { name: "Services", icon: Users, href: "/services" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle campaign creation logic here
    console.log("Creating campaign:", campaignData)
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

        {/* Create Campaign Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center space-x-4">
              <Link href="/campaigns">
                <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Create New Campaign</h1>
                <p className="text-[#afafaf] mt-1">
                  Set up your marketing campaign with detailed targeting and budget settings
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-[#a545b6]" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Campaign Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter campaign name"
                        value={campaignData.name}
                        onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Campaign Type</Label>
                      <Select
                        value={campaignData.type}
                        onValueChange={(value) => setCampaignData({ ...campaignData, type: value })}
                      >
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                          <SelectItem value="paid-ads" className="text-white hover:bg-[#3f3f3f]">
                            Paid Ads
                          </SelectItem>
                          <SelectItem value="seo" className="text-white hover:bg-[#3f3f3f]">
                            SEO
                          </SelectItem>
                          <SelectItem value="email" className="text-white hover:bg-[#3f3f3f]">
                            Email Marketing
                          </SelectItem>
                          <SelectItem value="social" className="text-white hover:bg-[#3f3f3f]">
                            Social Media
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your campaign objectives and strategy"
                      value={campaignData.description}
                      onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf] min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Platform & Budget */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-[#a545b6]" />
                    <span>Platform & Budget</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select
                        value={campaignData.platform}
                        onValueChange={(value) => setCampaignData({ ...campaignData, platform: value })}
                      >
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                          <SelectItem value="google" className="text-white hover:bg-[#3f3f3f]">
                            Google Ads
                          </SelectItem>
                          <SelectItem value="facebook" className="text-white hover:bg-[#3f3f3f]">
                            Meta (Facebook/Instagram)
                          </SelectItem>
                          <SelectItem value="linkedin" className="text-white hover:bg-[#3f3f3f]">
                            LinkedIn
                          </SelectItem>
                          <SelectItem value="twitter" className="text-white hover:bg-[#3f3f3f]">
                            Twitter
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Total Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="5000"
                        value={campaignData.budget}
                        onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dailyBudget">Daily Budget ($)</Label>
                      <Input
                        id="dailyBudget"
                        type="number"
                        placeholder="150"
                        value={campaignData.dailyBudget}
                        onChange={(e) => setCampaignData({ ...campaignData, dailyBudget: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule & Targeting */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-[#a545b6]" />
                    <span>Schedule & Targeting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={campaignData.startDate}
                        onChange={(e) => setCampaignData({ ...campaignData, startDate: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={campaignData.endDate}
                        onChange={(e) => setCampaignData({ ...campaignData, endDate: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Textarea
                      id="targetAudience"
                      placeholder="Define your target audience demographics, interests, and behaviors"
                      value={campaignData.targetAudience}
                      onChange={(e) => setCampaignData({ ...campaignData, targetAudience: e.target.value })}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Settings */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-[#a545b6]" />
                    <span>Campaign Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="objectives">Campaign Objectives</Label>
                      <Select
                        value={campaignData.objectives}
                        onValueChange={(value) => setCampaignData({ ...campaignData, objectives: value })}
                      >
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select objective" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                          <SelectItem value="awareness" className="text-white hover:bg-[#3f3f3f]">
                            Brand Awareness
                          </SelectItem>
                          <SelectItem value="traffic" className="text-white hover:bg-[#3f3f3f]">
                            Website Traffic
                          </SelectItem>
                          <SelectItem value="conversions" className="text-white hover:bg-[#3f3f3f]">
                            Conversions
                          </SelectItem>
                          <SelectItem value="leads" className="text-white hover:bg-[#3f3f3f]">
                            Lead Generation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bidStrategy">Bid Strategy</Label>
                      <Select
                        value={campaignData.bidStrategy}
                        onValueChange={(value) => setCampaignData({ ...campaignData, bidStrategy: value })}
                      >
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select bid strategy" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                          <SelectItem value="manual-cpc" className="text-white hover:bg-[#3f3f3f]">
                            Manual CPC
                          </SelectItem>
                          <SelectItem value="auto-cpc" className="text-white hover:bg-[#3f3f3f]">
                            Automated CPC
                          </SelectItem>
                          <SelectItem value="target-cpa" className="text-white hover:bg-[#3f3f3f]">
                            Target CPA
                          </SelectItem>
                          <SelectItem value="target-roas" className="text-white hover:bg-[#3f3f3f]">
                            Target ROAS
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoStart"
                      checked={campaignData.status === "active"}
                      onCheckedChange={(checked) =>
                        setCampaignData({ ...campaignData, status: checked ? "active" : "draft" })
                      }
                    />
                    <Label htmlFor="autoStart">Start campaign immediately after creation</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Link href="/campaigns">
                  <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    onClick={() => setCampaignData({ ...campaignData, status: "draft" })}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                  >
                    Create Campaign
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
