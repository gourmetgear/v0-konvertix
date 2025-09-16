"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: "",
    website: "",
    industry: "",
    businessSize: "",

    // Step 2: Goals & Objectives
    primaryGoal: "",
    monthlyBudget: "",
    targetAudience: "",
    currentChallenges: "",

    // Step 3: Marketing Channels
    currentChannels: [] as string[],
    interestedChannels: [] as string[],

    // Step 4: Preferences
    reportingFrequency: "",
    notifications: true,
    dataSharing: false,
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleChannelToggle = (channel: string, type: "current" | "interested") => {
    const field = type === "current" ? "currentChannels" : "interestedChannels"
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(channel) ? prev[field].filter((c) => c !== channel) : [...prev[field], channel],
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    // Persist onboarding settings to public.profiles for the signed-in user
    try {
      const { data: sessionRes } = await supabase.auth.getUser()
      const uid = sessionRes.user?.id
      if (!uid) {
        // Fallback: keep local state and send user to auth
        localStorage.setItem("konvertix-onboarding", JSON.stringify(formData))
        router.push("/auth/login")
        return
      }

      // Save business data to business_profiles table
      const payload: any = {
        user_id: uid,
        business_name: formData.businessName || null,
        website_url: formData.website || null,
        industry: formData.industry || null,
        business_size: formData.businessSize || null,
        marketing_goal: formData.primaryGoal || null,
        monthly_budget: formData.monthlyBudget || null,
        target_audience: formData.targetAudience || null,
        marketing_challenges: formData.currentChallenges || null,
        marketing_channels: (formData.currentChannels || []) as any,
        interested_channels: (formData.interestedChannels || []) as any,
        reporting_frequency: formData.reportingFrequency || null,
      }

      console.log("Saving onboarding data to business_profiles table")
      
      // Save to business_profiles table (create this table with the SQL script)
      const { error } = await supabase.from("business_profiles").upsert(payload, { onConflict: "user_id" })
      if (error) {
        console.error("Failed to save onboarding to profiles:", error.message)
        // Still mark as completed locally - onboarding flow should complete even if DB save fails
        localStorage.setItem("konvertix-onboarding", JSON.stringify({ ...formData, completed: true }))
      } else {
        // Mark onboarding as completed
        localStorage.setItem("konvertix-onboarding", JSON.stringify({ ...formData, completed: true }))
      }

      // Create account_members entry safely after profile is saved
      try {
        const accountMemberResponse = await fetch('/api/create-account-member', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: uid })
        })
        
        if (accountMemberResponse.ok) {
          const result = await accountMemberResponse.json()
          console.log("Account member created successfully for user:", uid, result)
        } else {
          const errorResult = await accountMemberResponse.json()
          console.error("Failed to create account member:", {
            status: accountMemberResponse.status,
            error: errorResult,
            userId: uid
          })
        }
      } catch (accountMemberError) {
        console.error("Account member creation error:", accountMemberError)
      }

      console.log("Onboarding completed for user:", uid)
    } catch (e) {
      console.error("Onboarding error:", e)
      // Always mark as completed locally - user shouldn't be stuck in onboarding loop
      localStorage.setItem("konvertix-onboarding", JSON.stringify({ ...formData, completed: true }))
    } finally {
      router.push("/dashboard")
    }
  }

  const channels = [
    "Google Ads",
    "Facebook Ads",
    "Instagram Ads",
    "LinkedIn Ads",
    "SEO",
    "Email Marketing",
    "Content Marketing",
    "Influencer Marketing",
    "YouTube Ads",
    "TikTok Ads",
    "Twitter Ads",
    "Pinterest Ads",
  ]

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-2xl font-bold">Konvertix</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Konvertix!</h1>
          <p className="text-[#afafaf]">Let's set up your account to get the most out of our platform</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-[#afafaf] mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#2b2b2b]" />
        </div>

        {/* Onboarding Steps */}
        <Card className="bg-[#201b2d] border-[#2b2b2b]">
          <CardHeader>
            <CardTitle className="text-white">
              {currentStep === 1 && "Tell us about your business"}
              {currentStep === 2 && "What are your goals?"}
              {currentStep === 3 && "Marketing channels"}
              {currentStep === 4 && "Final preferences"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Business Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName" className="text-[#afafaf]">
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="Enter your business name"
                    className="bg-[#2b2b2b] border-[#3f3f3f] text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="text-[#afafaf]">
                    Website URL
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="bg-[#2b2b2b] border-[#3f3f3f] text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="industry" className="text-[#afafaf]">
                    Industry *
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="businessSize" className="text-[#afafaf]">
                    Business Size
                  </Label>
                  <Select
                    value={formData.businessSize}
                    onValueChange={(value) => handleInputChange("businessSize", value)}
                  >
                    <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                      <SelectValue placeholder="Select business size" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                      <SelectItem value="small">Small (11-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                      <SelectItem value="large">Large (200+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Goals & Objectives */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primaryGoal" className="text-[#afafaf]">
                    Primary Marketing Goal *
                  </Label>
                  <Select
                    value={formData.primaryGoal}
                    onValueChange={(value) => handleInputChange("primaryGoal", value)}
                  >
                    <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                      <SelectValue placeholder="Select your primary goal" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                      <SelectItem value="lead-generation">Lead Generation</SelectItem>
                      <SelectItem value="sales">Increase Sales</SelectItem>
                      <SelectItem value="traffic">Drive Website Traffic</SelectItem>
                      <SelectItem value="engagement">Improve Engagement</SelectItem>
                      <SelectItem value="retention">Customer Retention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="monthlyBudget" className="text-[#afafaf]">
                    Monthly Marketing Budget
                  </Label>
                  <Select
                    value={formData.monthlyBudget}
                    onValueChange={(value) => handleInputChange("monthlyBudget", value)}
                  >
                    <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <SelectItem value="under-1k">Under $1,000</SelectItem>
                      <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="over-50k">Over $50,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="targetAudience" className="text-[#afafaf]">
                    Target Audience
                  </Label>
                  <Textarea
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    placeholder="Describe your target audience (age, interests, demographics, etc.)"
                    className="bg-[#2b2b2b] border-[#3f3f3f] text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="currentChallenges" className="text-[#afafaf]">
                    Current Marketing Challenges
                  </Label>
                  <Textarea
                    id="currentChallenges"
                    value={formData.currentChallenges}
                    onChange={(e) => handleInputChange("currentChallenges", e.target.value)}
                    placeholder="What marketing challenges are you facing?"
                    className="bg-[#2b2b2b] border-[#3f3f3f] text-white"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Marketing Channels */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-[#afafaf] mb-3 block">Current Marketing Channels</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {channels.map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox
                          id={`current-${channel}`}
                          checked={formData.currentChannels.includes(channel)}
                          onCheckedChange={() => handleChannelToggle(channel, "current")}
                          className="border-[#3f3f3f]"
                        />
                        <Label htmlFor={`current-${channel}`} className="text-sm text-[#afafaf]">
                          {channel}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-[#afafaf] mb-3 block">Interested in Exploring</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {channels.map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interested-${channel}`}
                          checked={formData.interestedChannels.includes(channel)}
                          onCheckedChange={() => handleChannelToggle(channel, "interested")}
                          className="border-[#3f3f3f]"
                        />
                        <Label htmlFor={`interested-${channel}`} className="text-sm text-[#afafaf]">
                          {channel}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reportingFrequency" className="text-[#afafaf]">
                    Reporting Frequency
                  </Label>
                  <Select
                    value={formData.reportingFrequency}
                    onValueChange={(value) => handleInputChange("reportingFrequency", value)}
                  >
                    <SelectTrigger className="bg-[#2b2b2b] border-[#3f3f3f] text-white">
                      <SelectValue placeholder="How often would you like reports?" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifications"
                      checked={formData.notifications}
                      onCheckedChange={(checked) => handleInputChange("notifications", checked)}
                      className="border-[#3f3f3f]"
                    />
                    <Label htmlFor="notifications" className="text-[#afafaf]">
                      Send me email notifications about campaign performance
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dataSharing"
                      checked={formData.dataSharing}
                      onCheckedChange={(checked) => handleInputChange("dataSharing", checked)}
                      className="border-[#3f3f3f]"
                    />
                    <Label htmlFor="dataSharing" className="text-[#afafaf]">
                      Share anonymized data to help improve Konvertix
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-[#3f3f3f] text-[#afafaf] hover:text-white bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={completeOnboarding}
                  className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                >
                  Complete Setup
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
