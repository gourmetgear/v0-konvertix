import { WooCommerceProduct, WooCommerceProductInsert } from '@/types/woocommerce'

/**
 * Transform WooCommerce API product data to our database format
 */
export function transformWooCommerceProduct(
  wooProduct: any,
  userId: string,
  storeUrl: string
): WooCommerceProductInsert {
  // Extract dimensions
  const dimensions = wooProduct.dimensions || {}

  return {
    user_id: userId,
    woo_product_id: wooProduct.id,
    name: wooProduct.name || '',
    slug: wooProduct.slug || null,
    permalink: wooProduct.permalink || null,

    // Dates
    date_created: wooProduct.date_created || null,
    date_created_gmt: wooProduct.date_created_gmt || null,
    date_modified: wooProduct.date_modified || null,
    date_modified_gmt: wooProduct.date_modified_gmt || null,

    // Product type and status
    type: wooProduct.type || 'simple',
    status: wooProduct.status || 'draft',
    featured: wooProduct.featured || false,
    catalog_visibility: wooProduct.catalog_visibility || 'visible',

    // Content
    description: wooProduct.description || null,
    short_description: wooProduct.short_description || null,

    // Pricing - convert strings to numbers
    sku: wooProduct.sku || null,
    price: parseFloat(wooProduct.price) || null,
    regular_price: parseFloat(wooProduct.regular_price) || null,
    sale_price: parseFloat(wooProduct.sale_price) || null,
    date_on_sale_from: wooProduct.date_on_sale_from || null,
    date_on_sale_from_gmt: wooProduct.date_on_sale_from_gmt || null,
    date_on_sale_to: wooProduct.date_on_sale_to || null,
    date_on_sale_to_gmt: wooProduct.date_on_sale_to_gmt || null,
    on_sale: wooProduct.on_sale || false,

    // Purchase settings
    purchasable: wooProduct.purchasable || true,
    total_sales: wooProduct.total_sales || 0,
    virtual: wooProduct.virtual || false,
    downloadable: wooProduct.downloadable || false,

    // Downloads (store as JSONB)
    downloads: wooProduct.downloads || [],

    // Stock management
    manage_stock: wooProduct.manage_stock || false,
    stock_quantity: wooProduct.stock_quantity || null,
    stock_status: wooProduct.stock_status || 'instock',
    backorders: wooProduct.backorders || 'no',
    low_stock_amount: wooProduct.low_stock_amount || null,

    // Physical properties
    weight: parseFloat(wooProduct.weight) || null,
    length: parseFloat(dimensions.length) || null,
    width: parseFloat(dimensions.width) || null,
    height: parseFloat(dimensions.height) || null,

    // Shipping
    shipping_required: wooProduct.shipping_required ?? true,
    shipping_taxable: wooProduct.shipping_taxable ?? true,
    shipping_class: wooProduct.shipping_class || null,
    shipping_class_id: wooProduct.shipping_class_id || null,

    // Reviews
    reviews_allowed: wooProduct.reviews_allowed ?? true,
    average_rating: parseFloat(wooProduct.average_rating) || 0,
    rating_count: wooProduct.rating_count || 0,

    // Related products (store as JSONB arrays)
    related_ids: wooProduct.related_ids || [],
    upsell_ids: wooProduct.upsell_ids || [],
    cross_sell_ids: wooProduct.cross_sell_ids || [],

    // Categories and tags (store as JSONB)
    categories: wooProduct.categories || [],
    tags: wooProduct.tags || [],

    // Images (store as JSONB)
    images: wooProduct.images || [],

    // Attributes (store as JSONB)
    attributes: wooProduct.attributes || [],
    default_attributes: wooProduct.default_attributes || [],
    variations: wooProduct.variations || [],
    grouped_products: wooProduct.grouped_products || [],

    // Menu order
    menu_order: wooProduct.menu_order || 0,

    // Meta data (store as JSONB)
    meta_data: wooProduct.meta_data || [],

    // External product fields
    external_url: wooProduct.external_url || null,
    button_text: wooProduct.button_text || null,

    // Tax settings
    tax_status: wooProduct.tax_status || 'taxable',
    tax_class: wooProduct.tax_class || null,

    // Store tracking
    store_url: storeUrl,
    sync_status: 'synced'
  }
}

