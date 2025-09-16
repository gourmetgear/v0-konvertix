import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// API to manually create missing profiles for existing users
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

    console.log('Fixing missing profile for user:', userId)

    // Get user from auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (authError) {
      return NextResponse.json(
        { error: 'User not found in auth', details: authError.message },
        { status: 404 }
      )
    }

    // Extract metadata
    const metadata = authUser.user.user_metadata || {}
    const firstName = metadata.first_name || ''
    const lastName = metadata.last_name || ''
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || '')

    // Create/update profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email: authUser.user.email || '',
        first_name: firstName,
        last_name: lastName,
        full_name: fullName
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      return NextResponse.json(
        { 
          error: 'Failed to create profile', 
          details: profileError.message,
          userId 
        },
        { status: 500 }
      )
    }

    // Also try to create account and account_members entry
    const { randomUUID } = require('crypto');
    const defaultAccountId = randomUUID()

    // First create the account
    const { data: newAccount, error: accountCreateError } = await supabaseAdmin
      .from('accounts')
      .insert({
        id: defaultAccountId,
        owner: userId,
        company_name: authUser.user.user_metadata?.company || `${authUser.user.email}'s Company`,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    // Then create account_members entry
    const { data: accountMember, error: accountError } = await supabaseAdmin
      .from('account_members')
      .upsert({
        user_id: userId,
        account_id: defaultAccountId,
        role: 'admin',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,account_id'
      })
      .select()
      .single()

    return NextResponse.json({
      success: true,
      message: 'Profile and account member created/updated successfully',
      profile,
      accountMember,
      accountMemberError: accountError?.message
    })

  } catch (error) {
    console.error('Fix profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint to check multiple users
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      )
    }

    // Get all users from auth that don't have profiles
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      return NextResponse.json(
        { error: 'Failed to list auth users', details: authError.message },
        { status: 500 }
      )
    }

    // Get existing profiles
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id')

    const profileIds = new Set(profiles?.map(p => p.id) || [])
    const usersWithoutProfiles = authUsers.users.filter(user => !profileIds.has(user.id))

    return NextResponse.json({
      success: true,
      totalUsers: authUsers.users.length,
      usersWithProfiles: profiles?.length || 0,
      usersWithoutProfiles: usersWithoutProfiles.length,
      missingProfileUsers: usersWithoutProfiles.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }))
    })

  } catch (error) {
    console.error('Check profiles error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}