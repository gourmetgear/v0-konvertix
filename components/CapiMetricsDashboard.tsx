"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Users, 
  Eye,
  ShoppingCart,
  UserPlus,
  Calendar,
  RefreshCw
} from 'lucide-react'

interface CapiMetric {
  id: string
  user_id: string
  account_id: string
  pixel_id: string
  provider: string
  date_start: string
  date_stop: string
  fetch_date: string
  events_received: number
  events_matched: number
  match_rate: number
  events_pageview: number
  events_purchase: number
  events_lead: number
  events_add_to_cart: number
  events_initiate_checkout: number
  events_complete_registration: number
  events_other: number
  total_revenue: number
  total_conversions: number
  server_events_count: number
  browser_events_count: number
}

interface CapiMetricsDashboardProps {
  userId: string
  accountId?: string
  pixelId?: string
}

export default function CapiMetricsDashboard({ userId, accountId, pixelId }: CapiMetricsDashboardProps) {
  const [metrics, setMetrics] = useState<CapiMetric[]>([])
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
        aggregation
      })
      
      if (accountId) params.append('accountId', accountId)
      if (pixelId) params.append('pixelId', pixelId)

      // Add date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - parseInt(timeRange))
      
      params.append('startDate', startDate.toISOString().split('T')[0])
      params.append('endDate', endDate.toISOString().split('T')[0])

      const response = await fetch(`/api/capi-metrics?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch metrics')
      }

      setMetrics(data.data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch metrics')
      console.error('CAPI metrics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary statistics
  const summary = metrics.reduce((acc, metric) => ({
    totalEventsReceived: acc.totalEventsReceived + (metric.events_received || 0),
    totalEventsMatched: acc.totalEventsMatched + (metric.events_matched || 0),
    totalRevenue: acc.totalRevenue + (parseFloat(metric.total_revenue?.toString()) || 0),
    totalConversions: acc.totalConversions + (metric.total_conversions || 0),
    totalPageViews: acc.totalPageViews + (metric.events_pageview || 0),
    totalPurchases: acc.totalPurchases + (metric.events_purchase || 0),
    totalLeads: acc.totalLeads + (metric.events_lead || 0),
    totalAddToCarts: acc.totalAddToCarts + (metric.events_add_to_cart || 0)
  }), {
    totalEventsReceived: 0,
    totalEventsMatched: 0,
    totalRevenue: 0,
    totalConversions: 0,
    totalPageViews: 0,
    totalPurchases: 0,
    totalLeads: 0,
    totalAddToCarts: 0
  })

  const averageMatchRate = summary.totalEventsReceived > 0 
    ? (summary.totalEventsMatched / summary.totalEventsReceived * 100)
    : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
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
        <h2 className="text-2xl font-bold text-white">CAPI Performance Metrics</h2>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Events Received</p>
                <p className="text-2xl font-bold text-white">{summary.totalEventsReceived.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Match Rate</p>
                <p className="text-2xl font-bold text-white">{averageMatchRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Conversions</p>
                <p className="text-2xl font-bold text-white">{summary.totalConversions.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Page Views</span>
              </div>
              <span className="text-lg font-semibold text-white">{summary.totalPageViews.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">Purchases</span>
              </div>
              <span className="text-lg font-semibold text-white">{summary.totalPurchases.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-400">Leads</span>
              </div>
              <span className="text-lg font-semibold text-white">{summary.totalLeads.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-gray-400">Add to Cart</span>
              </div>
              <span className="text-lg font-semibold text-white">{summary.totalAddToCarts.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Metrics Table */}
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
              <p className="text-sm mt-2">Make sure your n8n workflow is running and CAPI is configured.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-3 text-gray-400">Date</th>
                    <th className="text-right p-3 text-gray-400">Events</th>
                    <th className="text-right p-3 text-gray-400">Matched</th>
                    <th className="text-right p-3 text-gray-400">Match Rate</th>
                    <th className="text-right p-3 text-gray-400">Revenue</th>
                    <th className="text-right p-3 text-gray-400">Conversions</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="p-3 text-white">{formatDate(metric.date_start)}</td>
                      <td className="p-3 text-right text-white">{metric.events_received?.toLocaleString() || 0}</td>
                      <td className="p-3 text-right text-white">{metric.events_matched?.toLocaleString() || 0}</td>
                      <td className="p-3 text-right">
                        <span className={`font-medium ${(metric.match_rate || 0) > 0.7 ? 'text-green-400' : (metric.match_rate || 0) > 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {formatPercentage(metric.match_rate || 0)}
                        </span>
                      </td>
                      <td className="p-3 text-right text-white">{formatCurrency(parseFloat(metric.total_revenue?.toString()) || 0)}</td>
                      <td className="p-3 text-right text-white">{metric.total_conversions?.toLocaleString() || 0}</td>
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