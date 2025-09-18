import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Fetching products for userId:', userId)

    let query = supabaseAdmin
      .from('woocommerce_products')
      .select(`
        id,
        woo_product_id,
        name,
        slug,
        permalink,
        price,
        regular_price,
        sale_price,
        sku,
        status,
        type,
        featured,
        stock_status,
        stock_quantity,
        manage_stock,
        images,
        categories,
        short_description,
        last_synced_at,
        sync_status
      `)
      .eq('user_id', userId)
      .order('date_modified', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
    }

    const { data: products, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('woocommerce_products')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) {
      console.error('Error getting product count:', countError)
    }

    // Get stats
    const { data: stats, error: statsError } = await supabaseAdmin
      .from('woocommerce_products')
      .select('status, regular_price')
      .eq('user_id', userId)

    let productStats = {
      total: totalCount || 0,
      published: 0,
      draft: 0,
      totalRevenue: 0
    }

    if (!statsError && stats) {
      productStats = {
        total: stats.length,
        published: stats.filter(p => p.status === 'publish').length,
        draft: stats.filter(p => p.status === 'draft').length,
        totalRevenue: stats.reduce((sum, p) => sum + (parseFloat(p.regular_price) || 0), 0)
      }
    }

    console.log('✅ Found products:', products?.length || 0)

    return NextResponse.json({
      products: products || [],
      stats: productStats,
      pagination: {
        total: totalCount || 0,
        offset,
        limit,
        hasMore: (offset + limit) < (totalCount || 0)
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}