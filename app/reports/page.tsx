"use client"

import { useState, useEffect } from "react"
import AuthGuard from "@/components/auth/AuthGuard"
import Sidebar from "@/components/nav/Sidebar"
import { supabase } from "@/lib/supabase/client"
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Bell,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  BarChart3,
  Download,
  Wrench,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import Link from "next/link"

interface MetricsData {
  totalMetrics: {
    totalSpend: number
    totalRevenue: number
    totalConversions: number
    totalImpressions: number
    totalClicks: number
    averageROAS: number
    averageCTR: number
    averageCPC: number
    averageCPM: number
  }
  dailyData: Array<{
    date: string
    day: string
    spend: number
    revenue: number
    conversions: number
    roas: number
    clicks: number
    impressions: number
    ctr: number
    cpm: number
    cpc: number
  }>
  campaigns: Array<{
    campaign: string
    spend: number
    revenue: number
    conversions: number
    roas: number
    ctr: number
    impressions: number
    clicks: number
  }>
  dataCount: number
}

export default function ReportsPage() {
  return (
    <AuthGuard>
      <ReportsContent />
    </AuthGuard>
  )
}

function ReportsContent() {
  const { t } = useLanguage()
  const [isSyncing, setIsSyncing] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<string>('7')

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser()
        if (userRes.user) {
          setUserId(userRes.user.id)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setError(t('reports.errors.failedToLoadUser'))
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchMetricsData()
    }
  }, [userId, dateRange])

  const fetchMetricsData = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/reports?userId=${userId}&dateRange=${dateRange}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('reports.errors.failedToFetchMetrics'))
      }

      setMetricsData(result.data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
      setError(error.message || t('reports.errors.failedToFetchMetrics'))
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    if (!userId) {
      console.error(t('reports.errors.noUserIdAvailable'))
      return
    }

    setIsSyncing(true)

    try {
      // First sync campaigns
      const response = await fetch('/api/sync-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('reports.errors.syncFailed'))
      }

      console.log("Data synced successfully:", result)

      // Refresh metrics data after sync
      await fetchMetricsData()

    } catch (error) {
      console.error("Sync failed:", error)

      // Show more helpful error messages
      let errorMessage = t('reports.errors.failedToSyncCampaigns')
      if (error.message.includes('configuration not found')) {
        errorMessage = t('reports.errors.configurationNotFound')
      } else if (error.message.includes('missing ad_account_id or token')) {
        errorMessage = t('reports.errors.configurationIncomplete')
      } else if (error.message.includes('No account found')) {
        errorMessage = t('reports.errors.accountSetupIncomplete')
      } else {
        errorMessage = `${t('reports.errors.syncFailed')}: ${error.message}`
      }

      setError(errorMessage)
    } finally {
      setIsSyncing(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  const formatPercentage = (value: number, decimals = 2) => {
    return `${formatNumber(value, decimals)}%`
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Reports Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t("reports.title")}</h1>
              {metricsData && (
                <p className="text-sm text-[#afafaf] mt-1">
                  {t("reports.dataPointsAvailable").replace('{count}', metricsData.dataCount.toString())}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-[#2b2b2b] border border-[#3f3f3f] text-white px-3 py-2 rounded-md"
                disabled={loading}
              >
                <option value="7">{t("reports.dateRange.last7Days")}</option>
                <option value="14">{t("reports.dateRange.last14Days")}</option>
                <option value="30">{t("reports.dateRange.last30Days")}</option>
                <option value="90">{t("reports.dateRange.last90Days")}</option>
              </select>
              <Button
                variant="outline"
                onClick={handleSync}
                disabled={isSyncing || loading || !userId}
                className="border-[#3f3f3f] text-[#afafaf] hover:text-white hover:border-[#a545b6] disabled:opacity-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {loading ? t("reports.actions.loading") : isSyncing ? t("reports.actions.syncing") : t("reports.actions.syncNow")}
              </Button>
              <Button
                className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                disabled={!metricsData}
              >
                <Download className="mr-2 h-4 w-4" />
                {t("reports.actions.export")}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="bg-red-900/20 border-red-500/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && !metricsData && (
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#a545b6]" />
                <p className="text-[#afafaf]">{t("reports.states.loadingCampaignData")}</p>
              </CardContent>
            </Card>
          )}

          {/* No Data State */}
          {!loading && !error && (!metricsData || metricsData.dataCount === 0) && (
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-[#afafaf]" />
                <p className="text-white font-semibold mb-2">{t("reports.states.noCampaignData")}</p>
                <p className="text-[#afafaf] mb-4">
                  {t("reports.states.noCampaignDataDesc")}
                </p>
                <Button
                  onClick={handleSync}
                  disabled={isSyncing || !userId}
                  className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? t("reports.actions.syncing") : t("reports.actions.syncCampaigns")}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* KPI Cards */}
          {metricsData && metricsData.dataCount > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-[#5e2e6c] to-[#401958] border-[#2b2b2b]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-[#f8c140]" />
                    <CardTitle className="text-sm font-medium text-[#afafaf]">{t("reports.kpis.totalSpend")}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4 text-[#afafaf]" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(metricsData.totalMetrics.totalSpend)}
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-[#afafaf]">{t("reports.kpis.lastDays").replace('{days}', dateRange)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-[#03ba2b]" />
                    <CardTitle className="text-sm font-medium text-[#afafaf]">{t("reports.kpis.totalRevenue")}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4 text-[#afafaf]" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(metricsData.totalMetrics.totalRevenue)}
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-[#afafaf]">
                      {formatNumber(metricsData.totalMetrics.totalConversions)} {t("reports.kpis.conversions")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-[#f8c140]" />
                    <CardTitle className="text-sm font-medium text-[#afafaf]">{t("reports.kpis.averageRoas")}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4 text-[#afafaf]" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(metricsData.totalMetrics.averageROAS, 2)}x
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    {metricsData.totalMetrics.averageROAS > 2 ? (
                      <TrendingUp className="h-3 w-3 text-[#03ba2b]" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-[#f73c3c]" />
                    )}
                    <span className={metricsData.totalMetrics.averageROAS > 2 ? "text-[#03ba2b]" : "text-[#f73c3c]"}>
                      {metricsData.totalMetrics.averageROAS > 2 ? t("reports.kpis.good") : t("reports.kpis.needsImprovement")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-[#a545b6]" />
                    <CardTitle className="text-sm font-medium text-[#afafaf]">{t("reports.kpis.averageCtr")}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4 text-[#afafaf]" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatPercentage(metricsData.totalMetrics.averageCTR)}
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-[#afafaf]">
                      {formatNumber(metricsData.totalMetrics.totalClicks)} {t("reports.kpis.clicks")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts Section */}
          {metricsData && metricsData.dataCount > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Spend Chart */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="text-white">{t("reports.charts.dailySpend")}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-[#afafaf]">
                    <span>{t("reports.charts.totalSpend")}</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(metricsData.totalMetrics.totalSpend)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metricsData.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                        <XAxis dataKey="day" stroke="#afafaf" />
                        <YAxis stroke="#afafaf" />
                        <Line
                          type="monotone"
                          dataKey="spend"
                          stroke="#a545b6"
                          strokeWidth={3}
                          dot={{ fill: "#a545b6", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-[#afafaf] text-center mt-2">{t("reports.charts.days")}</div>
                </CardContent>
              </Card>

              {/* Campaign Performance Chart */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="text-white">{t("reports.charts.campaignPerformance")}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-[#afafaf]">
                    <span>{t("reports.charts.clickThroughRate")}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metricsData.campaigns} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                        <XAxis type="number" stroke="#afafaf" />
                        <YAxis dataKey="campaign" type="category" stroke="#afafaf" width={100} />
                        <Bar dataKey="ctr" fill="#a545b6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-[#afafaf] text-center mt-2">{t("reports.charts.campaignCtr")}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bottom Charts Section */}
          {metricsData && metricsData.dataCount > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ROAS Chart */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="text-white">{t("reports.charts.campaignRoas")}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-[#afafaf]">
                    <span>{t("reports.charts.returnOnAdSpend")}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metricsData.campaigns.slice(0, 5).map((item, index) => {
                      const maxROAS = Math.max(...metricsData.campaigns.map(c => c.roas), 6)
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#afafaf]">{item.campaign}</span>
                            <span className="text-white font-semibold">
                              {formatNumber(item.roas, 2)}x
                            </span>
                          </div>
                          <div className="w-full bg-[#3f3f3f] rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] h-3 rounded-full"
                              style={{ width: `${Math.min((item.roas / maxROAS) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-xs text-[#afafaf] text-center mt-4">
                    {t("reports.charts.higherRoasIndicates")}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader>
                  <CardTitle className="text-white">{t("reports.charts.dailyRevenue")}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-[#afafaf]">
                    <span>{t("reports.charts.totalRevenue")}</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(metricsData.totalMetrics.totalRevenue)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metricsData.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f3f" />
                        <XAxis dataKey="day" stroke="#afafaf" />
                        <YAxis stroke="#afafaf" />
                        <Bar dataKey="revenue" fill="#03ba2b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-[#afafaf] text-center mt-2">{t("reports.charts.days")}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Campaign Performance Table */}
          {metricsData && metricsData.dataCount > 0 && metricsData.campaigns.length > 0 && (
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white">{t("reports.table.campaignPerformanceDetails")}</CardTitle>
                <p className="text-sm text-[#afafaf]">
                  {t("reports.table.detailedBreakdown")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#3f3f3f]">
                        <th className="text-left py-3 px-4 font-semibold text-[#afafaf]">{t("reports.table.campaign")}</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#afafaf]">{t("reports.table.spend")}</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#afafaf]">{t("reports.table.revenue")}</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#afafaf]">{t("reports.table.roas")}</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#afafaf]">{t("reports.table.ctr")}</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#afafaf]">{t("reports.table.conversions")}</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#afafaf]">{t("reports.table.clicks")}</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#afafaf]">{t("reports.table.impressions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metricsData.campaigns.map((campaign, index) => (
                        <tr key={index} className="border-b border-[#3f3f3f]/50 hover:bg-[#3f3f3f]/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d]"></div>
                              <span className="text-white font-medium">{campaign.campaign}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-white">
                            {formatCurrency(campaign.spend)}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="text-[#03ba2b] font-semibold">
                              {formatCurrency(campaign.revenue)}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className={`font-semibold ${
                              campaign.roas > 2 ? 'text-[#03ba2b]' :
                              campaign.roas > 1 ? 'text-[#f8c140]' : 'text-[#f73c3c]'
                            }`}>
                              {formatNumber(campaign.roas, 2)}x
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className={`font-semibold ${
                              campaign.ctr > 2 ? 'text-[#03ba2b]' :
                              campaign.ctr > 1 ? 'text-[#f8c140]' : 'text-[#afafaf]'
                            }`}>
                              {formatPercentage(campaign.ctr)}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4 text-[#afafaf]">
                            {formatNumber(campaign.conversions)}
                          </td>
                          <td className="text-right py-3 px-4 text-[#afafaf]">
                            {formatNumber(campaign.clicks)}
                          </td>
                          <td className="text-right py-3 px-4 text-[#afafaf]">
                            {formatNumber(campaign.impressions)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {metricsData.campaigns.length === 0 && (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-[#afafaf]" />
                    <p className="text-[#afafaf]">{t("reports.states.noCampaignDataForPeriod")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
