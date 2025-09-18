'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthGuard from '@/components/auth/AuthGuard'
import { supabase } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Package,
  ExternalLink,
  Calendar,
  Tag,
  DollarSign,
  Archive,
  AlertCircle,
  Eye,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Clock,
  Brain,
  Loader2,
  Send
} from 'lucide-react'

interface Product {
  id: string
  woo_product_id: number
  name: string
  slug: string
  permalink?: string
  date_created?: string
  date_modified?: string
  price?: number
  regular_price?: number
  sale_price?: number
  sku?: string
  status: string
  type: string
  featured: boolean
  description?: string
  short_description?: string
  stock_status: string
  stock_quantity?: number
  manage_stock: boolean
  images: any[]
  categories: any[]
  tags: any[]
  attributes: any[]
  meta_data: any[]
  weight?: number
  length?: number
  width?: number
  height?: number
  total_sales: number
  virtual: boolean
  downloadable: boolean
  tax_status: string
  last_synced_at: string
  sync_status: string
  store_url?: string
}

export default function ProductDetailPage() {
  return (
    <AuthGuard>
      <ProductDetailContent />
    </AuthGuard>
  )
}

function ProductDetailContent() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [analysisError, setAnalysisError] = useState('')
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)

  useEffect(() => {
    const loadUserAndProduct = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser()
        if (userRes.user) {
          setUserId(userRes.user.id)
          await loadProduct(userRes.user.id, productId)
        } else {
          setError('User not authenticated')
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setError('Failed to load user data')
      }
    }
    loadUserAndProduct()
  }, [productId])

  const loadProduct = async (userId: string, productId: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products/${productId}?userId=${userId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load product')
      }

      const { product } = await response.json()
      setProduct(product)

      console.log('✅ Loaded product:', product)

    } catch (error) {
      console.error('Error loading product:', error)
      setError(error instanceof Error ? error.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number | string | undefined) => {
    if (!price) return '€0.00'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return `€${numPrice.toFixed(2)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publish': return 'bg-green-600'
      case 'draft': return 'bg-yellow-600'
      case 'private': return 'bg-gray-600'
      default: return 'bg-gray-600'
    }
  }

  const getStockStatusColor = (stockStatus: string) => {
    switch (stockStatus) {
      case 'instock': return 'text-green-400'
      case 'outofstock': return 'text-red-400'
      case 'onbackorder': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStockIcon = (stockStatus: string) => {
    switch (stockStatus) {
      case 'instock': return <CheckCircle2 className="h-4 w-4" />
      case 'outofstock': return <XCircle className="h-4 w-4" />
      case 'onbackorder': return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleAnalyzeDescription = async () => {
    if (!product) return

    setIsAnalyzing(true)
    setAnalysisError('')
    setAnalysisResult(null)

    try {
      const response = await fetch('https://n8n.konvertix.de/webhook/create-description/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: product.name,
          product_description: product.description || product.short_description || '',
          product_id: product.id,
          woo_product_id: product.woo_product_id,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      console.log('Response content-type:', contentType)

      let result
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
        console.log('JSON response:', result)
        setAnalysisResult(result)
      } else {
        // Handle HTML/text response
        const htmlContent = await response.text()
        console.log('HTML response:', htmlContent)
        console.log('HTML content type:', typeof htmlContent)
        console.log('HTML content length:', htmlContent.length)
        console.log('First 100 chars:', htmlContent.substring(0, 100))

        result = {
          enhanced_description: htmlContent,
          content_type: 'html',
          timestamp: new Date().toISOString()
        }
        setAnalysisResult(result)
      }

      console.log('Final analysisResult:', result)
    } catch (err) {
      console.error('Error posting to webhook:', err)
      setAnalysisError(err instanceof Error ? err.message : 'Failed to analyze product description')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b021c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b021c] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Product</h1>
          <p className="text-[#afafaf] mb-6">{error}</p>
          <Button
            onClick={() => router.push('/products')}
            className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0b021c] text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-[#afafaf]" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-[#afafaf] mb-6">The requested product could not be found.</p>
          <Button
            onClick={() => router.push('/products')}
            className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold truncate">{product.name}</h1>
                <p className="text-[#afafaf]">Product ID: {product.woo_product_id} • SKU: {product.sku || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-[#a545b6] text-[#a545b6] hover:bg-[#a545b6] hover:text-white bg-transparent"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze Description
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#2b2b2b] border-[#3f3f3f] max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">Analyze Product Description</DialogTitle>
                      <DialogDescription className="text-[#afafaf]">
                        Generate an enhanced product description using AI analysis
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-[#afafaf]">Product: <span className="text-white">{product.name}</span></p>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#afafaf]">Current Description:</label>
                          <Textarea
                            value={product.description || product.short_description || 'No description available'}
                            readOnly
                            className="min-h-[120px] bg-[#3f3f3f] border-[#5f5f5f] text-white resize-none"
                          />
                        </div>
                      </div>

                      {analysisError && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                          <p className="text-sm text-destructive">{analysisError}</p>
                        </div>
                      )}

                      {analysisResult && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">Analysis Complete</Badge>
                            <span className="text-sm text-[#afafaf]">
                              {new Date().toLocaleString()}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {analysisResult.content_type !== 'html' && (
                              <div>
                                <h4 className="font-medium text-white mb-2">Raw Response:</h4>
                                <div className="bg-[#3f3f3f] p-3 rounded-md max-h-40 overflow-y-auto">
                                  <pre className="text-sm text-[#afafaf] whitespace-pre-wrap">
                                    {JSON.stringify(analysisResult, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {analysisResult.enhanced_description && (
                              <div>
                                <h4 className="font-medium text-white mb-2">Enhanced Description:</h4>
                                <div className="bg-[#3f3f3f] p-4 rounded-md max-h-96 overflow-y-auto">
                                  {/* Test HTML rendering */}
                                  <div className="mb-4 p-2 bg-yellow-500/20 text-yellow-200 text-xs">
                                    Test HTML: <span dangerouslySetInnerHTML={{__html: "<b>Bold Test</b> <i>Italic Test</i>"}} />
                                  </div>

                                  {/* Actual content */}
                                  <div
                                    className="text-white"
                                    style={{color: 'white'}}
                                    dangerouslySetInnerHTML={{
                                      __html: analysisResult.enhanced_description
                                    }}
                                  />
                                </div>
                                <div className="mt-2 text-xs text-[#afafaf]">
                                  Debug: Content type: {analysisResult.content_type || 'unknown'} |
                                  Contains HTML: {String(analysisResult.enhanced_description).includes('<') ? 'Yes' : 'No'}
                                </div>
                              </div>
                            )}

                            {analysisResult.suggestions && Array.isArray(analysisResult.suggestions) && (
                              <div>
                                <h4 className="font-medium text-white mb-2">Suggestions:</h4>
                                <ul className="space-y-1">
                                  {analysisResult.suggestions.map((suggestion: string, index: number) => (
                                    <li key={index} className="text-sm text-[#afafaf] flex items-start space-x-2">
                                      <span className="text-[#a545b6]">•</span>
                                      <span>{suggestion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAnalysisOpen(false)}
                          className="border-[#3f3f3f] text-[#afafaf] hover:bg-[#3f3f3f]"
                        >
                          Close
                        </Button>
                        <Button
                          onClick={handleAnalyzeDescription}
                          disabled={isAnalyzing}
                          className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Analyze
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {product.permalink && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(product.permalink, '_blank')}
                    className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Store
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Product Images */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.images && product.images.length > 0 ? (
                      <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-video bg-[#3f3f3f] rounded-lg overflow-hidden">
                          <img
                            src={product.images[selectedImageIndex]?.src}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjM2YzZjNmIi8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDIwMCAyMDBMMzAwIDEwMEgzNTBWMjUwSDUwVjEwMEgxMDBaIiBmaWxsPSIjNmY2ZjZmIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyNSIgcj0iMjAiIGZpbGw9IiM2ZjZmNmYiLz4KPC9zdmc+Cg=='
                            }}
                          />
                        </div>

                        {/* Thumbnail Grid */}
                        {product.images.length > 1 && (
                          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {product.images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`aspect-square bg-[#3f3f3f] rounded-lg overflow-hidden border-2 transition-colors ${
                                  selectedImageIndex === index
                                    ? 'border-[#a545b6]'
                                    : 'border-transparent hover:border-[#5f5f5f]'
                                }`}
                              >
                                <img
                                  src={image.src}
                                  alt={`${product.name} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-[#3f3f3f] rounded-lg flex items-center justify-center">
                        <Package className="h-16 w-16 text-[#6f6f6f]" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Description */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.description ? (
                      <div
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    ) : (
                      <p className="text-[#afafaf] italic">No description available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Details */}
                {(product.attributes && product.attributes.length > 0) && (
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle>Product Attributes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {product.attributes.map((attr: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-[#afafaf]">{attr.name}:</span>
                            <span className="text-white">{Array.isArray(attr.options) ? attr.options.join(', ') : attr.options}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Status & Pricing */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle>Product Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${getStatusColor(product.status)} text-white`}>
                        {product.status}
                      </Badge>
                      <Badge variant="outline" className="border-[#5f5f5f] text-[#afafaf]">
                        {product.type}
                      </Badge>
                      {product.featured && (
                        <Badge className="bg-yellow-600 text-white">
                          Featured
                        </Badge>
                      )}
                      {product.virtual && (
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                          Virtual
                        </Badge>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-[#afafaf]" />
                        <span className="text-lg font-bold">{formatPrice(product.regular_price)}</span>
                      </div>
                      {product.sale_price && parseFloat(product.sale_price.toString()) > 0 && (
                        <div className="text-sm text-green-400 font-medium">
                          Sale Price: {formatPrice(product.sale_price)}
                        </div>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="space-y-2">
                      <div className={`flex items-center space-x-2 ${getStockStatusColor(product.stock_status)}`}>
                        {getStockIcon(product.stock_status)}
                        <span>
                          {product.stock_status === 'instock' && 'In Stock'}
                          {product.stock_status === 'outofstock' && 'Out of Stock'}
                          {product.stock_status === 'onbackorder' && 'On Backorder'}
                        </span>
                      </div>
                      {product.manage_stock && product.stock_quantity !== undefined && (
                        <div className="text-sm text-[#afafaf]">
                          Quantity: {product.stock_quantity}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Product Details */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#afafaf]">Created:</span>
                      <span>{product.date_created ? new Date(product.date_created).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#afafaf]">Modified:</span>
                      <span>{product.date_modified ? new Date(product.date_modified).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#afafaf]">Total Sales:</span>
                      <span>{product.total_sales || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#afafaf]">Tax Status:</span>
                      <span className="capitalize">{product.tax_status || 'taxable'}</span>
                    </div>
                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="text-[#afafaf]">Weight:</span>
                        <span>{product.weight}g</span>
                      </div>
                    )}
                    {(product.length || product.width || product.height) && (
                      <div className="flex justify-between">
                        <span className="text-[#afafaf]">Dimensions:</span>
                        <span>{product.length || 0} × {product.width || 0} × {product.height || 0} cm</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Categories & Tags */}
                {((product.categories && product.categories.length > 0) || (product.tags && product.tags.length > 0)) && (
                  <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                    <CardHeader>
                      <CardTitle>Categories & Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {product.categories && product.categories.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-[#afafaf] mb-2">Categories</h4>
                          <div className="flex flex-wrap gap-1">
                            {product.categories.map((cat: any, index: number) => (
                              <Badge key={index} variant="outline" className="border-[#5f5f5f] text-[#afafaf] text-xs">
                                {cat.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.tags && product.tags.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-[#afafaf] mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-1">
                            {product.tags.map((tag: any, index: number) => (
                              <Badge key={index} variant="outline" className="border-[#5f5f5f] text-[#afafaf] text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Sync Info */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle>Sync Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#afafaf]">Last Synced:</span>
                      <span>{new Date(product.last_synced_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#afafaf]">Status:</span>
                      <Badge
                        className={product.sync_status === 'synced' ? 'bg-green-600' : 'bg-yellow-600'}
                      >
                        {product.sync_status}
                      </Badge>
                    </div>
                    {product.store_url && (
                      <div className="flex justify-between">
                        <span className="text-[#afafaf]">Store:</span>
                        <span className="text-xs truncate max-w-32">{product.store_url}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}