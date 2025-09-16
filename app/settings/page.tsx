"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Settings,
  HeadphonesIcon,
  Upload,
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  // account_members rows for this user
  const [accounts, setAccounts] = useState<Array<{ account_id: string; ad_account_id: string | null; business_id: string | null; ad_token: string | null }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [newProvider, setNewProvider] = useState("facebook")
  const [newAccountId, setNewAccountId] = useState("")
  const [newBusinessId, setNewBusinessId] = useState("")
  const [testUid, setTestUid] = useState<string>("")
  const [testCount, setTestCount] = useState<number | null>(null)
  const [testMsg, setTestMsg] = useState<string>("")
  const [profile, setProfile] = useState<{
    business_name: string | null
    website_url: string | null
    industry: string | null
    business_size: string | null
    full_name?: string | null
    marketing_goal?: string | null
    monthly_budget?: string | null
    target_audience?: string | null
    marketing_challenges?: string | null
    marketing_channels?: string[] | null
    interested_channels?: string[] | null
    reporting_frequency?: string | null
  }>({ business_name: null, website_url: null, industry: null, business_size: null })
  const [profileMsg, setProfileMsg] = useState<string>("")
  // capiconfig per account
  const [capi, setCapi] = useState<Record<string, { pixel_id?: string | null; access_token?: string | null; domain?: string | null; eventsCsv?: string; test_event_code?: string | null; last_verified_at?: string | null }>>({})
  const [capiMsg, setCapiMsg] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError("")
      const { data: userRes } = await supabase.auth.getUser()
      if (!userRes.user) {
        setLoading(false)
        return
      }
      // Robust load: avoid server-side order and filter client-side for the signed-in user
      let rows: any[] = []
      // Skip account_members due to RLS policy issues, try accounts table directly
      console.log("Loading accounts for user:", userRes.user.id)
      
      try {
        // First explore the accounts table structure
        const { data: sampleData } = await supabase
          .from("accounts")
          .select("*")
          .limit(1)
        
        console.log("Accounts table structure:", sampleData?.[0] ? Object.keys(sampleData[0]) : "No existing data")
        
        // Try to load all accounts (since we don't know the user field yet)
        const { data, error } = await supabase
          .from("accounts")
          .select("*")
        
        if (error) {
          console.error("Error loading accounts:", error)
          rows = []
        } else {
          console.log("All accounts data:", data)
          // For now, show all accounts since we don't know the user field structure
          // In a real app, you'd filter by user_id or owner_id field
          rows = data || []
        }
      } catch (e) {
        console.error("Failed to load accounts:", e)
        rows = []
      }
      rows.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      console.log('Loaded accounts:', rows, 'User ID:', userRes.user.id)
      setAccounts(rows)

      // Load capiconfig for these accounts  
      const ids = (rows || []).map((d: any) => d.account_id)
      console.log("Looking for CAPI configs for account IDs:", ids)
      
      // First, explore capiconfig table structure
      try {
        const { data: capiSample } = await supabase
          .from("capiconfig")
          .select("*")
          .limit(1)
        console.log("Capiconfig table structure:", capiSample?.[0] ? Object.keys(capiSample[0]) : "No existing data")
      } catch (exploreError) {
        console.error("Failed to explore capiconfig table:", exploreError)
      }
      
      // Load capiconfig for current user (no need to filter by account_id since RLS handles it)
      const { data: capiRows, error: capiError } = await supabase
        .from("capiconfig")
        .select("account_id, provider, pixel_id, access_token, domain, events, test_event_code, last_verified_at")
        .eq("user_id", userRes.user.id)
        
      if (capiError) {
        console.error("Error loading capiconfig from database:", capiError)
        
        // Fallback to localStorage
        console.log("Loading CAPI configs from localStorage...")
        const localConfigs = JSON.parse(localStorage.getItem("capiconfig") || "{}")
        console.log("Found localStorage configs:", localConfigs)
        
        const byId: Record<string, any> = {}
        Object.keys(localConfigs).forEach(accountId => {
          const config = localConfigs[accountId]
          byId[accountId] = {
            pixel_id: config.pixel_id || "",
            access_token: config.access_token ? "••••••••" : "",
            domain: config.domain || "",
            eventsCsv: Array.isArray(config.events) ? config.events.join(", ") : "",
            test_event_code: config.test_event_code || "",
            last_verified_at: config.saved_at || null,
            storage_type: "localStorage"
          }
        })
        setCapi(byId)
      } else {
        const byId: Record<string, any> = {}
        for (const row of capiRows || []) {
          byId[row.account_id] = {
            pixel_id: row.pixel_id || "",
            access_token: row.access_token ? "••••••••" : "",
              domain: row.domain || "",
              eventsCsv: Array.isArray(row.events) ? row.events.join(", ") : "",
              test_event_code: row.test_event_code || "",
              last_verified_at: row.last_verified_at || null,
              storage_type: "database"
            }
          }
          setCapi(byId)
          
          // If we have CAPI configs but no accounts, create manual accounts for them
          if (accounts.length === 0 && (capiRows || []).length > 0) {
            const manualAccounts = (capiRows || []).map(row => ({
              id: row.account_id,
              account_id: row.account_id,
              provider: row.provider || 'facebook',
              name: row.provider === 'google' ? 'Google Ads' : 'Facebook Ads',
              manual: true
            }))
            setAccounts(manualAccounts)
          }
        }

      // Load profile basics (business info saved from onboarding)
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("business_name, website_url, industry, business_size, full_name, marketing_goal, monthly_budget, target_audience, marketing_challenges, marketing_channels, interested_channels, reporting_frequency")
        .eq("id", userRes.user.id)
        .maybeSingle()
      if (!profErr && prof) {
        const toArr = (v: any) => {
          if (Array.isArray(v)) return v
          if (typeof v === "string" && v.trim().length) return v.split(",").map((s) => s.trim()).filter(Boolean)
          return []
        }
        setProfile({
          ...(prof as any),
          marketing_channels: toArr((prof as any).marketing_channels),
          interested_channels: toArr((prof as any).interested_channels),
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const saveAccountMembersRow = async (account_id: string, payload: { ad_account_id?: string | null; business_id?: string | null; ad_token?: string | null }) => {
    setError("")
    const { data: userRes } = await supabase.auth.getUser()
    const uid = userRes.user?.id
    if (!uid) return
    const { error } = await supabase
      .from("account_members")
      .update(payload)
      .match({ account_id, user_id: uid })
    if (error) setError(error.message)
    else {
      const { data } = await supabase
        .from("account_members")
        .select("account_id, ad_account_id, business_id, ad_token")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
      setAccounts(data || [])
    }
  }

  const runTestSelect = async () => {
    setTestMsg("")
    setTestCount(null)
    const { data: userRes } = await supabase.auth.getUser()
    const uid = userRes.user?.id || ""
    setTestUid(uid)
    if (!uid) {
      setTestMsg("No active session")
      return
    }
    const { count, error } = await supabase
      .from("account_members")
      .select("account_id", { count: "exact", head: true })
      .eq("user_id", uid)
    if (error) setTestMsg(error.message)
    else setTestCount(count ?? 0)
  }

  const saveProfile = async () => {
    setProfileMsg("")
    const { data: userRes } = await supabase.auth.getUser()
    const uid = userRes.user?.id
    if (!uid) {
      setProfileMsg("Not signed in")
      return
    }
      const payload: any = {
        id: uid,
        business_name: profile.business_name || null,
        website_url: profile.website_url || null,
        industry: profile.industry || null,
        business_size: profile.business_size || null,
        full_name: profile.full_name || null,
        marketing_goal: profile.marketing_goal || null,
        monthly_budget: profile.monthly_budget || null,
        target_audience: profile.target_audience || null,
        marketing_challenges: profile.marketing_challenges || null,
        marketing_channels: (profile.marketing_channels || null) as any,
        interested_channels: (profile.interested_channels || null) as any,
        reporting_frequency: profile.reporting_frequency || null,
      }
    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" })
    if (error) setProfileMsg(error.message)
    else setProfileMsg("Saved")
  }

  const setCapiField = (accountId: string, field: string, value: string) => {
    setCapi((prev) => ({ ...prev, [accountId]: { ...(prev[accountId] || {}), [field]: value } }))
  }

  const addNewAccount = async () => {
    setError("")
    const { data: userRes } = await supabase.auth.getUser()
    const uid = userRes.user?.id
    if (!uid) {
      setError("Not authenticated")
      return
    }

    // Generate a proper UUID for the accounts table
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    const accountId = generateUUID()
    
    try {
      // Based on error analysis, accounts table only accepts UUID in 'id' field
      const payloads = [
        { id: accountId }
      ]
      
      let success = false
      for (const payload of payloads) {
        console.log(`Trying to create account with payload:`, payload)
        const { error } = await supabase
          .from("accounts")
          .insert(payload)
        
        if (!error) {
          console.log("Successfully created account with payload:", payload)
          success = true
          break
        } else {
          console.log(`Failed with payload:`, payload, error.message)
        }
      }
      
      if (!success) {
        setError("Failed to create account with any payload structure")
        return
      }

      // Reload accounts
      const { data, error: loadError } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (loadError) {
        console.error("Load error:", loadError)
        setError(`Failed to reload accounts: ${loadError.message}`)
      } else {
        setAccounts(data || [])
        setError("")
      }
    } catch (e) {
      console.error("Unexpected error:", e)
      setError("Unexpected error occurred")
    }
  }

  const saveCapi = async (accountId: string) => {
    setCapiMsg("")
    const { data: userRes } = await supabase.auth.getUser()
    const uid = userRes.user?.id
    if (!uid) {
      setCapiMsg("Not authenticated")
      return
    }
    
    // Find the account to get provider info
    const account = accounts.find(a => (a.id || a.account_id) === accountId)
    const provider = account?.provider || 'facebook' // default to facebook
    
    const row = capi[accountId] || {}
    const events = (row.eventsCsv || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => !!s)
    const payload: any = {
      user_id: uid,
      account_id: accountId,
      provider: provider,
      pixel_id: row.pixel_id || null,
      domain: row.domain || null,
      events: events.length ? events : null,
      test_event_code: row.test_event_code || null,
    }
    // only save access_token if user typed a non-masked value
    if (row.access_token && row.access_token !== "••••••••") {
      payload.access_token = row.access_token
    }
    
    console.log("Saving CAPI payload:", payload)
    
    try {
      // First try to save to database
      const { data, error } = await supabase
        .from("capiconfig")
        .upsert(payload, { onConflict: "user_id,account_id" })
        .select()
      
      if (error) {
        console.error("Database save failed:", error)
        console.error("Error details:", error.message, error.details, error.hint)
        
        // Fallback to localStorage
        console.log("Falling back to localStorage...")
        const existingConfigs = JSON.parse(localStorage.getItem("capiconfig") || "{}")
        existingConfigs[accountId] = {
          ...payload,
          saved_at: new Date().toISOString(),
          storage_type: "localStorage"
        }
        localStorage.setItem("capiconfig", JSON.stringify(existingConfigs))
        console.log("CAPI saved to localStorage:", existingConfigs[accountId])
        setCapiMsg("Saved (localStorage)")
      } else {
        console.log("CAPI saved to database successfully:", data)
        setCapiMsg("Saved")
      }
    } catch (e) {
      console.error("Unexpected error:", e)
      setCapiMsg("Error occurred")
    }
  }

  const deleteCapi = async (accountId: string) => {
    setCapiMsg("")
    const { data: userRes } = await supabase.auth.getUser()
    const uid = userRes.user?.id
    if (!uid) {
      setCapiMsg("Not authenticated")
      return
    }

    try {
      // Delete from database
      const { error } = await supabase
        .from("capiconfig")
        .delete()
        .eq("user_id", uid)
        .eq("account_id", accountId)
      
      if (error) {
        console.error("Database delete failed:", error)
        // Fallback to localStorage cleanup
        const existingConfigs = JSON.parse(localStorage.getItem("capiconfig") || "{}")
        delete existingConfigs[accountId]
        localStorage.setItem("capiconfig", JSON.stringify(existingConfigs))
        setCapiMsg("Deleted (localStorage)")
      } else {
        console.log("CAPI config deleted from database successfully")
        setCapiMsg("Deleted")
      }
      
      // Remove from local state
      const newCapi = { ...capi }
      delete newCapi[accountId]
      setCapi(newCapi)
      
      // Remove the account if it was manual
      setAccounts(prev => prev.filter(a => (a.id || a.account_id) !== accountId))
      
    } catch (e) {
      console.error("Unexpected error during delete:", e)
      setCapiMsg("Delete error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Settings Content */}
        <main className="flex-1 p-6">
          <div className="w-full space-y-8">
            {/* Page Header */}
            <h1 className="text-3xl font-bold">Settings</h1>

            {/* Profile Sections - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Profile Section */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold">Personal Profile</h2>

                  {/* Profile Picture Upload */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-[#3f3f3f] rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-[#afafaf]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Upload Profile</p>
                      <p className="text-xs text-[#afafaf]">Min 600x600.PNG, JPEG</p>
                    </div>
                    <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                      Upload
                    </Button>
                  </div>

                  {/* Name and Email Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        placeholder="Name"
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        placeholder="Mail id"
                        type="email"
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="password"
                        value="••••••••••"
                        readOnly
                        className="flex-1 bg-[#3f3f3f] border-[#4f4f4f] text-white"
                      />
                      <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Profile */}
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold">Business Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Name</label>
                      <Input
                        value={profile.business_name ?? ""}
                        onChange={(e) => setProfile((p) => ({ ...p, business_name: e.target.value }))}
                        placeholder="Your company"
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Website URL</label>
                      <Input
                        value={profile.website_url ?? ""}
                        onChange={(e) => setProfile((p) => ({ ...p, website_url: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Industry</label>
                      <select
                        value={profile.industry ?? ""}
                        onChange={(e) => setProfile((p) => ({ ...p, industry: e.target.value }))}
                        className="w-full bg-[#3f3f3f] border-[#4f4f4f] text-white rounded-md h-10 px-3"
                      >
                        <option value="">Select industry</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="saas">SaaS</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="finance">Finance</option>
                        <option value="education">Education</option>
                        <option value="real-estate">Real Estate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Size</label>
                      <select
                        value={profile.business_size ?? ""}
                        onChange={(e) => setProfile((p) => ({ ...p, business_size: e.target.value }))}
                        className="w-full bg-[#3f3f3f] border-[#4f4f4f] text-white rounded-md h-10 px-3"
                      >
                        <option value="">Select size</option>
                        <option value="startup">Startup (1-10 employees)</option>
                        <option value="small">Small (11-50 employees)</option>
                        <option value="medium">Medium (51-200 employees)</option>
                        <option value="large">Large (200+ employees)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={saveProfile} className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      Save business profile
                    </Button>
                    {profileMsg && <span className={`text-sm ${profileMsg === 'Saved' ? 'text-green-400' : 'text-red-400'}`}>{profileMsg}</span>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Marketing Preferences */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Marketing Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Goal</label>
                    <select
                      value={profile.marketing_goal ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, marketing_goal: e.target.value }))}
                      className="w-full bg-[#3f3f3f] border-[#4f4f4f] text-white rounded-md h-10 px-3"
                    >
                      <option value="">Select goal</option>
                      <option value="brand-awareness">Brand Awareness</option>
                      <option value="lead-generation">Lead Generation</option>
                      <option value="sales">Increase Sales</option>
                      <option value="traffic">Drive Website Traffic</option>
                      <option value="engagement">Improve Engagement</option>
                      <option value="retention">Customer Retention</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Budget</label>
                    <select
                      value={profile.monthly_budget ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, monthly_budget: e.target.value }))}
                      className="w-full bg-[#3f3f3f] border-[#4f4f4f] text-white rounded-md h-10 px-3"
                    >
                      <option value="">Select budget</option>
                      <option value="under-1k">Under $1,000</option>
                      <option value="1k-5k">$1,000 - $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="over-50k">Over $50,000</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <Textarea
                      value={profile.target_audience ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, target_audience: e.target.value }))}
                      placeholder="Demographics, interests, behaviors"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Marketing Challenges</label>
                    <Textarea
                      value={profile.marketing_challenges ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, marketing_challenges: e.target.value }))}
                      placeholder="Biggest obstacles (attribution, CAC, tracking, creative, etc.)"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Channels (comma separated)</label>
                    <Input
                      value={(Array.isArray(profile.marketing_channels)
                        ? profile.marketing_channels
                        : typeof profile.marketing_channels === "string"
                        ? (profile.marketing_channels as unknown as string)
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        : []
                      ).join(", ")}
                      onChange={(e) => setProfile((p) => ({ ...p, marketing_channels: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
                      placeholder="Google Ads, Facebook Ads, SEO"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Interested Channels (comma separated)</label>
                    <Input
                      value={(Array.isArray(profile.interested_channels)
                        ? profile.interested_channels
                        : typeof profile.interested_channels === "string"
                        ? (profile.interested_channels as unknown as string)
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        : []
                      ).join(", ")}
                      onChange={(e) => setProfile((p) => ({ ...p, interested_channels: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
                      placeholder="LinkedIn Ads, Email Marketing"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reporting Frequency</label>
                    <select
                      value={profile.reporting_frequency ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, reporting_frequency: e.target.value }))}
                      className="w-full bg-[#3f3f3f] border-[#4f4f4f] text-white rounded-md h-10 px-3"
                    >
                      <option value="">Select frequency</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={saveProfile} className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                    Save preferences
                  </Button>
                  {profileMsg && <span className={`text-sm ${profileMsg === 'Saved' ? 'text-green-400' : 'text-red-400'}`}>{profileMsg}</span>}
                </div>
              </CardContent>
            </Card>

            {/* Conversions API (Meta CAPI) */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Meta Conversions API</h2>
                <p className="text-sm text-[#afafaf]">Configure Pixel and CAPI credentials for your accounts.</p>
                {capiMsg && (
                  <div className={`text-sm ${capiMsg === 'Saved' ? 'text-green-400' : 'text-red-400'}`}>{capiMsg}</div>
                )}
                <div className="space-y-4">
                  {accounts.length === 0 && (
                    <div className="space-y-4">
                      <div className="text-[#afafaf]">No accounts available. You can configure CAPI settings by adding an account manually.</div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => {
                            const manualId = prompt("Enter your Facebook account ID manually:")
                            if (manualId) {
                              setAccounts(prev => [...prev, { id: manualId, manual: true, provider: 'facebook', name: 'Facebook Ads' }])
                            }
                          }}
                          variant="outline"
                          className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        >
                          Add Facebook Account
                        </Button>
                        <Button 
                          onClick={() => {
                            const manualId = prompt("Enter your Google Ads account ID manually:")
                            if (manualId) {
                              setAccounts(prev => [...prev, { id: manualId, manual: true, provider: 'google', name: 'Google Ads' }])
                            }
                          }}
                          variant="outline"
                          className="border-green-500 text-green-400 hover:bg-green-500/10"
                        >
                          Add Google Ads Account
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Facebook Ads Accounts */}
                  {accounts.filter(a => a.provider !== 'google').length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        Facebook Ads Accounts
                      </h3>
                      {accounts.filter(a => a.provider !== 'google').map((a) => {
                        const accountId = a.id || a.account_id || 'unknown'
                        const cfg = capi[accountId] || {}
                        return (
                      <div key={`capi-${accountId}`} className={`rounded-md border p-3 space-y-3 ${
                        a.provider === 'google' 
                          ? 'border-green-500/50 bg-green-900/10' 
                          : 'border-blue-500/50 bg-blue-900/10'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                a.provider === 'google' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {a.provider === 'google' ? 'Google Ads' : 'Facebook Ads'}
                              </span>
                              <span>
                                {a.manual ? accountId : `${accountId.slice(0, 8)}...${accountId.slice(-4)}`}
                              </span>
                              {a.manual && <span className="text-gray-400 text-xs">(Manual)</span>}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm mb-1">Pixel ID</label>
                            <Input
                              value={cfg.pixel_id || ""}
                              onChange={(e) => setCapiField(accountId, "pixel_id", e.target.value)}
                              placeholder="e.g. 123456789012345"
                              className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Access Token (server)</label>
                            <Input
                              value={cfg.access_token || ""}
                              onChange={(e) => setCapiField(accountId, "access_token", e.target.value)}
                              placeholder="enter to replace stored token"
                              className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Domain</label>
                            <Input
                              value={cfg.domain || ""}
                              onChange={(e) => setCapiField(accountId, "domain", e.target.value)}
                              placeholder="example.com"
                              className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm mb-1">Events (comma separated)</label>
                            <Input
                              value={cfg.eventsCsv || ""}
                              onChange={(e) => setCapiField(accountId, "eventsCsv", e.target.value)}
                              placeholder="PageView, Purchase, Lead"
                              className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Test Event Code</label>
                            <Input
                              value={cfg.test_event_code || ""}
                              onChange={(e) => setCapiField(accountId, "test_event_code", e.target.value)}
                              placeholder="optional"
                              className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button onClick={() => saveCapi(accountId)} className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">Save CAPI</Button>
                          <Button 
                            onClick={() => {
                              if (confirm(`Delete CAPI configuration for account ${accountId}?`)) {
                                deleteCapi(accountId)
                              }
                            }}
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            Delete
                          </Button>
                          {cfg.last_verified_at && (
                            <span className="text-xs text-[#afafaf]">
                              Last saved: {new Date(cfg.last_verified_at).toLocaleString()}
                              {cfg.storage_type && <span className="ml-2">({cfg.storage_type})</span>}
                            </span>
                          )}
                        </div>
                      </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Google Ads Accounts */}
                  {accounts.filter(a => a.provider === 'google').length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        Google Ads Accounts
                      </h3>
                      {accounts.filter(a => a.provider === 'google').map((a) => {
                        const accountId = a.id || a.account_id || 'unknown'
                        const cfg = capi[accountId] || {}
                        return (
                          <div key={`capi-${accountId}`} className="rounded-md border border-green-500/50 bg-green-900/10 p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                                    Google Ads
                                  </span>
                                  <span>
                                    {a.manual ? accountId : `${accountId.slice(0, 8)}...${accountId.slice(-4)}`}
                                  </span>
                                  {a.manual && <span className="text-gray-400 text-xs">(Manual)</span>}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm mb-1">Customer ID</label>
                                <Input
                                  value={cfg.pixel_id || ""}
                                  onChange={(e) => setCapiField(accountId, "pixel_id", e.target.value)}
                                  placeholder="e.g. 123-456-7890"
                                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm mb-1">Access Token</label>
                                <Input
                                  type="password"
                                  value={cfg.access_token || ""}
                                  onChange={(e) => setCapiField(accountId, "access_token", e.target.value)}
                                  placeholder="OAuth token"
                                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm mb-1">Domain</label>
                                <Input
                                  value={cfg.domain || ""}
                                  onChange={(e) => setCapiField(accountId, "domain", e.target.value)}
                                  placeholder="example.com"
                                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm mb-1">Conversion Actions</label>
                                <Input
                                  value={cfg.eventsCsv || ""}
                                  onChange={(e) => setCapiField(accountId, "eventsCsv", e.target.value)}
                                  placeholder="purchase, signup, page_view"
                                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm mb-1">Developer Token</label>
                                <Input
                                  value={cfg.test_event_code || ""}
                                  onChange={(e) => setCapiField(accountId, "test_event_code", e.target.value)}
                                  placeholder="optional"
                                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button onClick={() => saveCapi(accountId)} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600/90 hover:to-green-500/90">Save Google Ads Config</Button>
                              <Button 
                                onClick={() => {
                                  if (confirm(`Delete Google Ads configuration for account ${accountId}?`)) {
                                    deleteCapi(accountId)
                                  }
                                }}
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                              >
                                Delete
                              </Button>
                              {cfg.last_verified_at && (
                                <span className="text-xs text-[#afafaf]">
                                  Last saved: {new Date(cfg.last_verified_at).toLocaleString()}
                                  {cfg.storage_type && <span className="ml-2">({cfg.storage_type})</span>}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {accounts.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => {
                            const manualId = prompt("Enter your Facebook account ID manually:")
                            if (manualId) {
                              setAccounts(prev => [...prev, { id: manualId, manual: true, provider: 'facebook', name: 'Facebook Ads' }])
                            }
                          }}
                          variant="outline"
                          className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        >
                          Add Facebook Account
                        </Button>
                        <Button 
                          onClick={() => {
                            const manualId = prompt("Enter your Google Ads account ID manually:")
                            if (manualId) {
                              setAccounts(prev => [...prev, { id: manualId, manual: true, provider: 'google', name: 'Google Ads' }])
                            }
                          }}
                          variant="outline"
                          className="border-green-500 text-green-400 hover:bg-green-500/10"
                        >
                          Add Google Ads Account
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Info Section */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Company Info</h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="password"
                        value="••••••••••"
                        readOnly
                        className="flex-1 bg-[#3f3f3f] border-[#4f4f4f] text-white"
                      />
                      <Button
                        variant="outline"
                        className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                      >
                        Upload
                      </Button>
                    </div>
                  </div>

                  {/* Website Address */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Website address</label>
                    <Input
                      placeholder="https://"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals & Budgets Section */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Goals & Budgets</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Desired ROAS</label>
                    <Input
                      placeholder="ROAS"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Daily Spend</label>
                    <Input
                      placeholder="Spend"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Edit Profile Button */}
            <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90 px-8">
              Edit Profile
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
