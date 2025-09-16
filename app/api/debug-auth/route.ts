import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Debug endpoint to check auth status and manually create profile if needed
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      )
    }

    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    // Check if user exists in auth.users
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError) {
      return NextResponse.json(
        { error: 'User not found', details: userError.message },
        { status: 404 }
      )
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Check if account_members entry exists
    const { data: accountMembers, error: accountMembersError } = await supabaseAdmin
      .from('account_members')
      .select('*')
      .eq('user_id', userId)

    return NextResponse.json({
      success: true,
      user: {
        id: user.user.id,
        email: user.user.email,
        created_at: user.user.created_at,
        metadata: user.user.user_metadata
      },
      profile: profile,
      profileError: profileError?.message,
      hasProfile: !!profile,
      accountMembers: accountMembers || [],
      accountMembersError: accountMembersError?.message,
      hasAccountMembers: !!(accountMembers && accountMembers.length > 0)
    })

  } catch (error) {
    console.error('Debug auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// POST endpoint to manually create missing profile
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      )
    }

    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Get user from auth
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError) {
      return NextResponse.json(
        { error: 'User not found', details: userError.message },
        { status: 404 }
      )
    }

    // Extract metadata
    const metadata = user.user.user_metadata || {}
    const firstName = metadata.first_name || ''
    const lastName = metadata.last_name || ''
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || '')

    // Create profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email: user.user.email,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName
      })
      .select()
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to create profile', details: profileError.message },
        { status: 500 }
      )
    }

    // Create account and account_members entry
    const { randomUUID } = require('crypto');
    const defaultAccountId = randomUUID();

    // First create the account
    const { data: newAccount, error: accountCreateError } = await supabaseAdmin
      .from('accounts')
      .insert({
        id: defaultAccountId,
        owner: userId,
        company_name: user.user.user_metadata?.company || `${user.user.email}'s Company`,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    // Then create account_members entry
    const { data: accountMember, error: accountMemberError } = await supabaseAdmin
      .from('account_members')
      .upsert({
        user_id: userId,
        account_id: defaultAccountId,
        role: 'admin',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    return NextResponse.json({
      success: true,
      message: 'Profile and account member created successfully',
      profile,
      accountMember,
      accountMemberError: accountMemberError?.message
    })

  } catch (error) {
    console.error('Create profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}