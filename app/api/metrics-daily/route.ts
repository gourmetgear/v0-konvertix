import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// API endpoint for daily metrics (comprehensive Facebook Ads + CAPI data)
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
    const accountId = url.searchParams.get('accountId')
    const pixelId = url.searchParams.get('pixelId')
    const platform = url.searchParams.get('platform') || 'facebook'
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const aggregation = url.searchParams.get('aggregation') || 'day' // day, week, month
    const limit = parseInt(url.searchParams.get('limit') || '30')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      )
    }

    // First, get user's account_id from account_members table
    const { data: accountMembers, error: accountError } = await supabaseAdmin
      .from('account_members')
      .select('account_id')
      .eq('user_id', userId)

    if (accountError) {
      console.error('Error fetching account:', accountError)
      return NextResponse.json(
        { error: 'Failed to fetch account information', details: accountError.message },
        { status: 500 }
      )
    }

    if (!accountMembers || accountMembers.length === 0) {
      return NextResponse.json(
        { error: 'No account found for user' },
        { status: 404 }
      )
    }

    const userAccountId = accountMembers[0].account_id

    let data
    let query

    // Query metrics_daily table using account_id instead of user_id
    // The table structure only supports daily aggregation for now
    query = supabaseAdmin
      .from('metrics_daily')
      .select('*')
      .eq('account_id', userAccountId)
      .order('date', { ascending: false })
      .limit(limit)

    if (startDate) query = query.gte('date', startDate)
    if (endDate) query = query.lte('date', endDate)

    const { data: metricsData, error } = await query

    if (error) {
      console.error('Database error fetching daily metrics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch metrics', details: error.message },
        { status: 500 }
      )
    }

    // Calculate summary statistics
    const summary = calculateSummary(metricsData || [])

    return NextResponse.json({
      success: true,
      data: metricsData || [],
      summary,
      count: metricsData?.length || 0,
      aggregation,
      platform,
      accountId: userAccountId
    })

  } catch (error) {
    console.error('Daily metrics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// POST endpoint to create test data
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { userId, testData = false } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's account_id
    const { data: accountMembers, error: accountError } = await supabaseAdmin
      .from('account_members')
      .select('account_id')
      .eq('user_id', userId)

    if (accountError || !accountMembers?.[0]) {
      return NextResponse.json(
        { error: 'Failed to fetch user account' },
        { status: 500 }
      )
    }

    const accountId = accountMembers[0].account_id

    // Create test data if requested
    if (testData) {
      const testMetrics = []
      const today = new Date()

      // Generate 7 days of test data
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        const impressions = Math.floor(Math.random() * 50000) + 10000
        const clicks = Math.floor(Math.random() * 2000) + 500
        const spend = parseFloat((Math.random() * 500 + 100).toFixed(2))
        const revenue = parseFloat((Math.random() * 1000 + 200).toFixed(2))
        const serverEvents = Math.floor(Math.random() * 1000) + 200
        const matchedEvents = Math.floor(Math.random() * 600) + 100

        testMetrics.push({
          user_id: userId,
          account_id: accountId,
          date: date.toISOString().split('T')[0],
          platform: 'facebook',
          impressions,
          clicks,
          spend,
          total_revenue: revenue,
          total_conversions: Math.floor(Math.random() * 50) + 10,
          purchase_conversions: Math.floor(Math.random() * 30) + 5,
          server_events: serverEvents,
          browser_events: Math.floor(Math.random() * 800) + 150,
          matched_events: matchedEvents,
          match_rate: matchedEvents / serverEvents,
          cpm: (spend / impressions) * 1000,
          cpc: spend / clicks,
          ctr: (clicks / impressions),
          roas: revenue / spend
        })
      }

      // Insert test data
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('metrics_daily')
        .upsert(testMetrics, {
          onConflict: 'date,user_id,account_id,platform',
          ignoreDuplicates: false
        })
        .select()

      if (insertError) {
        console.error('Error inserting test data:', insertError)
        return NextResponse.json(
          { error: 'Failed to create test data', details: insertError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Test data created successfully',
        data: inserted,
        count: inserted?.length || 0
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Use { "testData": true } in POST body to generate test data'
    })

  } catch (error) {
    console.error('Metrics POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// Helper function to calculate summary statistics
// Based on comprehensive metrics_daily schema
function calculateSummary(data: any[]) {
  if (data.length === 0) {
    return {
      totalSpend: 0,
      totalRevenue: 0,
      totalConversions: 0,
      totalImpressions: 0,
      totalClicks: 0,
      averageRoas: 0,
      averageCpm: 0,
      averageCpc: 0,
      averageCtr: 0,
      totalServerEvents: 0,
      totalMatchedEvents: 0,
      averageMatchRate: 0,
      totalDays: 0,
      platforms: []
    }
  }

  const totals = data.reduce((acc, metric) => ({
    totalSpend: acc.totalSpend + (parseFloat(metric.spend) || 0),
    totalRevenue: acc.totalRevenue + (parseFloat(metric.total_revenue) || 0),
    totalConversions: acc.totalConversions + (parseInt(metric.total_conversions) || 0),
    totalImpressions: acc.totalImpressions + (parseInt(metric.impressions) || 0),
    totalClicks: acc.totalClicks + (parseInt(metric.clicks) || 0),
    totalServerEvents: acc.totalServerEvents + (parseInt(metric.server_events) || 0),
    totalMatchedEvents: acc.totalMatchedEvents + (parseInt(metric.matched_events) || 0)
  }), {
    totalSpend: 0,
    totalRevenue: 0,
    totalConversions: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalServerEvents: 0,
    totalMatchedEvents: 0
  })

  // Get unique platforms
  const platforms = [...new Set(data.map(metric => metric.platform).filter(Boolean))]

  return {
    ...totals,
    averageRoas: totals.totalSpend > 0 ? (totals.totalRevenue / totals.totalSpend) : 0,
    averageCpm: totals.totalImpressions > 0 ? (totals.totalSpend / totals.totalImpressions) * 1000 : 0,
    averageCpc: totals.totalClicks > 0 ? (totals.totalSpend / totals.totalClicks) : 0,
    averageCtr: totals.totalImpressions > 0 ? (totals.totalClicks / totals.totalImpressions) * 100 : 0,
    averageMatchRate: totals.totalServerEvents > 0 ? (totals.totalMatchedEvents / totals.totalServerEvents) * 100 : 0,
    costPerConversion: totals.totalConversions > 0 ? (totals.totalSpend / totals.totalConversions) : 0,
    totalDays: data.length,
    platforms
  }
}