/**
 * Transform database product back to WooCommerce API format
 */
export function transformToWooCommerceFormat(dbProduct: any): WooCommerceProduct {
  return {
    id: dbProduct.id,
    woo_product_id: dbProduct.woo_product_id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    permalink: dbProduct.permalink,
    date_created: dbProduct.date_created,
    date_created_gmt: dbProduct.date_created_gmt,
    date_modified: dbProduct.date_modified,
    date_modified_gmt: dbProduct.date_modified_gmt,
    type: dbProduct.type,
    status: dbProduct.status,
    featured: dbProduct.featured,
    catalog_visibility: dbProduct.catalog_visibility,
    description: dbProduct.description,
    short_description: dbProduct.short_description,
    sku: dbProduct.sku,
    price: dbProduct.price?.toString(),
    regular_price: dbProduct.regular_price?.toString(),
    sale_price: dbProduct.sale_price?.toString(),
    date_on_sale_from: dbProduct.date_on_sale_from,
    date_on_sale_from_gmt: dbProduct.date_on_sale_from_gmt,
    date_on_sale_to: dbProduct.date_on_sale_to,
    date_on_sale_to_gmt: dbProduct.date_on_sale_to_gmt,
    on_sale: dbProduct.on_sale,
    purchasable: dbProduct.purchasable,
    total_sales: dbProduct.total_sales,
    virtual: dbProduct.virtual,
    downloadable: dbProduct.downloadable,
    downloads: dbProduct.downloads,
    manage_stock: dbProduct.manage_stock,
    stock_quantity: dbProduct.stock_quantity,
    stock_status: dbProduct.stock_status,
    backorders: dbProduct.backorders,
    low_stock_amount: dbProduct.low_stock_amount,
    weight: dbProduct.weight?.toString(),
    dimensions: {
      length: dbProduct.length?.toString(),
      width: dbProduct.width?.toString(),
      height: dbProduct.height?.toString()
    },
    shipping_required: dbProduct.shipping_required,
    shipping_taxable: dbProduct.shipping_taxable,
    shipping_class: dbProduct.shipping_class,
    shipping_class_id: dbProduct.shipping_class_id,
    reviews_allowed: dbProduct.reviews_allowed,
    average_rating: dbProduct.average_rating?.toString(),
    rating_count: dbProduct.rating_count,
    related_ids: dbProduct.related_ids,
    upsell_ids: dbProduct.upsell_ids,
    cross_sell_ids: dbProduct.cross_sell_ids,
    categories: dbProduct.categories,
    tags: dbProduct.tags,
    images: dbProduct.images,
    attributes: dbProduct.attributes,
    default_attributes: dbProduct.default_attributes,
    variations: dbProduct.variations,
    grouped_products: dbProduct.grouped_products,
    menu_order: dbProduct.menu_order,
    meta_data: dbProduct.meta_data,
    external_url: dbProduct.external_url,
    button_text: dbProduct.button_text,
    tax_status: dbProduct.tax_status,
    tax_class: dbProduct.tax_class,
    store_url: dbProduct.store_url,
    last_synced_at: dbProduct.last_synced_at,
    sync_status: dbProduct.sync_status
  }
}

/**
 * Validate WooCommerce product data
 */
export function validateWooCommerceProduct(product: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!product.id) {
    errors.push('Product ID is required')
  }

  if (!product.name || product.name.trim() === '') {
    errors.push('Product name is required')
  }

  if (product.regular_price && isNaN(parseFloat(product.regular_price))) {
    errors.push('Regular price must be a valid number')
  }

  if (product.sale_price && isNaN(parseFloat(product.sale_price))) {
    errors.push('Sale price must be a valid number')
  }

  if (product.weight && isNaN(parseFloat(product.weight))) {
    errors.push('Weight must be a valid number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}