import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { ConversionService, ConversionEvent } from '@/lib/services/conversionService'

// Unified conversion endpoint that handles both Facebook and Google Ads
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId, events, userId } = body

    // Validate required fields
    if (!accountId || !events || !Array.isArray(events) || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: accountId, events (array), or userId' },
        { status: 400 }
      )
    }

    // Send conversions using the unified service
    const result = await ConversionService.sendConversions(userId, accountId, events)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Conversions sent successfully'
    })

  } catch (error) {
    console.error('Unified conversion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve CAPI configuration for an account
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const accountId = url.searchParams.get('accountId')

    if (!userId || !accountId) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId or accountId' },
        { status: 400 }
      )
    }

    const config = await ConversionService.getCapiConfig(userId, accountId)

    if (!config) {
      return NextResponse.json(
        { error: 'No CAPI configuration found for this account' },
        { status: 404 }
      )
    }

    // Remove sensitive data from response
    const safeConfig = {
      provider: config.provider,
      accountId: config.accountId,
      pixelId: config.pixelId,
      customerId: config.customerId,
      domain: config.domain,
      events: config.events,
      conversionActions: config.conversionActions,
      hasAccessToken: !!config.accessToken,
      hasTestEventCode: !!config.testEventCode,
      hasDeveloperToken: !!config.developerToken
    }

    return NextResponse.json({
      success: true,
      config: safeConfig
    })

  } catch (error) {
    console.error('CAPI config fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// PUT endpoint to update CAPI configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      accountId, 
      provider, 
      pixelId, 
      customerId, 
      accessToken, 
      domain, 
      events, 
      testEventCode, 
      developerToken, 
      refreshToken, 
      conversionActions 
    } = body

    // Validate required fields
    if (!userId || !accountId || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, accountId, or provider' },
        { status: 400 }
      )
    }

    // Prepare payload for database
    const payload: any = {
      user_id: userId,
      account_id: accountId,
      provider,
      domain: domain || null,
      events: events || null,
      updated_at: new Date().toISOString()
    }

    // Add provider-specific fields
    if (provider === 'facebook') {
      if (!pixelId || !accessToken) {
        return NextResponse.json(
          { error: 'Facebook provider requires pixelId and accessToken' },
          { status: 400 }
        )
      }
      payload.pixel_id = pixelId
      payload.access_token = accessToken
      payload.test_event_code = testEventCode || null
    } else if (provider === 'google') {
      if (!customerId || !accessToken || !developerToken) {
        return NextResponse.json(
          { error: 'Google provider requires customerId, accessToken, and developerToken' },
          { status: 400 }
        )
      }
      // Map to existing schema fields for backward compatibility
      payload.pixel_id = customerId // Store Google customer ID in pixel_id field
      payload.access_token = accessToken
      payload.test_event_code = developerToken // Store developer token in test_event_code field
      
      // Use new fields if available
      if (customerId) payload.customer_id = customerId
      if (developerToken) payload.developer_token = developerToken
      if (refreshToken) payload.refresh_token = refreshToken
      if (conversionActions) payload.conversion_actions = conversionActions
    }

    // Upsert CAPI configuration
    const { data, error } = await supabase
      .from('capiconfig')
      .upsert(payload, { onConflict: 'user_id,account_id' })
      .select()

    if (error) {
      console.error('Database upsert error:', error)
      return NextResponse.json(
        { error: 'Failed to save CAPI configuration', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'CAPI configuration saved successfully',
      data: data[0]
    })

  } catch (error) {
    console.error('CAPI config update error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove CAPI configuration
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const accountId = url.searchParams.get('accountId')

    if (!userId || !accountId) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId or accountId' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('capiconfig')
      .delete()
      .eq('user_id', userId)
      .eq('account_id', accountId)

    if (error) {
      console.error('Database delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete CAPI configuration', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'CAPI configuration deleted successfully'
    })

  } catch (error) {
    console.error('CAPI config delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}