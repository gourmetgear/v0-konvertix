import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    // Check if admin client is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      )
    }

    // Get user ID from request
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    console.log('Fetching capiconfig for user:', userId)

    // First get user's account_id from account_members
    const { data: accountMember, error: accountError } = await supabaseAdmin
      .from('account_members')
      .select('account_id, user_id')
      .eq('user_id', userId)
      .single()

    if (accountError) {
      console.error('Error fetching account member:', accountError)
      return NextResponse.json(
        { error: 'Failed to fetch user account', details: accountError.message },
        { status: 500 }
      )
    }

    if (!accountMember) {
      return NextResponse.json(
        { error: 'No account found for user' },
        { status: 404 }
      )
    }

    // Fetch capiconfig data from Supabase
    const { data: capiConfig, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (configError) {
      console.error('Error fetching capi config:', configError)
      return NextResponse.json(
        { error: 'Database error fetching configuration', details: configError.message },
        { status: 500 }
      )
    }

    if (!capiConfig) {
      console.error('No capi config found for user:', userId)
      return NextResponse.json(
        { error: `CAPI configuration not found for user. Please configure your Facebook Ads connection first.` },
        { status: 404 }
      )
    }

    console.log('Found capi config:', {
      id: capiConfig.id,
      user_id: capiConfig.user_id,
      account_id: capiConfig.account_id,
      pixel_id: capiConfig.pixel_id,
      provider: capiConfig.provider,
      has_ad_account_id: !!capiConfig.ad_account_id,
      has_token: !!capiConfig.token,
      has_access_token: !!capiConfig.access_token
    })

    // Check for token in either 'token' or 'access_token' field
    const authToken = capiConfig.token || capiConfig.access_token

    // Validate that required fields are present
    if (!capiConfig.ad_account_id || !authToken) {
      console.error('Incomplete capi config for user:', userId, {
        has_ad_account_id: !!capiConfig.ad_account_id,
        has_token: !!capiConfig.token,
        has_access_token: !!capiConfig.access_token
      })
      return NextResponse.json(
        {
          error: 'Incomplete Facebook Ads configuration - missing ad_account_id or access token. Please complete your CAPI setup first.',
          missing: {
            ad_account_id: !capiConfig.ad_account_id,
            token: !authToken
          }
        },
        { status: 400 }
      )
    }

    // Prepare data for n8n webhook
    const webhookData = {
      ad_account_id: capiConfig.ad_account_id,
      user_id: accountMember.user_id, // user_id for metrics_daily table (if it has user_id column)
      account_id: accountMember.account_id, // account_id for metrics_daily table
      token: authToken,
      pixel_id: capiConfig.pixel_id,
      provider: capiConfig.provider || 'facebook'
    }

    console.log('Calling n8n webhook with data:', {
      ad_account_id: capiConfig.ad_account_id,
      user_id: accountMember.user_id, // user_id for metrics_daily table
      account_id: accountMember.account_id, // account_id for metrics_daily table
      pixel_id: capiConfig.pixel_id,
      provider: capiConfig.provider,
      token: authToken ? '[REDACTED]' : null
    })

    // Call n8n webhook
    const webhookResponse = await fetch('https://n8n.konvertix.de/webhook/get-campaigns', {
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
        { error: 'Failed to sync campaigns', details: errorText },
        { status: 500 }
      )
    }

    const webhookResult = await webhookResponse.json()
    
    console.log('n8n webhook successful:', webhookResult)

    return NextResponse.json({
      success: true,
      message: 'Campaigns sync initiated successfully',
      data: webhookResult
    })

  } catch (error) {
    console.error('Sync campaigns API error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Internal server error', details: message },
      { status: 500 }
    )
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Sync campaigns API is working',
    timestamp: new Date().toISOString(),
    hasAdmin: !!supabaseAdmin
  })
}
