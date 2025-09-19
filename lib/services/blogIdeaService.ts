"use client"

import { supabase } from '@/lib/supabase/client'

export interface UserProfileData {
  id?: string
  full_name?: string
  role?: string
  created_at?: string

  // Basic Business Info
  business_name?: string
  website_url?: string
  industry?: string
  business_size?: string

  // Marketing Info
  marketing_goal?: string
  monthly_budget?: string
  target_audience?: string
  marketing_challenges?: string
  marketing_channels?: string[] | any
  interested_channels?: string[] | any
  reporting_frequency?: string

  // Product Information
  product_type?: string
  product_category?: string
  main_products?: string
  product_description?: string
  unique_selling_proposition?: string
  price_range?: string

  // Business Model
  business_model?: string
  revenue_streams?: string[] | any

  // Market Analysis
  target_market?: string
  geographic_reach?: string
  main_competitors?: string
  competitive_advantage?: string
  market_position?: string

  // Customer Information
  customer_demographics?: string
  customer_pain_points?: string
  customer_journey_stage?: string
  average_customer_value?: number
  customer_lifetime_value?: number

  // User Profile
  first_name?: string
  last_name?: string
  profile_picture_url?: string
}

export interface BlogIdeaWebhookPayload extends UserProfileData {
  user_id: string
  email?: string
  full_name?: string
}

/**
 * Fetch current user's profile data from Supabase
 */
export async function getUserProfileData(): Promise<UserProfileData | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    // First try to get from business_profiles table
    const { data: businessProfile, error: businessError } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (businessProfile && !businessError) {
      return {
        id: businessProfile.id,
        full_name: user.user_metadata?.full_name,
        role: user.role,
        created_at: businessProfile.created_at,

        // Basic Business Info
        business_name: businessProfile.business_name,
        website_url: businessProfile.website_url,
        industry: businessProfile.industry,
        business_size: businessProfile.business_size,

        // Marketing Info
        marketing_goal: businessProfile.marketing_goal,
        monthly_budget: businessProfile.monthly_budget,
        target_audience: businessProfile.target_audience,
        marketing_challenges: businessProfile.marketing_challenges,
        marketing_channels: businessProfile.marketing_channels,
        interested_channels: businessProfile.interested_channels,
        reporting_frequency: businessProfile.reporting_frequency,

        // Product Information
        product_type: businessProfile.product_type,
        product_category: businessProfile.product_category,
        main_products: businessProfile.main_products,
        product_description: businessProfile.product_description,
        unique_selling_proposition: businessProfile.unique_selling_proposition,
        price_range: businessProfile.price_range,

        // Business Model
        business_model: businessProfile.business_model,
        revenue_streams: businessProfile.revenue_streams,

        // Market Analysis
        target_market: businessProfile.target_market,
        geographic_reach: businessProfile.geographic_reach,
        main_competitors: businessProfile.main_competitors,
        competitive_advantage: businessProfile.competitive_advantage,
        market_position: businessProfile.market_position,

        // Customer Information
        customer_demographics: businessProfile.customer_demographics,
        customer_pain_points: businessProfile.customer_pain_points,
        customer_journey_stage: businessProfile.customer_journey_stage,
        average_customer_value: businessProfile.average_customer_value,
        customer_lifetime_value: businessProfile.customer_lifetime_value,

        // User Profile
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name,
        profile_picture_url: user.user_metadata?.avatar_url,
      }
    }

    // Fallback to profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return null
    }

    return {
      id: profile.id,
      business_name: profile.business_name || profile.company_name,
      website_url: profile.website_url || profile.website,
      industry: profile.industry,
      business_size: profile.business_size,
      marketing_goal: profile.marketing_goal,
      monthly_budget: profile.monthly_budget,
      target_audience: profile.target_audience,
      marketing_channels: profile.marketing_channels,
      interested_channels: profile.interested_channels,
      reporting_frequency: profile.reporting_frequency,
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * Call the n8n webhook to create blog post ideas
 */
export async function createBlogPostIdeas(): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'User not authenticated' }
    }

    // Fetch user profile data
    const profileData = await getUserProfileData()

    if (!profileData) {
      return { success: false, message: 'Could not fetch user profile data' }
    }

    // Prepare payload for webhook
    const webhookPayload: BlogIdeaWebhookPayload = {
      user_id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email,
      ...profileData
    }

    // Call n8n webhook
    const response = await fetch('https://n8n.konvertix.de/webhook/create-blog-post-ideas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Webhook call failed:', response.status, errorText)
      return {
        success: false,
        message: `Webhook call failed: ${response.status} ${response.statusText}`
      }
    }

    const responseData = await response.json()

    return {
      success: true,
      message: 'Blog post ideas created successfully',
      data: responseData
    }
  } catch (error) {
    console.error('Error creating blog post ideas:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}