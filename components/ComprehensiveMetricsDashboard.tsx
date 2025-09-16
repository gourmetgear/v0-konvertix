"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  DollarSign, 
  Users, 
  Eye,
  Target,
  ShoppingCart,
  UserPlus,
  Calendar,
  RefreshCw,
  Zap,
  MousePointer,
  Percent
} from 'lucide-react'

interface DailyMetric {
  id: string
  date: string
  user_id: string
  account_id: string
  pixel_id: string
  platform: string
  impressions: number
  clicks: number
  spend: number
  cpm: number
  cpc: number
  ctr: number
  frequency: number
  reach: number
  unique_clicks: number
  total_conversions: number
  purchase_conversions: number
  lead_conversions: number
  registration_conversions: number
  add_to_cart_conversions: number
  initiate_checkout_conversions: number
  total_revenue: number
  purchase_revenue: number
  cost_per_conversion: number
  cost_per_purchase: number
  cost_per_lead: number
  roas: number
  server_events: number
  browser_events: number
  matched_events: number
  match_rate: number
  active_campaigns: number
  active_adsets: number
  active_ads: number
}

interface MetricsSummary {
  totalSpend: number
  totalRevenue: number
  totalConversions: number
  totalImpressions: number
  totalClicks: number
  averageRoas: number
  averageCtr: number
  averageMatchRate: number
  totalServerEvents: number
  totalMatchedEvents: number
  activeCampaigns: number
  activeAds: number
  costPerConversion: number
}

interface ComprehensiveMetricsDashboardProps {
  userId: string
  accountId?: string
  pixelId?: string
}

export default function ComprehensiveMetricsDashboard({ userId, accountId, pixelId }: ComprehensiveMetricsDashboardProps) {
  const [metrics, setMetrics] = useState<DailyMetric[]>([])
  const [summary, setSummary] = useState<MetricsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [timeRange, setTimeRange] = useState('30') // days
  const [aggregation, setAggregation] = useState<'day' | 'week' | 'month'>('day')

  useEffect(() => {
    fetchMetrics()
  }, [userId, accountId, pixelId, timeRange, aggregation])

  const fetchMetrics = async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        userId,
        limit: timeRange,
        aggregation,
        platform: 'facebook'
      })
      
      if (accountId) params.append('accountId', accountId)
      if (pixelId) params.append('pixelId', pixelId)

      // Add date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - parseInt(timeRange))
      
      params.append('startDate', startDate.toISOString().split('T')[0])
      params.append('endDate', endDate.toISOString().split('T')[0])

      const response = await fetch(`/api/metrics-daily?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch metrics')
      }

      setMetrics(data.data || [])
      setSummary(data.summary || null)
    } catch (err) {
      setError(err.message || 'Failed to fetch metrics')
      console.error('Comprehensive metrics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getChangeIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-3 w-3 text-green-400" />
    if (current < previous) return <TrendingDown className="h-3 w-3 text-red-400" />
    return null
  }

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Facebook Ads Performance</h2>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={aggregation} onValueChange={(value: 'day' | 'week' | 'month') => setAggregation(value)}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={fetchMetrics} 
            variant="outline" 
            size="sm"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="bg-red-900/20 border-red-500">
          <CardContent className="pt-6">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-200">Total Spend</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary?.totalSpend || 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-200">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary?.totalRevenue || 0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-200">ROAS</p>
                <p className="text-2xl font-bold text-white">{(summary?.averageRoas || 0).toFixed(2)}x</p>
              </div>
              <Target className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-200">Conversions</p>
                <p className="text-2xl font-bold text-white">{formatNumber(summary?.totalConversions || 0)}</p>
              </div>
              <Users className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Impressions</span>
              </div>
              <span className="text-lg font-semibold text-white">{formatNumber(summary?.totalImpressions || 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">Clicks</span>
              </div>
              <span className="text-lg font-semibold text-white">{formatNumber(summary?.totalClicks || 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-400">CTR</span>
              </div>
              <span className="text-lg font-semibold text-white">{(summary?.averageCtr || 0).toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-red-400" />
                <span className="text-sm text-gray-400">Cost/Conv</span>
              </div>
              <span className="text-lg font-semibold text-white">{formatCurrency(summary?.costPerConversion || 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CAPI Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Server Events</span>
              </div>
              <span className="text-lg font-semibold text-white">{formatNumber(summary?.totalServerEvents || 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">Matched Events</span>
              </div>
              <span className="text-lg font-semibold text-white">{formatNumber(summary?.totalMatchedEvents || 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-400">Match Rate</span>
              </div>
              <span className={`text-lg font-semibold ${(summary?.averageMatchRate || 0) > 70 ? 'text-green-400' : (summary?.averageMatchRate || 0) > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {(summary?.averageMatchRate || 0).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Performance Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {aggregation.charAt(0).toUpperCase() + aggregation.slice(1)} Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No metrics data available for the selected period.</p>
              <p className="text-sm mt-2">Make sure your n8n workflow is running and Facebook Ads are configured.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-3 text-gray-400">Date</th>
                    <th className="text-right p-3 text-gray-400">Impressions</th>
                    <th className="text-right p-3 text-gray-400">Clicks</th>
                    <th className="text-right p-3 text-gray-400">Spend</th>
                    <th className="text-right p-3 text-gray-400">Revenue</th>
                    <th className="text-right p-3 text-gray-400">ROAS</th>
                    <th className="text-right p-3 text-gray-400">Conversions</th>
                    <th className="text-right p-3 text-gray-400">Match Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="p-3 text-white">{formatDate(metric.date)}</td>
                      <td className="p-3 text-right text-white">{formatNumber(metric.impressions)}</td>
                      <td className="p-3 text-right text-white">{formatNumber(metric.clicks)}</td>
                      <td className="p-3 text-right text-white">{formatCurrency(metric.spend)}</td>
                      <td className="p-3 text-right text-white">{formatCurrency(metric.total_revenue)}</td>
                      <td className="p-3 text-right">
                        <span className={`font-medium ${metric.roas > 3 ? 'text-green-400' : metric.roas > 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {metric.roas.toFixed(2)}x
                        </span>
                      </td>
                      <td className="p-3 text-right text-white">{formatNumber(metric.total_conversions)}</td>
                      <td className="p-3 text-right">
                        <span className={`font-medium ${(metric.match_rate * 100) > 70 ? 'text-green-400' : (metric.match_rate * 100) > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {formatPercentage(metric.match_rate)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}