import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Safe endpoint to create account_members entry after successful signup
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      )
    }

    const { userId, accountId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Check if user exists in auth
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (userError) {
      return NextResponse.json(
        { error: 'User not found', details: userError.message },
        { status: 404 }
      )
    }

    // Use provided accountId or create a new account
    let finalAccountId = accountId;

    if (!finalAccountId) {
      // Create a new account first
      const { randomUUID } = require('crypto');
      finalAccountId = randomUUID();

      const { data: newAccount, error: accountError } = await supabaseAdmin
        .from('accounts')
        .insert({
          id: finalAccountId,
          owner: userId,
          company_name: user.user.user_metadata?.company || `${user.user.email}'s Company`,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (accountError) {
        console.error('Error creating account:', accountError);
        return NextResponse.json(
          {
            error: 'Failed to create account',
            details: accountError.message,
            code: accountError.code,
            userId
          },
          { status: 500 }
        );
      }

      console.log('Created account:', newAccount);
    }

    // Check if account_members entry already exists
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('account_members')
      .select('id, account_id')
      .eq('user_id', userId)
      .eq('account_id', finalAccountId)
      .maybeSingle()  // Use maybeSingle to avoid error when no rows found

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Account member already exists',
        accountMember: existing
      })
    }

    console.log('Creating account member for user:', userId, 'with account_id:', finalAccountId)

    // Create account_members entry using insert first, then upsert if needed
    let accountMember, memberError;
    
    // Try insert first
    const insertResult = await supabaseAdmin
      .from('account_members')
      .insert({
        user_id: userId,
        account_id: finalAccountId
      })
      .select()
      .single()
    
    accountMember = insertResult.data
    memberError = insertResult.error
    
    // If insert fails due to conflict, try upsert
    if (memberError && memberError.code === '23505') {
      console.log('Account member exists, trying upsert...')
      const upsertResult = await supabaseAdmin
        .from('account_members')
        .upsert({
          user_id: userId,
          account_id: finalAccountId
        }, {
          onConflict: 'user_id,account_id'
        })
        .select()
        .single()
      
      accountMember = upsertResult.data
      memberError = upsertResult.error
    }

    if (memberError) {
      console.error('Error creating account member:', {
        error: memberError,
        userId,
        accountId: finalAccountId,
        errorCode: memberError.code,
        errorMessage: memberError.message
      })
      return NextResponse.json(
        { 
          error: 'Failed to create account member', 
          details: memberError.message,
          code: memberError.code,
          userId,
          accountId: finalAccountId
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account member created successfully',
      accountMember
    })

  } catch (error) {
    console.error('Create account member error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}