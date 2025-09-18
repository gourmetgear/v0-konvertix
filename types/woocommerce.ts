// WooCommerce Product Types

export interface WooCommerceProduct {
  // Internal Supabase fields
  id?: string
  user_id?: string
  created_at?: string
  updated_at?: string

  // WooCommerce product fields
  woo_product_id: number
  name: string
  slug?: string
  permalink?: string
  date_created?: string
  date_created_gmt?: string
  date_modified?: string
  date_modified_gmt?: string

  // Product type and status
  type?: 'simple' | 'variable' | 'grouped' | 'external'
  status?: 'draft' | 'pending' | 'private' | 'publish'
  featured?: boolean
  catalog_visibility?: 'visible' | 'catalog' | 'search' | 'hidden'

  // Content
  description?: string
  short_description?: string

  // Pricing
  sku?: string
  price?: string | number
  regular_price?: string | number
  sale_price?: string | number
  date_on_sale_from?: string | null
  date_on_sale_from_gmt?: string | null
  date_on_sale_to?: string | null
  date_on_sale_to_gmt?: string | null
  on_sale?: boolean

  // Purchase settings
  purchasable?: boolean
  total_sales?: number
  virtual?: boolean
  downloadable?: boolean

  // Downloads
  downloads?: WooCommerceDownload[]

  // Stock management
  manage_stock?: boolean
  stock_quantity?: number
  stock_status?: 'instock' | 'outofstock' | 'onbackorder'
  backorders?: 'no' | 'notify' | 'yes'
  low_stock_amount?: number

  // Physical properties
  weight?: string | number
  dimensions?: {
    length?: string | number
    width?: string | number
    height?: string | number
  }

  // Shipping
  shipping_required?: boolean
  shipping_taxable?: boolean
  shipping_class?: string
  shipping_class_id?: number

  // Reviews
  reviews_allowed?: boolean
  average_rating?: string | number
  rating_count?: number

  // Related products
  related_ids?: number[]
  upsell_ids?: number[]
  cross_sell_ids?: number[]

  // Categories and tags
  categories?: WooCommerceCategory[]
  tags?: WooCommerceTag[]

  // Images
  images?: WooCommerceImage[]

  // Attributes
  attributes?: WooCommerceAttribute[]
  default_attributes?: WooCommerceDefaultAttribute[]
  variations?: number[]
  grouped_products?: number[]

  // Menu order
  menu_order?: number

  // Meta data
  meta_data?: WooCommerceMetaData[]

  // External product fields
  external_url?: string
  button_text?: string

  // Tax settings
  tax_status?: 'taxable' | 'shipping' | 'none'
  tax_class?: string

  // Store tracking
  store_url?: string
  last_synced_at?: string
  sync_status?: 'synced' | 'pending' | 'error'
}

export interface WooCommerceDownload {
  id?: string
  name?: string
  file?: string
}

export interface WooCommerceCategory {
  id: number
  name?: string
  slug?: string
}

export interface WooCommerceTag {
  id: number
  name?: string
  slug?: string
}

export interface WooCommerceImage {
  id?: number
  date_created?: string
  date_created_gmt?: string
  date_modified?: string
  date_modified_gmt?: string
  src: string
  name?: string
  alt?: string
}

export interface WooCommerceAttribute {
  id?: number
  name?: string
  position?: number
  visible?: boolean
  variation?: boolean
  options?: string[]
}

export interface WooCommerceDefaultAttribute {
  id?: number
  name?: string
  option?: string
}

export interface WooCommerceMetaData {
  id?: number
  key: string
  value: string | number | boolean | object
}

// Database insert/update types (with proper Supabase types)
export interface WooCommerceProductInsert {
  user_id: string
  woo_product_id: number
  name: string
  slug?: string
  permalink?: string
  date_created?: string
  date_created_gmt?: string
  date_modified?: string
  date_modified_gmt?: string
  type?: string
  status?: string
  featured?: boolean
  catalog_visibility?: string
  description?: string
  short_description?: string
  sku?: string
  price?: number
  regular_price?: number
  sale_price?: number
  date_on_sale_from?: string
  date_on_sale_from_gmt?: string
  date_on_sale_to?: string
  date_on_sale_to_gmt?: string
  on_sale?: boolean
  purchasable?: boolean
  total_sales?: number
  virtual?: boolean
  downloadable?: boolean
  downloads?: any // JSONB
  manage_stock?: boolean
  stock_quantity?: number
  stock_status?: string
  backorders?: string
  low_stock_amount?: number
  weight?: number
  length?: number
  width?: number
  height?: number
  shipping_required?: boolean
  shipping_taxable?: boolean
  shipping_class?: string
  shipping_class_id?: number
  reviews_allowed?: boolean
  average_rating?: number
  rating_count?: number
  related_ids?: any // JSONB
  upsell_ids?: any // JSONB
  cross_sell_ids?: any // JSONB
  categories?: any // JSONB
  tags?: any // JSONB
  images?: any // JSONB
  attributes?: any // JSONB
  default_attributes?: any // JSONB
  variations?: any // JSONB
  grouped_products?: any // JSONB
  menu_order?: number
  meta_data?: any // JSONB
  external_url?: string
  button_text?: string
  tax_status?: string
  tax_class?: string
  store_url?: string
  sync_status?: string
}

export type WooCommerceProductUpdate = Partial<WooCommerceProductInsert>

// API Response types
export interface SyncProductsResponse {
  success: boolean
  message: string
  data?: {
    products_synced: number
    products_updated: number
    products_created: number
    errors: string[]
  }
}