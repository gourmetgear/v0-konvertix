"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Zap,
  Mail,
  PieChart,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

const services = [
  {
    name: "Paid Ads",
    icon: DollarSign,
    status: "Active",
    description: "Run and optimize ad campaigns across Google, Meta & LinkedIn platforms effectively.",
    buttonText: "Included in your plan",
    isActive: true,
  },
  {
    name: "SEO",
    icon: Search,
    status: "Inactive",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    buttonText: "Add SEO",
    isActive: false,
  },
  {
    name: "Automation",
    icon: Zap,
    status: "Inactive",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    buttonText: "Add Automation.",
    isActive: false,
  },
  {
    name: "Reporting",
    icon: BarChart3,
    status: "Active",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    buttonText: "Included in your plan",
    isActive: true,
  },
  {
    name: "Email Marketing",
    icon: Mail,
    status: "Inactive",
    description: "Run and optimize ad campaigns across Google, Meta & LinkedIn platforms effectively.",
    buttonText: "Add Email Marketing.",
    isActive: false,
  },
  {
    name: "Analytics",
    icon: PieChart,
    status: "Active",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    buttonText: "Included in your plan",
    isActive: true,
  },
]

export default function ServicesPage() {
  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Reports", icon: TrendingUp, href: "/reports" },
    { name: "Documents", icon: Users, href: "/documents" },
    { name: "Campaigns", icon: Target, href: "/campaigns" },
    { name: "SEO", icon: Search, href: "/seo" },
    { name: "Tools", icon: Users, href: "/tools" },
    { name: "Support", icon: HeadphonesIcon, href: "/support" },
    { name: "Services", icon: Users, href: "/services", active: true },
    { name: "Settings", icon: Settings, href: "/settings" },
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

        {/* Services Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Services</h1>
            <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
              Request Upgrade
            </Button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6]/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  {/* Service Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <service.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                    </div>
                    <Badge
                      className={`${
                        service.isActive
                          ? "bg-green-600 hover:bg-green-600/90 text-white"
                          : "bg-red-600 hover:bg-red-600/90 text-white"
                      }`}
                    >
                      {service.status}
                    </Badge>
                  </div>

                  {/* Service Description */}
                  <p className="text-[#afafaf] text-sm leading-relaxed">{service.description}</p>

                  {/* Service Action */}
                  <Button
                    variant={service.isActive ? "ghost" : "outline"}
                    className={`w-full ${
                      service.isActive
                        ? "text-[#afafaf] hover:text-white border-[#3f3f3f] hover:bg-[#3f3f3f]"
                        : "border-[#3f3f3f] text-white hover:bg-[#3f3f3f] hover:text-white"
                    }`}
                  >
                    {service.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
