import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// API endpoint to receive CAPI metrics from n8n workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metrics } = body

    // Validate required fields
    if (!metrics || !metrics.user_id || !metrics.account_id || !metrics.pixel_id) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, account_id, or pixel_id' },
        { status: 400 }
      )
    }

    // Validate authorization (simple API key check)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.N8N_API_KEY}`
    
    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Prepare metrics data for database
    const metricsData = {
      user_id: metrics.user_id,
      account_id: metrics.account_id,
      pixel_id: metrics.pixel_id,
      provider: metrics.provider || 'facebook',
      date_start: metrics.date_start,
      date_stop: metrics.date_stop,
      fetch_date: metrics.fetch_date || new Date().toISOString(),
      events_received: metrics.events_received || 0,
      events_matched: metrics.events_matched || 0,
      match_rate: metrics.match_rate || 0.0000,
      events_pageview: metrics.events_pageview || 0,
      events_purchase: metrics.events_purchase || 0,
      events_lead: metrics.events_lead || 0,
      events_add_to_cart: metrics.events_add_to_cart || 0,
      events_initiate_checkout: metrics.events_initiate_checkout || 0,
      events_complete_registration: metrics.events_complete_registration || 0,
      events_other: metrics.events_other || 0,
      total_revenue: metrics.total_revenue || 0.00,
      total_conversions: metrics.total_conversions || 0,
      cost_per_conversion: metrics.cost_per_conversion || 0.00,
      event_source_quality: metrics.event_source_quality || null,
      server_events_count: metrics.server_events_count || 0,
      browser_events_count: metrics.browser_events_count || 0,
      raw_response: metrics.raw_response || null
    }

    // Upsert metrics data (insert or update if exists for same day)
    const { data, error } = await supabase
      .from('capi_metrics')
      .upsert(metricsData, { 
        onConflict: 'user_id,account_id,pixel_id,date_start,date_stop'
      })
      .select()

    if (error) {
      console.error('Database error saving CAPI metrics:', error)
      return NextResponse.json(
        { error: 'Failed to save metrics', details: error.message },
        { status: 500 }
      )
    }

    console.log('CAPI metrics saved successfully:', {
      pixel_id: metrics.pixel_id,
      date_start: metrics.date_start,
      events_received: metrics.events_received,
      match_rate: metrics.match_rate
    })

    return NextResponse.json({
      success: true,
      message: 'CAPI metrics saved successfully',
      data: data[0]
    })

  } catch (error) {
    console.error('CAPI metrics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve metrics with filtering and aggregation
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const accountId = url.searchParams.get('accountId')
    const pixelId = url.searchParams.get('pixelId')
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

    // Build query
    let query = supabase
      .from('capi_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('date_start', { ascending: false })
      .limit(limit)

    // Apply filters
    if (accountId) query = query.eq('account_id', accountId)
    if (pixelId) query = query.eq('pixel_id', pixelId)
    if (startDate) query = query.gte('date_start', startDate)
    if (endDate) query = query.lte('date_stop', endDate)

    const { data, error } = await query

    if (error) {
      console.error('Database error fetching CAPI metrics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch metrics', details: error.message },
        { status: 500 }
      )
    }

    // Apply aggregation if requested
    let aggregatedData = data
    if (aggregation !== 'day' && data && data.length > 0) {
      aggregatedData = aggregateMetrics(data, aggregation)
    }

    return NextResponse.json({
      success: true,
      data: aggregatedData,
      count: aggregatedData?.length || 0,
      aggregation
    })

  } catch (error) {
    console.error('CAPI metrics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// Helper function to aggregate metrics by time period
function aggregateMetrics(data: any[], period: 'week' | 'month') {
  const grouped = data.reduce((acc, metric) => {
    const date = new Date(metric.date_start)
    let key: string

    if (period === 'week') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
      key = weekStart.toISOString().split('T')[0]
    } else { // month
      key = date.toISOString().slice(0, 7) // YYYY-MM
    }

    if (!acc[key]) {
      acc[key] = {
        period_start: key,
        period_type: period,
        user_id: metric.user_id,
        account_id: metric.account_id,
        pixel_id: metric.pixel_id,
        provider: metric.provider,
        events_received: 0,
        events_matched: 0,
        events_pageview: 0,
        events_purchase: 0,
        events_lead: 0,
        events_add_to_cart: 0,
        events_initiate_checkout: 0,
        events_complete_registration: 0,
        events_other: 0,
        total_revenue: 0,
        total_conversions: 0,
        server_events_count: 0,
        browser_events_count: 0,
        days_count: 0,
        last_fetch_date: metric.fetch_date
      }
    }

    // Aggregate numeric values
    acc[key].events_received += metric.events_received || 0
    acc[key].events_matched += metric.events_matched || 0
    acc[key].events_pageview += metric.events_pageview || 0
    acc[key].events_purchase += metric.events_purchase || 0
    acc[key].events_lead += metric.events_lead || 0
    acc[key].events_add_to_cart += metric.events_add_to_cart || 0
    acc[key].events_initiate_checkout += metric.events_initiate_checkout || 0
    acc[key].events_complete_registration += metric.events_complete_registration || 0
    acc[key].events_other += metric.events_other || 0
    acc[key].total_revenue += parseFloat(metric.total_revenue) || 0
    acc[key].total_conversions += metric.total_conversions || 0
    acc[key].server_events_count += metric.server_events_count || 0
    acc[key].browser_events_count += metric.browser_events_count || 0
    acc[key].days_count += 1

    // Keep most recent fetch date
    if (new Date(metric.fetch_date) > new Date(acc[key].last_fetch_date)) {
      acc[key].last_fetch_date = metric.fetch_date
    }

    return acc
  }, {} as any)

  // Calculate average match rate for each period
  return Object.values(grouped).map((period: any) => ({
    ...period,
    match_rate: period.events_received > 0 
      ? (period.events_matched / period.events_received)
      : 0,
    cost_per_conversion: period.total_conversions > 0
      ? (0 / period.total_conversions) // Would need ad spend data
      : 0
  }))
}