'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AuthGuard from '@/components/auth/AuthGuard'
import { supabase } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Package, Search, Filter, Upload, RefreshCw, AlertCircle, CheckCircle, ExternalLink, Eye, FileSpreadsheet } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ProductStats {
  total: number
  published: number
  draft: number
  totalRevenue: number
}

interface Product {
  id: string
  woo_product_id: number
  name: string
  slug: string
  permalink?: string
  price?: number
  regular_price?: number
  sale_price?: number
  sku?: string
  status: string
  type: string
  featured: boolean
  stock_status: string
  stock_quantity?: number
  manage_stock: boolean
  images: any[]
  categories: any[]
  short_description?: string
  last_synced_at: string
  sync_status: string
}

export default function ProductsPage() {
  return (
    <AuthGuard>
      <ProductsContent />
    </AuthGuard>
  )
}

function ProductsContent() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
  const [userId, setUserId] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<ProductStats>({ total: 0, published: 0, draft: 0, totalRevenue: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser()
        if (userRes.user) {
          setUserId(userRes.user.id)
          await loadProducts(userRes.user.id)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setError(t('products.errors.failedToLoadUser'))
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (userId) {
      const timeoutId = setTimeout(() => {
        loadProducts(userId, searchTerm)
      }, 300) // Debounce search

      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm, userId])

  const loadProducts = async (userId: string, search?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        userId,
        ...(search && { search }),
        limit: '50'
      })

      const response = await fetch(`/api/products?${params}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('products.errors.failedToLoadProducts'))
      }

      const { products, stats } = await response.json()
      setProducts(products)
      setStats(stats)

      console.log('✅ Loaded products:', products.length)

    } catch (error) {
      console.error('Error loading products:', error)
      setError(error instanceof Error ? error.message : t('products.errors.failedToLoadProducts'))
    } finally {
      setLoading(false)
    }
  }

  const handleSyncProducts = async () => {
    if (!userId) {
      setSyncStatus({ type: 'error', message: t('products.sync.userAuthRequired') })
      return
    }

    try {
      setSyncing(true)
      setSyncStatus({ type: null, message: '' })

      const response = await fetch('/api/sync-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        const errorResult = await response.json()
        throw new Error(errorResult.error || t('products.errors.failedToSyncProducts'))
      }

      const result = await response.json()
      console.log('Sync successful:', result)

      setSyncStatus({
        type: 'success',
        message: t('products.sync.success')
      })

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSyncStatus({ type: null, message: '' })
      }, 5000)

      // Reload products after successful sync
      await loadProducts(userId)

    } catch (error) {
      console.error('Sync error:', error)
      setSyncStatus({
        type: 'error',
        message: error instanceof Error ? error.message : t('products.errors.failedToSyncProducts')
      })
    } finally {
      setSyncing(false)
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'publish': return t('products.status.publish')
      case 'draft': return t('products.status.draft')
      case 'private': return t('products.status.private')
      default: return status
    }
  }

  const getStockStatusText = (stockStatus: string) => {
    switch (stockStatus) {
      case 'instock': return t('products.status.inStock')
      case 'outofstock': return t('products.status.outOfStock')
      case 'onbackorder': return t('products.status.onBackorder')
      default: return stockStatus
    }
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{t("products.title")}</h1>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  {t("products.actions.filter")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSyncProducts}
                  disabled={syncing}
                  className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent disabled:opacity-50"
                >
                  {syncing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("products.actions.syncing")}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("products.actions.syncProducts")}
                    </>
                  )}
                </Button>
                <Link href="/products/bulk-upload">
                  <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    {t("products.actions.bulkUpload")}
                  </Button>
                </Link>
                <Link href="/products/upload">
                  <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                    <Upload className="h-4 w-4 mr-2" />
                    {t("products.actions.uploadProduct")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Status Messages */}
            {syncStatus.type && (
              <Card className={`${
                syncStatus.type === 'success'
                  ? 'bg-green-900/20 border-green-500/50'
                  : 'bg-red-900/20 border-red-500/50'
              }`}>
                <CardContent className="p-4">
                  <div className={`flex items-center space-x-2 ${
                    syncStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {syncStatus.type === 'success' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <span>{syncStatus.message}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">{t("products.stats.totalProducts")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-[#afafaf]">{t("products.stats.totalProductsDesc")}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">{t("products.stats.published")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.published}</div>
                  <p className="text-xs text-[#afafaf]">{t("products.stats.publishedDesc")}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">{t("products.stats.draft")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.draft}</div>
                  <p className="text-xs text-[#afafaf]">{t("products.stats.draftDesc")}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#afafaf]">{t("products.stats.totalValue")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                  <p className="text-xs text-[#afafaf]">{t("products.stats.totalValueDesc")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
              <Input
                placeholder={t("products.search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2b2b2b] border-[#3f3f3f] text-white placeholder-[#afafaf]"
              />
            </div>

            {/* Loading State */}
            {loading && (
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-[#afafaf]">{t("products.states.loadingProducts")}</p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && !loading && (
              <Card className="bg-red-900/20 border-red-500/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            {!loading && !error && products.length > 0 && (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product.id} className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#5f5f5f] transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-[#3f3f3f] rounded-lg overflow-hidden flex-shrink-0">
                          {product.images && product.images.length > 0 && product.images[0].src ? (
                            <img
                              src={product.images[0].src}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjM2YzZjNmIi8+CjxwYXRoIGQ9Ik0yNCAzMkw0MCA0OEw1NiAzMkg2NEw2NCA2NEgyMFYzMkgyNFoiIGZpbGw9IiM2ZjZmNmYiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyOCIgcj0iNCIgZmlsbD0iIzZmNmY2ZiIvPgo8L3N2Zz4K'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-[#6f6f6f]" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-white truncate">
                                {product.name}
                              </h3>
                              <p className="text-sm text-[#afafaf] mt-1">
                                {t("products.details.id")}: {product.woo_product_id} • {t("products.details.sku")}: {product.sku || 'N/A'}
                              </p>

                              {/* Status and Type Badges */}
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={`${getStatusColor(product.status)} text-white`}>
                                  {getStatusText(product.status)}
                                </Badge>
                                <Badge variant="outline" className="border-[#5f5f5f] text-[#afafaf]">
                                  {product.type}
                                </Badge>
                                {product.featured && (
                                  <Badge className="bg-yellow-600 text-white">
                                    {t("products.status.featured")}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Price and Stock */}
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-white">
                                {formatPrice(product.regular_price)}
                              </div>
                              {product.sale_price && parseFloat(product.sale_price.toString()) > 0 && (
                                <div className="text-sm text-green-400 font-medium">
                                  {t("products.details.sale")}: {formatPrice(product.sale_price)}
                                </div>
                              )}
                              <div className={`text-sm mt-1 ${getStockStatusColor(product.stock_status)}`}>
                                {getStockStatusText(product.stock_status)}
                                {product.manage_stock && product.stock_quantity !== undefined && (
                                  <span className="text-[#afafaf]"> ({product.stock_quantity})</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Short Description */}
                          {product.short_description && (
                            <p className="text-sm text-[#afafaf] mt-3 line-clamp-2">
                              {product.short_description.replace(/<[^>]*>/g, '')}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-xs text-[#afafaf]">
                              {t("products.details.lastSynced")}: {new Date(product.last_synced_at).toLocaleString()}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link href={`/products/${product.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[#5f5f5f] text-[#afafaf] hover:text-white hover:border-[#7f7f7f]"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  {t("products.actions.view")}
                                </Button>
                              </Link>
                              {product.permalink && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[#5f5f5f] text-[#afafaf] hover:text-white hover:border-[#7f7f7f]"
                                  onClick={() => window.open(product.permalink, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  {t("products.actions.viewInStore")}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-[#afafaf]" />
                  <h3 className="text-xl font-semibold mb-2">{t("products.search.noProductsFound")}</h3>
                  <p className="text-[#afafaf] mb-6">
                    {searchTerm ? t("products.search.noResults") : t("products.states.noProductsDesc")}
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => loadProducts(userId)}
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("products.actions.refresh")}
                    </Button>
                    <Link href="/products/bulk-upload">
                      <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent mr-3">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        {t("products.actions.bulkUpload")}
                      </Button>
                    </Link>
                    <Link href="/products/upload">
                      <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                        <Upload className="h-4 w-4 mr-2" />
                        {t("products.actions.uploadProduct")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}