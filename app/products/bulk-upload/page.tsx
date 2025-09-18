'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/auth/AuthGuard'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw,
  Copy,
  FileSpreadsheet
} from 'lucide-react'
import Link from 'next/link'

interface BulkProductData {
  id: string
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
  status: 'pending' | 'uploading' | 'success' | 'error'
  error_message?: string
}

const INITIAL_PRODUCT: Omit<BulkProductData, 'id'> = {
  name: '',
  type: 'simple',
  regular_price: '',
  sku: '',
  description: '',
  short_description: '',
  manage_stock: true,
  stock_quantity: 0,
  category_id: 12,
  image_url: 'no-image',
  seo_title: '',
  seo_description: '',
  seo_focus_kw: '',
  status: 'pending'
}

export default function BulkProductUploadPage() {
  return (
    <AuthGuard>
      <BulkProductUploadContent />
    </AuthGuard>
  )
}

function BulkProductUploadContent() {
  const router = useRouter()
  const [products, setProducts] = useState<BulkProductData[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [userImages, setUserImages] = useState<string[]>([])
  const [editingCell, setEditingCell] = useState<{ productId: string, field: string } | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser()
        if (userRes.user) {
          setUserId(userRes.user.id)
          await loadUserImages(userRes.user.id)
          // Initialize with 5 empty rows
          addEmptyRows(5)
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
      const response = await fetch(`/api/user-images?userId=${userId}`)
      if (response.ok) {
        const { images } = await response.json()
        setUserImages(images)
      }
    } catch (error) {
      console.error('Error loading user images:', error)
    }
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addEmptyRows = (count: number = 1) => {
    const newProducts = Array.from({ length: count }, () => ({
      ...INITIAL_PRODUCT,
      id: generateId(),
    }))
    setProducts(prev => [...prev, ...newProducts])
  }

  const updateProduct = (id: string, field: keyof BulkProductData, value: any) => {
    setProducts(prev => prev.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ))
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  const duplicateProduct = (id: string) => {
    const productToDuplicate = products.find(p => p.id === id)
    if (productToDuplicate) {
      const newProduct = {
        ...productToDuplicate,
        id: generateId(),
        name: `${productToDuplicate.name} (Copy)`,
        sku: `${productToDuplicate.sku}-copy`,
        status: 'pending' as const
      }
      const index = products.findIndex(p => p.id === id)
      setProducts(prev => [
        ...prev.slice(0, index + 1),
        newProduct,
        ...prev.slice(index + 1)
      ])
    }
  }

  const validateProduct = (product: BulkProductData): string | null => {
    if (!product.name.trim()) return 'Product name is required'
    if (!product.regular_price.trim()) return 'Regular price is required'
    if (!product.sku.trim()) return 'SKU is required'
    if (!product.description.trim()) return 'Description is required'
    if (!product.short_description.trim()) return 'Short description is required'
    if (isNaN(parseFloat(product.regular_price))) return 'Regular price must be a valid number'
    return null
  }

  const uploadSingleProduct = async (product: BulkProductData): Promise<boolean> => {
    const validationError = validateProduct(product)
    if (validationError) {
      updateProduct(product.id, 'status', 'error')
      updateProduct(product.id, 'error_message', validationError)
      return false
    }

    try {
      updateProduct(product.id, 'status', 'uploading')

      const payload = {
        name: product.name,
        type: product.type,
        regular_price: product.regular_price,
        sku: product.sku,
        description: product.description,
        short_description: product.short_description,
        manage_stock: product.manage_stock,
        stock_quantity: product.stock_quantity,
        categories: [{ id: product.category_id }],
        images: product.image_url && product.image_url !== 'no-image' ? [{ src: product.image_url }] : [],
        meta_data: [
          { key: "rank_math_title", value: product.seo_title },
          { key: "rank_math_description", value: product.seo_description },
          { key: "rank_math_focus_keyword", value: product.seo_focus_kw }
        ],
        userId: userId
      }

      const response = await fetch('/api/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorResult = await response.json()
        throw new Error(errorResult.error || 'Failed to create product')
      }

      updateProduct(product.id, 'status', 'success')
      return true
    } catch (error) {
      updateProduct(product.id, 'status', 'error')
      updateProduct(product.id, 'error_message', error instanceof Error ? error.message : 'Upload failed')
      return false
    }
  }

  const uploadAllProducts = async () => {
    const validProducts = products.filter(p =>
      p.name.trim() && p.regular_price.trim() && p.sku.trim()
    )

    if (validProducts.length === 0) {
      setError('No valid products to upload')
      return
    }

    setLoading(true)
    setUploadingCount(0)
    setError(null)

    let successCount = 0

    for (let i = 0; i < validProducts.length; i++) {
      const product = validProducts[i]
      setUploadingCount(i + 1)

      const success = await uploadSingleProduct(product)
      if (success) successCount++

      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setLoading(false)
    setUploadingCount(0)

    if (successCount === validProducts.length) {
      setError(null)
      // Show success message briefly then reset
      setTimeout(() => {
        setProducts([])
        addEmptyRows(5)
      }, 2000)
    } else {
      setError(`${successCount}/${validProducts.length} products uploaded successfully. Check individual rows for errors.`)
    }
  }

  const exportTemplate = () => {
    const csvHeaders = [
      'Name', 'Type', 'Regular Price', 'SKU', 'Description',
      'Short Description', 'Manage Stock', 'Stock Quantity',
      'Category ID', 'Image URL', 'SEO Title', 'SEO Description', 'Focus Keyword'
    ]

    const csvRows = [
      csvHeaders.join(','),
      // Add one sample row
      `"Sample Product","simple","9.99","SAMPLE-001","This is a sample product description","Short sample description","true","100","12","","Sample SEO Title","Sample SEO Description","sample keyword"`
    ]

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk-product-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleCellClick = (productId: string, field: string) => {
    setEditingCell({ productId, field })
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  const getStatusColor = (status: BulkProductData['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'uploading': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: BulkProductData['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      case 'uploading': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">Bulk Product Upload</h1>
                  <p className="text-[#afafaf]">Upload multiple products using an Excel-like interface</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={exportTemplate}
                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <Button
                  onClick={() => addEmptyRows(5)}
                  variant="outline"
                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add 5 Rows
                </Button>
                <Button
                  onClick={uploadAllProducts}
                  disabled={loading || products.length === 0}
                  className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading {uploadingCount}/{products.filter(p => p.name.trim()).length}...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload All Products
                    </>
                  )}
                </Button>
              </div>
            </div>


            {/* Error/Status Message */}
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

            {/* Bulk Products Table */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Product Data Sheet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={tableRef} className="overflow-x-auto">
                  <div className="min-w-[1800px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-14 gap-2 p-2 bg-[#1a1a1a] border border-[#3f3f3f] rounded-t-lg text-sm font-medium">
                      <div className="col-span-1">#</div>
                      <div className="col-span-2">Product Name *</div>
                      <div className="col-span-1">Type</div>
                      <div className="col-span-1">Price *</div>
                      <div className="col-span-1">SKU *</div>
                      <div className="col-span-2">Description *</div>
                      <div className="col-span-2">Short Description *</div>
                      <div className="col-span-1">Stock</div>
                      <div className="col-span-1">Category</div>
                      <div className="col-span-1">Image</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Actions</div>
                    </div>

                    {/* Table Rows */}
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        className={`grid grid-cols-14 gap-2 p-2 border-x border-b border-[#3f3f3f] hover:bg-[#3f3f3f]/20 transition-colors ${
                          product.status === 'error' ? 'bg-red-900/10' :
                          product.status === 'success' ? 'bg-green-900/10' : ''
                        }`}
                      >
                        {/* Row Number */}
                        <div className="col-span-1 flex items-center text-sm text-[#afafaf]">
                          {index + 1}
                        </div>

                        {/* Product Name */}
                        <div className="col-span-2">
                          <Input
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                            placeholder="Enter product name"
                            className="h-8 bg-[#1a1a1a] border-[#3f3f3f] text-white text-sm"
                          />
                        </div>

                        {/* Type */}
                        <div className="col-span-1">
                          <Select
                            value={product.type}
                            onValueChange={(value) => updateProduct(product.id, 'type', value)}
                          >
                            <SelectTrigger className="h-8 bg-[#1a1a1a] border-[#3f3f3f] text-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                              <SelectItem value="simple" className="text-white hover:bg-[#3f3f3f]">Simple</SelectItem>
                              <SelectItem value="variable" className="text-white hover:bg-[#3f3f3f]">Variable</SelectItem>
                              <SelectItem value="grouped" className="text-white hover:bg-[#3f3f3f]">Grouped</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Price */}
                        <div className="col-span-1">
                          <Input
                            type="number"
                            step="0.01"
                            value={product.regular_price}
                            onChange={(e) => updateProduct(product.id, 'regular_price', e.target.value)}
                            placeholder="9.99"
                            className="h-8 bg-[#1a1a1a] border-[#3f3f3f] text-white text-sm"
                          />
                        </div>

                        {/* SKU */}
                        <div className="col-span-1">
                          <Input
                            value={product.sku}
                            onChange={(e) => updateProduct(product.id, 'sku', e.target.value)}
                            placeholder="SKU-001"
                            className="h-8 bg-[#1a1a1a] border-[#3f3f3f] text-white text-sm"
                          />
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                          <Input
                            value={product.description}
                            onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                            placeholder="Product description"
                            className="h-8 bg-[#1a1a1a] border-[#3f3f3f] text-white text-sm"
                          />
                        </div>

                        {/* Short Description */}
                        <div className="col-span-2">
                          <Input
                            value={product.short_description}
                            onChange={(e) => updateProduct(product.id, 'short_description', e.target.value)}
                            placeholder="Short description"
                            className="h-8 bg-[#1a1a1a] border-[#3f3f3f] text-white text-sm"
                          />
                        </div>

                        {/* Stock */}
                        <div className="col-span-1">
                          <Input
                            type="number"
                            value={product.stock_quantity}
                            onChange={(e) => updateProduct(product.id, 'stock_quantity', parseInt(e.target.value) || 0)}
                            placeholder="100"
                            className="h-8 bg-[#1a1a1a] border-[#3f3f3f] text-white text-sm"
                          />
                        </div>

                        {/* Category */}
                        <div className="col-span-1">
                          <Input
                            type="number"
                            value={product.category_id}
                            onChange={(e) => updateProduct(product.id, 'category_id', parseInt(e.target.value) || 12)}
                            placeholder="12"
                            className="h-8 bg-[#1a1a1a] border-[#3f3f3f] text-white text-sm"
                          />
                        </div>

                        {/* Image */}
                        <div className="col-span-1">
                          <Select
                            value={product.image_url}
                            onValueChange={(value) => updateProduct(product.id, 'image_url', value)}
                          >
                            <SelectTrigger className="h-8 bg-[#1a1a1a] border-[#3f3f3f] text-white text-sm">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f] max-h-48">
                              <SelectItem value="no-image" className="text-white hover:bg-[#3f3f3f]">No image</SelectItem>
                              {userImages.map((imageUrl) => {
                                const fileName = imageUrl.split('/').pop() || 'Image'
                                return (
                                  <SelectItem key={imageUrl} value={imageUrl} className="text-white hover:bg-[#3f3f3f]">
                                    {fileName.substring(0, 20)}...
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>


                        {/* Status */}
                        <div className="col-span-1 flex items-center">
                          <div className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            {product.status}
                          </div>
                          {product.status === 'error' && product.error_message && (
                            <div className="text-xs text-red-400 truncate ml-1" title={product.error_message}>
                              {product.error_message}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => duplicateProduct(product.id)}
                            className="h-8 w-8 p-0 hover:bg-[#3f3f3f]"
                            title="Duplicate row"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteProduct(product.id)}
                            className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
                            title="Delete row"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Add Row Button */}
                    <div className="p-4 border-x border-b border-[#3f3f3f] rounded-b-lg bg-[#1a1a1a]">
                      <Button
                        onClick={() => addEmptyRows(1)}
                        variant="outline"
                        size="sm"
                        className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Row
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <ul className="text-sm text-[#afafaf] space-y-1">
                  <li>• Fill in the required fields marked with * for each product</li>
                  <li>• Use the dropdown to select images from your uploaded collection</li>
                  <li>• Click the duplicate button to copy a row with all its data</li>
                  <li>• Products will be validated before upload - check the status column for errors</li>
                  <li>• Download the CSV template for bulk import from spreadsheet applications</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}