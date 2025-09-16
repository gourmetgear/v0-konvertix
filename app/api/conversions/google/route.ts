import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// Google Ads Conversion API implementation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customerId, 
      conversions, 
      accessToken, 
      developerToken 
    } = body

    // Validate required fields
    if (!customerId || !conversions || !accessToken || !developerToken) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, conversions, accessToken, or developerToken' },
        { status: 400 }
      )
    }

    // Google Ads API endpoint
    const googleAdsApiUrl = `https://googleads.googleapis.com/v14/customers/${customerId}/conversionUploads:upload`

    // Prepare Google Ads API request
    const googleAdsPayload = {
      conversions: conversions.map((conversion: any) => ({
        gclid: conversion.gclid,
        conversionAction: `customers/${customerId}/conversionActions/${conversion.conversionActionId}`,
        conversionDateTime: conversion.conversionDateTime,
        conversionValue: conversion.value ? parseFloat(conversion.value) : undefined,
        currencyCode: conversion.currencyCode || 'USD',
        orderId: conversion.orderId,
        userAgent: conversion.userAgent,
        userIdentifiers: conversion.userIdentifiers ? [{
          hashedEmail: conversion.userIdentifiers.hashedEmail,
          hashedPhoneNumber: conversion.userIdentifiers.hashedPhoneNumber,
          addressInfo: conversion.userIdentifiers.addressInfo
        }] : undefined
      })),
      partialFailureMode: true
    }

    // Make request to Google Ads API
    const response = await fetch(googleAdsApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(googleAdsPayload)
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Google Ads API error:', responseData)
      return NextResponse.json(
        { 
          error: 'Google Ads API request failed', 
          details: responseData,
          status: response.status 
        },
        { status: response.status }
      )
    }

    // Log successful conversion upload
    console.log('Google Ads conversions uploaded successfully:', {
      customerId,
      conversionsCount: conversions.length,
      response: responseData
    })

    return NextResponse.json({
      success: true,
      data: responseData,
      conversionsProcessed: conversions.length
    })

  } catch (error) {
    console.error('Google Ads conversion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve Google Ads conversion actions
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const customerId = url.searchParams.get('customerId')
    const accessToken = url.searchParams.get('accessToken')
    const developerToken = url.searchParams.get('developerToken')

    if (!customerId || !accessToken || !developerToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: customerId, accessToken, or developerToken' },
        { status: 400 }
      )
    }

    // Google Ads API endpoint for conversion actions
    const googleAdsApiUrl = `https://googleads.googleapis.com/v14/customers/${customerId}/conversionActions`

    const response = await fetch(`${googleAdsApiUrl}?query=SELECT conversion_action.id, conversion_action.name, conversion_action.status, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'Content-Type': 'application/json'
      }
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Google Ads API error:', responseData)
      return NextResponse.json(
        { error: 'Failed to fetch conversion actions', details: responseData },
        { status: response.status }
      )
    }

    const conversionActions = responseData.results?.map((result: any) => ({
      id: result.conversionAction.id,
      name: result.conversionAction.name,
      status: result.conversionAction.status,
      type: result.conversionAction.type
    })) || []

    return NextResponse.json({
      success: true,
      conversionActions
    })

  } catch (error) {
    console.error('Google Ads conversion actions fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}