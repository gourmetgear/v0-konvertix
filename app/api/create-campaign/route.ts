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

    // Parse request body
    const body = await request.json()
    const {
      name,
      objective,
      status,
      special_ad_categories = [],
      userId
    } = body

    // Validate required fields
    if (!name || !objective || !userId) {
      return NextResponse.json(
        { error: 'Name, objective, and userId are required' },
        { status: 400 }
      )
    }

    // Get user's capiconfig for ad_account_id and token
    const { data: capiConfig, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('ad_account_id, token, pixel_id')
      .eq('user_id', userId)
      .eq('provider', 'facebook')
      .single()

    if (configError || !capiConfig) {
      return NextResponse.json(
        { error: 'Facebook CAPI configuration not found. Please configure your Facebook settings first.' },
        { status: 400 }
      )
    }

    // Prepare data for n8n webhook
    const webhookData = {
      name,
      objective,
      status: status || 'PAUSED', // Facebook default
      special_ad_categories,
      ad_account_id: capiConfig.ad_account_id,
      token: capiConfig.token,
      user_id: userId // Include for tracking
    }

    console.log('API received data:', { name, objective, status, special_ad_categories, userId })
    console.log('Sending to webhook:', webhookData)

    // Call n8n webhook
    const webhookUrl = 'https://n8n.konvertix.de/webhook/create-campaign'

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    })

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('n8n webhook error:', errorText)
      return NextResponse.json(
        { error: 'Failed to create campaign via Facebook API', details: errorText },
        { status: 500 }
      )
    }

    const webhookResult = await webhookResponse.json()

    // TODO: Store campaign in database after running the campaigns table schema
    // For now, skip database save and return success
    console.log('Campaign created successfully on Facebook:', webhookResult)

    // Temporary disable database save for testing
    /*
    const { data: campaign, error: dbError } = await supabaseAdmin
      .from('campaigns')
      .insert({
        name,
        platform: 'facebook',
        objective,
        status,
        facebook_campaign_id: webhookResult.campaign_id,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Campaign created on Facebook but failed to save to database', facebook_data: webhookResult },
        { status: 500 }
      )
    }
    */

    return NextResponse.json({
      success: true,
      message: 'Campaign created successfully on Facebook',
      campaignName: name,
      facebook_data: webhookResult
    })

  } catch (error) {
    console.error('Campaign creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}