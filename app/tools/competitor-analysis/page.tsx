"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Wrench,
  ArrowLeft,
  Zap,
  Globe,
  Eye,
  Star,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function CompetitorAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState({
    competitorUrl: "",
    yourWebsite: "",
    industry: "",
    targetMarket: "",
    analysisGoals: "",
  })

  

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 3000)
  }

  const competitorData = {
    overview: {
      name: "TechCorp Solutions",
      domain: "techcorp.com",
      monthlyTraffic: "2.4M",
      domainAuthority: 78,
      backlinks: "45.2K",
      keywords: "12.8K",
    },
    strengths: [
      "Strong SEO performance with high-authority backlinks",
      "Comprehensive content marketing strategy",
      "Active social media presence across all platforms",
      "Mobile-optimized website with fast loading speeds",
      "Strong brand recognition in the industry",
    ],
    weaknesses: [
      "Limited video content marketing",
      "Outdated blog design and user experience",
      "Weak presence on emerging social platforms",
      "High bounce rate on product pages",
      "Limited international market presence",
    ],
    opportunities: [
      "Expand into video marketing and YouTube presence",
      "Improve conversion rate optimization",
      "Target long-tail keywords they're missing",
      "Develop mobile app for better user engagement",
      "Create more interactive content formats",
    ],
    keyMetrics: [
      { metric: "SEO Score", value: 85, color: "bg-green-500" },
      { metric: "Content Quality", value: 78, color: "bg-blue-500" },
      { metric: "Social Presence", value: 92, color: "bg-purple-500" },
      { metric: "Technical SEO", value: 71, color: "bg-yellow-500" },
      { metric: "User Experience", value: 66, color: "bg-orange-500" },
    ],
    topKeywords: [
      { keyword: "enterprise software", position: 3, volume: "22K", difficulty: 78 },
      { keyword: "business automation", position: 7, volume: "18K", difficulty: 65 },
      { keyword: "workflow management", position: 12, volume: "15K", difficulty: 72 },
      { keyword: "team collaboration", position: 5, volume: "25K", difficulty: 68 },
      { keyword: "project management", position: 15, volume: "45K", difficulty: 85 },
    ],
  }

  return (
    <div className="text-white">

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

        {/* Content */}
        <main className="flex-1 p-6 w-full">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/tools">
                  <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">Competitor Analysis</h1>
                  <p className="text-[#afafaf] mt-1">Analyze your competitors and discover opportunities</p>
                </div>
              </div>
              {showResults && (
                <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              )}
            </div>

            {!showResults ? (
              /* Analysis Form */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Competitor Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="competitor-url" className="text-[#afafaf]">
                        Competitor Website URL *
                      </Label>
                      <Input
                        id="competitor-url"
                        placeholder="https://competitor.com"
                        value={formData.competitorUrl}
                        onChange={(e) => setFormData({ ...formData, competitorUrl: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="your-website" className="text-[#afafaf]">
                        Your Website URL
                      </Label>
                      <Input
                        id="your-website"
                        placeholder="https://yoursite.com"
                        value={formData.yourWebsite}
                        onChange={(e) => setFormData({ ...formData, yourWebsite: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-[#afafaf]">
                        Industry/Niche
                      </Label>
                      <Input
                        id="industry"
                        placeholder="e.g., SaaS, E-commerce, Healthcare"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Analysis Focus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="target-market" className="text-[#afafaf]">
                        Target Market
                      </Label>
                      <Input
                        id="target-market"
                        placeholder="e.g., Small businesses, Enterprise, B2C"
                        value={formData.targetMarket}
                        onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="analysis-goals" className="text-[#afafaf]">
                        Analysis Goals
                      </Label>
                      <Textarea
                        id="analysis-goals"
                        placeholder="What specific insights are you looking for? (SEO, content strategy, social media, pricing, etc.)"
                        value={formData.analysisGoals}
                        onChange={(e) => setFormData({ ...formData, analysisGoals: e.target.value })}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf] min-h-[100px]"
                      />
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !formData.competitorUrl}
                      className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing Competitor...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Start Analysis
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Analysis Results */
              <div className="space-y-6">
                {/* Competitor Overview */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Competitor Overview: {competitorData.overview.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#a545b6]">
                          {competitorData.overview.monthlyTraffic}
                        </div>
                        <div className="text-[#afafaf] text-sm">Monthly Traffic</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#cd4f9d]">
                          {competitorData.overview.domainAuthority}
                        </div>
                        <div className="text-[#afafaf] text-sm">Domain Authority</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#a545b6]">{competitorData.overview.backlinks}</div>
                        <div className="text-[#afafaf] text-sm">Backlinks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#cd4f9d]">{competitorData.overview.keywords}</div>
                        <div className="text-[#afafaf] text-sm">Keywords</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {competitorData.keyMetrics.map((metric, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[#afafaf]">{metric.metric}</span>
                            <span className="text-white font-semibold">{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* SWOT Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {competitorData.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Star className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-[#afafaf] text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                        Weaknesses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {competitorData.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <TrendingDown className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-[#afafaf] text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Opportunities */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                      Opportunities for Your Business
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {competitorData.opportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-[#3f3f3f] rounded-lg">
                          <Eye className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-[#afafaf] text-sm">{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Keywords */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <SearchIcon className="h-5 w-5 mr-2" />
                      Top Ranking Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#3f3f3f]">
                            <th className="text-left text-[#afafaf] py-2">Keyword</th>
                            <th className="text-left text-[#afafaf] py-2">Position</th>
                            <th className="text-left text-[#afafaf] py-2">Volume</th>
                            <th className="text-left text-[#afafaf] py-2">Difficulty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {competitorData.topKeywords.map((keyword, index) => (
                            <tr key={index} className="border-b border-[#3f3f3f]">
                              <td className="py-3 text-white">{keyword.keyword}</td>
                              <td className="py-3">
                                <Badge variant="secondary" className="bg-[#3f3f3f] text-[#afafaf]">
                                  #{keyword.position}
                                </Badge>
                              </td>
                              <td className="py-3 text-[#afafaf]">{keyword.volume}</td>
                              <td className="py-3">
                                <Badge
                                  variant="secondary"
                                  className={`${
                                    keyword.difficulty > 75
                                      ? "bg-red-500/20 text-red-400"
                                      : keyword.difficulty > 50
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-green-500/20 text-green-400"
                                  }`}
                                >
                                  {keyword.difficulty}%
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
