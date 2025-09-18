import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      campaign_id,
      facebook_campaign_id, // Direct Facebook campaign ID (preferred)
      daily_budget,
      billing_event = 'IMPRESSIONS',
      optimization_goal = 'OFFSITE_CONVERSIONS',
      bid_strategy = 'LOWEST_COST_WITHOUT_CAP',
      destination_type = 'WEBSITE',
      custom_event_type = 'PURCHASE',
      countries = ['DE'],
      publisher_platforms = ['facebook', 'instagram'],
      facebook_positions = ['feed'],
      instagram_positions = ['stream'],
      click_window_days = 7,
      view_window_days = 1,
      dsa_beneficiary = 'CamperBanner',
      dsa_payor = 'CamperBanner',
      status = 'PAUSED',
      userId,
      // Image data from the form
      image_url,
      image_name
    } = body

    console.log('Ad set creation request:', {
      name,
      campaign_id,
      facebook_campaign_id,
      userId,
      image_name
    })

    // Validate required fields
    if (!name || !daily_budget || !userId) {
      return NextResponse.json(
        { error: 'Name, daily_budget, and userId are required' },
        { status: 400 }
      )
    }

    if (!facebook_campaign_id && !campaign_id) {
      return NextResponse.json(
        { error: 'Either facebook_campaign_id or campaign_id (campaign name) is required' },
        { status: 400 }
      )
    }

    // Get user's capiconfig for pixel_id and access_token
    console.log('Looking for CAPI config for userId:', userId)

    const { data: capiConfigs, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('pixel_id, token, ad_account_id')
      .eq('user_id', userId)
      .eq('provider', 'facebook')
      .not('ad_account_id', 'is', null)
      .not('ad_account_id', 'eq', '')
      .not('token', 'is', null)
      .not('token', 'eq', '')

    console.log('CAPI config query results:', { capiConfigs, configError, count: capiConfigs?.length })

    if (configError || !capiConfigs || capiConfigs.length === 0) {
      console.log('CAPI config error:', configError)
      console.log('Available configs:', capiConfigs)

      // Get all configs for this user to debug
      const { data: allConfigs } = await supabaseAdmin
        .from('capiconfig')
        .select('*')
        .eq('user_id', userId)

      console.log('All user configs for debugging:', allConfigs)

      return NextResponse.json(
        { error: 'Facebook CAPI configuration not found. Please configure your Facebook settings first.' },
        { status: 400 }
      )
    }

    // Use the first valid configuration
    const capiConfig = capiConfigs[0]
    console.log('Selected CAPI config:', {
      ad_account_id: capiConfig.ad_account_id,
      pixel_id: capiConfig.pixel_id,
      token_length: capiConfig.token?.length || 0
    })

    // Determine Facebook campaign ID - prioritize direct ID over lookup
    let finalCampaignId = null
    let campaignLookupInfo = {}

    if (facebook_campaign_id) {
      // Direct Facebook campaign ID provided - use it directly
      console.log('Using direct Facebook campaign ID:', facebook_campaign_id)
      finalCampaignId = facebook_campaign_id
      campaignLookupInfo = {
        method: 'direct',
        campaign_id: facebook_campaign_id,
        campaign_name: campaign_id || 'Direct ID provided'
      }
    } else {
      // Need to lookup campaign by name in metrics_daily table
      console.log('Looking up campaign in metrics_daily by name:', campaign_id, 'for user:', userId)

      // First, let's see what campaigns exist for this user
      const { data: allCampaigns, error: debugError } = await supabaseAdmin
        .from('metrics_daily')
        .select('campaign_id, campaign_name, account_id')
        .eq('account_id', userId)
        .not('campaign_id', 'is', null)
        .limit(10)

      console.log('Available campaigns for user:', allCampaigns)

      // Now try to find the specific campaign
      const { data: campaigns, error: campaignError } = await supabaseAdmin
        .from('metrics_daily')
        .select('campaign_id, campaign_name')
        .eq('campaign_name', campaign_id) // campaign_id field actually contains campaign name
        .eq('account_id', userId)
        .not('campaign_id', 'is', null)

      console.log('Campaign search result:', { campaigns, campaignError, searchTerm: campaign_id })

      if (campaignError) {
        console.log('Campaign query error:', campaignError)
        return NextResponse.json(
          { error: `Database error looking up campaign: ${campaignError.message}` },
          { status: 500 }
        )
      }

      if (!campaigns || campaigns.length === 0) {
        console.log('No campaigns found matching name:', campaign_id)
        return NextResponse.json(
          { error: `Campaign "${campaign_id}" not found. Available campaigns: ${allCampaigns?.map(c => c.campaign_name).join(', ') || 'none'}` },
          { status: 400 }
        )
      }

      // Take the first matching campaign
      const campaign = campaigns[0]

      if (!campaign.campaign_id) {
        console.log('Campaign found but missing Facebook campaign ID:', campaign)
        return NextResponse.json(
          { error: `Campaign "${campaign_id}" found but missing Facebook campaign ID` },
          { status: 400 }
        )
      }

      finalCampaignId = campaign.campaign_id
      campaignLookupInfo = {
        method: 'lookup',
        campaign_name: campaign.campaign_name,
        campaign_id: campaign.campaign_id
      }

      console.log('Found campaign:', { campaign_name: campaign.campaign_name, campaign_id: campaign.campaign_id })
    }

    // Prepare data for n8n webhook
    const webhookData = {
      name,
      campaign_id: finalCampaignId, // Use determined Facebook campaign ID
      daily_budget: daily_budget * 100, // Convert to cents for Facebook API
      billing_event,
      optimization_goal,
      bid_strategy,
      destination_type,
      promoted_object: {
        pixel_id: capiConfig.pixel_id,
        custom_event_type
      },
      targeting: {
        geo_locations: { countries },
        publisher_platforms,
        facebook_positions,
        instagram_positions
      },
      attribution_spec: [
        { event_type: "CLICK_THROUGH", window_days: click_window_days },
        { event_type: "VIEW_THROUGH", window_days: view_window_days }
      ],
      status,
      dsa_beneficiary,
      dsa_payor,
      ad_account_id: capiConfig.ad_account_id,
      access_token: capiConfig.token
    }

    console.log('API received adset data:', { name, campaign_id, facebook_campaign_id, daily_budget, userId, image_name })
    console.log('Campaign lookup result:', campaignLookupInfo)
    console.log('Final campaign ID for webhook:', finalCampaignId)
    console.log('Sending to webhook with image data:', webhookData)

    // Call n8n webhook
    const webhookUrl = 'https://n8n.konvertix.de/webhook/create-adset'

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    })

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('n8n webhook error:', {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        errorText,
        sentData: webhookData
      })
      return NextResponse.json(
        {
          error: 'Failed to create ad set via Facebook API',
          details: errorText,
          status: webhookResponse.status,
          sentData: webhookData
        },
        { status: 500 }
      )
    }

    const webhookResult = await webhookResponse.json()
    console.log('Ad set created successfully on Facebook:', webhookResult)

    // If image was selected, upload it to Facebook after ad set creation
    let imageUploadResult = null
    if (image_url && image_name) {
      try {
        console.log('Processing image upload for ad set...')

        // Convert image URL to base64
        const imageResponse = await fetch(image_url)
        if (!imageResponse.ok) {
          throw new Error('Failed to fetch image from URL')
        }

        const imageBuffer = await imageResponse.arrayBuffer()
        const base64Image = Buffer.from(imageBuffer).toString('base64')

        // Get the image file extension for MIME type
        const fileExtension = image_name.split('.').pop()?.toLowerCase()
        const mimeType = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp'
        }[fileExtension || 'jpg'] || 'image/jpeg'

        // Prepare image upload payload
        const imageUploadPayload = {
          image_base64: base64Image,
          image_name: image_name,
          mime_type: mimeType,
          ad_account_id: capiConfig.ad_account_id,
          access_token: capiConfig.token,
          adset_id: webhookResult.id || webhookResult.adset_id // Use the created ad set ID
        }

        console.log('Uploading image to webhook:', {
          image_name,
          mime_type: mimeType,
          ad_account_id: capiConfig.ad_account_id,
          base64_length: base64Image.length
        })

        // Call image upload webhook
        const imageUploadResponse = await fetch('https://n8n.konvertix.de/webhook/upload-image/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(imageUploadPayload),
        })

        if (imageUploadResponse.ok) {
          imageUploadResult = await imageUploadResponse.json()
          console.log('Image uploaded successfully:', imageUploadResult)
        } else {
          const errorText = await imageUploadResponse.text()
          console.error('Image upload failed:', errorText)
        }

      } catch (imageError) {
        console.error('Error processing image upload:', imageError)
        // Don't fail the entire request if image upload fails
      }
    }

    // TODO: Store ad set in database after running the ad_sets table schema
    // For now, skip database save and return success
    return NextResponse.json({
      success: true,
      message: 'Ad set created successfully on Facebook',
      facebook_data: webhookResult,
      image_upload: imageUploadResult ? {
        success: true,
        message: 'Image uploaded successfully',
        data: imageUploadResult
      } : image_url ? {
        success: false,
        message: 'Image upload failed, but ad set was created'
      } : null
    })

  } catch (error) {
    console.error('Ad set creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}