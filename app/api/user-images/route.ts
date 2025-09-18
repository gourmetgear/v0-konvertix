import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

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

    console.log('🔍 Fetching images for userId:', userId)
    console.log('📁 Storage path: assets-private/assets/private/' + userId)

    // List files in the user's private folder using admin client
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('assets-private')
      .list(`assets/private/${userId}`, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    console.log('📂 Raw files from storage:', files)
    console.log('❌ Storage list error:', listError)

    if (listError) {
      console.error('Error loading images:', listError)
      return NextResponse.json(
        { error: `Storage error: ${listError.message}` },
        { status: 500 }
      )
    }

    if (!files) {
      return NextResponse.json({ images: [] })
    }

    console.log('📋 All files found:', files.length, files.map(f => f.name))

    // Filter for image files only
    const imageFiles = files.filter(file =>
      file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i)
    )

    console.log('🖼️ Image files after filtering:', imageFiles.length, imageFiles.map(f => f.name))

    // Generate signed URLs for private images (valid for 1 hour)
    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const { data, error } = await supabaseAdmin.storage
          .from('assets-private')
          .createSignedUrl(`assets/private/${userId}/${file.name}`, 3600) // 1 hour expiry

        if (error) {
          console.error('Error creating signed URL for', file.name, ':', error)
          return null
        }

        console.log('🔗 Generated signed URL for', file.name, ':', data.signedUrl)
        return data.signedUrl
      })
    )

    // Filter out any null URLs (failed to create signed URL)
    const validImageUrls = imageUrls.filter(url => url !== null)

    console.log('✅ Final signed image URLs:', validImageUrls)

    return NextResponse.json({ images: validImageUrls })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}