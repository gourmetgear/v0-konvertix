import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Syncing products for userId:', userId)

    // Get WooCommerce credentials from capiconfig table
    const { data: wooConfig, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('consumer_key, consumer_secret, url')
      .eq('user_id', userId)
      .eq('account_id', 'woocommerce-store')
      .single()

    if (configError || !wooConfig) {
      console.error('WooCommerce config error:', configError)
      return NextResponse.json(
        { error: 'WooCommerce configuration not found. Please configure your WooCommerce settings first.' },
        { status: 404 }
      )
    }

    console.log('✅ WooCommerce config found:', {
      url: wooConfig.url,
      consumer_key: wooConfig.consumer_key ? '***' : 'missing',
      consumer_secret: wooConfig.consumer_secret ? '***' : 'missing'
    })

    // Prepare payload for n8n webhook
    const webhookPayload = {
      consumer_key: wooConfig.consumer_key,
      consumer_secret: wooConfig.consumer_secret,
      store_url: wooConfig.url,
      userId: userId
    }

    console.log('📤 Sending sync request to n8n webhook...')

    // Call n8n webhook
    const webhookResponse = await fetch('https://n8n.konvertix.de/webhook/get-products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    })

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('n8n webhook error:', errorText)
      throw new Error(`Webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`)
    }

    const webhookResult = await webhookResponse.json()
    console.log('✅ n8n webhook response:', webhookResult)

    return NextResponse.json({
      success: true,
      message: 'Products sync initiated successfully',
      data: webhookResult
    })

  } catch (error) {
    console.error('Sync products error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync products' },
      { status: 500 }
    )
  }
}