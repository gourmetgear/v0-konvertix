import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      campaign_id,
      daily_budget,
      billing_event = 'IMPRESSIONS',
      optimization_goal = 'OFFSITE_CONVERSIONS',
      bid_strategy = 'LOWEST_COST_WITHOUT_CAP',
      destination_type = 'WEBSITE',
      custom_event_type = 'PURCHASE',
      countries = ['DE'],
      publisher_platforms = ['facebook', 'instagram'],
      facebook_positions = ['feed'],
      instagram_positions = ['stream'],
      click_window_days = 7,
      view_window_days = 1,
      dsa_beneficiary = 'CamperBanner',
      dsa_payor = 'CamperBanner',
      status = 'PAUSED',
      userId
    } = body

    console.log('Ad set creation request:', { name, campaign_id, userId })

    // Validate required fields
    if (!name || !daily_budget || !userId || !campaign_id) {
      return NextResponse.json(
        { error: 'Name, daily_budget, userId and campaign_id (campaign_name) are required' },
        { status: 400 }
      )
    }

    // Get user's capiconfig for pixel_id and access_token
    const { data: capiConfig, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('pixel_id, token, ad_account_id')
      .eq('user_id', userId)
      .eq('provider', 'facebook')
      .single()

    if (configError || !capiConfig) {
      return NextResponse.json(
        { error: 'Facebook CAPI configuration not found. Please configure your Facebook settings first.' },
        { status: 400 }
      )
    }

    console.log('Looking up campaign in metrics_daily by name:', campaign_id)

    // Get user's CAPI config first to obtain ad_account_id for correct metrics_daily scoping
    const { data: capiConfig, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('pixel_id, token, ad_account_id')
      .eq('user_id', userId)
      .eq('provider', 'facebook')
      .single()

    if (configError || !capiConfig) {
      return NextResponse.json(
        { error: 'Facebook CAPI configuration not found. Please configure your Facebook settings first.' },
        { status: 400 }
      )
    }

    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('metrics_daily')
      .select('campaign_id, campaign_name')
      .eq('campaign_name', campaign_id)
      .eq('account_id', capiConfig.ad_account_id)
      .not('campaign_id', 'is', null)
      .single()

    if (campaignError || !campaign || !campaign.campaign_id) {
      console.log('Campaign lookup failed:', { campaignError, campaign, campaign_id, userId, ad_account_id: capiConfig.ad_account_id })
      return NextResponse.json(
        { error: `Campaign "${campaign_id}" not found or missing Facebook campaign ID` },
        { status: 400 }
      )
    }

    console.log('Found campaign:', { campaign_name: campaign.campaign_name, campaign_id: campaign.campaign_id })
    const facebookCampaignId = campaign.campaign_id

    // Prepare data for n8n webhook
    const webhookData = {
      name,
      campaign_id: facebookCampaignId as string,
      daily_budget: Number(daily_budget) * 100,
      billing_event,
      optimization_goal,
      bid_strategy,
      destination_type,
      promoted_object: {
        pixel_id: capiConfig.pixel_id,
        custom_event_type
      },
      targeting: {
        geo_locations: { countries },
        publisher_platforms,
        facebook_positions,
        instagram_positions
      },
      attribution_spec: [
        { event_type: "CLICK_THROUGH", window_days: click_window_days },
        { event_type: "VIEW_THROUGH", window_days: view_window_days }
      ],
      status,
      dsa_beneficiary,
      dsa_payor,
      ad_account_id: capiConfig.ad_account_id,
      access_token: capiConfig.token
    }

    console.log('API received adset data:', { name, campaign_id, daily_budget, userId })
    console.log('Campaign lookup result:', {
      searchedName: campaign_id,
      foundCampaign: campaign.campaign_name,
      facebookCampaignId: campaign.campaign_id
    })
    console.log('Sending to webhook:', webhookData)

    // Call n8n webhook
    const webhookUrl = 'https://n8n.konvertix.de/webhook/create-adset'

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    })

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      return NextResponse.json(
        { error: 'Failed to create ad set via Facebook API', details: errorText },
        { status: 500 }
      )
    }

    const webhookResult = await webhookResponse.json()

    // TODO: Store ad set in database after running the ad_sets table schema
    // For now, skip database save and return success
    console.log('Ad set created successfully on Facebook:', webhookResult)

    return NextResponse.json({
      success: true,
      message: 'Ad set created successfully on Facebook',
      facebook_data: webhookResult
    })

  } catch (error) {
    console.error('Ad set creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
