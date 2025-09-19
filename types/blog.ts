// Blog Posts and Images Types for Supabase Schema

export interface BlogPostIdea {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  // Core blog post fields
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status: 'draft' | 'pending' | 'published' | 'archived';

  // SEO and metadata
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];

  // Content structure
  outline?: OutlineSection[];
  research_notes?: string;
  target_audience?: string;
  word_count_target?: number;
  estimated_reading_time?: number;

  // Categorization
  category?: string;
  tags?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';

  // Publishing details
  publish_date?: string;
  featured: boolean;
  priority: number;

  // Content planning
  content_type: 'article' | 'tutorial' | 'guide' | 'review' | 'listicle' | 'case_study' | 'opinion';
  tone?: 'professional' | 'casual' | 'technical' | 'conversational' | 'formal';

  // Media and images
  featured_image?: FeaturedImage;
  images?: BlogImage[];

  // Collaboration
  author_notes?: string;
  editor_notes?: string;
  assigned_to?: string;

  // Analytics and performance tracking
  view_count: number;
  share_count: number;
  engagement_score: number;

  // External references
  related_products?: RelatedProduct[];
  external_links?: ExternalLink[];
  sources?: Source[];

  // Workflow tracking
  last_edited_by?: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  approved_by?: string;
  approved_at?: string;
}

export interface BlogPostImage {
  id: string;
  blog_post_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  // Image file details
  filename: string;
  original_filename?: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;

  // Image descriptions and metadata
  title?: string;
  alt_text: string;
  caption?: string;
  description?: string;

  // SEO and optimization
  seo_title?: string;
  seo_description?: string;
  focal_point: {
    x: number;
    y: number;
  };

  // Categorization
  tags?: string[];
  category?: string;

  // Usage tracking
  usage_context?: ImageUsageContext[];
  position_in_post?: number;

  // Copyright and attribution
  copyright_info?: string;
  attribution?: string;
  license?: string;
  source_url?: string;

  // AI and automation
  ai_generated: boolean;
  ai_description?: string;
  ai_tags?: string[];
  color_palette?: ColorInfo[];

  // Status
  status: 'active' | 'archived' | 'deleted';
  approved: boolean;
}

// Supporting interfaces
export interface OutlineSection {
  id: string;
  level: number; // 1 = H1, 2 = H2, etc.
  title: string;
  description?: string;
  key_points?: string[];
  word_count_estimate?: number;
  order: number;
}

export interface FeaturedImage {
  id?: string;
  url: string;
  alt_text: string;
  caption?: string;
  title?: string;
  focal_point?: {
    x: number;
    y: number;
  };
}

export interface BlogImage {
  id: string;
  url: string;
  alt_text: string;
  caption?: string;
  title?: string;
  description?: string;
  position?: number;
  usage_context?: ImageUsageContext[];
}

export interface RelatedProduct {
  product_id: string;
  woo_product_id: number;
  name: string;
  url?: string;
  price?: number;
  image?: string;
  mention_context: string; // How it's mentioned in the blog post
}

export interface ExternalLink {
  id: string;
  url: string;
  title: string;
  description?: string;
  domain: string;
  link_type: 'reference' | 'resource' | 'affiliate' | 'sponsor';
  anchor_text?: string;
  no_follow: boolean;
}

export interface Source {
  id: string;
  title: string;
  url?: string;
  author?: string;
  publication?: string;
  publish_date?: string;
  access_date: string;
  citation_format: 'APA' | 'MLA' | 'Chicago' | 'custom';
  notes?: string;
}

export interface ColorInfo {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  percentage: number; // How much of the image this color represents
  name?: string; // Human-readable color name
}

export type ImageUsageContext =
  | 'featured'
  | 'inline'
  | 'thumbnail'
  | 'gallery'
  | 'banner'
  | 'icon'
  | 'diagram'
  | 'screenshot'
  | 'illustration';

// API request/response interfaces
export interface CreateBlogPostRequest {
  title: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  status?: BlogPostIdea['status'];
  featured_image?: Omit<FeaturedImage, 'id'>;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
  id: string;
}

export interface CreateBlogImageRequest {
  blog_post_id: string;
  filename: string;
  file_path: string;
  alt_text: string;
  title?: string;
  caption?: string;
  description?: string;
  usage_context?: ImageUsageContext[];
  position_in_post?: number;
}

export interface BlogPostFilters {
  status?: BlogPostIdea['status'];
  category?: string;
  tags?: string[];
  featured?: boolean;
  difficulty_level?: BlogPostIdea['difficulty_level'];
  content_type?: BlogPostIdea['content_type'];
  approval_status?: BlogPostIdea['approval_status'];
  search?: string; // For full-text search
  date_from?: string;
  date_to?: string;
}

export interface BlogPostListResponse {
  data: BlogPostIdea[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Supabase database types (for use with supabase-js)
export interface Database {
  public: {
    Tables: {
      blog_posts_ideas: {
        Row: BlogPostIdea;
        Insert: Omit<BlogPostIdea, 'id' | 'created_at' | 'updated_at' | 'slug'>;
        Update: Partial<Omit<BlogPostIdea, 'id' | 'user_id' | 'created_at'>>;
      };
      blog_post_images: {
        Row: BlogPostImage;
        Insert: Omit<BlogPostImage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogPostImage, 'id' | 'blog_post_id' | 'user_id' | 'created_at'>>;
      };
    };
  };
}

// Utility types for forms and components
export type BlogPostFormData = Pick<
  BlogPostIdea,
  | 'title'
  | 'content'
  | 'excerpt'
  | 'category'
  | 'tags'
  | 'meta_title'
  | 'meta_description'
  | 'target_audience'
  | 'difficulty_level'
  | 'content_type'
  | 'tone'
>;

export type BlogImageFormData = Pick<
  BlogPostImage,
  | 'filename'
  | 'alt_text'
  | 'title'
  | 'caption'
  | 'description'
  | 'usage_context'
  | 'tags'
  | 'category'
>;