# Facebook CAPI Metrics Integration Setup Guide

This guide walks you through setting up the complete Facebook CAPI metrics workflow with n8n automation.

## Overview

The system consists of:
1. **Database Schema** - Stores CAPI metrics in Supabase
2. **n8n Workflow** - Fetches metrics from Facebook API hourly
3. **API Endpoint** - Receives metrics from n8n
4. **Dashboard Component** - Displays metrics in the UI

## Prerequisites

- Supabase project with authentication enabled
- n8n instance (cloud or self-hosted)
- Facebook Developer Account with Business Manager access
- Facebook Pixel with CAPI configured

## Step 1: Database Setup

1. Run the database migration in Supabase SQL editor:
```sql
-- Run the contents of scripts/013_create_capi_metrics_table.sql
```

2. Update your existing capiconfig table:
```sql
-- Run the contents of scripts/012_add_provider_to_capiconfig.sql
```

## Step 2: Environment Variables

Add these environment variables to your Next.js project:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# API Key for n8n to authenticate with your app
N8N_API_KEY=your_secure_random_api_key

# Facebook API
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

## Step 3: n8n Workflow Setup

### 3.1 Install n8n (if needed)
```bash
npm install -g n8n
# or use Docker
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

### 3.2 Configure Credentials in n8n
1. **Supabase API Credential**
   - Name: `Supabase API`
   - URL: Your Supabase URL
   - Service Role Key: Your Supabase service role key

2. **Facebook Graph API Credential** (if using built-in node)
   - Access Token: Long-lived page access token

3. **Slack API Credential** (optional, for error notifications)
   - Bot Token: Your Slack bot token

### 3.3 Import Workflow
1. Open n8n web interface (usually http://localhost:5678)
2. Import the workflow from `n8n-workflows/facebook-capi-metrics-fetcher.json`
3. Update the webhook URL in the "Save to Database" node to point to your app:
   ```
   https://your-app-domain.com/api/capi-metrics
   ```
4. Update the Authorization header with your N8N_API_KEY

### 3.4 Activate Workflow
1. Ensure all credentials are properly configured
2. Test the workflow manually first
3. Activate the workflow to run every hour

## Step 4: Facebook API Setup

### 4.1 Get Required Permissions
Your Facebook app needs these permissions:
- `ads_read` - To read pixel data
- `business_management` - To access Business Manager data

### 4.2 Generate Long-lived Access Token
```bash
# Get long-lived user access token
curl -i -X GET "https://graph.facebook.com/oauth/access_token?
    grant_type=fb_exchange_token&
    client_id={app-id}&
    client_secret={app-secret}&
    fb_exchange_token={short-lived-user-access-token}"

# Get long-lived page access token (if needed)
curl -i -X GET "https://graph.facebook.com/me/accounts?access_token={long-lived-user-access-token}"
```

### 4.3 Test API Access
Test that you can access your pixel data:
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/{pixel-id}/stats?
    access_token={access-token}&
    start_time=2024-01-01&
    end_time=2024-01-02"
```

## Step 5: Configure CAPI Settings

1. Go to your app's Settings page
2. Add your Facebook account using "Add Facebook Account"
3. Configure the CAPI settings:
   - **Pixel ID**: Your Facebook Pixel ID
   - **Access Token**: Long-lived access token
   - **Domain**: Your website domain
   - **Events**: Comma-separated list (e.g., PageView, Purchase, Lead)
   - **Test Event Code**: Optional test event code

## Step 6: Test the Integration

### 6.1 Manual Test
1. Use the test page at `/test-conversions`
2. Test both configuration validation and conversion sending

### 6.2 n8n Workflow Test
1. Manually execute the workflow in n8n
2. Check the execution logs for any errors
3. Verify data appears in your `capi_metrics` table

### 6.3 Dashboard Test
1. Go to your Dashboard
2. Scroll down to see the CAPI Metrics Dashboard
3. Verify metrics are displaying correctly

## Step 7: Monitoring and Maintenance

### 7.1 Set up Monitoring
- Monitor n8n workflow execution logs
- Set up Slack alerts for failed executions
- Monitor API rate limits

### 7.2 Regular Maintenance
- Refresh Facebook access tokens before expiry (60 days)
- Monitor match rates and investigate drops
- Review and optimize event tracking

## Troubleshooting

### Common Issues

**1. "No CAPI configuration found"**
- Verify CAPI config is saved in Settings
- Check user_id matches between config and API call

**2. Facebook API errors**
- Verify access token is valid and not expired
- Check pixel ID is correct
- Ensure proper permissions are granted

**3. n8n workflow fails**
- Check all credentials are properly configured
- Verify webhook URL is accessible
- Check API key authentication

**4. No data in dashboard**
- Verify n8n workflow is running and executing successfully
- Check API endpoint logs for errors
- Ensure data is being saved to database

### Debug Steps

1. **Check n8n execution logs** for specific error messages
2. **Test API endpoints** directly with curl or Postman
3. **Query database** directly to verify data is being stored
4. **Check browser console** for frontend errors

## Data Flow

```
Facebook Pixel → Facebook Graph API → n8n Workflow → Your API → Supabase → Dashboard
```

1. Facebook collects conversion data via Pixel and CAPI
2. n8n workflow runs hourly to fetch yesterday's metrics
3. Workflow processes and sends data to your API endpoint
4. API endpoint validates and stores data in Supabase
5. Dashboard component fetches and displays metrics

## Security Considerations

- Store all secrets in environment variables
- Use proper API authentication
- Implement rate limiting on your API endpoints
- Regular access token rotation
- Monitor for unusual API usage patterns

## Performance Optimization

- Implement caching for dashboard data
- Use database indexes for common queries
- Batch process multiple pixels if you have many
- Consider using webhooks for real-time updates instead of polling