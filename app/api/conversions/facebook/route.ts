import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import crypto from 'crypto'

// Facebook Conversions API implementation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      pixelId, 
      accessToken, 
      events, 
      testEventCode,
      domain 
    } = body

    // Validate required fields
    if (!pixelId || !accessToken || !events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Missing required fields: pixelId, accessToken, or events array' },
        { status: 400 }
      )
    }

    // Facebook Conversions API endpoint
    const facebookApiUrl = `https://graph.facebook.com/v18.0/${pixelId}/events`

    // Prepare Facebook API request
    const facebookPayload = {
      data: events.map((event: any) => ({
        event_name: event.eventName,
        event_time: event.eventTime || Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: event.eventSourceUrl || domain,
        user_data: {
          em: event.userData?.email ? [crypto.createHash('sha256').update(event.userData.email.toLowerCase()).digest('hex')] : undefined,
          ph: event.userData?.phone ? [crypto.createHash('sha256').update(event.userData.phone.replace(/\D/g, '')).digest('hex')] : undefined,
          fn: event.userData?.firstName ? [crypto.createHash('sha256').update(event.userData.firstName.toLowerCase()).digest('hex')] : undefined,
          ln: event.userData?.lastName ? [crypto.createHash('sha256').update(event.userData.lastName.toLowerCase()).digest('hex')] : undefined,
          ct: event.userData?.city ? [crypto.createHash('sha256').update(event.userData.city.toLowerCase()).digest('hex')] : undefined,
          st: event.userData?.state ? [crypto.createHash('sha256').update(event.userData.state.toLowerCase()).digest('hex')] : undefined,
          zp: event.userData?.zip ? [crypto.createHash('sha256').update(event.userData.zip.replace(/\D/g, '')).digest('hex')] : undefined,
          country: event.userData?.country ? [crypto.createHash('sha256').update(event.userData.country.toLowerCase()).digest('hex')] : undefined,
          client_ip_address: event.userData?.clientIpAddress,
          client_user_agent: event.userData?.clientUserAgent,
          fbc: event.userData?.fbc, // Facebook click ID
          fbp: event.userData?.fbp  // Facebook browser ID
        },
        custom_data: {
          currency: event.customData?.currency || 'USD',
          value: event.customData?.value ? parseFloat(event.customData.value) : undefined,
          order_id: event.customData?.orderId,
          content_name: event.customData?.contentName,
          content_category: event.customData?.contentCategory,
          content_ids: event.customData?.contentIds,
          content_type: event.customData?.contentType,
          num_items: event.customData?.numItems,
          search_string: event.customData?.searchString,
          status: event.customData?.status
        }
      })),
      access_token: accessToken,
      ...(testEventCode && { test_event_code: testEventCode })
    }

    // Remove undefined values from user_data and custom_data
    facebookPayload.data.forEach((event: any) => {
      Object.keys(event.user_data).forEach(key => {
        if (event.user_data[key] === undefined) {
          delete event.user_data[key]
        }
      })
      Object.keys(event.custom_data).forEach(key => {
        if (event.custom_data[key] === undefined) {
          delete event.custom_data[key]
        }
      })
    })

    // Make request to Facebook Conversions API
    const response = await fetch(facebookApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(facebookPayload)
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Facebook Conversions API error:', responseData)
      return NextResponse.json(
        { 
          error: 'Facebook Conversions API request failed', 
          details: responseData,
          status: response.status 
        },
        { status: response.status }
      )
    }

    // Log successful conversion upload
    console.log('Facebook conversions uploaded successfully:', {
      pixelId,
      eventsCount: events.length,
      response: responseData
    })

    return NextResponse.json({
      success: true,
      data: responseData,
      eventsProcessed: events.length,
      fbtrace_id: responseData.fbtrace_id
    })

  } catch (error) {
    console.error('Facebook Conversions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint to test pixel connection
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pixelId = url.searchParams.get('pixelId')
    const accessToken = url.searchParams.get('accessToken')

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: pixelId or accessToken' },
        { status: 400 }
      )
    }

    // Facebook Graph API endpoint for pixel validation
    const facebookApiUrl = `https://graph.facebook.com/v18.0/${pixelId}?access_token=${accessToken}&fields=id,name,creation_time,last_fired_time`

    const response = await fetch(facebookApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Facebook pixel validation error:', responseData)
      return NextResponse.json(
        { error: 'Failed to validate pixel', details: responseData },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      pixel: responseData
    })

  } catch (error) {
    console.error('Facebook pixel validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}