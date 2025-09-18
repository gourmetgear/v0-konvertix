"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import AuthGuard from "@/components/auth/AuthGuard"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Eye,
  MousePointer,
  Calendar,
  RefreshCw,
  AlertCircle,
  Activity,
  Zap,
  Edit,
  ExternalLink,
  Download,
  Share2,
  Settings,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import { generateFacebookCampaignUrl, openInNewTab, extractCampaignId } from "@/lib/facebook-utils"

interface Campaign {
  id: string
  campaign_name: string
  spend: string | number
  revenue: string | number
  conversions: number
  roas: string | number
  date: string
  objective: string
  daily_budget: number | null
  ctr: string | number
  cpc: string | number
  cpm: string | number
  cpp: string | number
  status?: string
  campaign_id?: string
}

interface PerformanceData {
  date: string
  spend: number
  revenue: number
  conversions: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  roas: number
}

export default function CampaignDetailsPage() {
  return (
    <AuthGuard>
      <CampaignDetailsContent />
    </AuthGuard>
  )
}

function CampaignDetailsContent() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock performance data for the last 30 days
  const generateMockPerformanceData = (campaign: Campaign): PerformanceData[] => {
    const data: PerformanceData[] = []
    const baseSpend = parseFloat(campaign.spend as string) || 1000
    const baseRevenue = parseFloat(campaign.revenue as string) || 3000
    const baseConversions = campaign.conversions || 50

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Add some variance to make it realistic
      const variance = 0.7 + Math.random() * 0.6 // Between 0.7 and 1.3
      const dailySpend = (baseSpend / 30) * variance
      const dailyRevenue = (baseRevenue / 30) * variance
      const dailyConversions = Math.round((baseConversions / 30) * variance)
      const dailyImpressions = Math.round(dailySpend * 100 * (0.8 + Math.random() * 0.4))
      const dailyClicks = Math.round(dailyImpressions * (0.01 + Math.random() * 0.04))

      data.push({
        date: date.toISOString().split('T')[0],
        spend: dailySpend,
        revenue: dailyRevenue,
        conversions: dailyConversions,
        impressions: dailyImpressions,
        clicks: dailyClicks,
        ctr: dailyClicks > 0 ? (dailyClicks / dailyImpressions) * 100 : 0,
        cpc: dailyClicks > 0 ? dailySpend / dailyClicks : 0,
        cpm: dailyImpressions > 0 ? (dailySpend / dailyImpressions) * 1000 : 0,
        roas: dailySpend > 0 ? dailyRevenue / dailySpend : 0,
      })
    }

    return data
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser()
        if (userRes.user) {
          setUserId(userRes.user.id)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setError('Failed to load user data')
      }
    }

    loadUserData()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchCampaignDetails()
    }
  }, [userId, campaignId])

  const fetchCampaignDetails = async () => {
    if (!userId || !campaignId) return

    try {
      setLoading(true)
      setError(null)

      // Fetch campaign data from the same API used in campaigns page
      const response = await fetch(`/api/reports?userId=${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch campaign details')
      }

      // Find the specific campaign by ID (decoded for matching)
      const decodedCampaignId = decodeURIComponent(campaignId)
      const campaignsData = result.data.campaigns || []
      const foundCampaign = campaignsData.find((campaign: any) =>
        campaign.campaign === decodedCampaignId ||
        campaign.campaign_id === decodedCampaignId ||
        campaign.id === decodedCampaignId
      )

      if (!foundCampaign) {
        throw new Error('Campaign not found')
      }

      // Convert to expected format
      const campaignData: Campaign = {
        id: foundCampaign.campaign || `campaign-${Math.random()}`,
        campaign_name: foundCampaign.campaign,
        spend: foundCampaign.spend || 0,
        revenue: foundCampaign.revenue || 0,
        conversions: foundCampaign.conversions || 0,
        roas: foundCampaign.roas || 0,
        date: new Date().toISOString().split('T')[0],
        objective: foundCampaign.objective || 'OUTCOME_SALES',
        daily_budget: foundCampaign.daily_budget || null,
        ctr: foundCampaign.ctr || 0,
        cpc: foundCampaign.cpc || 0,
        cpm: foundCampaign.cpm || 0,
        cpp: foundCampaign.cpp || 0,
        status: foundCampaign.status || 'UNKNOWN',
        campaign_id: foundCampaign.campaign_id || null
      }

      setCampaign(campaignData)

      // Generate mock performance data
      const perfData = generateMockPerformanceData(campaignData)
      setPerformanceData(perfData)

    } catch (error) {
      console.error('Error fetching campaign details:', error)
      setError(error.message || 'Failed to fetch campaign details')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number | string) => {
    const num = parseFloat(value as string) || 0
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  const formatNumber = (value: number | string, decimals = 0) => {
    const num = parseFloat(value as string) || 0
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)
  }

  const formatPercentage = (value: number | string, decimals = 2) => {
    const num = parseFloat(value as string) || 0
    return `${formatNumber(num, decimals)}%`
  }

  const getCampaignStatus = (campaign: Campaign) => {
    if (campaign.status && campaign.status !== 'UNKNOWN') {
      return campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1).toLowerCase()
    }
    const spent = parseFloat(campaign.spend as string) || 0
    return spent > 0 ? 'Active' : 'No Spend'
  }

  const getStatusBadge = (campaign: Campaign) => {
    const status = getCampaignStatus(campaign)
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>
      case 'paused':
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">{status}</Badge>
      case 'archived':
        return <Badge className="bg-gray-600 hover:bg-gray-700">{status}</Badge>
      default:
        return <Badge className="bg-blue-600 hover:bg-blue-700">{status}</Badge>
    }
  }

  const handleViewInFacebook = () => {
    if (!campaign) return

    try {
      // Extract campaign ID from the campaign data
      const campaignId = campaign.campaign_id || extractCampaignId(campaign.campaign_name)

      // Generate Facebook URL
      const facebookUrl = generateFacebookCampaignUrl(campaignId)

      // Open in new tab
      openInNewTab(facebookUrl)

      console.log('Opening Facebook Ads Manager:', {
        campaignName: campaign.campaign_name,
        campaignId: campaignId,
        url: facebookUrl
      })
    } catch (error) {
      console.error('Error opening Facebook Ads Manager:', error)
      // Fallback: open general Facebook Ads Manager
      openInNewTab('https://www.facebook.com/adsmanager/manage/campaigns')
    }
  }

  // Calculate period-over-period changes (comparing last 15 days vs previous 15 days)
  const calculatePeriodChange = (data: PerformanceData[], metric: keyof PerformanceData) => {
    if (data.length < 30) return { change: 0, trend: 'neutral' as const }

    const recent = data.slice(-15)
    const previous = data.slice(-30, -15)

    const recentSum = recent.reduce((sum, item) => sum + (item[metric] as number), 0)
    const previousSum = previous.reduce((sum, item) => sum + (item[metric] as number), 0)

    if (previousSum === 0) return { change: 0, trend: 'neutral' as const }

    const change = ((recentSum - previousSum) / previousSum) * 100
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'

    return { change: Math.abs(change), trend }
  }

  // Colors for charts
  const chartColors = {
    primary: '#a545b6',
    secondary: '#f8c140',
    success: '#03ba2b',
    danger: '#f73c3c',
    info: '#4a48ff'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b021c] text-white flex">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-[#a545b6]" />
              <span className="ml-3 text-lg">Loading campaign details...</span>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-[#0b021c] text-white flex">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <Card className="bg-red-900/20 border-red-500/50 p-6">
                <div className="flex items-center space-x-3 text-red-400">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Error Loading Campaign</h3>
                    <p className="text-sm">{error || 'Campaign not found'}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 border-red-500 text-red-400"
                  onClick={() => router.push('/campaigns')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Campaigns
                </Button>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/campaigns')}
                  className="text-[#afafaf] hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Campaigns
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">{campaign.campaign_name}</h1>
                  <div className="flex items-center space-x-3 mt-2">
                    {getStatusBadge(campaign)}
                    <span className="text-[#afafaf] text-sm">Campaign ID: {campaign.campaign_id || campaign.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f]">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f]">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f]"
                  onClick={handleViewInFacebook}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View in Facebook
                </Button>
                <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d]">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Campaign
                </Button>
              </div>
            </div>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-[#5e2e6c] to-[#401958] border-[#2b2b2b]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-[#afafaf]">Total Spend</CardTitle>
                    <DollarSign className="h-5 w-5 text-[#f8c140]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(campaign.spend)}</div>
                  <div className="flex items-center space-x-1 text-sm mt-1">
                    {(() => {
                      const { change, trend } = calculatePeriodChange(performanceData, 'spend')
                      return (
                        <>
                          {trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-[#03ba2b]" />
                          ) : trend === 'down' ? (
                            <TrendingDown className="h-3 w-3 text-[#f73c3c]" />
                          ) : null}
                          <span className={trend === 'up' ? 'text-[#03ba2b]' : trend === 'down' ? 'text-[#f73c3c]' : 'text-[#afafaf]'}>
                            {change > 0 ? `${trend === 'up' ? '+' : '-'}${formatNumber(change, 1)}%` : 'No change'}
                          </span>
                        </>
                      )
                    })()}
                  </div>
                  <p className="text-xs text-[#afafaf] mt-1">Last 15 days vs previous</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-[#afafaf]">Revenue</CardTitle>
                    <TrendingUp className="h-5 w-5 text-[#03ba2b]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(campaign.revenue)}</div>
                  <div className="flex items-center space-x-1 text-sm mt-1">
                    {(() => {
                      const { change, trend } = calculatePeriodChange(performanceData, 'revenue')
                      return (
                        <>
                          {trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-[#03ba2b]" />
                          ) : trend === 'down' ? (
                            <TrendingDown className="h-3 w-3 text-[#f73c3c]" />
                          ) : null}
                          <span className={trend === 'up' ? 'text-[#03ba2b]' : trend === 'down' ? 'text-[#f73c3c]' : 'text-[#afafaf]'}>
                            {change > 0 ? `${trend === 'up' ? '+' : '-'}${formatNumber(change, 1)}%` : 'No change'}
                          </span>
                        </>
                      )
                    })()}
                  </div>
                  <p className="text-xs text-[#afafaf] mt-1">Generated revenue</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-[#afafaf]">ROAS</CardTitle>
                    <Target className="h-5 w-5 text-[#f8c140]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatNumber(campaign.roas, 2)}x</div>
                  <div className="flex items-center space-x-1 text-sm mt-1">
                    {(() => {
                      const { change, trend } = calculatePeriodChange(performanceData, 'roas')
                      return (
                        <>
                          {trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-[#03ba2b]" />
                          ) : trend === 'down' ? (
                            <TrendingDown className="h-3 w-3 text-[#f73c3c]" />
                          ) : null}
                          <span className={trend === 'up' ? 'text-[#03ba2b]' : trend === 'down' ? 'text-[#f73c3c]' : 'text-[#afafaf]'}>
                            {change > 0 ? `${trend === 'up' ? '+' : '-'}${formatNumber(change, 1)}%` : 'No change'}
                          </span>
                        </>
                      )
                    })()}
                  </div>
                  <p className="text-xs text-[#afafaf] mt-1">Return on ad spend</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-[#afafaf]">Conversions</CardTitle>
                    <Users className="h-5 w-5 text-[#f73c3c]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatNumber(campaign.conversions)}</div>
                  <div className="flex items-center space-x-1 text-sm mt-1">
                    {(() => {
                      const { change, trend } = calculatePeriodChange(performanceData, 'conversions')
                      return (
                        <>
                          {trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-[#03ba2b]" />
                          ) : trend === 'down' ? (
                            <TrendingDown className="h-3 w-3 text-[#f73c3c]" />
                          ) : null}
                          <span className={trend === 'up' ? 'text-[#03ba2b]' : trend === 'down' ? 'text-[#f73c3c]' : 'text-[#afafaf]'}>
                            {change > 0 ? `${trend === 'up' ? '+' : '-'}${formatNumber(change, 1)}%` : 'No change'}
                          </span>
                        </>
                      )
                    })()}
                  </div>
                  <p className="text-xs text-[#afafaf] mt-1">Total conversions</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for Different Views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-[#2b2b2b] border-[#3f3f3f]">
                <TabsTrigger value="overview" className="data-[state=active]:bg-[#a545b6]">Overview</TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-[#a545b6]">Performance</TabsTrigger>
                <TabsTrigger value="audience" className="data-[state=active]:bg-[#a545b6]">Audience</TabsTrigger>
                <TabsTrigger value="insights" className="data-[state=active]:bg-[#a545b6]">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Performance Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white">Spend vs Revenue (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                            <XAxis
                              dataKey="date"
                              stroke="#afafaf"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#afafaf" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#2b2b2b',
                                border: '1px solid #3f3f3f',
                                borderRadius: '8px',
                                color: 'white'
                              }}
                              formatter={(value: any, name: string) => [
                                name === 'spend' || name === 'revenue' ? formatCurrency(value) : formatNumber(value, 2),
                                name === 'spend' ? 'Spend' : name === 'revenue' ? 'Revenue' : name
                              ]}
                              labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <Area
                              type="monotone"
                              dataKey="spend"
                              stackId="1"
                              stroke={chartColors.danger}
                              fill={chartColors.danger}
                              fillOpacity={0.3}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stackId="1"
                              stroke={chartColors.success}
                              fill={chartColors.success}
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MousePointer className="h-4 w-4 text-[#afafaf]" />
                          <span className="text-sm text-[#afafaf]">CTR</span>
                        </div>
                        <span className="font-medium">{formatPercentage(campaign.ctr)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-[#afafaf]" />
                          <span className="text-sm text-[#afafaf]">CPC</span>
                        </div>
                        <span className="font-medium">${formatNumber(campaign.cpc, 2)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-[#afafaf]" />
                          <span className="text-sm text-[#afafaf]">CPM</span>
                        </div>
                        <span className="font-medium">${formatNumber(campaign.cpm, 2)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-[#afafaf]" />
                          <span className="text-sm text-[#afafaf]">CPP</span>
                        </div>
                        <span className="font-medium">${formatNumber(campaign.cpp, 2)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-[#afafaf]" />
                          <span className="text-sm text-[#afafaf]">Daily Budget</span>
                        </div>
                        <span className="font-medium">
                          {campaign.daily_budget ? formatCurrency(campaign.daily_budget) : 'Not set'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-[#afafaf]" />
                          <span className="text-sm text-[#afafaf]">Objective</span>
                        </div>
                        <span className="font-medium text-xs">{campaign.objective}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Conversions Over Time */}
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white">Conversions Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                            <XAxis
                              dataKey="date"
                              stroke="#afafaf"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#afafaf" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#2b2b2b',
                                border: '1px solid #3f3f3f',
                                borderRadius: '8px',
                                color: 'white'
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="conversions"
                              stroke={chartColors.primary}
                              strokeWidth={3}
                              dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ROAS Trend */}
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white">ROAS Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                            <XAxis
                              dataKey="date"
                              stroke="#afafaf"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#afafaf" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#2b2b2b',
                                border: '1px solid #3f3f3f',
                                borderRadius: '8px',
                                color: 'white'
                              }}
                              formatter={(value: any) => [formatNumber(value, 2) + 'x', 'ROAS']}
                            />
                            <Line
                              type="monotone"
                              dataKey="roas"
                              stroke={chartColors.secondary}
                              strokeWidth={3}
                              dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cost Metrics */}
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white">Cost Metrics (CPC vs CPM)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                            <XAxis
                              dataKey="date"
                              stroke="#afafaf"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#afafaf" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#2b2b2b',
                                border: '1px solid #3f3f3f',
                                borderRadius: '8px',
                                color: 'white'
                              }}
                              formatter={(value: any, name: string) => [
                                '$' + formatNumber(value, 2),
                                name === 'cpc' ? 'CPC' : 'CPM'
                              ]}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="cpc"
                              stroke={chartColors.info}
                              strokeWidth={2}
                              name="CPC"
                            />
                            <Line
                              type="monotone"
                              dataKey="cpm"
                              stroke={chartColors.danger}
                              strokeWidth={2}
                              name="CPM"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Click-Through Rate */}
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white">Click-Through Rate (%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                            <XAxis
                              dataKey="date"
                              stroke="#afafaf"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#afafaf" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#2b2b2b',
                                border: '1px solid #3f3f3f',
                                borderRadius: '8px',
                                color: 'white'
                              }}
                              formatter={(value: any) => [formatNumber(value, 2) + '%', 'CTR']}
                            />
                            <Area
                              type="monotone"
                              dataKey="ctr"
                              stroke={chartColors.success}
                              fill={chartColors.success}
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="audience" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Impressions vs Clicks */}
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white">Impressions vs Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={performanceData.slice(-7)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                            <XAxis
                              dataKey="date"
                              stroke="#afafaf"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                            />
                            <YAxis stroke="#afafaf" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#2b2b2b',
                                border: '1px solid #3f3f3f',
                                borderRadius: '8px',
                                color: 'white'
                              }}
                              formatter={(value: any, name: string) => [
                                formatNumber(value, 0),
                                name === 'impressions' ? 'Impressions' : 'Clicks'
                              ]}
                            />
                            <Legend />
                            <Bar dataKey="impressions" fill={chartColors.primary} name="Impressions" />
                            <Bar dataKey="clicks" fill={chartColors.secondary} name="Clicks" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Audience Engagement */}
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white">Audience Engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#afafaf]">Impressions</span>
                            <span className="text-white">
                              {formatNumber(performanceData.reduce((sum, day) => sum + day.impressions, 0))}
                            </span>
                          </div>
                          <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                            <div className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] h-2 rounded-full w-full"></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#afafaf]">Clicks</span>
                            <span className="text-white">
                              {formatNumber(performanceData.reduce((sum, day) => sum + day.clicks, 0))}
                            </span>
                          </div>
                          <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                            <div className="bg-gradient-to-r from-[#f8c140] to-[#f6cf7d] h-2 rounded-full w-3/4"></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#afafaf]">Conversions</span>
                            <span className="text-white">
                              {formatNumber(performanceData.reduce((sum, day) => sum + day.conversions, 0))}
                            </span>
                          </div>
                          <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                            <div className="bg-gradient-to-r from-[#03ba2b] to-[#377e36] h-2 rounded-full w-1/2"></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-[#3f3f3f] rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Engagement Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#afafaf]">Avg. CTR:</span>
                            <span className="text-white">{formatPercentage(campaign.ctr)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#afafaf]">Conversion Rate:</span>
                            <span className="text-white">
                              {formatPercentage(
                                (performanceData.reduce((sum, day) => sum + day.conversions, 0) /
                                performanceData.reduce((sum, day) => sum + day.clicks, 0)) * 100
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Insights */}
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                        Performance Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-400">Strong ROAS Performance</h4>
                            <p className="text-sm text-[#afafaf] mt-1">
                              Your campaign is generating a {formatNumber(campaign.roas, 2)}x return on ad spend,
                              which is above the industry average of 2.5x.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Eye className="h-5 w-5 text-blue-400 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-400">Audience Engagement</h4>
                            <p className="text-sm text-[#afafaf] mt-1">
                              Your CTR of {formatPercentage(campaign.ctr)} indicates good audience targeting
                              and compelling ad creative.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-yellow-400">Cost Optimization</h4>
                            <p className="text-sm text-[#afafaf] mt-1">
                              Consider optimizing your bidding strategy. Your CPC of ${formatNumber(campaign.cpc, 2)}
                              could potentially be reduced with audience refinement.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Target className="mr-2 h-5 w-5 text-[#a545b6]" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-[#3f3f3f] rounded-lg">
                          <div className="flex items-start space-x-2">
                            <span className="text-green-400 font-bold text-sm">1.</span>
                            <div>
                              <h5 className="font-medium text-white text-sm">Increase Budget</h5>
                              <p className="text-xs text-[#afafaf] mt-1">
                                With a ROAS of {formatNumber(campaign.roas, 2)}x, consider increasing your daily budget
                                to scale successful performance.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-[#3f3f3f] rounded-lg">
                          <div className="flex items-start space-x-2">
                            <span className="text-green-400 font-bold text-sm">2.</span>
                            <div>
                              <h5 className="font-medium text-white text-sm">A/B Test Creative</h5>
                              <p className="text-xs text-[#afafaf] mt-1">
                                Test new ad creative variations to potentially improve CTR beyond the current {formatPercentage(campaign.ctr)}.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-[#3f3f3f] rounded-lg">
                          <div className="flex items-start space-x-2">
                            <span className="text-green-400 font-bold text-sm">3.</span>
                            <div>
                              <h5 className="font-medium text-white text-sm">Lookalike Audiences</h5>
                              <p className="text-xs text-[#afafaf] mt-1">
                                Create lookalike audiences based on your converters to expand reach while maintaining quality.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-[#3f3f3f] rounded-lg">
                          <div className="flex items-start space-x-2">
                            <span className="text-green-400 font-bold text-sm">4.</span>
                            <div>
                              <h5 className="font-medium text-white text-sm">Optimize Landing Page</h5>
                              <p className="text-xs text-[#afafaf] mt-1">
                                Review landing page performance to potentially improve conversion rates.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}