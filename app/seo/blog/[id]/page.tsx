"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Save,
  Eye,
  Share2,
  Calendar,
  User,
  Tag,
  BarChart3,
  Globe,
  Image as ImageIcon,
  FileText,
  Search,
  Target,
  Clock,
  TrendingUp,
  Users,
  ExternalLink,
  Copy,
  Download,
  RefreshCw
} from "lucide-react"

export default function BlogPostDetailPage() {
  const params = useParams()
  const blogId = params.id as string

  // Mock data - in real app this would come from API
  const blogPost = {
    id: blogId,
    title: "10 Essential Facebook Ad Metrics Every Marketer Should Track",
    slug: "10-essential-facebook-ad-metrics-every-marketer-should-track",
    category: "Facebook Ads",
    status: "planned",
    priority: "high",
    author: "Marketing Team",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    publishDate: "2024-02-01",

    // SEO Data
    metaTitle: "10 Essential Facebook Ad Metrics Every Marketer Should Track in 2024",
    metaDescription: "Discover the most important Facebook ad metrics that drive results. Learn which KPIs to monitor for better ROAS and campaign optimization.",
    focusKeyword: "facebook ad metrics",
    searchVolume: 2400,
    difficulty: 42,
    estimatedTraffic: 720,

    // Content
    excerpt: "Understanding which Facebook ad metrics to track is crucial for campaign success. This comprehensive guide covers the 10 most important KPIs that every marketer should monitor to optimize their ad spend and maximize ROI.",
    content: `# Introduction

Facebook advertising offers incredible opportunities for businesses to reach their target audience, but success depends on tracking the right metrics. With so many data points available in Facebook Ads Manager, it can be overwhelming to know which ones actually matter.

## The 10 Essential Metrics

### 1. Return on Ad Spend (ROAS)
ROAS is perhaps the most important metric for measuring campaign profitability...

### 2. Cost Per Acquisition (CPA)
Understanding your cost per acquisition helps you optimize your budget allocation...

### 3. Click-Through Rate (CTR)
CTR indicates how compelling your ad creative and targeting are...

[Content continues...]`,

    // Images
    featuredImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
        alt: "Facebook Ads Dashboard showing key metrics",
        caption: "Example of Facebook Ads Manager dashboard with key metrics highlighted"
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
        alt: "Analytics charts and graphs",
        caption: "Visual representation of ad performance metrics over time"
      }
    ],

    // Performance Tracking
    performance: {
      views: 0,
      shares: 0,
      comments: 0,
      avgTimeOnPage: "0:00",
      bounceRate: "0%",
      organicTraffic: 0,
      backlinks: 0
    },

    // SEO Analysis
    seoScore: 85,
    readabilityScore: 78,
    wordCount: 2450,

    // Related Keywords
    relatedKeywords: [
      { keyword: "facebook advertising metrics", volume: 1200, difficulty: 38 },
      { keyword: "facebook ad KPIs", volume: 800, difficulty: 35 },
      { keyword: "facebook ROAS", volume: 600, difficulty: 42 },
      { keyword: "facebook ad optimization", volume: 1500, difficulty: 55 }
    ],

    // Competitors
    competitors: [
      { url: "example.com/facebook-metrics", title: "Facebook Ad Metrics Guide", position: 3 },
      { url: "competitor.com/fb-ads", title: "Essential FB Ad KPIs", position: 7 },
      { url: "blog.com/facebook-advertising", title: "Facebook Advertising Guide", position: 12 }
    ]
  }

  const [isEditing, setIsEditing] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-600 hover:bg-green-700">Published</Badge>
      case "in-progress":
        return <Badge className="bg-blue-600 hover:bg-blue-700">In Progress</Badge>
      case "draft":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Draft</Badge>
      case "outline":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Outline</Badge>
      case "planned":
        return <Badge className="bg-gray-600 hover:bg-gray-700">Planned</Badge>
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Medium Priority</Badge>
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>
      default:
        return <Badge variant="secondary">Low Priority</Badge>
    }
  }

  return (
    <main className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/seo">
              <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to SEO Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              {getStatusBadge(blogPost.status)}
              {getPriorityBadge(blogPost.priority)}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Blog Post Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#afafaf]">Title</Label>
                  {isEditing ? (
                    <Input
                      id="title"
                      defaultValue={blogPost.title}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-white">{blogPost.title}</h1>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-[#afafaf]">URL Slug</Label>
                  {isEditing ? (
                    <Input
                      id="slug"
                      defaultValue={blogPost.slug}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                    />
                  ) : (
                    <p className="text-[#afafaf] font-mono text-sm">/{blogPost.slug}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-[#afafaf]">Excerpt</Label>
                  {isEditing ? (
                    <Textarea
                      id="excerpt"
                      defaultValue={blogPost.excerpt}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white min-h-[100px]"
                    />
                  ) : (
                    <p className="text-white">{blogPost.excerpt}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Category</Label>
                    <p className="text-white">{blogPost.category}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Author</Label>
                    <p className="text-white">{blogPost.author}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Created</Label>
                    <p className="text-white">{blogPost.createdAt}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Updated</Label>
                    <p className="text-white">{blogPost.updatedAt}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Publish Date</Label>
                    <p className="text-white">{blogPost.publishDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Details */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  SEO Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle" className="text-[#afafaf]">Meta Title ({blogPost.metaTitle.length}/60)</Label>
                  {isEditing ? (
                    <Input
                      id="metaTitle"
                      defaultValue={blogPost.metaTitle}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                      maxLength={60}
                    />
                  ) : (
                    <p className="text-white">{blogPost.metaTitle}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription" className="text-[#afafaf]">Meta Description ({blogPost.metaDescription.length}/160)</Label>
                  {isEditing ? (
                    <Textarea
                      id="metaDescription"
                      defaultValue={blogPost.metaDescription}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                      maxLength={160}
                    />
                  ) : (
                    <p className="text-white">{blogPost.metaDescription}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focusKeyword" className="text-[#afafaf]">Focus Keyword</Label>
                  {isEditing ? (
                    <Input
                      id="focusKeyword"
                      defaultValue={blogPost.focusKeyword}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                    />
                  ) : (
                    <p className="text-white font-mono">{blogPost.focusKeyword}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Search Volume</Label>
                    <p className="text-white font-bold">{blogPost.searchVolume.toLocaleString()}/mo</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Difficulty</Label>
                    <p className="text-white font-bold">{blogPost.difficulty}%</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Est. Traffic</Label>
                    <p className="text-white font-bold">{blogPost.estimatedTraffic}/mo</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">SEO Score</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${blogPost.seoScore}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold">{blogPost.seoScore}/100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Readability</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${blogPost.readabilityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold">{blogPost.readabilityScore}/100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">Word Count</Label>
                    <p className="text-white font-bold">{blogPost.wordCount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Edit className="h-5 w-5 mr-2" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    defaultValue={blogPost.content}
                    className="bg-[#3f3f3f] border-[#4f4f4f] text-white min-h-[400px] font-mono"
                    placeholder="Write your blog post content here..."
                  />
                ) : (
                  <div className="bg-[#3f3f3f] rounded-lg p-4 text-white whitespace-pre-wrap font-mono text-sm max-h-[400px] overflow-y-auto">
                    {blogPost.content}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-[#3f3f3f] rounded-lg overflow-hidden">
                  <img
                    src={blogPost.featuredImage}
                    alt="Featured image"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <Button variant="outline" className="w-full border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Change Image
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#afafaf]">Views</span>
                  <span className="text-white font-bold">{blogPost.performance.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#afafaf]">Shares</span>
                  <span className="text-white font-bold">{blogPost.performance.shares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#afafaf]">Comments</span>
                  <span className="text-white font-bold">{blogPost.performance.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#afafaf]">Avg. Time</span>
                  <span className="text-white font-bold">{blogPost.performance.avgTimeOnPage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#afafaf]">Bounce Rate</span>
                  <span className="text-white font-bold">{blogPost.performance.bounceRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#afafaf]">Organic Traffic</span>
                  <span className="text-white font-bold">{blogPost.performance.organicTraffic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#afafaf]">Backlinks</span>
                  <span className="text-white font-bold">{blogPost.performance.backlinks}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Publish Now
                </Button>
                <Button variant="outline" className="w-full border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Post
                </Button>
                <Button variant="outline" className="w-full border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Draft
                </Button>
                <Button variant="outline" className="w-full border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent justify-start">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Post
                </Button>
                <Button variant="outline" className="w-full border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Content
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
          <CardContent className="p-0">
            <Tabs defaultValue="keywords" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-[#3f3f3f] rounded-t-lg rounded-b-none">
                <TabsTrigger value="keywords" className="data-[state=active]:bg-[#a545b6]">Related Keywords</TabsTrigger>
                <TabsTrigger value="competitors" className="data-[state=active]:bg-[#a545b6]">Competitors</TabsTrigger>
                <TabsTrigger value="images" className="data-[state=active]:bg-[#a545b6]">Images</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-[#a545b6]">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="keywords" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Related Keywords</h3>
                  <div className="space-y-3">
                    {blogPost.relatedKeywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#3f3f3f] rounded-lg">
                        <div>
                          <p className="text-white font-medium">{keyword.keyword}</p>
                          <p className="text-[#afafaf] text-sm">Volume: {keyword.volume}/mo</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={keyword.difficulty < 40 ? "bg-green-600" : keyword.difficulty < 60 ? "bg-yellow-600" : "bg-red-600"}>
                            {keyword.difficulty}% difficulty
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                            <Target className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="competitors" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Competitor Analysis</h3>
                  <div className="space-y-3">
                    {blogPost.competitors.map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#3f3f3f] rounded-lg">
                        <div>
                          <p className="text-white font-medium">{competitor.title}</p>
                          <p className="text-[#afafaf] text-sm">{competitor.url}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={competitor.position <= 3 ? "bg-green-600" : competitor.position <= 10 ? "bg-yellow-600" : "bg-red-600"}>
                            #{competitor.position}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Content Images</h3>
                    <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blogPost.images.map((image, index) => (
                      <div key={index} className="bg-[#3f3f3f] rounded-lg overflow-hidden">
                        <div className="aspect-video">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-white text-sm font-medium mb-1">{image.alt}</p>
                          <p className="text-[#afafaf] text-xs">{image.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Analytics & Insights</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#3f3f3f] rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-[#afafaf] text-sm">Growth Rate</span>
                      </div>
                      <p className="text-white text-2xl font-bold">+24%</p>
                    </div>
                    <div className="bg-[#3f3f3f] rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-[#afafaf] text-sm">Engagement</span>
                      </div>
                      <p className="text-white text-2xl font-bold">3.2%</p>
                    </div>
                    <div className="bg-[#3f3f3f] rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span className="text-[#afafaf] text-sm">Read Time</span>
                      </div>
                      <p className="text-white text-2xl font-bold">8m 45s</p>
                    </div>
                    <div className="bg-[#3f3f3f] rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <RefreshCw className="h-4 w-4 text-yellow-500" />
                        <span className="text-[#afafaf] text-sm">Return Rate</span>
                      </div>
                      <p className="text-white text-2xl font-bold">12%</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}