"use client"
import { useState, useEffect } from "react"
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
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
}

interface CampaignStats {
  totalCampaigns: number
  activeCampaigns: number
  totalSpend: number
  avgRoas: number
}

export default function CampaignsPage() {
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
  const CAMPAIGNS_PER_PAGE = 10

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
        return campaignStatus === statusFilter
      })
    }

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
          case 'revenue':
            result = parseFloat(a.revenue as string) - parseFloat(b.revenue as string)
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
      const campaignsList = campaignsData.map((campaign: any) => ({
        id: campaign.campaign || `campaign-${Math.random()}`,
        campaign_name: campaign.campaign,
        spend: campaign.spend || 0,
        revenue: campaign.revenue || 0,
        conversions: campaign.conversions || 0,
        roas: campaign.roas || 0,
        date: new Date().toISOString().split('T')[0],
        objective: 'OUTCOME_SALES',
        daily_budget: null
      }))

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

  const getCampaignStatus = (campaign: Campaign) => {
    const spent = parseFloat(campaign.spend as string) || 0
    return spent > 0 ? 'Active' : 'No Spend'
  }

  const getStatusBadge = (campaign: Campaign) => {
    const status = getCampaignStatus(campaign)
    if (status === 'Active') {
      return <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
    } else {
      return <Badge className="bg-gray-600 hover:bg-gray-700">No Spend</Badge>
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
    campaigns.forEach(campaign => {
      const status = getCampaignStatus(campaign)
      statuses.add(status)
    })
    return Array.from(statuses)
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

  const exportToCSV = () => {
    // Use filtered campaigns for export to include search/filter results
    const dataToExport = filteredCampaigns.length > 0 ? filteredCampaigns : campaigns

    // Create CSV headers
    const headers = [
      'Campaign Name',
      'Status',
      'Budget',
      'Spent',
      'Revenue',
      'Conversions',
      'ROAS',
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
      {/* Sidebar */}
      

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

              {/* Status Filter */}
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                    Status: {statusFilter}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                  {getStatusOptions().map((status) => (
                    <DropdownMenuItem
                      key={status}
                      className="text-white hover:bg-[#3f3f3f] cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        setStatusFilter(status)
                        setIsDropdownOpen(false)
                      }}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

            </div>

            {/* Campaigns Table */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#3f3f3f] hover:bg-[#3f3f3f]">
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none"
                        onClick={() => handleSort('campaign_name')}
                      >
                        Campaign Name {getSortIcon('campaign_name')}
                      </TableHead>
                      <TableHead className="text-[#afafaf]">Status</TableHead>
                      <TableHead className="text-[#afafaf]">Budget</TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none"
                        onClick={() => handleSort('spend')}
                      >
                        Spent {getSortIcon('spend')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none"
                        onClick={() => handleSort('revenue')}
                      >
                        Revenue {getSortIcon('revenue')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none"
                        onClick={() => handleSort('conversions')}
                      >
                        Conversions {getSortIcon('conversions')}
                      </TableHead>
                      <TableHead
                        className="text-[#afafaf] cursor-pointer hover:text-white select-none"
                        onClick={() => handleSort('roas')}
                      >
                        ROAS {getSortIcon('roas')}
                      </TableHead>
                      <TableHead className="text-[#afafaf]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#a545b6]" />
                          <p className="text-[#afafaf]">Loading campaigns...</p>
                        </TableCell>
                      </TableRow>
                    ) : displayedCampaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
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
                                      router.push(`/campaigns/create-adset?campaign_id=${campaign.id}`)
                                    }}
                                  >
                                    Create Ad Set
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
    </div>
  )
}
