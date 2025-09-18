"use client"
import { useState, useEffect } from "react"
import AuthGuard from "@/components/auth/AuthGuard"
import Sidebar from "@/components/nav/Sidebar"
import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Bell,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Settings,
  HeadphonesIcon,
  Plus,
  Filter,
  Download,
  Play,
  Pause,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  AlertCircle,
  BarChart4,
  Eye,
  EyeOff,
  Lightbulb,
  TrendingDown,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import CampaignAnalysisModal from "@/components/CampaignAnalysisModal"

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

interface CampaignStats {
  totalCampaigns: number
  activeCampaigns: number
  totalSpend: number
  avgRoas: number
}

interface CampaignAnalysis {
  id: string
  title: string
  summary: string
  detailed_analysis: any
  insights: any[]
  recommendations: any[]
  metrics: any
  confidence_score: number
  created_at: string
}

export default function CampaignsPage() {
  return (
    <AuthGuard>
      <CampaignsContent />
    </AuthGuard>
  )
}

function CampaignsContent() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [displayedCampaigns, setDisplayedCampaigns] = useState<Campaign[]>([])
  const [campaignStats, setCampaignStats] = useState<CampaignStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSpend: 0,
    avgRoas: 0
  })
  const [loading, setLoading] = useState(true)
  const [navigating, setNavigating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreCampaigns, setHasMoreCampaigns] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [analyzingCampaigns, setAnalyzingCampaigns] = useState(false)
  const [analyses, setAnalyses] = useState<CampaignAnalysis[]>([])
  const [loadingAnalyses, setLoadingAnalyses] = useState(false)
  const [showAnalyses, setShowAnalyses] = useState(false)
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [currentAnalysisResult, setCurrentAnalysisResult] = useState(null)
  const [currentAnalysisCampaign, setCurrentAnalysisCampaign] = useState('')
  const [analyzingSingleCampaign, setAnalyzingSingleCampaign] = useState<string | null>(null)
  const CAMPAIGNS_PER_PAGE = 10

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [isDropdownOpen])

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
      fetchCampaigns()
      fetchAnalyses()
    }
  }, [userId])

  // Filter and search campaigns whenever campaigns, searchTerm, statusFilter, or sortBy changes
  useEffect(() => {
    let filtered = campaigns

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(campaign => {
        const campaignStatus = getCampaignStatus(campaign)
        // Handle case-insensitive comparison and various status formats
        const match = campaignStatus.toUpperCase() === statusFilter.toUpperCase()

        // Debug logging for status filtering
        if (!match) {
          console.log('Filter Debug:', {
            campaignName: campaign.campaign_name,
            campaignStatus: campaignStatus,
            statusFilter: statusFilter,
            match: match
          })
        }

        return match
      })
    }

    console.log('Filter Results:', {
      originalCount: campaigns.length,
      filteredCount: filtered.length,
      statusFilter: statusFilter,
      searchTerm: searchTerm
    })

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let result = 0

        switch (sortBy) {
          case 'campaign_name':
            result = a.campaign_name.localeCompare(b.campaign_name)
            break
          case 'spend':
            result = parseFloat(a.spend as string) - parseFloat(b.spend as string)
            break
          case 'revenue':
            result = parseFloat(a.revenue as string) - parseFloat(b.revenue as string)
            break
          case 'roas':
            result = parseFloat(a.roas as string) - parseFloat(b.roas as string)
            break
          case 'conversions':
            result = a.conversions - b.conversions
            break
          case 'ctr':
            result = parseFloat(a.ctr as string) - parseFloat(b.ctr as string)
            break
          case 'cpc':
            result = parseFloat(a.cpc as string) - parseFloat(b.cpc as string)
            break
          case 'cpm':
            result = parseFloat(a.cpm as string) - parseFloat(b.cpm as string)
            break
          case 'cpp':
            result = parseFloat(a.cpp as string) - parseFloat(b.cpp as string)
            break
          default:
            return 0
        }

        return sortDirection === 'desc' ? -result : result
      })
    }

    setFilteredCampaigns(filtered)

    // Reset pagination when filters change
    const initialFiltered = filtered.slice(0, CAMPAIGNS_PER_PAGE)
    setDisplayedCampaigns(initialFiltered)
    setHasMoreCampaigns(filtered.length > CAMPAIGNS_PER_PAGE)
    setCurrentPage(1)
  }, [campaigns, searchTerm, statusFilter, sortBy, sortDirection])

  const fetchCampaigns = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/reports?userId=${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch campaigns')
      }

      // Get campaigns data directly from the API response
      const campaignsData = result.data.campaigns || []

      // Convert campaigns data to the expected format
      const campaignsList = campaignsData.map((campaign: any) => {
        // Debug ROAS and Status values
        if (campaign.campaign && (campaign.roas !== undefined || campaign.status)) {
          console.log('Frontend Debug:', {
            name: campaign.campaign,
            status: campaign.status,
            statusType: typeof campaign.status,
            roas: campaign.roas,
            roasType: typeof campaign.roas,
            spend: campaign.spend,
            revenue: campaign.revenue
          })
        }

        return {
          id: campaign.campaign || `campaign-${Math.random()}`,
          campaign_name: campaign.campaign,
          spend: campaign.spend || 0,
          revenue: campaign.revenue || 0,
          conversions: campaign.conversions || 0,
          roas: campaign.roas || 0,
          date: new Date().toISOString().split('T')[0],
          objective: campaign.objective || 'OUTCOME_SALES',
          daily_budget: campaign.daily_budget || null,
          ctr: campaign.ctr || 0,
          cpc: campaign.cpc || 0,
          cpm: campaign.cpm || 0,
          cpp: campaign.cpp || 0,
          status: campaign.status || 'UNKNOWN',
          campaign_id: campaign.campaign_id || null
        }
      })

      setCampaigns(campaignsList)


      // Set initial displayed campaigns (first page)
      const initialCampaigns = campaignsList.slice(0, CAMPAIGNS_PER_PAGE)
      setDisplayedCampaigns(initialCampaigns)
      setHasMoreCampaigns(campaignsList.length > CAMPAIGNS_PER_PAGE)
      setCurrentPage(1)

      // Calculate stats
      const stats: CampaignStats = {
        totalCampaigns: campaignsList.length,
        activeCampaigns: campaignsList.filter(c => parseFloat(c.spend as string) > 0).length,
        totalSpend: result.data.totalMetrics.totalSpend || 0,
        avgRoas: result.data.totalMetrics.averageROAS || 0
      }
      setCampaignStats(stats)

    } catch (error) {
      console.error('Error fetching campaigns:', error)
      setError(error.message || 'Failed to fetch campaigns')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalyses = async () => {
    if (!userId) return

    try {
      setLoadingAnalyses(true)
      // Skip fetching analyses since the table doesn't exist yet
      // This can be re-enabled once the campaign_analysis table is created
      console.log('Skipping analysis fetch - campaign_analysis table not available')
      setAnalyses([])
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setLoadingAnalyses(false)
    }
  }

  const getCampaignStatus = (campaign: Campaign) => {
    // Use actual status from database if available, otherwise fall back to spend-based logic
    if (campaign.status && campaign.status !== 'UNKNOWN') {
      // Normalize status to title case for consistency
      return campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1).toLowerCase()
    }

    // Fallback logic for campaigns without status data
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
      case 'deleted':
        return <Badge className="bg-red-600 hover:bg-red-700">{status}</Badge>
      case 'no spend':
        return <Badge className="bg-gray-600 hover:bg-gray-700">{status}</Badge>
      default:
        // Handle other statuses or show the actual status
        return <Badge className="bg-blue-600 hover:bg-blue-700">{status}</Badge>
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

  const formatCurrencyMetric = (value: number | string, decimals = 2) => {
    const num = parseFloat(value as string) || 0
    return `$${formatNumber(num, decimals)}`
  }

  const loadMoreCampaigns = () => {
    const nextPage = currentPage + 1
    const startIndex = 0 // Always start from beginning
    const endIndex = nextPage * CAMPAIGNS_PER_PAGE

    const newDisplayedCampaigns = filteredCampaigns.slice(startIndex, endIndex)
    setDisplayedCampaigns(newDisplayedCampaigns)
    setCurrentPage(nextPage)
    setHasMoreCampaigns(filteredCampaigns.length > endIndex)
  }

  const getStatusOptions = () => {
    const statuses = new Set(['All'])

    // Only process campaigns if they exist
    if (campaigns && campaigns.length > 0) {
      campaigns.forEach(campaign => {
        try {
          const status = getCampaignStatus(campaign)
          // Normalize status display (capitalize first letter, rest lowercase for consistency)
          const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          statuses.add(normalizedStatus)
        } catch (error) {
          console.error('Error processing campaign status:', error, campaign)
        }
      })
    }

    const statusArray = Array.from(statuses).sort((a, b) => {
      // Sort with 'All' first, then alphabetically
      if (a === 'All') return -1
      if (b === 'All') return 1
      return a.localeCompare(b)
    })

    console.log('Status Options:', statusArray)
    console.log('Current Status Filter:', statusFilter)
    console.log('Total Campaigns:', campaigns?.length || 0)
    return statusArray
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null
    return sortDirection === 'asc' ?
      <ChevronUp className="ml-1 h-4 w-4 inline" /> :
      <ChevronDown className="ml-1 h-4 w-4 inline" />
  }

  const analyzeCampaigns = async () => {
    if (!userId) {
      setError('User not authenticated')
      return
    }

    try {
      setAnalyzingCampaigns(true)
      setError(null)

      // Use userId directly as account_id (same pattern as fetchCampaigns and reports API)
      let accountId = userId

      // Try to get account_id from account_members table as fallback
      try {
        const { data: accountMember, error: accountError } = await supabase
          .from('account_members')
          .select('account_id')
          .eq('user_id', userId)
          .single()

        if (!accountError && accountMember) {
          accountId = accountMember.account_id
        }
      } catch (fallbackError) {
        // If account_members lookup fails, continue with userId as account_id
        console.log('Using userId as account_id (account_members lookup failed):', fallbackError)
      }

      // Call the analyze campaigns webhook
      const response = await fetch('https://n8n.konvertix.de/webhook/analyze-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: accountId
        })
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result = await response.json()

      // Show success message and refresh analyses
      alert('Campaign analysis started successfully! Check your reports for insights.')

      // Refresh analyses after a short delay to allow processing
      setTimeout(() => {
        fetchAnalyses()
      }, 2000)

    } catch (error) {
      console.error('Error analyzing campaigns:', error)
      setError(error.message || 'Failed to analyze campaigns')
    } finally {
      setAnalyzingCampaigns(false)
    }
  }

  const analyzeSingleCampaign = async (campaignName: string, campaignId?: string) => {
    if (!userId) {
      setError('User not authenticated')
      return
    }

    try {
      setError(null)
      setAnalyzingSingleCampaign(campaignName)

      // Use userId directly as account_id (same pattern as fetchCampaigns and reports API)
      let accountId = userId

      // Try to get account_id from account_members table as fallback
      try {
        const { data: accountMember, error: accountError } = await supabase
          .from('account_members')
          .select('account_id')
          .eq('user_id', userId)
          .single()

        if (!accountError && accountMember) {
          accountId = accountMember.account_id
        }
      } catch (fallbackError) {
        // If account_members lookup fails, continue with userId as account_id
        console.log('Using userId as account_id (account_members lookup failed):', fallbackError)
      }

      // Call the analyze single campaign webhook
      const response = await fetch('https://n8n.konvertix.de/webhook/analyze-single-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: accountId,
          campaign_name: campaignName,
          campaign_id: campaignId
        })
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Analysis result:', result)

      // Display the analysis results in the modal
      setCurrentAnalysisResult(result)
      setCurrentAnalysisCampaign(campaignName)
      setAnalysisModalOpen(true)

      // Also refresh analyses for future reference
      setTimeout(() => {
        fetchAnalyses()
      }, 2000)

    } catch (error) {
      console.error('Error analyzing single campaign:', error)
      setError(error.message || `Failed to analyze campaign "${campaignName}"`)
    } finally {
      setAnalyzingSingleCampaign(null)
    }
  }

  const exportToCSV = () => {
    // Use filtered campaigns for export to include search/filter results
    const dataToExport = filteredCampaigns.length > 0 ? filteredCampaigns : campaigns

    // Create CSV headers
    const headers = [
      'Campaign Name',
      'Status',
      'Daily Budget',
      'Spent',
      'Revenue',
      'Conversions',
      'ROAS',
      'CTR',
      'CPC',
      'CPM',
      'CPP',
      'Date',
      'Objective'
    ]

    // Create CSV rows
    const csvData = dataToExport.map(campaign => [
      `"${campaign.campaign_name}"`, // Wrap in quotes to handle commas
      getCampaignStatus(campaign),
      campaign.daily_budget ? formatCurrency(campaign.daily_budget).replace(/[$,]/g, '') : '0',
      formatCurrency(campaign.spend).replace(/[$,]/g, ''), // Remove $ and commas for numbers
      formatCurrency(campaign.revenue).replace(/[$,]/g, ''),
      campaign.conversions.toString(),
      formatNumber(campaign.roas, 2),
      formatNumber(campaign.ctr, 2),
      formatNumber(campaign.cpc, 2),
      formatNumber(campaign.cpm, 2),
      formatNumber(campaign.cpp, 2),
      campaign.date,
      campaign.objective
    ])

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)

      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD format
      const filename = `campaigns_export_${dateStr}.csv`

      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Campaigns Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  onClick={exportToCSV}
                  disabled={campaigns.length === 0}
                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent disabled:opacity-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAnalyses(!showAnalyses)}
                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                >
                  {showAnalyses ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {showAnalyses ? 'Hide Insights' : `View Insights ${analyses.length > 0 ? `(${analyses.length})` : ''}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={analyzeCampaigns}
                  disabled={analyzingCampaigns || !userId || campaigns.length === 0}
                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent disabled:opacity-50"
                >
                  <BarChart4 className={`mr-2 h-4 w-4 ${analyzingCampaigns ? 'animate-pulse' : ''}`} />
                  {analyzingCampaigns ? 'Analyzing...' : 'Analyze'}
                </Button>
                <Button
                  variant="outline"
                  onClick={fetchCampaigns}
                  disabled={loading || !userId}
                  className="border-[#3f3f3f] text-[#afafaf] hover:text-white hover:border-[#a545b6] disabled:opacity-50"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'Sync'}
                </Button>
                <Link href="/campaigns/create">
                  <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </Link>
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

            {/* Campaign Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Total Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{campaignStats.totalCampaigns}</div>
                  <p className="text-xs text-[#afafaf]">From Facebook Ads</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{campaignStats.activeCampaigns}</div>
                  <p className="text-xs text-[#afafaf]">With spend data</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Total Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(campaignStats.totalSpend)}</div>
                  <p className="text-xs text-[#afafaf]">All campaigns</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">Avg ROAS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(campaignStats.avgRoas, 2)}x</div>
                  <p className="text-xs text-[#afafaf]">Return on ad spend</p>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Analysis Section */}
            {showAnalyses && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
                    Campaign Insights
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchAnalyses}
                    disabled={loadingAnalyses}
                    className="text-[#afafaf] hover:text-white"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loadingAnalyses ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {loadingAnalyses ? (
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardContent className="p-6 text-center">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#a545b6]" />
                      <p className="text-[#afafaf]">Loading analysis...</p>
                    </CardContent>
                  </Card>
                ) : analyses.length === 0 ? (
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardContent className="p-6 text-center">
                      <BarChart4 className="h-12 w-12 mx-auto mb-4 text-[#afafaf]" />
                      <p className="text-white font-semibold mb-2">No analysis available</p>
                      <p className="text-[#afafaf] mb-4">
                        Click "Analyze" to generate AI-powered insights for your campaigns
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {analyses.map((analysis) => (
                      <Card key={analysis.id} className="bg-[#2b2b2b] border-[#3f3f3f]">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center">
                              <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                              {analysis.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {Math.round(analysis.confidence_score * 100)}% confidence
                              </Badge>
                              <div className="flex items-center text-xs text-[#afafaf]">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(analysis.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {analysis.summary && (
                            <p className="text-[#afafaf] mb-4">{analysis.summary}</p>
                          )}

                          {analysis.insights && analysis.insights.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold mb-2 text-white">Key Insights:</h4>
                              <ul className="space-y-1">
                                {analysis.insights.slice(0, 3).map((insight, index) => (
                                  <li key={index} className="text-sm text-[#afafaf] flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>{typeof insight === 'string' ? insight : insight.text || insight.description}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {analysis.recommendations && analysis.recommendations.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2 text-white">Recommendations:</h4>
                              <ul className="space-y-1">
                                {analysis.recommendations.slice(0, 2).map((rec, index) => (
                                  <li key={index} className="text-sm text-green-400 flex items-start">
                                    <span className="mr-2 mt-1">→</span>
                                    <span>{typeof rec === 'string' ? rec : rec.text || rec.description}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#2b2b2b] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                />
              </div>

              {/* Status Filter - Custom Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Dropdown button clicked, current state:', isDropdownOpen)
                    setIsDropdownOpen(!isDropdownOpen)
                  }}
                >
                  Status: {statusFilter}
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[#2b2b2b] border border-[#3f3f3f] rounded-md shadow-lg z-50">
                    {getStatusOptions().map((status) => (
                      <button
                        key={status}
                        className="w-full text-left px-4 py-2 text-white hover:bg-[#3f3f3f] focus:bg-[#3f3f3f] focus:outline-none first:rounded-t-md last:rounded-b-md"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Status selected:', status)
                          setStatusFilter(status)
                          setIsDropdownOpen(false)
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Campaigns Table */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none min-w-[200px]"
                        onClick={() => handleSort('campaign_name')}
                      >
                        Campaign Name {getSortIcon('campaign_name')}
                      </TableHead>
                      <TableHead className="text-[#afafaf] min-w-[80px]">Status</TableHead>
                      <TableHead className="text-[#afafaf] min-w-[80px]">Daily Budget</TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none min-w-[80px]"
                        onClick={() => handleSort('spend')}
                      >
                        Spent {getSortIcon('spend')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none min-w-[80px]"
                        onClick={() => handleSort('revenue')}
                      >
                        Revenue {getSortIcon('revenue')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none min-w-[100px]"
                        onClick={() => handleSort('conversions')}
                      >
                        Conversions {getSortIcon('conversions')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none min-w-[80px]"
                        onClick={() => handleSort('roas')}
                      >
                        ROAS {getSortIcon('roas')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none min-w-[80px]"
                        onClick={() => handleSort('ctr')}
                      >
                        CTR {getSortIcon('ctr')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none min-w-[80px]"
                        onClick={() => handleSort('cpc')}
                      >
                        CPC {getSortIcon('cpc')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none min-w-[80px]"
                        onClick={() => handleSort('cpm')}
                      >
                        CPM {getSortIcon('cpm')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none min-w-[80px]"
                        onClick={() => handleSort('cpp')}
                      >
                        CPP {getSortIcon('cpp')}
                      </TableHead>
                      <TableHead className="text-[#afafaf] min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#a545b6]" />
                          <p className="text-[#afafaf]">Loading campaigns...</p>
                        </TableCell>
                      </TableRow>
                    ) : displayedCampaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8">
                          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-[#afafaf]" />
                          <p className="text-white font-semibold mb-2">No campaigns found</p>
                          <p className="text-[#afafaf] mb-4">
                            Sync your Facebook Ads data to see campaigns here
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedCampaigns.map((campaign) => (
                        <TableRow key={campaign.id} className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                          <TableCell className="font-medium text-white">{campaign.campaign_name}</TableCell>
                          <TableCell>{getStatusBadge(campaign)}</TableCell>
                          <TableCell className="text-white">{campaign.daily_budget ? formatCurrency(campaign.daily_budget) : '-'}</TableCell>
                          <TableCell className="text-white">{formatCurrency(campaign.spend)}</TableCell>
                          <TableCell className="text-white">{formatCurrency(campaign.revenue)}</TableCell>
                          <TableCell className="text-white">{formatNumber(campaign.conversions)}</TableCell>
                          <TableCell className="text-white">{formatNumber(campaign.roas, 2)}x</TableCell>
                          <TableCell className="text-white">{formatPercentage(campaign.ctr)}</TableCell>
                          <TableCell className="text-white">{formatCurrencyMetric(campaign.cpc)}</TableCell>
                          <TableCell className="text-white">{formatCurrencyMetric(campaign.cpm)}</TableCell>
                          <TableCell className="text-white">{formatCurrencyMetric(campaign.cpp)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 text-[#afafaf] hover:text-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                                  <DropdownMenuItem className="text-white hover:bg-[#3f3f3f]">
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-white hover:bg-[#3f3f3f]">
                                    View in Facebook
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-white hover:bg-[#3f3f3f] cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault()
                                      if (navigating) return
                                      setNavigating(true)
                                      router.push(`/campaigns/create-adset?campaign_id=${encodeURIComponent(campaign.id)}`)
                                    }}
                                  >
                                    Create Ad Set
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-white hover:bg-[#3f3f3f] cursor-pointer disabled:opacity-50"
                                    disabled={analyzingSingleCampaign === campaign.campaign_name}
                                    onSelect={(e) => {
                                      e.preventDefault()
                                      if (analyzingSingleCampaign !== campaign.campaign_name) {
                                        analyzeSingleCampaign(campaign.campaign_name, campaign.campaign_id)
                                      }
                                    }}
                                  >
                                    {analyzingSingleCampaign === campaign.campaign_name ? (
                                      <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                      </>
                                    ) : (
                                      <>
                                        <BarChart4 className="mr-2 h-4 w-4" />
                                        Analyze Campaign
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            {!loading && (searchTerm || statusFilter !== 'All') && (
              <div className="text-center text-[#afafaf] text-sm">
                Showing {displayedCampaigns.length} of {filteredCampaigns.length} campaigns
                {searchTerm && (
                  <span> matching "<span className="text-white">{searchTerm}</span>"</span>
                )}
                {statusFilter !== 'All' && (
                  <span> with status "<span className="text-white">{statusFilter}</span>"</span>
                )}
              </div>
            )}

            {/* Load More Button */}
            {!loading && displayedCampaigns.length > 0 && hasMoreCampaigns && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={loadMoreCampaigns}
                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent px-8 py-2"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Load More Campaigns ({filteredCampaigns.length - displayedCampaigns.length} remaining)
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Campaign Analysis Modal */}
      <CampaignAnalysisModal
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        analysisResult={currentAnalysisResult}
        campaignName={currentAnalysisCampaign}
      />
    </div>
  )
}
