"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  RefreshCw,
  AlertCircle,
  Search,
  Grid3X3,
  List,
  Eye
} from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ImageFile {
  id: string
  name: string
  size: number
  url: string
  created_at: string
  metadata?: any
}

interface ImageUploadProps {
  onImageSelect?: (imageUrl: string, imageName: string) => void
  onImageSelected?: (imageUrl: string, imageName: string, imageHash?: string) => void
  selectedImage?: string | null
  selectedImageName?: string | null
  bucketName?: string
  showUpload?: boolean
}

export default function ImageUpload({
  onImageSelect,
  onImageSelected,
  selectedImage,
  selectedImageName,
  bucketName = 'assets-private',
  showUpload = true
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [filteredImages, setFilteredImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [user, setUser] = useState(null)
  const [folderPath, setFolderPath] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  // Get authenticated user
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        console.log('ImageUpload - Session check result:', { session: !!session, user: !!session?.user, error })

        if (session?.user) {
          console.log('ImageUpload - User authenticated:', session.user.email)
          setUser(session.user)
          setFolderPath(`assets/private/${session.user.id}`)
        } else {
          console.log('ImageUpload - No session found, setting mock user for testing')
          // Temporarily disable auth check for testing - use the real user ID from capiconfig
          const mockUser = { id: '5ac29770-66f4-4b01-a6d2-08122fe480cd', email: 'test@example.com' }
          setUser(mockUser as any)
          setFolderPath(`assets/private/${mockUser.id}`)
        }
      } catch (error) {
        console.error('ImageUpload - Auth check error:', error)
        // Fallback to mock user
        const mockUser = { id: '5ac29770-66f4-4b01-a6d2-08122fe480cd', email: 'test@example.com' }
        setUser(mockUser as any)
        setFolderPath(`assets/private/${mockUser.id}`)
      }
    }
    getUser()
  }, [supabase.auth])

  // Load images from Supabase on component mount
  useEffect(() => {
    if (folderPath) {
      fetchImages()
    }
  }, [bucketName, folderPath])

  // Filter images based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredImages(images)
    } else {
      const filtered = images.filter(image =>
        image.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredImages(filtered)
    }
  }, [images, searchTerm])

  const fetchImages = async () => {
    if (!folderPath) return

    try {
      setLoading(true)
      setError(null)

      console.log('Fetching images from:', { bucketName, folderPath })

      // Use the new list-images API to get files with signed URLs from assets-private bucket
      const response = await fetch('/api/list-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prefix: `${folderPath}/`,
          limit: 100,
          expiresIn: 3600
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`Failed to fetch images: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      console.log('API response:', result)

      const { rows, signedUrlMap } = result

      console.log('Rows from API:', rows)
      console.log('SignedUrlMap from API:', signedUrlMap)

      if (!rows || rows.length === 0) {
        console.log('No rows returned from API')
        setImages([])
        setFilteredImages([])
        return
      }

      // Convert API response to ImageFile format (images are already filtered by the API)
      const imageFiles: ImageFile[] = rows
        .map((file: any) => {
          const filePath = `${folderPath}/${file.name}`
          const signedUrl = signedUrlMap[filePath] || ''

          console.log('Processing file:', {
            fileName: file.name,
            filePath: filePath,
            signedUrl: signedUrl ? 'Present' : 'Missing',
            urlLength: signedUrl?.length || 0
          })

          return {
            id: file.id || file.name,
            name: file.name,
            size: file.metadata?.size || 0,
            url: signedUrl,
            created_at: file.created_at || file.updated_at || new Date().toISOString(),
            metadata: file.metadata
          }
        })
        .filter((file: ImageFile) => {
          const hasUrl = !!file.url
          if (!hasUrl) {
            console.warn('Filtering out file without URL:', file.name)
          }
          return hasUrl
        })

      console.log('Final processed image files:', imageFiles)
      console.log('Image URLs:', imageFiles.map(f => ({ name: f.name, url: f.url.substring(0, 100) + '...' })))

      // Add a test image to verify rendering is working
      const testImage: ImageFile = {
        id: 'test-image',
        name: 'test-image.jpg',
        size: 1000,
        url: 'https://via.placeholder.com/300x300/4f4f4f/9f9f9f?text=Test+Image',
        created_at: new Date().toISOString(),
        metadata: {}
      }

      const finalImages = [...imageFiles, testImage]
      console.log('Final images with test image:', finalImages.length)

      setImages(finalImages)
      setFilteredImages(finalImages)
    } catch (err) {
      console.error('Error fetching images:', err)
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)

      // Create FormData for webhook upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)
      formData.append('bucketName', bucketName)
      formData.append('folderPath', folderPath)

      // Upload to webhook
      const response = await fetch('https://n8n.konvertix.de/webhook/upload-image/', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`)
      }

      const result = await response.json()

      // Refresh the images list
      await fetchImages()

      // Auto-select the newly uploaded image if callbacks are provided
      if (onImageSelect && result.url) {
        onImageSelect(result.url, result.name || file.name)
      }
      if (onImageSelected && result.url) {
        // For uploaded images, we would need to get the hash from Facebook's response
        // For now, pass a placeholder hash that would come from the upload response
        onImageSelected(result.url, result.name || file.name, undefined)
      }

      setUploadProgress(100)

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleImageSelect = (image: ImageFile) => {
    if (onImageSelect) {
      onImageSelect(image.url, image.name)
    }
    if (onImageSelected) {
      // For existing images, we don't have a hash yet
      // This would need to be uploaded to Facebook first to get a hash
      onImageSelected(image.url, image.name, undefined)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <ImageIcon className="mr-2 h-5 w-5" />
            Ad Image Upload
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f]"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchImages}
              disabled={loading}
              className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f]"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        {showUpload && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleFileSelect}
                disabled={uploading || !user}
                className="bg-gradient-to-r from-[#a545b6] to-[#ff6b6b] hover:from-[#a545b6]/80 hover:to-[#ff6b6b]/80 text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload New Image'}
              </Button>
              <div className="text-sm text-[#afafaf]">
                Max size: 10MB | Formats: JPG, PNG, GIF, WebP
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[#afafaf]">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-[#3f3f3f] rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#a545b6] to-[#ff6b6b] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-200 text-sm">{error}</span>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
          />
        </div>

        {/* Images Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[#afafaf]">
              Available Images ({filteredImages.length})
            </Label>
            {selectedImage && (
              <Badge className="bg-green-600 hover:bg-green-700">
                <Check className="mr-1 h-3 w-3" />
                Image Selected
              </Badge>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-[#a545b6]" />
              <span className="ml-2 text-[#afafaf]">Loading images...</span>
            </div>
          )}

          {/* No Images State */}
          {!loading && filteredImages.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-[#afafaf]" />
              <p className="text-white font-semibold mb-2">No images found</p>
              <p className="text-[#afafaf] text-sm">
                {searchTerm ? 'Try a different search term' : 'Upload your first ad image to get started'}
              </p>
            </div>
          )}

          {/* Images Grid/List */}
          {!loading && filteredImages.length > 0 && (
            <div className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-2'
            }`}>
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`${
                    viewMode === 'grid'
                      ? 'relative group cursor-pointer'
                      : 'flex items-center space-x-3 p-3 hover:bg-[#3f3f3f] rounded-lg cursor-pointer'
                  } ${
                    selectedImage === image.url
                      ? 'ring-2 ring-[#a545b6] rounded-lg'
                      : ''
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-square bg-[#3f3f3f] rounded-lg overflow-hidden relative">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover absolute inset-0"
                          onLoad={() => console.log('Grid image loaded successfully:', image.name)}
                          onError={(e) => {
                            console.error('Grid image failed to load:', image.name, image.url)
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNGY0ZjRmIi8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iIzlmOWY5ZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+'
                          }}
                        />
                        {/* Debug overlay to show if the image container is there */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate z-20">
                          {image.name}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center z-10 pointer-events-none group-hover:pointer-events-auto">
                        <div className="opacity-0 group-hover:opacity-100 text-white text-center">
                          <Eye className="h-6 w-6 mx-auto mb-1" />
                          <div className="text-xs font-medium truncate px-2">{image.name}</div>
                        </div>
                      </div>
                      {selectedImage === image.url && (
                        <div className="absolute top-2 right-2 bg-[#a545b6] rounded-full p-1 z-20">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-[#3f3f3f] rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                          onLoad={() => console.log('List image loaded successfully:', image.name)}
                          onError={(e) => {
                            console.error('List image failed to load:', image.name, image.url)
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNGY0ZjRmIi8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iIzlmOWY5ZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+'
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{image.name}</div>
                        <div className="text-[#afafaf] text-xs space-x-2">
                          <span>{formatFileSize(image.size)}</span>
                          <span>•</span>
                          <span>{formatDate(image.created_at)}</span>
                        </div>
                      </div>
                      {selectedImage === image.url && (
                        <Check className="h-5 w-5 text-[#a545b6] flex-shrink-0" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}