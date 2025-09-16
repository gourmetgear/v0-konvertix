"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Settings,
  HeadphonesIcon,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUserId } from "@/lib/auth"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function CreateCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [campaignData, setCampaignData] = useState({
    name: "",
    objective: "", // Facebook campaign objective
    status: "PAUSED", // Facebook default (ACTIVE, PAUSED)
    special_ad_categories: [], // Facebook specific
  })

  const [showAdSetForm, setShowAdSetForm] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [createdCampaignName, setCreatedCampaignName] = useState<string | null>(null)
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null)
  const [createdAdSetId, setCreatedAdSetId] = useState<string | null>(null)
  const [adSetData, setAdSetData] = useState({
    name: "",
    daily_budget: "",
    billing_event: "IMPRESSIONS",
    optimization_goal: "OFFSITE_CONVERSIONS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    destination_type: "WEBSITE",
    custom_event_type: "PURCHASE",
    countries: ["DE"],
    publisher_platforms: ["facebook", "instagram"],
    facebook_positions: ["feed"],
    instagram_positions: ["stream"],
    click_window_days: 7,
    view_window_days: 1,
    dsa_beneficiary: "CamperBanner",
    dsa_payor: "CamperBanner",
    status: "PAUSED",
  })

  const [imageUploadData, setImageUploadData] = useState({
    selectedFile: null as File | null,
    uploading: false,
    preview: null as string | null
  })

  // Check authentication on component mount
  useEffect(() => {
    const supabase = createClientComponentClient()

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        console.log('Session check result:', { session: !!session, user: !!session?.user, error })

        if (error) {
          console.error('Session error:', error)
          router.push('/auth/login?redirectTo=/campaigns/create')
          return
        }

        if (session?.user) {
          console.log('User authenticated:', session.user.email)
          setUser(session.user)
          setAuthLoading(false)
        } else {
          console.log('No session found, setting mock user for testing')
          // Temporarily disable auth check for testing - use the real user ID from capiconfig
          setUser({ id: '5ac29770-66f4-4b01-a6d2-08122fe480cd', email: 'test@example.com' } as any)
          setAuthLoading(false)
          // router.push('/auth/login?redirectTo=/campaigns/create')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/auth/login?redirectTo=/campaigns/create')
      }
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { event, session: !!session, user: !!session?.user })

        if (session?.user) {
          console.log('Auth state change - user authenticated:', session.user.email)
          setUser(session.user)
          setAuthLoading(false)
        } else if (event === 'SIGNED_OUT') {
          console.log('Auth state change - signed out, redirecting')
          router.push('/auth/login?redirectTo=/campaigns/create')
        }
      }
    )

    getInitialSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Reports", icon: TrendingUp, href: "/reports" },
    { name: "Documents", icon: Users, href: "/documents" },
    { name: "Campaigns", icon: Target, href: "/campaigns", active: true },
    { name: "Support", icon: HeadphonesIcon, href: "/support" },
    { name: "Services", icon: Users, href: "/services" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Use the user ID from state (already authenticated)
      if (!user?.id) {
        throw new Error('You must be logged in to create campaigns')
      }

      // Debug the campaign data state before creating payload
      console.log('=== CAMPAIGN CREATION DEBUG ===')
      console.log('Current campaignData state:', campaignData)
      console.log('Campaign name from state:', campaignData.name)
      console.log('Campaign name length:', campaignData.name?.length)
      console.log('Campaign name type:', typeof campaignData.name)

      const payload = {
        userId: user.id,
        name: campaignData.name,
        objective: campaignData.objective,
        status: campaignData.status,
        special_ad_categories: campaignData.special_ad_categories,
      }

      console.log('Submitting campaign data:', payload)
      console.log('Payload name field:', payload.name)

      const response = await fetch('/api/create-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create campaign')
      }

      // Success - show ad set form
      // Store both campaign name and Facebook campaign ID for ad set creation
      console.log('=== CAMPAIGN SUCCESS DEBUG ===')
      console.log('API response result:', result)
      console.log('result.campaignName:', result.campaignName)
      console.log('result.facebook_data:', result.facebook_data)
      console.log('campaignData.name:', campaignData.name)

      const campaignNameToUse = result.campaignName || campaignData.name
      const facebookCampaignId = result.facebook_data?.campaign_id || result.facebook_data?.id

      console.log('Campaign name to use for ad set lookup:', campaignNameToUse)
      console.log('Facebook campaign ID:', facebookCampaignId)
      console.log('Setting createdCampaignName to:', campaignNameToUse)
      console.log('Setting createdCampaignId to:', facebookCampaignId)

      setCreatedCampaignName(campaignNameToUse)
      setCreatedCampaignId(facebookCampaignId)
      setShowAdSetForm(true)

      // Set default ad set name based on campaign name
      setAdSetData(prev => ({
        ...prev,
        name: `${campaignData.name} - Ad Set 1`
      }))

    } catch (error) {
      console.error('Campaign creation error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAdSetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!user?.id) {
        throw new Error('You must be logged in to create ad sets')
      }

      if (!createdCampaignName) {
        throw new Error('Campaign name is required to create ad set')
      }

      console.log('=== AD SET CREATION DEBUG ===')
      console.log('createdCampaignName state:', createdCampaignName)
      console.log('createdCampaignId state:', createdCampaignId)
      console.log('createdCampaignName type:', typeof createdCampaignName)
      console.log('createdCampaignId type:', typeof createdCampaignId)
      console.log('Creating ad set with campaign name:', createdCampaignName)
      console.log('Creating ad set with Facebook campaign ID:', createdCampaignId)

      const payload = {
        userId: user.id,
        name: adSetData.name,
        campaign_id: createdCampaignName,
        daily_budget: parseFloat(adSetData.daily_budget),
        billing_event: adSetData.billing_event,
        optimization_goal: adSetData.optimization_goal,
        bid_strategy: adSetData.bid_strategy,
        destination_type: adSetData.destination_type,
        custom_event_type: adSetData.custom_event_type,
        countries: adSetData.countries,
        status: adSetData.status,
      }

      console.log('Submitting ad set data:', payload)

      const response = await fetch('/api/create-adset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create ad set')
      }

      console.log('Ad set created successfully:', result)

      // Success - show image upload form
      setCreatedAdSetId(result.facebook_data?.id || result.adset_id || 'new-adset')
      setShowImageUpload(true)

    } catch (error) {
      console.error('Ad set creation error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSkipAdSet = () => {
    router.push('/campaigns?success=created')
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUploadData(prev => ({
          ...prev,
          selectedFile: file,
          preview: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result as string
        // Remove the data:image/...;base64, prefix
        resolve(base64.split(',')[1])
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageUploadData.selectedFile) {
      setError('Please select an image to upload')
      return
    }

    setImageUploadData(prev => ({ ...prev, uploading: true }))
    setLoading(true)
    setError('')

    try {
      // Get user's capiconfig
      if (!user?.id) {
        throw new Error('You must be logged in to upload images')
      }

      // Convert image to base64
      const base64Image = await convertToBase64(imageUploadData.selectedFile)

      // Get capiconfig from API or mock it for now
      const capiConfigResponse = await fetch(`/api/debug-capiconfig?userId=${user.id}`)
      const capiConfigResult = await capiConfigResponse.json()

      if (!capiConfigResponse.ok) {
        throw new Error(capiConfigResult.error || 'Failed to get CAPI configuration')
      }

      const capiConfig = capiConfigResult.data

      // Prepare webhook payload
      const webhookPayload = {
        image: base64Image,
        ad_account_id: capiConfig.ad_account_id,
        token: capiConfig.token,
        filename: imageUploadData.selectedFile.name,
        mimetype: imageUploadData.selectedFile.type,
        adset_id: createdAdSetId,
        campaign_id: createdCampaignId
      }

      console.log('Uploading image to webhook...', {
        filename: imageUploadData.selectedFile.name,
        size: imageUploadData.selectedFile.size,
        type: imageUploadData.selectedFile.type
      })

      // Call n8n webhook
      const webhookResponse = await fetch('https://n8n.konvertix.de/webhook/upload-image/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      })

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text()
        throw new Error(`Image upload failed: ${errorText}`)
      }

      const webhookResult = await webhookResponse.json()
      console.log('Image uploaded successfully:', webhookResult)

      // Success - redirect to campaigns page
      router.push('/campaigns?success=campaign-adset-image-created')

    } catch (error) {
      console.error('Image upload error:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setImageUploadData(prev => ({ ...prev, uploading: false }))
      setLoading(false)
    }
  }

  const handleSkipImageUpload = () => {
    router.push('/campaigns?success=campaign-and-adset-created')
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b021c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a545b6] mx-auto"></div>
          <p className="mt-4 text-[#afafaf]">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render the form if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">

      <div className="flex-1 flex flex-col">
        {/* Create Campaign Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center space-x-4">
              <Link href="/campaigns">
                <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  {!showAdSetForm && !showImageUpload
                    ? "Create New Campaign"
                    : !showImageUpload
                    ? "Create Ad Set"
                    : "Upload Ad Image"
                  }
                </h1>
                <p className="text-[#afafaf] mt-1">
                  {!showAdSetForm && !showImageUpload
                    ? "Set up your marketing campaign with detailed targeting and budget settings"
                    : !showImageUpload
                    ? "Complete your campaign setup by adding an ad set with targeting and budget"
                    : "Upload an image for your ad creative from your private assets"
                  }
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="bg-red-900/20 border-red-500/50">
                <CardContent className="pt-6">
                  <div className="text-red-400">{error}</div>
                </CardContent>
              </Card>
            )}

            {!showAdSetForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Essential Campaign Information */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-[#a545b6]" />
                      <span>Create Facebook Campaign</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Campaign Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter campaign name"
                        value={campaignData.name}
                        onChange={(e) => {
                          console.log('Campaign name input changed:', e.target.value)
                          setCampaignData({ ...campaignData, name: e.target.value })
                        }}
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="objective">Campaign Objective *</Label>
                      <Select
                        value={campaignData.objective}
                        onValueChange={(value) => setCampaignData({ ...campaignData, objective: value })}
                        required
                      >
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select Facebook objective" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                          <SelectItem value="OUTCOME_AWARENESS" className="text-white hover:bg-[#3f3f3f]">Awareness</SelectItem>
                          <SelectItem value="OUTCOME_TRAFFIC" className="text-white hover:bg-[#3f3f3f]">Traffic</SelectItem>
                          <SelectItem value="OUTCOME_ENGAGEMENT" className="text-white hover:bg-[#3f3f3f]">Engagement</SelectItem>
                          <SelectItem value="OUTCOME_LEADS" className="text-white hover:bg-[#3f3f3f]">Leads</SelectItem>
                          <SelectItem value="OUTCOME_SALES" className="text-white hover:bg-[#3f3f3f]">Sales</SelectItem>
                          <SelectItem value="OUTCOME_APP_PROMOTION" className="text-white hover:bg-[#3f3f3f]">App Promotion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Campaign Status</Label>
                      <Select
                        value={campaignData.status}
                        onValueChange={(value) => setCampaignData({ ...campaignData, status: value })}
                      >
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                          <SelectItem value="PAUSED" className="text-white hover:bg-[#3f3f3f]">
                            Paused (Create as Draft)
                          </SelectItem>
                          <SelectItem value="ACTIVE" className="text-white hover:bg-[#3f3f3f]">
                            Active (Start Immediately)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="special_ad_categories">Special Ad Categories (Optional)</Label>
                      <Select
                        value={campaignData.special_ad_categories.length > 0 ? campaignData.special_ad_categories[0] : "NONE"}
                        onValueChange={(value) => setCampaignData({
                          ...campaignData,
                          special_ad_categories: value === "NONE" ? [] : [value]
                        })}
                      >
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select if applicable" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                          <SelectItem value="NONE" className="text-white hover:bg-[#3f3f3f]">None</SelectItem>
                          <SelectItem value="CREDIT" className="text-white hover:bg-[#3f3f3f]">Credit</SelectItem>
                          <SelectItem value="EMPLOYMENT" className="text-white hover:bg-[#3f3f3f]">Employment</SelectItem>
                          <SelectItem value="HOUSING" className="text-white hover:bg-[#3f3f3f]">Housing</SelectItem>
                          <SelectItem value="SOCIAL_ISSUES" className="text-white hover:bg-[#3f3f3f]">Social Issues</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#afafaf]">Select if your campaign relates to credit, employment, housing, or social issues</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6">
                  <Link href="/campaigns">
                    <Button
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                      onClick={() => setCampaignData({ ...campaignData, status: "PAUSED" })}
                      disabled={loading}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                      disabled={loading || !campaignData.name || !campaignData.objective}
                    >
                      {loading ? "Creating..." : "Create Facebook Campaign"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Success Message */}
                <Card className="bg-green-900/20 border-green-500/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 text-green-400">
                      <Target className="h-5 w-5" />
                      <span>Campaign "{campaignData.name}" created successfully!</span>
                    </div>
                    <p className="text-[#afafaf] mt-2">Now create an ad set for your campaign:</p>
                  </CardContent>
                </Card>

                {/* Ad Set Form */}
                <form onSubmit={handleAdSetSubmit} className="space-y-6">
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-[#a545b6]" />
                        <span>Create Ad Set</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="adset-name">Ad Set Name *</Label>
                        <Input
                          id="adset-name"
                          placeholder="Enter ad set name"
                          value={adSetData.name}
                          onChange={(e) => setAdSetData({ ...adSetData, name: e.target.value })}
                          className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="daily_budget">Daily Budget (USD) *</Label>
                        <Input
                          id="daily_budget"
                          type="number"
                          min="1"
                          step="0.01"
                          value={adSetData.daily_budget}
                          onChange={(e) => setAdSetData({ ...adSetData, daily_budget: e.target.value })}
                          placeholder="10.00"
                          className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="optimization_goal">Optimization Goal</Label>
                        <Select
                          value={adSetData.optimization_goal}
                          onValueChange={(value) => setAdSetData({ ...adSetData, optimization_goal: value })}
                        >
                          <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                            <SelectItem value="OFFSITE_CONVERSIONS" className="text-white hover:bg-[#3f3f3f]">Offsite Conversions</SelectItem>
                            <SelectItem value="LINK_CLICKS" className="text-white hover:bg-[#3f3f3f]">Link Clicks</SelectItem>
                            <SelectItem value="IMPRESSIONS" className="text-white hover:bg-[#3f3f3f]">Impressions</SelectItem>
                            <SelectItem value="REACH" className="text-white hover:bg-[#3f3f3f]">Reach</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="custom_event_type">Custom Event Type</Label>
                        <Select
                          value={adSetData.custom_event_type}
                          onValueChange={(value) => setAdSetData({ ...adSetData, custom_event_type: value })}
                        >
                          <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                            <SelectItem value="PURCHASE" className="text-white hover:bg-[#3f3f3f]">Purchase</SelectItem>
                            <SelectItem value="ADD_TO_CART" className="text-white hover:bg-[#3f3f3f]">Add to Cart</SelectItem>
                            <SelectItem value="LEAD" className="text-white hover:bg-[#3f3f3f]">Lead</SelectItem>
                            <SelectItem value="COMPLETE_REGISTRATION" className="text-white hover:bg-[#3f3f3f]">Complete Registration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="destination_type">Destination Type</Label>
                        <Select
                          value={adSetData.destination_type}
                          onValueChange={(value) => setAdSetData({ ...adSetData, destination_type: value })}
                        >
                          <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                            <SelectItem value="WEBSITE" className="text-white hover:bg-[#3f3f3f]">Website</SelectItem>
                            <SelectItem value="APP" className="text-white hover:bg-[#3f3f3f]">App</SelectItem>
                            <SelectItem value="MESSENGER" className="text-white hover:bg-[#3f3f3f]">Messenger</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="countries">Target Countries</Label>
                        <Select
                          value={adSetData.countries[0] || "DE"}
                          onValueChange={(value) => setAdSetData({ ...adSetData, countries: [value] })}
                        >
                          <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                            <SelectItem value="DE" className="text-white hover:bg-[#3f3f3f]">Germany</SelectItem>
                            <SelectItem value="US" className="text-white hover:bg-[#3f3f3f]">United States</SelectItem>
                            <SelectItem value="GB" className="text-white hover:bg-[#3f3f3f]">United Kingdom</SelectItem>
                            <SelectItem value="FR" className="text-white hover:bg-[#3f3f3f]">France</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dsa_beneficiary">DSA Beneficiary</Label>
                        <Input
                          id="dsa_beneficiary"
                          value={adSetData.dsa_beneficiary}
                          onChange={(e) => setAdSetData({ ...adSetData, dsa_beneficiary: e.target.value })}
                          placeholder="Enter DSA beneficiary"
                          className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dsa_payor">DSA Payor</Label>
                        <Input
                          id="dsa_payor"
                          value={adSetData.dsa_payor}
                          onChange={(e) => setAdSetData({ ...adSetData, dsa_payor: e.target.value })}
                          placeholder="Enter DSA payor"
                          className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adset-status">Ad Set Status</Label>
                        <Select
                          value={adSetData.status}
                          onValueChange={(value) => setAdSetData({ ...adSetData, status: value })}
                        >
                          <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                            <SelectItem value="PAUSED" className="text-white hover:bg-[#3f3f3f]">
                              Paused (Create as Draft)
                            </SelectItem>
                            <SelectItem value="ACTIVE" className="text-white hover:bg-[#3f3f3f]">
                              Active (Start Immediately)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ad Set Action Buttons */}
                  <div className="flex items-center justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                      onClick={handleSkipAdSet}
                      disabled={loading}
                    >
                      Skip Ad Set Creation
                    </Button>
                    <div className="flex items-center space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                        onClick={() => setAdSetData({ ...adSetData, status: "PAUSED" })}
                        disabled={loading}
                      >
                        Save as Draft
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                        disabled={loading || !adSetData.name || !adSetData.daily_budget}
                      >
                        {loading ? "Creating Ad Set..." : "Create Ad Set"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {showImageUpload && (
              <div className="space-y-6">
                {/* Success Message */}
                <Card className="bg-green-900/20 border-green-500/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 text-green-400">
                      <Target className="h-5 w-5" />
                      <span>Campaign & Ad Set created successfully!</span>
                    </div>
                    <p className="text-[#afafaf] mt-2">Now upload an image for your ad creative:</p>
                  </CardContent>
                </Card>

                {/* Image Upload Form */}
                <form onSubmit={handleImageUpload} className="space-y-6">
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ImageIcon className="h-5 w-5 text-[#a545b6]" />
                        <span>Upload Ad Image</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Image Upload Area */}
                      <div className="space-y-4">
                        <Label htmlFor="image-upload">Select Image</Label>
                        <div className="border-2 border-dashed border-[#3f3f3f] rounded-lg p-8 text-center hover:border-[#a545b6] transition-colors">
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center space-y-4"
                          >
                            {imageUploadData.preview ? (
                              <div className="space-y-4">
                                <img
                                  src={imageUploadData.preview}
                                  alt="Preview"
                                  className="max-w-xs max-h-64 rounded-lg border border-[#3f3f3f]"
                                />
                                <div className="text-sm text-[#afafaf]">
                                  {imageUploadData.selectedFile?.name} ({Math.round((imageUploadData.selectedFile?.size || 0) / 1024)}KB)
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                                  onClick={() => setImageUploadData(prev => ({ ...prev, selectedFile: null, preview: null }))}
                                >
                                  Remove Image
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <Upload className="h-12 w-12 text-[#afafaf]" />
                                <div className="space-y-2">
                                  <p className="text-white font-medium">Click to upload an image</p>
                                  <p className="text-sm text-[#afafaf]">
                                    PNG, JPG, GIF up to 10MB
                                  </p>
                                  <p className="text-xs text-[#afafaf]">
                                    Image will be uploaded to your private assets and sent to Facebook
                                  </p>
                                </div>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Image Requirements */}
                      <Card className="bg-[#1a1a1a] border-[#3f3f3f]">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium text-white mb-2">Image Requirements:</h4>
                          <ul className="text-xs text-[#afafaf] space-y-1">
                            <li>• Recommended aspect ratio: 1:1 (square) or 16:9 (landscape)</li>
                            <li>• Minimum resolution: 1080x1080 pixels</li>
                            <li>• Supported formats: JPG, PNG, GIF</li>
                            <li>• Maximum file size: 10MB</li>
                            <li>• Text should cover less than 20% of the image</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>

                  {/* Image Upload Action Buttons */}
                  <div className="flex items-center justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                      onClick={handleSkipImageUpload}
                      disabled={loading || imageUploadData.uploading}
                    >
                      Skip Image Upload
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                      disabled={loading || imageUploadData.uploading || !imageUploadData.selectedFile}
                    >
                      {loading || imageUploadData.uploading ? "Uploading..." : "Upload Image & Complete"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

