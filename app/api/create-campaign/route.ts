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
    console.log('Looking for CAPI config for userId:', userId)

    const { data: capiConfigs, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('ad_account_id, token, pixel_id')
      .eq('user_id', userId)
      .eq('provider', 'facebook')
      .not('ad_account_id', 'is', null)
      .not('ad_account_id', 'eq', '')
      .not('token', 'is', null)
      .not('token', 'eq', '')

    console.log('CAPI config query results:', { capiConfigs, configError, count: capiConfigs?.length })

    if (configError || !capiConfigs || capiConfigs.length === 0) {
      console.log('CAPI config error:', configError)
      console.log('Available configs:', capiConfigs)

      // Get all configs for this user to debug
      const { data: allConfigs } = await supabaseAdmin
        .from('capiconfig')
        .select('*')
        .eq('user_id', userId)

      console.log('All user configs for debugging:', allConfigs)

      return NextResponse.json(
        { error: 'Facebook CAPI configuration not found. Please configure your Facebook settings first.' },
        { status: 400 }
      )
    }

    // Use the first valid configuration
    const capiConfig = capiConfigs[0]
    console.log('Selected CAPI config:', {
      ad_account_id: capiConfig.ad_account_id,
      pixel_id: capiConfig.pixel_id,
      token_length: capiConfig.token?.length || 0
    })

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
      console.error('n8n webhook error:', {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        errorText,
        sentData: webhookData
      })
      return NextResponse.json(
        {
          error: 'Failed to create campaign via Facebook API',
          details: errorText,
          status: webhookResponse.status,
          sentData: webhookData
        },
        { status: 500 }
      )
    }

    const webhookResult = await webhookResponse.json()

    // TODO: Store campaign in database after running the campaigns table schema
    // For now, skip database save and return success
    console.log('Campaign created successfully on Facebook:', webhookResult)

    // Automatically sync campaigns after successful creation and wait for completion
    let syncSuccessful = false
    try {
      console.log('Triggering campaign sync after successful creation...')

      const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sync-campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })

      if (syncResponse.ok) {
        const syncResult = await syncResponse.json()
        console.log('Campaign sync triggered successfully:', syncResult)
        syncSuccessful = true

        // Wait a moment for the sync to process
        await new Promise(resolve => setTimeout(resolve, 2000))
      } else {
        const syncError = await syncResponse.text()
        console.warn('Campaign sync failed but campaign was created:', syncError)
      }
    } catch (syncError) {
      console.warn('Failed to trigger campaign sync, but campaign was created:', syncError)
    }

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
      message: syncSuccessful
        ? 'Campaign created and synced successfully'
        : 'Campaign created successfully (sync pending)',
      campaignName: name,
      facebook_campaign_id: webhookResult.id || webhookResult.campaign_id,
      facebook_data: webhookResult,
      sync_completed: syncSuccessful
    })

  } catch (error) {
    console.error('Campaign creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}