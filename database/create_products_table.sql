-- Create WooCommerce Products table
CREATE TABLE IF NOT EXISTS woocommerce_products (
  -- Internal fields
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- WooCommerce product fields
  woo_product_id INTEGER NOT NULL, -- WooCommerce product ID
  name TEXT NOT NULL,
  slug TEXT,
  permalink TEXT,
  date_created TIMESTAMP WITH TIME ZONE,
  date_created_gmt TIMESTAMP WITH TIME ZONE,
  date_modified TIMESTAMP WITH TIME ZONE,
  date_modified_gmt TIMESTAMP WITH TIME ZONE,

  -- Product type and status
  type TEXT DEFAULT 'simple', -- simple, variable, grouped, external
  status TEXT DEFAULT 'draft', -- draft, pending, private, publish
  featured BOOLEAN DEFAULT FALSE,
  catalog_visibility TEXT DEFAULT 'visible', -- visible, catalog, search, hidden

  -- Content
  description TEXT,
  short_description TEXT,

  -- Pricing
  sku TEXT,
  price DECIMAL(10,2),
  regular_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  date_on_sale_from TIMESTAMP WITH TIME ZONE,
  date_on_sale_from_gmt TIMESTAMP WITH TIME ZONE,
  date_on_sale_to TIMESTAMP WITH TIME ZONE,
  date_on_sale_to_gmt TIMESTAMP WITH TIME ZONE,
  on_sale BOOLEAN DEFAULT FALSE,

  -- Purchase settings
  purchasable BOOLEAN DEFAULT TRUE,
  total_sales INTEGER DEFAULT 0,
  virtual BOOLEAN DEFAULT FALSE,
  downloadable BOOLEAN DEFAULT FALSE,

  -- Downloads (stored as JSONB for flexibility)
  downloads JSONB DEFAULT '[]',

  -- Stock management
  manage_stock BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER,
  stock_status TEXT DEFAULT 'instock', -- instock, outofstock, onbackorder
  backorders TEXT DEFAULT 'no', -- no, notify, yes
  low_stock_amount INTEGER,

  -- Physical properties
  weight DECIMAL(8,3),
  length DECIMAL(8,3),
  width DECIMAL(8,3),
  height DECIMAL(8,3),

  -- Shipping
  shipping_required BOOLEAN DEFAULT TRUE,
  shipping_taxable BOOLEAN DEFAULT TRUE,
  shipping_class TEXT,
  shipping_class_id INTEGER,

  -- Reviews
  reviews_allowed BOOLEAN DEFAULT TRUE,
  average_rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,

  -- Related products (stored as JSONB arrays)
  related_ids JSONB DEFAULT '[]',
  upsell_ids JSONB DEFAULT '[]',
  cross_sell_ids JSONB DEFAULT '[]',

  -- Categories and tags (stored as JSONB)
  categories JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',

  -- Images (stored as JSONB)
  images JSONB DEFAULT '[]',

  -- Attributes (stored as JSONB for flexibility)
  attributes JSONB DEFAULT '[]',
  default_attributes JSONB DEFAULT '[]',
  variations JSONB DEFAULT '[]',
  grouped_products JSONB DEFAULT '[]',

  -- Menu order
  menu_order INTEGER DEFAULT 0,

  -- Meta data (stored as JSONB for flexibility)
  meta_data JSONB DEFAULT '[]',

  -- External product fields
  external_url TEXT,
  button_text TEXT,

  -- Tax settings
  tax_status TEXT DEFAULT 'taxable', -- taxable, shipping, none
  tax_class TEXT,

  -- Store URL for multi-store support
  store_url TEXT,

  -- Sync tracking
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sync_status TEXT DEFAULT 'synced' -- synced, pending, error
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_woocommerce_products_user_id ON woocommerce_products(user_id);
CREATE INDEX IF NOT EXISTS idx_woocommerce_products_woo_id ON woocommerce_products(woo_product_id);
CREATE INDEX IF NOT EXISTS idx_woocommerce_products_sku ON woocommerce_products(sku);
CREATE INDEX IF NOT EXISTS idx_woocommerce_products_status ON woocommerce_products(status);
CREATE INDEX IF NOT EXISTS idx_woocommerce_products_type ON woocommerce_products(type);
CREATE INDEX IF NOT EXISTS idx_woocommerce_products_store_url ON woocommerce_products(store_url);
CREATE INDEX IF NOT EXISTS idx_woocommerce_products_last_synced ON woocommerce_products(last_synced_at);

-- Create unique constraint on woo_product_id + user_id + store_url
CREATE UNIQUE INDEX IF NOT EXISTS idx_woocommerce_products_unique
ON woocommerce_products(woo_product_id, user_id, store_url);

-- Add RLS (Row Level Security)
ALTER TABLE woocommerce_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own products" ON woocommerce_products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON woocommerce_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON woocommerce_products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON woocommerce_products
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_woocommerce_products_updated_at
  BEFORE UPDATE ON woocommerce_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE woocommerce_products IS 'Stores synchronized WooCommerce product data for each user';
COMMENT ON COLUMN woocommerce_products.woo_product_id IS 'Original WooCommerce product ID';
COMMENT ON COLUMN woocommerce_products.user_id IS 'Supabase user ID who owns this product';
COMMENT ON COLUMN woocommerce_products.store_url IS 'WooCommerce store URL for multi-store support';
COMMENT ON COLUMN woocommerce_products.last_synced_at IS 'Last time this product was synced from WooCommerce';
COMMENT ON COLUMN woocommerce_products.sync_status IS 'Current sync status: synced, pending, error';