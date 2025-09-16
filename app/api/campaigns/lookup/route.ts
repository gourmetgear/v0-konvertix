import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignName, userId } = body

    if (!campaignName || !userId) {
      return NextResponse.json(
        { error: 'Campaign name and userId are required' },
        { status: 400 }
      )
    }

    // Look up the campaign by name and user_id
    const { data: campaign, error } = await supabaseAdmin
      .from('campaigns')
      .select('facebook_campaign_id, id, name')
      .eq('name', campaignName)
      .eq('user_id', userId)
      .single()

    if (error || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      campaign_id: campaign.facebook_campaign_id,
      internal_id: campaign.id,
      name: campaign.name
    })

  } catch (error) {
    console.error('Campaign lookup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const campaignName = searchParams.get('name')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    let query = supabaseAdmin
      .from('campaigns')
      .select('facebook_campaign_id, id, name, status, objective')
      .eq('user_id', userId)

    // If campaign name is provided, filter by name
    if (campaignName) {
      query = query.eq('name', campaignName)
    }

    const { data: campaigns, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      campaigns: campaigns || []
    })

  } catch (error) {
    console.error('Campaign lookup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}