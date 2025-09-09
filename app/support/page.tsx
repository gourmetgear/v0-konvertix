"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  MessageCircle,
  Paperclip,
  Mic,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SupportPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Reports", icon: TrendingUp, href: "/reports" },
    { name: "Documents", icon: Users, href: "/documents" },
    { name: "Campaigns", icon: Target, href: "/campaigns" },
    { name: "SEO", icon: Search, href: "/seo" },
    { name: "Tools", icon: Users, href: "/tools" },
    { name: "Support", icon: HeadphonesIcon, href: "/support", active: true },
    { name: "Services", icon: Users, href: "/services" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ]

  const faqItems = [
    { id: "accounting", title: "Accounting & Billing" },
    { id: "campaigns", title: "Campaigns" },
    { id: "reports", title: "Reports" },
    { id: "campaigns2", title: "Campaigns" },
    { id: "accounting2", title: "Accounting & Billing" },
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

        {/* Support Content */}
        <main className="flex-1 p-6 flex gap-6">
          {/* Left Side - Support Form and FAQ */}
          <div className="flex-1 space-y-8">
            {/* Page Header */}
            <h1 className="text-3xl font-bold">Support</h1>

            {/* Create Ticket Form */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Create a New Ticket</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      placeholder="Subject"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      placeholder="Short description"
                      rows={4}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <Select defaultValue="low">
                      <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                    Create Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">FAQ</h2>

              <div className="space-y-2">
                {faqItems.map((item) => (
                  <Collapsible
                    key={item.id}
                    open={openFAQ === item.id}
                    onOpenChange={(open) => setOpenFAQ(open ? item.id : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between bg-[#2b2b2b] hover:bg-[#3f3f3f] border border-[#3f3f3f] text-white p-4 h-auto"
                      >
                        <span className="text-left">{item.title}</span>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-[#2b2b2b] border border-t-0 border-[#3f3f3f] p-4 text-[#afafaf]">
                      <p>Frequently asked questions and answers about {item.title.toLowerCase()} will appear here.</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Chat Widget */}
          <div className="w-80">
            <Card className="bg-[#2b2b2b] border-[#3f3f3f] h-fit">
              <CardContent className="p-0">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#3f3f3f]">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">Chat with us</span>
                  </div>
                  <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white">T</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">Chatbot</span>
                        <span className="text-xs text-[#afafaf]">4:05 pm</span>
                      </div>
                      <div className="bg-[#3f3f3f] rounded-lg p-3 text-sm">
                        Hi there! I am Tidus, a bot working for Konvertix. How can I help you today?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-[#3f3f3f] space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      Start 14-day Free trial
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      Question
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      Support
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      Book a Demo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      Chat with live agent
                    </Button>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-[#3f3f3f]">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Write Your message"
                      className="flex-1 bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                    <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                      <Mic className="h-4 w-4" />
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
