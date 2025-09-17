import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      message,
      website_url,
      call_to_action_type,
      image_url,
      image_name,
      userId
    } = body

    console.log('Creative creation request:', { name, message, website_url, call_to_action_type, image_name, userId })

    // Validate required fields
    if (!name || !message || !website_url || !call_to_action_type || !image_url || !userId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Get user's CAPI config for access token and page details
    const { data: capiConfig, error: configError } = await supabaseAdmin
      .from('capiconfig')
      .select('token, page_id, website_url, ad_account_id')
      .eq('user_id', userId)
      .eq('provider', 'facebook')
      .single()

    if (configError || !capiConfig) {
      return NextResponse.json(
        { error: 'Facebook CAPI configuration not found. Please configure your Facebook settings first.' },
        { status: 400 }
      )
    }

    console.log('Found CAPI config for user:', userId)

    // Step 1: Upload image to Facebook to get hash
    console.log('Step 1: Uploading image to Facebook to get hash...')

    // Fetch the image from the signed URL
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

    // Upload image to Facebook to get hash
    const imageUploadPayload = {
      image_base64: base64Image,
      image_name: image_name,
      mime_type: mimeType,
      ad_account_id: capiConfig.ad_account_id,
      access_token: capiConfig.token
    }

    console.log('Uploading image to Facebook:', {
      image_name,
      mime_type: mimeType,
      ad_account_id: capiConfig.ad_account_id,
      base64_length: base64Image.length
    })

    const imageUploadResponse = await fetch('https://n8n.konvertix.de/webhook/upload-image/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageUploadPayload),
    })

    if (!imageUploadResponse.ok) {
      const errorText = await imageUploadResponse.text()
      console.error('Image upload failed:', errorText)
      return NextResponse.json(
        { error: 'Failed to upload image to Facebook', details: errorText },
        { status: 500 }
      )
    }

    const imageUploadResult = await imageUploadResponse.json()
    console.log('Image uploaded to Facebook successfully:', imageUploadResult)

    // Extract image hash from upload result
    const imageHash = imageUploadResult.hash || imageUploadResult.image_hash
    if (!imageHash) {
      console.error('No image hash in upload result:', imageUploadResult)
      return NextResponse.json(
        { error: 'Failed to get image hash from Facebook upload' },
        { status: 500 }
      )
    }

    // Step 2: Create creative with the image hash
    console.log('Step 2: Creating creative with image hash:', imageHash)

    const creativePayload = {
      name: name,
      access_token: capiConfig.token,
      object_story_spec: {
        page_id: capiConfig.page_id,
        link_data: {
          link: website_url,
          message: message,
          image_hash: imageHash,
          call_to_action: {
            type: call_to_action_type,
            value: {
              link: website_url
            }
          }
        }
      }
    }

    console.log('Creating creative with payload:', creativePayload)

    const creativeResponse = await fetch('https://n8n.konvertix.de/webhook/create-creative/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creativePayload)
    })

    if (!creativeResponse.ok) {
      const errorText = await creativeResponse.text()
      console.error('Creative creation failed:', errorText)
      return NextResponse.json(
        { error: 'Failed to create creative via Facebook API', details: errorText },
        { status: 500 }
      )
    }

    const creativeResult = await creativeResponse.json()
    console.log('Creative created successfully:', creativeResult)

    return NextResponse.json({
      success: true,
      message: 'Creative created successfully',
      creative_data: creativeResult,
      image_upload: {
        success: true,
        image_hash: imageHash,
        upload_data: imageUploadResult
      }
    })

  } catch (error) {
    console.error('Creative creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}