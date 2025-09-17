import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      )
    }

    const analysis = await request.json()

    // Validate required fields
    if (!analysis || !analysis.account_id || !analysis.title) {
      return NextResponse.json(
        { error: 'Missing required fields: account_id and title are required' },
        { status: 400 }
      )
    }

    // Get user_id from account_id (you may need to adjust this logic based on your setup)
    let userId = analysis.user_id || analysis.account_id

    // Try to get proper user_id from account_members if needed
    if (!analysis.user_id) {
      const { data: accountMember } = await supabaseAdmin
        .from('account_members')
        .select('user_id')
        .eq('account_id', analysis.account_id)
        .single()

      if (accountMember) {
        userId = accountMember.user_id
      }
    }

    // Insert analysis data
    const { data, error } = await supabaseAdmin
      .from('campaign_analysis')
      .insert({
        account_id: analysis.account_id,
        user_id: userId,
        analysis_type: analysis.analysis_type || 'campaign_performance',
        title: analysis.title,
        summary: analysis.summary,
        detailed_analysis: analysis.detailed_analysis || {},
        insights: analysis.insights || [],
        recommendations: analysis.recommendations || [],
        metrics: analysis.metrics || {},
        campaign_ids: analysis.campaign_ids || [],
        date_range_start: analysis.date_range_start,
        date_range_end: analysis.date_range_end,
        confidence_score: analysis.confidence_score || 0.8,
        status: analysis.status || 'completed',
        generated_by: analysis.generated_by || 'n8n_analysis'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving campaign analysis:', error)
      return NextResponse.json(
        { error: 'Failed to save analysis', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      analysis: data,
      message: 'Campaign analysis saved successfully'
    })

  } catch (error) {
    console.error('Error in campaign analysis API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      )
    }

    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const accountId = url.searchParams.get('accountId')
    const analysisType = url.searchParams.get('type')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    if (!userId && !accountId) {
      return NextResponse.json(
        { error: 'Either userId or accountId is required' },
        { status: 400 }
      )
    }

    let query = supabaseAdmin
      .from('campaign_analysis')
      .select('*')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (accountId) {
      query = query.eq('account_id', accountId)
    }

    if (analysisType) {
      query = query.eq('analysis_type', analysisType)
    }

    const { data: analyses, error } = await query

    if (error) {
      console.error('Error fetching campaign analyses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analyses', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      analyses: analyses || [],
      count: analyses?.length || 0
    })

  } catch (error) {
    console.error('Error in campaign analysis GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}