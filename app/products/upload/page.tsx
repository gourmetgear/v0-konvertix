'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ArrowLeft,
  Package,
  Upload,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Hash,
  FileText,
  Image as ImageIcon,
  Tags
} from 'lucide-react'
import Link from 'next/link'

interface ProductFormData {
  name: string
  type: string
  regular_price: string
  sku: string
  description: string
  short_description: string
  manage_stock: boolean
  stock_quantity: number
  category_id: number
  image_url: string
  seo_title: string
  seo_description: string
  seo_focus_kw: string
}

export default function ProductUploaderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [userImages, setUserImages] = useState<string[]>([])
  const [loadingImages, setLoadingImages] = useState(false)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    type: 'simple',
    regular_price: '',
    sku: '',
    description: '',
    short_description: '',
    manage_stock: true,
    stock_quantity: 0,
    category_id: 12,
    image_url: '',
    seo_title: '',
    seo_description: '',
    seo_focus_kw: ''
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser()
        if (userRes.user) {
          setUserId(userRes.user.id)
          await loadUserImages(userRes.user.id)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setError('Failed to load user data')
      }
    }

    loadUserData()
  }, [])

  const loadUserImages = async (userId: string) => {
    try {
      setLoadingImages(true)

      console.log('🔍 Loading images via API for userId:', userId)

      // Fetch images via API route (bypasses RLS policy issues)
      const response = await fetch(`/api/user-images?userId=${userId}`)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData.error)
        setError(`Failed to load images: ${errorData.error}`)
        return
      }

      const { images } = await response.json()
      console.log('✅ Images loaded via API:', images)

      setUserImages(images)
    } catch (error) {
      console.error('Error loading user images:', error)
      setError('Failed to load images from storage')
    } finally {
      setLoadingImages(false)
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = (): string | null => {
    if (!userId) return 'User authentication required'
    if (!formData.name.trim()) return 'Product name is required'
    if (!formData.regular_price.trim()) return 'Regular price is required'
    if (!formData.sku.trim()) return 'SKU is required'
    if (!formData.description.trim()) return 'Description is required'
    if (!formData.short_description.trim()) return 'Short description is required'
    if (formData.manage_stock && formData.stock_quantity < 0) return 'Stock quantity must be 0 or greater'
    if (!formData.image_url.trim()) return 'Image URL is required'

    // Validate price format
    if (isNaN(parseFloat(formData.regular_price))) return 'Regular price must be a valid number'

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Build the payload for the API route
      const payload = {
        name: formData.name,
        type: formData.type,
        regular_price: formData.regular_price,
        sku: formData.sku,
        description: formData.description,
        short_description: formData.short_description,
        manage_stock: formData.manage_stock,
        stock_quantity: formData.stock_quantity,
        categories: [{ id: formData.category_id }],
        images: [{ src: formData.image_url }],
        meta_data: [
          { key: "rank_math_title", value: formData.seo_title },
          { key: "rank_math_description", value: formData.seo_description },
          { key: "rank_math_focus_keyword", value: formData.seo_focus_kw }
        ],
        userId: userId
      }

      console.log('Submitting product data:', payload)

      const response = await fetch('/api/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorResult = await response.json()
        console.log('🚨 API Error Response:', errorResult)
        if (errorResult.debug) {
          console.log('🔍 Debug Information:', errorResult.debug)
        }
        throw new Error(errorResult.error || `Failed to create product: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Product created successfully:', result)

      setSuccess(true)

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          type: 'simple',
          regular_price: '',
          sku: '',
          description: '',
          short_description: '',
          manage_stock: true,
          stock_quantity: 0,
          category_id: 12,
          image_url: '',
          seo_title: '',
          seo_description: '',
          seo_focus_kw: ''
        })
        setSuccess(false)
      }, 3000)

    } catch (error) {
      console.error('Error creating product:', error)
      setError(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#0b021c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Product Uploader</h1>
                <p className="text-[#afafaf]">Upload a new product directly to your WooCommerce store</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="bg-red-900/20 border-red-500/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Message */}
            {success && (
              <Card className="bg-green-900/20 border-green-500/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>Product uploaded successfully!</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Form */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      <FileText className="h-4 w-4 inline mr-1" />
                      Product Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                      required
                    />
                  </div>

                  {/* Product Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-white">
                      <Tags className="h-4 w-4 inline mr-1" />
                      Product Type <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-[#3f3f3f] text-white">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                        <SelectItem value="simple" className="text-white hover:bg-[#3f3f3f]">Simple Product</SelectItem>
                        <SelectItem value="variable" className="text-white hover:bg-[#3f3f3f]">Variable Product</SelectItem>
                        <SelectItem value="grouped" className="text-white hover:bg-[#3f3f3f]">Grouped Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Regular Price and SKU */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="regular_price" className="text-white">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        Regular Price <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="regular_price"
                        type="number"
                        step="0.01"
                        placeholder="9.99"
                        value={formData.regular_price}
                        onChange={(e) => handleInputChange('regular_price', e.target.value)}
                        className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku" className="text-white">
                        <Hash className="h-4 w-4 inline mr-1" />
                        SKU <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="sku"
                        type="text"
                        placeholder="PROD-SKU-001"
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                        required
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <Label htmlFor="short_description" className="text-white">
                      Short Description <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="short_description"
                      type="text"
                      placeholder="Brief product description"
                      value={formData.short_description}
                      onChange={(e) => handleInputChange('short_description', e.target.value)}
                      className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed product description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Stock Management */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="manage_stock"
                        checked={formData.manage_stock}
                        onChange={(e) => handleInputChange('manage_stock', e.target.checked)}
                        className="rounded border-[#3f3f3f] bg-[#1a1a1a] text-[#a545b6]"
                      />
                      <Label htmlFor="manage_stock" className="text-white">
                        Manage stock quantity
                      </Label>
                    </div>
                    {formData.manage_stock && (
                      <div className="space-y-2">
                        <Label htmlFor="stock_quantity" className="text-white">
                          Stock Quantity
                        </Label>
                        <Input
                          id="stock_quantity"
                          type="number"
                          min="0"
                          placeholder="100"
                          value={formData.stock_quantity}
                          onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                          className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">
                      Category ID
                    </Label>
                    <Input
                      id="category"
                      type="number"
                      placeholder="12"
                      value={formData.category_id}
                      onChange={(e) => handleInputChange('category_id', parseInt(e.target.value) || 12)}
                      className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                    />
                  </div>

                  {/* Image Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="image_url" className="text-white">
                      <ImageIcon className="h-4 w-4 inline mr-1" />
                      Product Image <span className="text-red-400">*</span>
                    </Label>
                    {loadingImages ? (
                      <div className="flex items-center justify-center p-4 bg-[#1a1a1a] border border-[#3f3f3f] rounded-md">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                        <span className="text-[#afafaf]">Loading your images...</span>
                      </div>
                    ) : userImages.length > 0 ? (
                      <div>
                        <Select
                          value={formData.image_url}
                          onValueChange={(value) => handleInputChange('image_url', value)}
                        >
                          <SelectTrigger className="bg-[#1a1a1a] border-[#3f3f3f] text-white">
                            <SelectValue placeholder="Select an image from your storage" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f] max-h-60">
                            {userImages.map((imageUrl, index) => {
                              const fileName = imageUrl.split('/').pop() || `Image ${index + 1}`
                              return (
                                <SelectItem
                                  key={imageUrl}
                                  value={imageUrl}
                                  className="text-white hover:bg-[#3f3f3f] cursor-pointer"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-[#3f3f3f] rounded overflow-hidden flex-shrink-0">
                                      <img
                                        src={imageUrl}
                                        alt={fileName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none'
                                        }}
                                      />
                                    </div>
                                    <span className="truncate">{fileName}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        {formData.image_url && (
                          <div className="mt-2 p-2 bg-[#1a1a1a] border border-[#3f3f3f] rounded-md">
                            <p className="text-xs text-[#afafaf] mb-2">Selected image preview:</p>
                            <img
                              src={formData.image_url}
                              alt="Selected product image"
                              className="w-32 h-32 object-cover rounded border border-[#3f3f3f]"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-[#1a1a1a] border border-[#3f3f3f] rounded-md text-center">
                        <ImageIcon className="h-8 w-8 text-[#afafaf] mx-auto mb-2" />
                        <p className="text-[#afafaf] text-sm mb-2">No images found in your storage</p>
                        <p className="text-xs text-[#afafaf]">
                          Upload images to your private storage folder first
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-[#afafaf]">
                      Select an image from your private storage bucket
                    </p>
                  </div>

                  {/* SEO Section */}
                  <div className="space-y-4 pt-4 border-t border-[#3f3f3f]">
                    <h3 className="text-lg font-semibold text-white">SEO Settings (Rank Math)</h3>

                    {/* SEO Title */}
                    <div className="space-y-2">
                      <Label htmlFor="seo_title" className="text-white">
                        SEO Title
                      </Label>
                      <Input
                        id="seo_title"
                        type="text"
                        placeholder="SEO optimized title"
                        value={formData.seo_title}
                        onChange={(e) => handleInputChange('seo_title', e.target.value)}
                        className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                      />
                      <p className="text-xs text-[#afafaf]">
                        Custom title for search engines (Rank Math)
                      </p>
                    </div>

                    {/* SEO Description */}
                    <div className="space-y-2">
                      <Label htmlFor="seo_description" className="text-white">
                        SEO Description
                      </Label>
                      <Textarea
                        id="seo_description"
                        placeholder="SEO meta description"
                        value={formData.seo_description}
                        onChange={(e) => handleInputChange('seo_description', e.target.value)}
                        className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                        rows={3}
                      />
                      <p className="text-xs text-[#afafaf]">
                        Meta description for search engines (Rank Math)
                      </p>
                    </div>

                    {/* SEO Focus Keyword */}
                    <div className="space-y-2">
                      <Label htmlFor="seo_focus_kw" className="text-white">
                        Focus Keyword
                      </Label>
                      <Input
                        id="seo_focus_kw"
                        type="text"
                        placeholder="main keyword"
                        value={formData.seo_focus_kw}
                        onChange={(e) => handleInputChange('seo_focus_kw', e.target.value)}
                        className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                      />
                      <p className="text-xs text-[#afafaf]">
                        Primary focus keyword for SEO optimization (Rank Math)
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end space-x-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={loading}
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Product
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}