import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      )
    }

    // Check if admin client is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      )
    }

    // Get user's account
    const { data: accountMember, error: accountError } = await supabaseAdmin
      .from('account_members')
      .select('account_id, role')
      .eq('user_id', userId)
      .single()

    // Get capiconfig
    const { data: capiConfig, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get all capiconfigs for debugging
    const { data: allConfigs, error: allError } = await supabaseAdmin
      .from('capiconfig')
      .select('user_id, id, ad_account_id, provider')
      .limit(10)

    return NextResponse.json({
      success: true,
      debug: {
        userId,
        accountMember: accountMember || null,
        accountError: accountError?.message || null,
        capiConfig: capiConfig ? {
          id: capiConfig.id,
          user_id: capiConfig.user_id,
          account_id: capiConfig.account_id,
          pixel_id: capiConfig.pixel_id,
          provider: capiConfig.provider,
          has_ad_account_id: !!capiConfig.ad_account_id,
          has_token: !!capiConfig.token,
          has_access_token: !!capiConfig.access_token,
          created_at: capiConfig.created_at
        } : null,
        configError: configError?.message || null,
        allConfigs: allConfigs || [],
        allConfigsError: allError?.message || null
      }
    })

  } catch (error) {
    console.error('Debug capiconfig error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}