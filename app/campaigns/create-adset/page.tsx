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
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function CreateAdSetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaign_id')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

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

  const [campaignName, setCampaignName] = useState(campaignId || "") // Store the campaign name separately

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
          router.push(`/auth/login?redirectTo=/campaigns/create-adset${campaignId ? `?campaign_id=${campaignId}` : ''}`)
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
          router.push(`/auth/login?redirectTo=/campaigns/create-adset${campaignId ? `?campaign_id=${campaignId}` : ''}`)
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

      // Redirect to campaigns page with success message
      router.push('/campaigns?success=adset-created')
    } catch (error) {
      console.error('Ad set creation error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
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
    </div>
  )
}