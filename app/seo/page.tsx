"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Plus,
  Filter,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Wrench,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/contexts/LanguageContext"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { createBlogPostIdeas } from "@/lib/services/blogIdeaService"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function SEOPage() {
  const { t } = useLanguage()
  const [isCreatingIdeas, setIsCreatingIdeas] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [blogIdea, setBlogIdea] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateIdeas = async () => {
    setIsCreatingIdeas(true)
    try {
      const result = await createBlogPostIdeas()

      if (result.success) {
        toast.success(result.message || t("seo.messages.blogIdeasSuccess"))
        // You might want to refresh the ideas list here or show the new ideas
      } else {
        toast.error(result.message || t("seo.messages.blogIdeasError"))
      }
    } catch (error) {
      console.error("Error creating blog post ideas:", error)
      toast.error(t("seo.messages.unexpectedError"))
    } finally {
      setIsCreatingIdeas(false)
    }
  }

  const handleSubmitBlogPost = async () => {
    if (!blogIdea.trim()) {
      toast.error(t("seo.messages.enterBlogIdea"))
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogIdea: blogIdea.trim(),
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(t("seo.messages.blogPostSuccess"))
        setBlogIdea("")
        setIsDialogOpen(false)
      } else {
        toast.error(result.message || t("seo.messages.blogPostError"))
      }
    } catch (error) {
      console.error("Error sending blog post request:", error)
      toast.error(t("seo.messages.requestError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const organicTrafficData = [
    { month: "Jan", traffic: 12500 },
    { month: "Feb", traffic: 13200 },
    { month: "Mar", traffic: 14800 },
    { month: "Apr", traffic: 16200 },
    { month: "May", traffic: 18500 },
    { month: "Jun", traffic: 21300 },
  ]

  const keywordRankingsData = [
    { keyword: "digital marketing", position: 3, volume: 8100, difficulty: 78 },
    { keyword: "seo services", position: 7, volume: 5400, difficulty: 65 },
    { keyword: "marketing analytics", position: 12, volume: 3200, difficulty: 58 },
    { keyword: "conversion optimization", position: 5, volume: 2800, difficulty: 72 },
    { keyword: "ppc management", position: 15, volume: 4600, difficulty: 69 },
  ]

  const siteAuditIssues = [
    { type: t("seo.audit.types.critical"), issue: t("seo.audit.issues.missingMetaDescriptions"), count: 12, status: "error" },
    { type: t("seo.audit.types.warning"), issue: t("seo.audit.issues.slowPageLoad"), count: 8, status: "warning" },
    { type: t("seo.audit.types.notice"), issue: t("seo.audit.issues.missingAltText"), count: 24, status: "info" },
    { type: t("seo.audit.types.critical"), issue: t("seo.audit.issues.brokenInternalLinks"), count: 3, status: "error" },
    { type: t("seo.audit.types.warning"), issue: t("seo.audit.issues.duplicateTitleTags"), count: 6, status: "warning" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getRankingBadge = (position: number) => {
    if (position <= 3) {
      return <Badge className="bg-green-600 hover:bg-green-700">#{position}</Badge>
    } else if (position <= 10) {
      return <Badge className="bg-yellow-600 hover:bg-yellow-700">#{position}</Badge>
    } else {
      return <Badge className="bg-red-600 hover:bg-red-700">#{position}</Badge>
    }
  }

  const blogPostIdeas = [
    {
      title: "10 Essential Facebook Ad Metrics Every Marketer Should Track",
      category: "Facebook Ads",
      searchVolume: 2400,
      difficulty: 42,
      estimatedTraffic: 720,
      status: "planned",
      priority: "high"
    },
    {
      title: "Complete Guide to Google Ads Conversion Tracking in 2024",
      category: "Google Ads",
      searchVolume: 1800,
      difficulty: 38,
      estimatedTraffic: 540,
      status: "in-progress",
      priority: "high"
    },
    {
      title: "How to Optimize Landing Pages for Maximum Conversion Rates",
      category: "Conversion Optimization",
      searchVolume: 3200,
      difficulty: 55,
      estimatedTraffic: 960,
      status: "published",
      priority: "medium"
    },
    {
      title: "Email Marketing Automation: From Setup to Scale",
      category: "Email Marketing",
      searchVolume: 1600,
      difficulty: 35,
      estimatedTraffic: 480,
      status: "planned",
      priority: "medium"
    },
    {
      title: "The Ultimate TikTok Ads Strategy for E-commerce Brands",
      category: "Social Media",
      searchVolume: 2800,
      difficulty: 48,
      estimatedTraffic: 840,
      status: "draft",
      priority: "high"
    },
    {
      title: "Marketing Attribution Models: Which One Should You Use?",
      category: "Analytics",
      searchVolume: 1200,
      difficulty: 62,
      estimatedTraffic: 360,
      status: "planned",
      priority: "low"
    },
    {
      title: "Programmatic Advertising: A Beginner's Complete Guide",
      category: "Programmatic",
      searchVolume: 1500,
      difficulty: 45,
      estimatedTraffic: 450,
      status: "outline",
      priority: "medium"
    },
    {
      title: "Customer Lifetime Value: How to Calculate and Increase CLV",
      category: "Analytics",
      searchVolume: 2100,
      difficulty: 52,
      estimatedTraffic: 630,
      status: "planned",
      priority: "high"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-600 hover:bg-green-700">{t("seo.blogPosts.status.published")}</Badge>
      case "in-progress":
        return <Badge className="bg-blue-600 hover:bg-blue-700">{t("seo.blogPosts.status.inProgress")}</Badge>
      case "draft":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">{t("seo.blogPosts.status.draft")}</Badge>
      case "outline":
        return <Badge className="bg-purple-600 hover:bg-purple-700">{t("seo.blogPosts.status.outline")}</Badge>
      case "planned":
        return <Badge className="bg-gray-600 hover:bg-gray-700">{t("seo.blogPosts.status.planned")}</Badge>
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700">{t("seo.blogPosts.status.unknown")}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">{t("seo.blogPosts.priority.high")}</Badge>
      case "medium":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">{t("seo.blogPosts.priority.medium")}</Badge>
      case "low":
        return <Badge variant="secondary">{t("seo.blogPosts.priority.low")}</Badge>
      default:
        return <Badge variant="secondary">{t("seo.blogPosts.priority.low")}</Badge>
    }
  }

  return (
    <main className="p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{t("seo.title")}</h1>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  {t("seo.actions.exportReport")}
                </Button>
                <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("seo.actions.addKeywords")}
                </Button>
              </div>
            </div>

            {/* SEO Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">{t("seo.stats.organicTraffic")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">21,300</div>
                  <p className="text-xs text-green-500">{t("seo.stats.organicTrafficChange")}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">{t("seo.stats.keywordsRanking")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">147</div>
                  <p className="text-xs text-green-500">{t("seo.stats.keywordsRankingChange")}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">{t("seo.stats.avgPosition")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.4</div>
                  <p className="text-xs text-green-500">{t("seo.stats.avgPositionChange")}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">{t("seo.stats.domainAuthority")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68</div>
                  <p className="text-xs text-green-500">{t("seo.stats.domainAuthorityChange")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Blog Post Ideas */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{t("seo.blogPosts.title")}</CardTitle>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      {t("seo.actions.filterByStatus")}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#a545b6] text-[#a545b6] hover:bg-[#a545b6] hover:text-white bg-transparent"
                      onClick={handleCreateIdeas}
                      disabled={isCreatingIdeas}
                    >
                      {isCreatingIdeas ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {isCreatingIdeas ? t("seo.actions.creatingIdeas") : t("seo.actions.createIdeas")}
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                          <Plus className="h-4 w-4 mr-2" />
                          {t("seo.actions.createBlogPost")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                        <DialogHeader>
                          <DialogTitle className="text-white">{t("seo.blogPosts.modal.title")}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="blog-idea" className="text-white">
                              {t("seo.blogPosts.modal.blogIdea")}
                            </Label>
                            <Textarea
                              id="blog-idea"
                              placeholder={t("seo.blogPosts.modal.placeholder")}
                              value={blogIdea}
                              onChange={(e) => setBlogIdea(e.target.value)}
                              className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder:text-gray-400 min-h-32"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                          >
                            {t("seo.blogPosts.modal.cancel")}
                          </Button>
                          <Button
                            onClick={handleSubmitBlogPost}
                            disabled={isSubmitting || !blogIdea.trim()}
                            className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                {t("seo.blogPosts.modal.create")}
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                      <TableHead className="text-[#afafaf]">{t("seo.blogPosts.table.title")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.blogPosts.table.category")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.blogPosts.table.searchVolume")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.blogPosts.table.difficulty")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.blogPosts.table.estTraffic")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.blogPosts.table.status")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.blogPosts.table.priority")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.blogPosts.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPostIdeas.map((idea, index) => (
                      <TableRow key={index} className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                        <TableCell className="font-medium text-white max-w-md">
                          <div className="truncate">{idea.title}</div>
                        </TableCell>
                        <TableCell className="text-white">{idea.category}</TableCell>
                        <TableCell className="text-white">{idea.searchVolume.toLocaleString()}</TableCell>
                        <TableCell className="text-white">{idea.difficulty}%</TableCell>
                        <TableCell className="text-white">{idea.estimatedTraffic}</TableCell>
                        <TableCell>{getStatusBadge(idea.status)}</TableCell>
                        <TableCell>{getPriorityBadge(idea.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/seo/blog/${index + 1}`}>
                              <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Organic Traffic Chart */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="text-white">{t("seo.charts.organicTrafficTrend")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={organicTrafficData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                      <XAxis dataKey="month" stroke="#afafaf" />
                      <YAxis stroke="#afafaf" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2b2b2b",
                          border: "1px solid #3f3f3f",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="traffic"
                        stroke="#a545b6"
                        strokeWidth={3}
                        dot={{ fill: "#cd4f9d", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Site Health Score */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="text-white">{t("seo.charts.siteHealthScore")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#afafaf]">{t("seo.charts.overallScore")}</span>
                      <span className="text-white font-medium">85/100</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#afafaf]">{t("seo.charts.technicalSeo")}</span>
                      <span className="text-white font-medium">92/100</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#afafaf]">{t("seo.charts.contentQuality")}</span>
                      <span className="text-white font-medium">78/100</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#afafaf]">{t("seo.charts.userExperience")}</span>
                      <span className="text-white font-medium">88/100</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Keyword Rankings Table */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{t("seo.keywords.title")}</CardTitle>
                  <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("seo.actions.filter")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                      <TableHead className="text-[#afafaf]">{t("seo.keywords.table.keyword")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.keywords.table.position")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.keywords.table.searchVolume")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.keywords.table.difficulty")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.keywords.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywordRankingsData.map((keyword, index) => (
                      <TableRow key={index} className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                        <TableCell className="font-medium text-white">{keyword.keyword}</TableCell>
                        <TableCell>{getRankingBadge(keyword.position)}</TableCell>
                        <TableCell className="text-white">{keyword.volume.toLocaleString()}</TableCell>
                        <TableCell className="text-white">{keyword.difficulty}%</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Site Audit Issues */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white">{t("seo.audit.title")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                      <TableHead className="text-[#afafaf]">{t("seo.audit.table.issueType")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.audit.table.description")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.audit.table.count")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.audit.table.priority")}</TableHead>
                      <TableHead className="text-[#afafaf]">{t("seo.audit.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {siteAuditIssues.map((issue, index) => (
                      <TableRow key={index} className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                        <TableCell className="font-medium text-white">{issue.type}</TableCell>
                        <TableCell className="text-white">{issue.issue}</TableCell>
                        <TableCell className="text-white">{issue.count}</TableCell>
                        <TableCell>{getStatusIcon(issue.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
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
  )
}
