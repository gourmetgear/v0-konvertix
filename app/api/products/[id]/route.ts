import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Fetching product:', productId, 'for user:', userId)

    const { data: product, error } = await supabaseAdmin
      .from('woocommerce_products')
      .select('*')
      .eq('id', productId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    console.log('✅ Found product:', product.name)

    return NextResponse.json({ product })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}