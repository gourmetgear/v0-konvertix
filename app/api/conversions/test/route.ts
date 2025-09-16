import { NextRequest, NextResponse } from 'next/server'
import { ConversionService, createConversionEvent } from '@/lib/services/conversionService'

// Test endpoint for conversion APIs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, accountId, provider, testType = 'pageview' } = body

    if (!userId || !accountId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId or accountId' },
        { status: 400 }
      )
    }

    // Get configuration
    const config = await ConversionService.getCapiConfig(userId, accountId)
    
    if (!config) {
      return NextResponse.json(
        { error: 'No CAPI configuration found for this account' },
        { status: 404 }
      )
    }

    // Create test event based on provider and test type
    let testEvents = []
    
    if (testType === 'pageview') {
      testEvents.push(createConversionEvent(
        'PageView',
        {
          email: 'test@example.com',
          clientUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          clientIpAddress: '192.168.1.1'
        },
        {},
        config.domain || 'https://example.com'
      ))
    } else if (testType === 'purchase') {
      testEvents.push(createConversionEvent(
        config.provider === 'google' ? 'purchase' : 'Purchase',
        {
          email: 'customer@example.com',
          firstName: 'Test',
          lastName: 'Customer',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'US',
          clientUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          clientIpAddress: '192.168.1.1'
        },
        {
          currency: 'USD',
          value: 99.99,
          orderId: `test-order-${Date.now()}`,
          contentName: 'Test Product',
          contentCategory: 'Electronics',
          numItems: 1
        },
        config.domain || 'https://example.com'
      ))
    } else if (testType === 'lead') {
      testEvents.push(createConversionEvent(
        config.provider === 'google' ? 'sign_up' : 'Lead',
        {
          email: 'lead@example.com',
          firstName: 'Test',
          lastName: 'Lead',
          clientUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          clientIpAddress: '192.168.1.1'
        },
        {
          currency: 'USD',
          value: 10.00
        },
        config.domain || 'https://example.com'
      ))
    }

    // Send test conversions
    const result = await ConversionService.sendConversions(userId, accountId, testEvents)

    if (!result.success) {
      return NextResponse.json(
        { 
          error: `Test ${testType} conversion failed`, 
          details: result.error,
          provider: config.provider 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Test ${testType} conversion sent successfully`,
      provider: config.provider,
      accountId,
      testType,
      eventsCount: testEvents.length,
      data: result.data
    })

  } catch (error) {
    console.error('Test conversion error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint for connection validation
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const provider = url.searchParams.get('provider') as 'facebook' | 'google'
    const pixelId = url.searchParams.get('pixelId')
    const customerId = url.searchParams.get('customerId')
    const accessToken = url.searchParams.get('accessToken')
    const developerToken = url.searchParams.get('developerToken')

    if (!provider) {
      return NextResponse.json(
        { error: 'Missing required parameter: provider' },
        { status: 400 }
      )
    }

    let result

    if (provider === 'facebook') {
      if (!pixelId || !accessToken) {
        return NextResponse.json(
          { error: 'Facebook validation requires pixelId and accessToken' },
          { status: 400 }
        )
      }
      
      result = await ConversionService.validateFacebookPixel(pixelId, accessToken)
    } else if (provider === 'google') {
      if (!customerId || !accessToken || !developerToken) {
        return NextResponse.json(
          { error: 'Google validation requires customerId, accessToken, and developerToken' },
          { status: 400 }
        )
      }
      
      result = await ConversionService.getGoogleConversionActions(customerId, accessToken, developerToken)
    } else {
      return NextResponse.json(
        { error: 'Unsupported provider. Use "facebook" or "google"' },
        { status: 400 }
      )
    }

    if (!result.success) {
      return NextResponse.json(
        { error: `${provider} validation failed`, details: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      provider,
      message: `${provider} connection validated successfully`,
      data: result.data
    })

  } catch (error) {
    console.error('Connection validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}