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
  FileText,
  Download,
  ImageIcon,
} from "lucide-react"
import Link from "next/link"

const documents = [
  {
    name: "Contract_01.pdf",
    type: "PDF",
    dateUploaded: "Aug 28, 2025",
    size: "1.2MB",
    icon: FileText,
  },
  {
    name: "Banner_V1.png",
    type: "PNG",
    dateUploaded: "Aug 30, 2025",
    size: "320KB",
    icon: ImageIcon,
  },
  {
    name: "Invoice_July.pdf",
    type: "PDF",
    dateUploaded: "Sep 2, 2025",
    size: "1.2MB",
    icon: FileText,
  },
  {
    name: "Banner_V1.png",
    type: "PNG",
    dateUploaded: "Aug 28, 2025",
    size: "320KB",
    icon: ImageIcon,
  },
  {
    name: "Contract_01.pdf",
    type: "PDF",
    dateUploaded: "Sep 2, 2025",
    size: "2.4MB",
    icon: FileText,
  },
]

export default function DocumentsPage() {
  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Reports", icon: TrendingUp, href: "/reports" },
    { name: "Documents", icon: Users, href: "/documents", active: true },
    { name: "Campaigns", icon: Target, href: "/campaigns" },
    { name: "SEO", icon: Search, href: "/seo" },
    { name: "Tools", icon: Users, href: "/tools" },
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

        {/* Documents Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Documents</h1>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
              <Input
                placeholder="Search documents"
                className="pl-10 bg-[#2b2b2b] border-[#3f3f3f] text-white placeholder-[#afafaf]"
              />
            </div>
            <Button variant="ghost" className="text-[#afafaf] hover:text-white border border-[#3f3f3f]">
              Date Range
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" className="text-[#afafaf] hover:text-white border border-[#3f3f3f]">
              Document Type: All
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
              Search
            </Button>
          </div>

          {/* File Upload Area */}
          <Card className="bg-[#2b2b2b] border-[#3f3f3f] border-2 border-dashed border-[#a545b6]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-[#afafaf] mb-4" />
              <p className="text-lg text-[#afafaf] mb-2">Drop your documents here, or select</p>
              <Button variant="ghost" className="text-white hover:text-[#a545b6] font-semibold">
                Click to Browse
              </Button>
            </CardContent>
          </Card>

          {/* File List Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">File List Table</h2>
              <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>

            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#3f3f3f]">
                        <th className="text-left p-4 text-[#afafaf] font-medium">FILE NAME</th>
                        <th className="text-left p-4 text-[#afafaf] font-medium">TYPE</th>
                        <th className="text-left p-4 text-[#afafaf] font-medium">DATE UPLOADED</th>
                        <th className="text-left p-4 text-[#afafaf] font-medium">SIZE</th>
                        <th className="text-left p-4 text-[#afafaf] font-medium">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, index) => (
                        <tr key={index} className="border-b border-[#3f3f3f] hover:bg-[#3f3f3f]/20">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <doc.icon className="h-5 w-5 text-[#afafaf]" />
                              <span className="text-white">{doc.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={`${
                                doc.type === "PDF"
                                  ? "bg-[#a545b6] hover:bg-[#a545b6]/90"
                                  : "bg-[#cd4f9d] hover:bg-[#cd4f9d]/90"
                              } text-white`}
                            >
                              {doc.type}
                            </Badge>
                          </td>
                          <td className="p-4 text-[#afafaf]">{doc.dateUploaded}</td>
                          <td className="p-4 text-[#afafaf]">{doc.size}</td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
