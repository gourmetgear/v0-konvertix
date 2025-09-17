import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface ProductData {
  name: string
  type: string
  regular_price: string
  sku: string
  description: string
  short_description: string
  manage_stock: boolean
  stock_quantity: number
  categories: { id: number }[]
  images: { src: string }[]
  userId: string
}

interface WooCommerceConfig {
  consumer_key: string
  consumer_secret: string
  url: string
}

export async function POST(request: NextRequest) {
  try {
    const productData: ProductData = await request.json()
    const { userId, ...woocommerceProduct } = productData

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      )
    }

    // Debug: Log the userId being searched
    console.log('🔍 Searching for WooCommerce config with userId:', userId)

    // First, let's see what's in the capiconfig table for this user
    const { data: allConfigs, error: allConfigsError } = await supabaseAdmin
      .from('capiconfig')
      .select('*')
      .eq('user_id', userId)

    console.log('📊 All capiconfig entries for user:', allConfigs)
    console.log('❌ Error fetching all configs:', allConfigsError)

    // Now try the specific query
    const { data: config, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('consumer_key, consumer_secret, url, account_id, provider')
      .eq('user_id', userId)
      .eq('account_id', 'woocommerce-store')
      .single()

    console.log('🎯 WooCommerce config query result:', config)
    console.log('❌ WooCommerce config error:', configError)

    if (configError || !config) {
      console.log('🚨 WooCommerce config not found. Error details:', configError)
      return NextResponse.json(
        {
          error: 'WooCommerce configuration not found. Please configure your WooCommerce settings first.',
          debug: {
            userId: userId,
            allConfigs: allConfigs,
            configError: configError,
            searchCriteria: { user_id: userId, account_id: 'woocommerce-store' }
          }
        },
        { status: 404 }
      )
    }

    const wooConfig: WooCommerceConfig = {
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      url: config.url
    }

    if (!wooConfig.consumer_key || !wooConfig.consumer_secret || !wooConfig.url) {
      return NextResponse.json(
        { error: 'Incomplete WooCommerce configuration. Please check your settings.' },
        { status: 400 }
      )
    }

    // Create payload for n8n webhook with WooCommerce credentials
    const n8nPayload = {
      ...woocommerceProduct,
      woocommerce_config: {
        consumer_key: wooConfig.consumer_key,
        consumer_secret: wooConfig.consumer_secret,
        store_url: wooConfig.url
      }
    }

    console.log('Calling n8n webhook:', {
      url: 'https://n8n.konvertix.de/webhook/create-product/',
      payload: n8nPayload
    })

    // Make request to n8n webhook
    const response = await fetch('https://n8n.konvertix.de/webhook/create-product/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('n8n Webhook Error:', errorData)
      return NextResponse.json(
        { error: `n8n Webhook Error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('Product created successfully via n8n:', result)

    return NextResponse.json({
      success: true,
      product: result,
      message: 'Product created successfully via n8n webhook'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}