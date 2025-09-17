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

    // Generate public URLs for the images
    const imageUrls = imageFiles.map(file => {
      const { data } = supabaseAdmin.storage
        .from('assets-private')
        .getPublicUrl(`assets/private/${userId}/${file.name}`)
      console.log('🔗 Generated URL for', file.name, ':', data.publicUrl)
      return data.publicUrl
    })

    console.log('✅ Final image URLs:', imageUrls)

    return NextResponse.json({ images: imageUrls })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}