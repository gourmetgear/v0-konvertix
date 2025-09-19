-- Populate Benjamin Lauer's profile with missing data
UPDATE profiles
SET
  business_size = 'small',
  marketing_goal = 'lead-generation',
  monthly_budget = '5k-10k',
  target_audience = 'Ecommerce businesses looking to optimize their marketing analytics and improve conversion tracking',
  marketing_challenges = 'Attribution tracking, campaign optimization, cross-channel analytics',
  marketing_channels = '["Google Ads", "Facebook Ads", "Email Marketing", "SEO"]'::jsonb,
  interested_channels = '["TikTok Ads", "LinkedIn Ads", "Influencer Marketing"]'::jsonb,
  reporting_frequency = 'daily'
WHERE email = 'benjaminlauer33@gmail.com';

-- Also update business_profiles if it exists
UPDATE business_profiles
SET
  business_size = 'small',
  marketing_goal = 'lead-generation',
  monthly_budget = '5k-10k',
  target_audience = 'Ecommerce businesses looking to optimize their marketing analytics and improve conversion tracking',
  marketing_challenges = 'Attribution tracking, campaign optimization, cross-channel analytics',
  marketing_channels = '["Google Ads", "Facebook Ads", "Email Marketing", "SEO"]'::jsonb,
  interested_channels = '["TikTok Ads", "LinkedIn Ads", "Influencer Marketing"]'::jsonb,
  reporting_frequency = 'daily'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'benjaminlauer33@gmail.com');