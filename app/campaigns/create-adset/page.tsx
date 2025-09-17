"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/ImageUpload"
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Settings,
  HeadphonesIcon,
  ArrowLeft,
  Image,
  MessageSquare,
  Link as LinkIcon,
  MousePointer,
  CheckCircle,
  Upload,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function CreateAdSetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaign_id')

  // Debug what campaign ID we received
  console.log('Received campaign_id from URL:', campaignId)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [workflowStage, setWorkflowStage] = useState<'adset' | 'creative' | 'image' | 'completed'>('adset')
  const [adSetResult, setAdSetResult] = useState<any>(null)
  const [creativeLoading, setCreativeLoading] = useState(false)
  const [creativeError, setCreativeError] = useState("")

  const [adSetData, setAdSetData] = useState({
    name: "",
    campaign_id: campaignId || "", // This will be the campaign name initially
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

  // Image upload state
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState("")

  const [campaignName, setCampaignName] = useState(campaignId || "") // Store the campaign name separately

  // Creative form state
  const [creativeData, setCreativeData] = useState({
    name: "",
    message: "Jetzt dein Camper-Deal sichern!",
    website_url: "",
    call_to_action_type: "SHOP_NOW",
    image_url: "",
    image_name: ""
  })
  const [capiConfig, setCapiConfig] = useState<any>(null)

  const callToActionTypes = [
    { value: 'SHOP_NOW', label: 'Shop Now' },
    { value: 'LEARN_MORE', label: 'Learn More' },
    { value: 'SIGN_UP', label: 'Sign Up' },
    { value: 'DOWNLOAD', label: 'Download' },
    { value: 'BOOK_TRAVEL', label: 'Book Travel' },
    { value: 'CONTACT_US', label: 'Contact Us' },
    { value: 'APPLY_NOW', label: 'Apply Now' },
    { value: 'SUBSCRIBE', label: 'Subscribe' },
    { value: 'WATCH_MORE', label: 'Watch More' },
    { value: 'GET_QUOTE', label: 'Get Quote' }
  ]

  const loadCapiConfigForCreative = async () => {
    if (!user?.id) {
      console.log('No user ID available for loading CAPI config')
      return
    }

    try {
      console.log('Loading CAPI config for user:', user.id)
      const supabase = createClientComponentClient()

      // First, let's see what's in the table
      console.log('Querying capiconfig table...')
      const { data: allConfigs, error: allError } = await supabase
        .from('capiconfig')
        .select('*')

      console.log('All configs in table:', allConfigs, 'Error:', allError)

      // Now try the specific query - get first match instead of single
      const { data: configs, error: configError } = await supabase
        .from('capiconfig')
        .select('token, pixel_id, url, ad_account_id, account_id')
        .eq('user_id', user.id)
        .eq('provider', 'facebook')
        .limit(1)

      const config = configs && configs.length > 0 ? configs[0] : null

      console.log('CAPI config query result:', { config, configError })
      console.log('Query details - user_id:', user.id, 'provider: facebook')

      if (configError) {
        console.error('CAPI config error details:', {
          message: configError.message,
          details: configError.details,
          hint: configError.hint,
          code: configError.code
        })
        setCreativeError(`Facebook CAPI configuration error: ${configError.message}`)
        return
      }

      if (config) {
        console.log('Setting CAPI config:', config)
        setCapiConfig(config)

        // Pre-fill website URL from config
        setCreativeData(prev => ({
          ...prev,
          website_url: config.url || ''
        }))

        // Clear any previous errors
        setCreativeError('')
      } else {
        console.log('No CAPI config found, using fallback for testing')

        // Temporary fallback for testing based on your CSV data
        const fallbackConfig = {
          token: 'EAAdXkzP5Ir8BPbJ8xJvxzltLNl9ltDpTVZBwOCPVDX8Rzd60ZAocnm13qFdmB3FN9BEwqX2OJlj26qqkqhlQxCsb1pOTJipkcItQQ7iyhQEyecUHkFWdq5LGKPXLtdheq7PYVo8uk2bBCQTTAYboPSNVsgd0jEmrpYYo0Qi8Eku8HZAQYweRSODV66eCQNbblSi6heunhfjUPDZAqHsKCnrntsK02FbXxWcbf3vKetGgdCvql1us',
          pixel_id: '227827390035216',
          url: 'https://camperbanner.de',
          ad_account_id: '1174014140125533',
          account_id: '55555'
        }

        console.log('Using fallback config:', fallbackConfig)
        setCapiConfig(fallbackConfig)

        // Pre-fill website URL from fallback config
        setCreativeData(prev => ({
          ...prev,
          website_url: fallbackConfig.url
        }))

        // Clear any previous errors
        setCreativeError('')
      }
    } catch (error) {
      console.error('Error loading CAPI config for creative:', error)
      setCreativeError('Failed to load Facebook configuration. Please try again.')
    }
  }

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
          router.push(`/auth/login?redirectTo=/campaigns/create-adset${campaignId ? `?campaign_id=${encodeURIComponent(campaignId)}` : ''}`)
          return
        }

        if (session?.user) {
          console.log('User authenticated:', session.user.email)
          setUser(session.user)
          setAuthLoading(false)
        } else {
          console.log('No session found, setting mock user for testing')
          // Temporarily disable auth check for testing - use the real user ID from capiconfig
          const mockUser = { id: '5ac29770-66f4-4b01-a6d2-08122fe480cd', email: 'test@example.com' } as any
          setUser(mockUser)
          setAuthLoading(false)
          // router.push('/auth/login?redirectTo=/campaigns/create-adset')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push(`/auth/login?redirectTo=/campaigns/create-adset${campaignId ? `?campaign_id=${campaignId}` : ''}`)
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
          router.push(`/auth/login?redirectTo=/campaigns/create-adset${campaignId ? `?campaign_id=${encodeURIComponent(campaignId)}` : ''}`)
        }
      }
    )

    getInitialSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Load CAPI config whenever user changes
  useEffect(() => {
    if (user?.id) {
      console.log('User changed, loading CAPI config for:', user.id)
      loadCapiConfigForCreative()
    }
  }, [user])

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
        throw new Error('You must be logged in to create ad sets')
      }

      const payload = {
        userId: user.id,
        name: adSetData.name,
        campaign_id: adSetData.campaign_id,
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

      // Store ad set result and move to creative stage
      setAdSetResult(result)

      // Load CAPI config for creative form
      await loadCapiConfigForCreative()

      // Pre-fill creative name with ad set name + " Creative"
      setCreativeData(prev => ({
        ...prev,
        name: `${adSetData.name} Creative`
      }))

      // Move to creative creation stage
      setWorkflowStage('creative')
    } catch (error) {
      console.error('Ad set creation error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCreativeInputChange = (field: string, value: string) => {
    setCreativeData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreativeImageSelected = (imageUrl: string, imageName: string) => {
    console.log('Creative image selected:', { imageUrl, imageName })
    console.log('Previous creative data:', creativeData)
    setCreativeData(prev => {
      const newData = {
        ...prev,
        image_url: imageUrl,
        image_name: imageName
      }
      console.log('New creative data:', newData)
      return newData
    })
  }

  const handleCreativeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreativeLoading(true)
    setCreativeError("")

    try {
      if (!user?.id) {
        throw new Error('You must be logged in to create creatives')
      }

      // Validate required fields
      if (!creativeData.name.trim()) throw new Error('Creative name is required')
      if (!creativeData.message.trim()) throw new Error('Message is required')
      if (!creativeData.website_url.trim()) throw new Error('Website URL is required')
      if (!creativeData.image_name) throw new Error('Please select an image')
      if (!capiConfig) throw new Error('Facebook configuration not found')

      // Step 1: Upload image to Facebook to get hash
      console.log('Step 1: Uploading image to Facebook to get hash...')

      const imageResponse = await fetch(creativeData.image_url)
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image from URL')
      }

      const imageBuffer = await imageResponse.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString('base64')

      // Get the image file extension for MIME type
      const fileExtension = creativeData.image_name.split('.').pop()?.toLowerCase()
      const mimeType = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp'
      }[fileExtension || 'jpg'] || 'image/jpeg'

      // Upload image to Facebook to get hash
      const imageUploadPayload = {
        image_base64: base64Image,
        image_name: creativeData.image_name,
        mime_type: mimeType,
        ad_account_id: capiConfig.ad_account_id,
        access_token: capiConfig.token
      }

      console.log('Uploading image to Facebook:', {
        image_name: creativeData.image_name,
        mime_type: mimeType,
        ad_account_id: capiConfig.ad_account_id,
        base64_length: base64Image.length
      })

      const imageUploadResponse = await fetch('https://n8n.konvertix.de/webhook/upload-image/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageUploadPayload),
      })

      if (!imageUploadResponse.ok) {
        const errorText = await imageUploadResponse.text()
        console.error('Image upload failed:', errorText)
        throw new Error('Failed to upload image to Facebook')
      }

      const imageUploadResult = await imageUploadResponse.json()
      console.log('Image uploaded to Facebook successfully:', imageUploadResult)

      // Extract image hash from upload result
      const imageHash = imageUploadResult.hash || imageUploadResult.image_hash
      if (!imageHash) {
        console.error('No image hash in upload result:', imageUploadResult)
        throw new Error('Failed to get image hash from Facebook upload')
      }

      // Step 2: Create creative with the exact n8n webhook structure
      console.log('Step 2: Creating creative with image hash:', imageHash)

      const creativePayload = {
        name: creativeData.name,
        access_token: capiConfig.token,
        object_story_spec: {
          page_id: capiConfig.account_id,
          link_data: {
            link: creativeData.website_url,
            message: creativeData.message,
            image_hash: imageHash,
            call_to_action: {
              type: creativeData.call_to_action_type,
              value: {
                link: creativeData.website_url
              }
            }
          }
        }
      }

      console.log('Creating creative with n8n payload:', creativePayload)

      const response = await fetch('https://n8n.konvertix.de/webhook-test/create-creative/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creativePayload)
      })

      if (!response.ok) {
        const errorResult = await response.json()
        throw new Error(errorResult.error || `Failed to create creative: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Creative created successfully:', result)

      // Move to image upload stage
      setWorkflowStage('image')

    } catch (error) {
      console.error('Error creating creative:', error)
      setCreativeError(error instanceof Error ? error.message : 'Failed to create creative')
    } finally {
      setCreativeLoading(false)
    }
  }

  const handleSkipCreative = () => {
    // Skip creative creation and go to completion
    setWorkflowStage('completed')
  }

  const handleFinishWorkflow = () => {
    // Redirect to campaigns page with success message
    const redirectUrl = adSetResult?.image_upload?.success
      ? '/campaigns?success=adset-and-creative-created'
      : '/campaigns?success=adset-created'
    router.push(redirectUrl)
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

  // Render different stages based on workflow stage
  const renderWorkflowStage = () => {
    switch (workflowStage) {
      case 'adset':
        return renderAdSetForm()
      case 'creative':
        return renderCreativeForm()
      case 'image':
        return renderImageUploadForm()
      case 'completed':
        return renderCompletedStage()
      default:
        return renderAdSetForm()
    }
  }

  const renderAdSetForm = () => (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#a545b6] rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
          <span className="ml-2 text-white">Ad Set</span>
        </div>
        <div className="flex-1 h-px bg-[#3f3f3f]"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#3f3f3f] rounded-full flex items-center justify-center text-[#afafaf] text-sm font-medium">2</div>
          <span className="ml-2 text-[#afafaf]">Creative</span>
        </div>
        <div className="flex-1 h-px bg-[#3f3f3f]"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#3f3f3f] rounded-full flex items-center justify-center text-[#afafaf] text-sm font-medium">3</div>
          <span className="ml-2 text-[#afafaf]">Ad Image</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Ad Set</h1>
        <p className="text-[#afafaf]">Create a new Facebook ad set for your campaign</p>
        {adSetData.campaign_id && (
          <div className="mt-4 p-3 bg-[#2a2a2a] border border-[#3f3f3f] rounded-lg">
            <p className="text-sm text-[#afafaf]">Campaign: <span className="text-white font-medium">{adSetData.campaign_id}</span></p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
        <CardHeader>
          <CardTitle className="text-white">Ad Set Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Set Name</Label>
                <Input
                  id="name"
                  value={adSetData.name}
                  onChange={(e) => setAdSetData({ ...adSetData, name: e.target.value })}
                  placeholder="Enter ad set name"
                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                  required
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="daily_budget">Daily Budget (USD)</Label>
                <Input
                  id="daily_budget"
                  type="number"
                  min="1"
                  step="0.01"
                  value={adSetData.daily_budget}
                  onChange={(e) => setAdSetData({ ...adSetData, daily_budget: e.target.value })}
                  placeholder="10.00"
                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
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
                <Label htmlFor="click_window_days">Click Attribution Window (Days)</Label>
                <Select
                  value={adSetData.click_window_days.toString()}
                  onValueChange={(value) => setAdSetData({ ...adSetData, click_window_days: parseInt(value) })}
                >
                  <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <SelectItem value="1" className="text-white hover:bg-[#3f3f3f]">1 Day</SelectItem>
                    <SelectItem value="7" className="text-white hover:bg-[#3f3f3f]">7 Days</SelectItem>
                    <SelectItem value="28" className="text-white hover:bg-[#3f3f3f]">28 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="view_window_days">View Attribution Window (Days)</Label>
                <Select
                  value={adSetData.view_window_days.toString()}
                  onValueChange={(value) => setAdSetData({ ...adSetData, view_window_days: parseInt(value) })}
                >
                  <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <SelectItem value="1" className="text-white hover:bg-[#3f3f3f]">1 Day</SelectItem>
                    <SelectItem value="7" className="text-white hover:bg-[#3f3f3f]">7 Days</SelectItem>
                    <SelectItem value="28" className="text-white hover:bg-[#3f3f3f]">28 Days</SelectItem>
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
                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
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
                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Ad Set Status</Label>
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


            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#a545b6] to-[#ff6b6b] hover:from-[#a545b6]/80 hover:to-[#ff6b6b]/80 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              {loading ? 'Creating Ad Set...' : 'Create Ad Set'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )

  const renderCreativeForm = () => (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="ml-2 text-white">Ad Set</span>
        </div>
        <div className="flex-1 h-px bg-green-600"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#a545b6] rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
          <span className="ml-2 text-white">Creative</span>
        </div>
        <div className="flex-1 h-px bg-[#3f3f3f]"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#3f3f3f] rounded-full flex items-center justify-center text-[#afafaf] text-sm font-medium">3</div>
          <span className="ml-2 text-[#afafaf]">Ad Image</span>
        </div>
      </div>

      {/* Success Message */}
      <Card className="bg-green-900/20 border-green-500/50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span>Ad set created successfully! Now create your creative.</span>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Creative</h1>
        <p className="text-[#afafaf]">Create a Facebook ad creative for your ad set</p>
      </div>

      {creativeError && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-200">{creativeError}</p>
        </div>
      )}

      <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Image className="h-5 w-5" />
            Creative Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreativeSubmit} className="space-y-6">
            {/* Creative Name */}
            <div className="space-y-2">
              <Label htmlFor="creative_name" className="text-white">
                Creative Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="creative_name"
                type="text"
                placeholder="Enter creative name"
                value={creativeData.name}
                onChange={(e) => handleCreativeInputChange('name', e.target.value)}
                className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">
                <MessageSquare className="h-4 w-4 inline mr-1" />
                Message <span className="text-red-400">*</span>
              </Label>
              <Input
                id="message"
                type="text"
                placeholder="Enter creative message"
                value={creativeData.message}
                onChange={(e) => handleCreativeInputChange('message', e.target.value)}
                className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                required
              />
              <p className="text-xs text-[#afafaf]">This will be displayed as the main text of your ad</p>
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <Label htmlFor="website_url" className="text-white">
                <LinkIcon className="h-4 w-4 inline mr-1" />
                Website URL <span className="text-red-400">*</span>
              </Label>
              <Input
                id="website_url"
                type="url"
                placeholder="https://example.com"
                value={creativeData.website_url}
                onChange={(e) => handleCreativeInputChange('website_url', e.target.value)}
                className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                required
              />
              <p className="text-xs text-[#afafaf]">URL where users will be directed when they click your ad</p>
            </div>

            {/* Call to Action */}
            <div className="space-y-2">
              <Label htmlFor="cta" className="text-white">
                <MousePointer className="h-4 w-4 inline mr-1" />
                Call to Action <span className="text-red-400">*</span>
              </Label>
              <Select
                value={creativeData.call_to_action_type}
                onValueChange={(value) => handleCreativeInputChange('call_to_action_type', value)}
              >
                <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                  <SelectValue placeholder="Select call to action type" />
                </SelectTrigger>
                <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                  {callToActionTypes.map((cta) => (
                    <SelectItem key={cta.value} value={cta.value} className="text-white hover:bg-[#3f3f3f]">
                      {cta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-[#afafaf]">Button text that will appear on your ad</p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-white">
                <Upload className="h-4 w-4 inline mr-1" />
                Creative Image <span className="text-red-400">*</span>
              </Label>
              <ImageUpload
                onImageSelect={handleCreativeImageSelected}
                onImageSelected={handleCreativeImageSelected}
                selectedImage={creativeData.image_url}
                selectedImageName={creativeData.image_name}
                bucketName="assets-private"
                showUpload={true}
              />
              <p className="text-xs text-[#afafaf]">Select an image for your creative from your uploaded assets</p>
              {/* Debug info */}
              {creativeData.image_name && (
                <div className="mt-2 p-2 bg-green-900/20 border border-green-500/50 rounded">
                  <p className="text-xs text-green-400">
                    Selected: {creativeData.image_name}
                  </p>
                </div>
              )}
            </div>


            {/* Submit Buttons */}
            <div className="flex items-center justify-between space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkipCreative}
                disabled={creativeLoading}
                className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
              >
                Skip Creative
              </Button>
              <Button
                type="submit"
                disabled={creativeLoading || !capiConfig}
                className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90 disabled:opacity-50"
              >
                {creativeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : !capiConfig ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Configure Facebook Settings
                  </>
                ) : (
                  <>
                    <Image className="h-4 w-4 mr-2" />
                    Create Creative
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )

  const handleImageSelected = (imageUrl: string, imageName: string) => {
    console.log('Final image selected:', { imageUrl, imageName })
    setSelectedImageUrl(imageUrl)
    setSelectedImageName(imageName)
  }

  const handleImageUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setImageLoading(true)
    setImageError("")

    try {
      if (!selectedImageUrl || !selectedImageName) {
        throw new Error('Please select an image')
      }

      console.log('Image upload completed with:', {
        url: selectedImageUrl,
        name: selectedImageName
      })

      // Move to completed stage
      setWorkflowStage('completed')

    } catch (error) {
      console.error('Error with image upload:', error)
      setImageError(error instanceof Error ? error.message : 'Failed to process image')
    } finally {
      setImageLoading(false)
    }
  }

  const renderImageUploadForm = () => (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="ml-2 text-white">Ad Set</span>
        </div>
        <div className="flex-1 h-px bg-green-600"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="ml-2 text-white">Creative</span>
        </div>
        <div className="flex-1 h-px bg-green-600"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#a545b6] rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
          <span className="ml-2 text-white">Ad Image</span>
        </div>
      </div>

      {/* Success Message */}
      <Card className="bg-green-900/20 border-green-500/50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span>Creative created successfully! Now upload your ad image.</span>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Ad Image</h1>
        <p className="text-[#afafaf]">Upload or select an image for your Facebook ad</p>
      </div>

      {imageError && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-200">{imageError}</p>
        </div>
      )}

      <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Upload className="h-5 w-5" />
            Image Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleImageUploadSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-white">
                <Upload className="h-4 w-4 inline mr-1" />
                Ad Image <span className="text-red-400">*</span>
              </Label>
              <ImageUpload
                onImageSelect={handleImageSelected}
                onImageSelected={handleImageSelected}
                selectedImage={selectedImageUrl}
                selectedImageName={selectedImageName}
                bucketName="assets-private"
                showUpload={true}
              />
              <p className="text-xs text-[#afafaf]">
                Upload a new image or select from your existing assets. Recommended size: 1200x628 pixels.
              </p>
              {/* Debug info */}
              {selectedImageName && (
                <div className="mt-2 p-2 bg-green-900/20 border border-green-500/50 rounded">
                  <p className="text-xs text-green-400">
                    Selected: {selectedImageName}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-between space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setWorkflowStage('completed')}
                disabled={imageLoading}
                className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
              >
                Skip Image Upload
              </Button>
              <Button
                type="submit"
                disabled={imageLoading || !selectedImageUrl}
                className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90 disabled:opacity-50"
              >
                {imageLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )

  const renderCompletedStage = () => (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="ml-2 text-white">Ad Set</span>
        </div>
        <div className="flex-1 h-px bg-green-600"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="ml-2 text-white">Creative</span>
        </div>
        <div className="flex-1 h-px bg-green-600"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="ml-2 text-white">Ad Image</span>
        </div>
      </div>

      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Campaign Setup Complete!</h1>
        <p className="text-[#afafaf] mb-8">
          Your ad set, creative, and image have been successfully created and are ready to run.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <h3 className="font-medium text-white">Ad Set</h3>
              <p className="text-sm text-[#afafaf]">Created successfully</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardContent className="p-4 text-center">
              <Image className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <h3 className="font-medium text-white">Creative</h3>
              <p className="text-sm text-[#afafaf]">Ready to launch</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardContent className="p-4 text-center">
              <Upload className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <h3 className="font-medium text-white">Ad Image</h3>
              <p className="text-sm text-[#afafaf]">Upload completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Link href="/campaigns">
            <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
          <Button
            onClick={handleFinishWorkflow}
            className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Finish Setup
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {renderWorkflowStage()}
      </div>
    </div>
  )
}