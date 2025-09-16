import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    // Check if admin client is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      )
    }
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const dateRange = url.searchParams.get('dateRange') || '7' // default 7 days

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Remove date range filtering - get all data

    console.log('Fetching metrics for userId:', userId)

    // Query by account_id using the userId directly (no date range filtering)
    let { data: metrics, error: metricsError } = await supabaseAdmin
      .from('metrics_daily')
      .select('*')
      .eq('account_id', userId)
      .order('date', { ascending: false })

    console.log('Account query result:', {
      count: metrics?.length || 0,
      searchedAccountId: userId,
      foundAccountIds: metrics?.map(m => m.account_id).slice(0, 3) || []
    })

    // If still no results, check what data exists in the table
    if (!metrics || metrics.length === 0) {
      console.log('No results found, checking all available data...')

      // Check if table has any data at all
      const { data: anyData, error: anyError } = await supabaseAdmin
        .from('metrics_daily')
        .select('account_id, date, platform, spend, total_revenue, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      console.log('Any data in metrics_daily table:', {
        count: anyData?.length || 0,
        allAccountIds: anyData?.map(d => d.account_id) || [],
        sample: anyData?.[0] || null
      })

      // Show the exact account_id we're looking for vs what exists
      console.log('COMPARISON:', {
        lookingFor: userId,
        existingAccountIds: anyData?.map(d => d.account_id) || [],
        exactMatch: anyData?.some(d => d.account_id === userId) || false
      })

      // Specifically check for this account's data with exact match
      const { data: exactAccountData, error: exactError } = await supabaseAdmin
        .from('metrics_daily')
        .select('*')
        .eq('account_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      console.log('Exact account_id match data:', {
        searchAccountId: userId,
        count: exactAccountData?.length || 0,
        sample: exactAccountData?.[0] || null
      })

      // Try to find data for this specific user with a broader search
      if (anyData && anyData.length > 0) {
        const { data: userSpecific, error: userSpecificError } = await supabaseAdmin
          .from('metrics_daily')
          .select('*')
          .eq('account_id', userId)
          .order('date', { ascending: true })

        if (userSpecific && userSpecific.length > 0) {
          metrics = userSpecific
          metricsError = userSpecificError
          console.log('Found user-specific data:', { count: metrics?.length || 0 })
        }
      }
    }

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError)
      return NextResponse.json(
        { error: 'Failed to fetch metrics data', details: metricsError.message },
        { status: 500 }
      )
    }

    console.log('Metrics query result:', {
      count: metrics?.length || 0,
      error: metricsError?.message || null,
      sampleData: metrics?.[0] || null,
      accountId: userId
    })

    // Process and aggregate the data
    // Based on comprehensive metrics_daily schema
    const totalMetrics = {
      totalSpend: 0,
      totalRevenue: 0,
      totalConversions: 0,
      totalImpressions: 0,
      totalClicks: 0,
      averageROAS: 0,
      averageCPM: 0,
      averageCPC: 0,
      averageCTR: 0
    }

    const dailyData = []
    const campaignData = new Map()

    // Safely process metrics data
    // Available columns from metrics_daily table schema
    if (metrics && Array.isArray(metrics)) {
      metrics.forEach(metric => {
        try {
          // Aggregate totals - map database fields to expected fields
          totalMetrics.totalSpend += parseFloat(metric.spend || 0)
          totalMetrics.totalRevenue += parseFloat(metric.revenue || 0) // Use 'revenue' instead of 'total_revenue'
          totalMetrics.totalConversions += parseInt(metric.conversions || 0) // Use 'conversions' instead of 'total_conversions'
          totalMetrics.totalImpressions += parseInt(metric.impressions || 0)
          totalMetrics.totalClicks += parseInt(metric.clicks || 0)

          // Daily data for charts - map database fields correctly
          dailyData.push({
            date: metric.date,
            day: metric.date ? new Date(metric.date).toLocaleDateString('en', { weekday: 'short' }) : 'N/A',
            spend: parseFloat(metric.spend || 0),
            revenue: parseFloat(metric.revenue || 0), // Use 'revenue' instead of 'total_revenue'
            conversions: parseInt(metric.conversions || 0), // Use 'conversions' instead of 'total_conversions'
            impressions: parseInt(metric.impressions || 0),
            clicks: parseInt(metric.clicks || 0),
            roas: parseFloat(metric.roas || 0),
            cpm: parseFloat(metric.cpm || 0),
            cpc: parseFloat(metric.cpc || 0),
            ctr: parseFloat(metric.ctr || 0),
            platform: metric.channel || metric.platform || 'facebook', // Use 'channel' field from your data
            // CAPI specific metrics
            server_events: parseInt(metric.server_events || 0),
            browser_events: parseInt(metric.browser_events || 0),
            matched_events: parseInt(metric.matched_events || 0),
            match_rate: parseFloat(metric.match_rate || 0)
          })

          // Campaign-level aggregation (using campaign_name as campaign identifier)
          const campaignKey = metric.campaign_name || metric.platform || metric.channel || 'facebook'
          if (!campaignData.has(campaignKey)) {
            campaignData.set(campaignKey, {
              campaign: campaignKey,
              spend: 0,
              revenue: 0,
              conversions: 0,
              impressions: 0,
              clicks: 0,
              roas: 0
            })
          }

          const campaign = campaignData.get(campaignKey)
          campaign.spend += parseFloat(metric.spend || 0)
          campaign.revenue += parseFloat(metric.revenue || 0) // Use 'revenue' instead of 'total_revenue'
          campaign.conversions += parseInt(metric.conversions || 0) // Use 'conversions' instead of 'total_conversions'
          campaign.impressions += parseInt(metric.impressions || 0)
          campaign.clicks += parseInt(metric.clicks || 0)
        } catch (error) {
          console.error('Error processing metric:', error, metric)
        }
      })
    }

    // Calculate averages
    if (metrics && metrics.length > 0) {
      const validROAS = metrics.filter(m => m.roas && m.roas > 0)

      totalMetrics.averageROAS = validROAS.length > 0
        ? validROAS.reduce((sum, m) => sum + parseFloat(m.roas || 0), 0) / validROAS.length
        : (totalMetrics.totalSpend > 0 ? totalMetrics.totalRevenue / totalMetrics.totalSpend : 0)

      // Calculate additional averages
      totalMetrics.averageCPM = totalMetrics.totalImpressions > 0
        ? (totalMetrics.totalSpend / totalMetrics.totalImpressions) * 1000
        : 0

      totalMetrics.averageCPC = totalMetrics.totalClicks > 0
        ? totalMetrics.totalSpend / totalMetrics.totalClicks
        : 0

      totalMetrics.averageCTR = totalMetrics.totalImpressions > 0
        ? (totalMetrics.totalClicks / totalMetrics.totalImpressions) * 100
        : 0
    }

    // Calculate campaign-level metrics
    const campaigns = Array.from(campaignData.values()).map(campaign => ({
      ...campaign,
      roas: campaign.spend > 0 ? campaign.revenue / campaign.spend : 0,
      cpm: campaign.impressions > 0 ? (campaign.spend / campaign.impressions) * 1000 : 0,
      cpc: campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0,
      ctr: campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalMetrics,
        dailyData,
        campaigns,
        dataCount: metrics?.length || 0
      }
    })

  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}