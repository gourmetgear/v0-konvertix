-- Create Blog Posts Ideas table with image descriptions
CREATE TABLE IF NOT EXISTS blog_posts_ideas (
  -- Internal fields
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Core blog post fields
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived')),

  -- SEO and metadata
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],

  -- Content structure
  outline JSONB DEFAULT '[]', -- Array of section objects
  research_notes TEXT,
  target_audience TEXT,
  word_count_target INTEGER,
  estimated_reading_time INTEGER, -- in minutes

  -- Categorization
  category TEXT,
  tags TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),

  -- Publishing details
  publish_date TIMESTAMP WITH TIME ZONE,
  featured BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0, -- Higher number = higher priority

  -- Content planning
  content_type TEXT DEFAULT 'article' CHECK (content_type IN ('article', 'tutorial', 'guide', 'review', 'listicle', 'case_study', 'opinion')),
  tone TEXT CHECK (tone IN ('professional', 'casual', 'technical', 'conversational', 'formal')),

  -- Media and images
  featured_image JSONB DEFAULT '{}', -- Single main image object
  images JSONB DEFAULT '[]', -- Array of image objects with descriptions

  -- Collaboration
  author_notes TEXT,
  editor_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),

  -- Analytics and performance tracking
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  engagement_score DECIMAL(5,2) DEFAULT 0,

  -- External references
  related_products JSONB DEFAULT '[]', -- References to woocommerce_products
  external_links JSONB DEFAULT '[]', -- Array of external link objects
  sources JSONB DEFAULT '[]', -- Research sources and references

  -- Workflow tracking
  last_edited_by UUID REFERENCES auth.users(id),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create separate table for detailed image metadata
CREATE TABLE IF NOT EXISTS blog_post_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID REFERENCES blog_posts_ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Image file details
  filename TEXT NOT NULL,
  original_filename TEXT,
  file_path TEXT NOT NULL, -- Supabase storage path
  file_size INTEGER, -- in bytes
  mime_type TEXT,
  width INTEGER,
  height INTEGER,

  -- Image descriptions and metadata
  title TEXT,
  alt_text TEXT NOT NULL, -- Required for accessibility
  caption TEXT,
  description TEXT,

  -- SEO and optimization
  seo_title TEXT,
  seo_description TEXT,
  focal_point JSONB DEFAULT '{"x": 0.5, "y": 0.5}', -- For responsive cropping

  -- Categorization
  tags TEXT[],
  category TEXT,

  -- Usage tracking
  usage_context TEXT[], -- Where this image is used: 'featured', 'inline', 'thumbnail', etc.
  position_in_post INTEGER, -- Order within the blog post

  -- Copyright and attribution
  copyright_info TEXT,
  attribution TEXT,
  license TEXT,
  source_url TEXT,

  -- AI and automation
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_description TEXT, -- Auto-generated description
  ai_tags TEXT[], -- Auto-generated tags
  color_palette JSONB DEFAULT '[]', -- Extracted color information

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  approved BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_ideas_user_id ON blog_posts_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_ideas_status ON blog_posts_ideas(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_ideas_category ON blog_posts_ideas(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_ideas_publish_date ON blog_posts_ideas(publish_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_ideas_priority ON blog_posts_ideas(priority DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_ideas_featured ON blog_posts_ideas(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_ideas_tags ON blog_posts_ideas USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_ideas_keywords ON blog_posts_ideas USING GIN(keywords);

-- Indexes for images table
CREATE INDEX IF NOT EXISTS idx_blog_post_images_blog_post_id ON blog_post_images(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_images_user_id ON blog_post_images(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_images_usage_context ON blog_post_images USING GIN(usage_context);
CREATE INDEX IF NOT EXISTS idx_blog_post_images_tags ON blog_post_images USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_post_images_status ON blog_post_images(status);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_ideas_search ON blog_posts_ideas USING GIN(
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, ''))
);

-- Add RLS (Row Level Security)
ALTER TABLE blog_posts_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_posts_ideas
CREATE POLICY "Users can view their own blog posts" ON blog_posts_ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blog posts" ON blog_posts_ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog posts" ON blog_posts_ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog posts" ON blog_posts_ideas
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for blog_post_images
CREATE POLICY "Users can view their own blog post images" ON blog_post_images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blog post images" ON blog_post_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog post images" ON blog_post_images
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog post images" ON blog_post_images
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_blog_posts_ideas_updated_at
  BEFORE UPDATE ON blog_posts_ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_post_images_updated_at
  BEFORE UPDATE ON blog_post_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically generate slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'));
    NEW.slug = REGEXP_REPLACE(NEW.slug, '\s+', '-', 'g');
    NEW.slug = TRIM(NEW.slug, '-');

    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM blog_posts_ideas WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())) LOOP
      NEW.slug = NEW.slug || '-' || EXTRACT(EPOCH FROM NOW())::TEXT;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for slug generation
CREATE TRIGGER generate_blog_post_slug
  BEFORE INSERT OR UPDATE ON blog_posts_ideas
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_title();

-- Create function to update reading time based on content
CREATE OR REPLACE FUNCTION calculate_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.content IS NOT NULL THEN
    -- Estimate reading time: ~200 words per minute
    NEW.estimated_reading_time = CEIL(
      (array_length(string_to_array(REGEXP_REPLACE(NEW.content, '<[^>]*>', '', 'g'), ' '), 1))::DECIMAL / 200
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for reading time calculation
CREATE TRIGGER calculate_blog_post_reading_time
  BEFORE INSERT OR UPDATE ON blog_posts_ideas
  FOR EACH ROW
  EXECUTE FUNCTION calculate_reading_time();

-- Add comments for documentation
COMMENT ON TABLE blog_posts_ideas IS 'Stores blog post ideas, drafts, and published content with comprehensive metadata';
COMMENT ON TABLE blog_post_images IS 'Stores detailed image metadata and descriptions for blog posts';

COMMENT ON COLUMN blog_posts_ideas.outline IS 'JSON array of section objects with headings, subheadings, and key points';
COMMENT ON COLUMN blog_posts_ideas.images IS 'JSON array of image objects with descriptions, alt text, and metadata';
COMMENT ON COLUMN blog_posts_ideas.related_products IS 'JSON array referencing woocommerce_products for affiliate/product mentions';
COMMENT ON COLUMN blog_posts_ideas.sources IS 'JSON array of research sources, citations, and references';

COMMENT ON COLUMN blog_post_images.focal_point IS 'JSON object with x,y coordinates (0-1) for responsive image cropping';
COMMENT ON COLUMN blog_post_images.color_palette IS 'JSON array of dominant colors extracted from the image';
COMMENT ON COLUMN blog_post_images.ai_description IS 'Auto-generated image description using AI vision models';
COMMENT ON COLUMN blog_post_images.usage_context IS 'Array indicating where image is used: featured, inline, thumbnail, gallery, etc.';