-- Create campaign_analysis table for storing AI-generated campaign insights
CREATE TABLE IF NOT EXISTS campaign_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL DEFAULT 'campaign_performance', -- campaign_performance, audience_insights, optimization_recommendations
  title TEXT NOT NULL,
  summary TEXT,
  detailed_analysis JSONB, -- Store structured analysis data
  insights JSONB, -- Array of key insights
  recommendations JSONB, -- Array of actionable recommendations
  metrics JSONB, -- Key metrics and KPIs
  campaign_ids TEXT[], -- Array of campaign IDs this analysis covers
  date_range_start DATE,
  date_range_end DATE,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  status TEXT DEFAULT 'completed', -- pending, processing, completed, failed
  generated_by TEXT DEFAULT 'n8n_analysis', -- Track the source
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_campaign_analysis_account_id ON campaign_analysis(account_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analysis_user_id ON campaign_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analysis_type ON campaign_analysis(analysis_type);
CREATE INDEX IF NOT EXISTS idx_campaign_analysis_status ON campaign_analysis(status);
CREATE INDEX IF NOT EXISTS idx_campaign_analysis_created_at ON campaign_analysis(created_at DESC);

-- Enable Row Level Security
ALTER TABLE campaign_analysis ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own analysis
CREATE POLICY "Users can view their own campaign analysis" ON campaign_analysis
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own analysis
CREATE POLICY "Users can insert their own campaign analysis" ON campaign_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own analysis
CREATE POLICY "Users can update their own campaign analysis" ON campaign_analysis
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own analysis
CREATE POLICY "Users can delete their own campaign analysis" ON campaign_analysis
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_campaign_analysis_updated_at
  BEFORE UPDATE ON campaign_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy querying of recent analysis
CREATE OR REPLACE VIEW recent_campaign_analysis AS
SELECT
  id,
  account_id,
  user_id,
  analysis_type,
  title,
  summary,
  confidence_score,
  status,
  created_at,
  date_range_start,
  date_range_end,
  (detailed_analysis->>'total_campaigns')::INTEGER as total_campaigns,
  (metrics->>'total_spend')::DECIMAL as total_spend,
  (metrics->>'total_revenue')::DECIMAL as total_revenue,
  (metrics->>'average_roas')::DECIMAL as average_roas
FROM campaign_analysis
WHERE status = 'completed'
ORDER BY created_at DESC;