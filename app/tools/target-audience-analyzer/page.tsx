"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Loader2,
  Brain,
  UserCheck,
  DollarSign,
  Heart,
  Smartphone,
} from "lucide-react"
import Link from "next/link"

export default function TargetAudienceAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    industry: "",
    priceRange: "",
    currentCustomers: "",
    businessGoals: "",
    competitors: "",
    uniqueValue: "",
  })

  

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    // Simulate API call to ChatGPT
    setTimeout(() => {
      setAnalysisResult({
        primaryAudience: {
          demographics: "Women aged 25-40, college-educated, household income $50k-$100k",
          psychographics: "Health-conscious, busy professionals, value convenience and quality",
          behaviors: "Active on Instagram and Facebook, shop online frequently, read health blogs",
          painPoints: "Limited time for meal prep, difficulty maintaining healthy eating habits",
        },
        secondaryAudience: {
          demographics: "Men aged 30-45, urban professionals, household income $75k+",
          psychographics: "Career-focused, fitness enthusiasts, early adopters of technology",
          behaviors: "Use fitness apps, follow influencers, prefer premium products",
          painPoints: "Lack of nutrition knowledge, inconsistent eating schedule",
        },
        recommendations: [
          "Focus on Instagram and Facebook advertising with lifestyle imagery",
          "Emphasize time-saving and convenience benefits in messaging",
          "Partner with health and fitness influencers for authentic endorsements",
          "Create content around busy professional lifestyle challenges",
          "Use testimonials from similar demographic profiles",
        ],
        platforms: [
          { name: "Instagram", score: 95, reason: "High engagement with target demographic" },
          { name: "Facebook", score: 88, reason: "Excellent targeting options for professionals" },
          { name: "LinkedIn", score: 72, reason: "Good for reaching career-focused audience" },
          { name: "TikTok", score: 65, reason: "Growing audience in target age range" },
        ],
        budget: {
          suggested: "$2,500 - $5,000/month",
          breakdown: "70% Facebook/Instagram, 20% Google Ads, 10% LinkedIn",
        },
      })
      setIsAnalyzing(false)
    }, 3000)
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
        <main className="flex-1 p-6">
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
                  <h1 className="text-3xl font-bold flex items-center">
                    <Brain className="h-8 w-8 mr-3 text-[#a545b6]" />
                    Target Audience Analyzer
                  </h1>
                  <p className="text-[#afafaf] mt-1">AI-powered audience insights for optimal targeting</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] text-white">Powered by ChatGPT</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="text-white">Product Information</CardTitle>
                  <p className="text-[#afafaf] text-sm">
                    Provide details about your product or service for AI analysis
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name" className="text-[#afafaf]">
                      Product/Service Name *
                    </Label>
                    <Input
                      id="product-name"
                      placeholder="e.g., Organic Meal Delivery Service"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-description" className="text-[#afafaf]">
                      Product Description *
                    </Label>
                    <Textarea
                      id="product-description"
                      placeholder="Describe your product, its features, and main benefits..."
                      value={formData.productDescription}
                      onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf] min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-[#afafaf]">
                        Industry
                      </Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => setFormData({ ...formData, industry: value })}
                      >
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                          <SelectItem value="health">Health & Wellness</SelectItem>
                          <SelectItem value="tech">Technology</SelectItem>
                          <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                          <SelectItem value="food">Food & Beverage</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price-range" className="text-[#afafaf]">
                        Price Range
                      </Label>
                      <Select
                        value={formData.priceRange}
                        onValueChange={(value) => setFormData({ ...formData, priceRange: value })}
                      >
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                          <SelectItem value="budget">Budget ($0-$50)</SelectItem>
                          <SelectItem value="mid">Mid-range ($50-$200)</SelectItem>
                          <SelectItem value="premium">Premium ($200-$500)</SelectItem>
                          <SelectItem value="luxury">Luxury ($500+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current-customers" className="text-[#afafaf]">
                      Current Customer Profile
                    </Label>
                    <Textarea
                      id="current-customers"
                      placeholder="Describe your current customers (age, interests, behavior, etc.)"
                      value={formData.currentCustomers}
                      onChange={(e) => setFormData({ ...formData, currentCustomers: e.target.value })}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-goals" className="text-[#afafaf]">
                      Business Goals
                    </Label>
                    <Input
                      id="business-goals"
                      placeholder="e.g., Increase sales, brand awareness, market expansion"
                      value={formData.businessGoals}
                      onChange={(e) => setFormData({ ...formData, businessGoals: e.target.value })}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitors" className="text-[#afafaf]">
                      Main Competitors
                    </Label>
                    <Input
                      id="competitors"
                      placeholder="List 2-3 main competitors"
                      value={formData.competitors}
                      onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unique-value" className="text-[#afafaf]">
                      Unique Value Proposition
                    </Label>
                    <Textarea
                      id="unique-value"
                      placeholder="What makes your product unique and valuable?"
                      value={formData.uniqueValue}
                      onChange={(e) => setFormData({ ...formData, uniqueValue: e.target.value })}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !formData.productName || !formData.productDescription}
                    className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze Target Audience
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {isAnalyzing && (
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardContent className="p-8 text-center">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#a545b6]" />
                      <h3 className="text-xl font-semibold mb-2">Analyzing Your Audience</h3>
                      <p className="text-[#afafaf]">
                        AI is processing your product information to identify optimal target audiences...
                      </p>
                    </CardContent>
                  </Card>
                )}

                {analysisResult && (
                  <>
                    {/* Primary Audience */}
                    <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <UserCheck className="h-5 w-5 mr-2 text-[#a545b6]" />
                          Primary Target Audience
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Demographics
                          </h4>
                          <p className="text-[#afafaf]">{analysisResult.primaryAudience.demographics}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-2 flex items-center">
                            <Heart className="h-4 w-4 mr-2" />
                            Psychographics
                          </h4>
                          <p className="text-[#afafaf]">{analysisResult.primaryAudience.psychographics}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-2 flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            Behaviors
                          </h4>
                          <p className="text-[#afafaf]">{analysisResult.primaryAudience.behaviors}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-2">Pain Points</h4>
                          <p className="text-[#afafaf]">{analysisResult.primaryAudience.painPoints}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Platform Recommendations */}
                    <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <CardHeader>
                        <CardTitle className="text-white">Platform Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {analysisResult.platforms.map((platform: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-[#3f3f3f] rounded-lg">
                            <div>
                              <h4 className="font-semibold text-white">{platform.name}</h4>
                              <p className="text-sm text-[#afafaf]">{platform.reason}</p>
                            </div>
                            <Badge
                              className={`${
                                platform.score >= 90
                                  ? "bg-green-600"
                                  : platform.score >= 75
                                    ? "bg-yellow-600"
                                    : "bg-gray-600"
                              } text-white`}
                            >
                              {platform.score}%
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Budget Recommendation */}
                    <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <DollarSign className="h-5 w-5 mr-2 text-[#a545b6]" />
                          Budget Recommendation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-white">Suggested Monthly Budget</h4>
                            <p className="text-2xl font-bold text-[#a545b6]">{analysisResult.budget.suggested}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Allocation</h4>
                            <p className="text-[#afafaf]">{analysisResult.budget.breakdown}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Items */}
                    <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <CardHeader>
                        <CardTitle className="text-white">Recommended Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-[#a545b6] rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-[#afafaf]">{rec}</p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
