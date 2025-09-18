/**
 * Utility functions for Facebook Ads Manager integration
 */

/**
 * Generates a Facebook Ads Manager URL for a specific campaign
 * @param campaignId - The Facebook campaign ID
 * @param adAccountId - The Facebook ad account ID (optional)
 * @returns URL to open the campaign in Facebook Ads Manager
 */
export function generateFacebookCampaignUrl(campaignId: string, adAccountId?: string): string {
  // Base Facebook Ads Manager URL
  const baseUrl = 'https://www.facebook.com/adsmanager/manage/campaigns'

  // If we have both campaign ID and ad account ID, create a direct link
  if (campaignId && adAccountId) {
    return `${baseUrl}?act=${adAccountId}&selected_campaign_ids=${campaignId}`
  }

  // If we only have campaign ID, use search functionality
  if (campaignId) {
    return `${baseUrl}?search=${encodeURIComponent(campaignId)}`
  }

  // Fallback to general campaigns view
  return baseUrl
}

/**
 * Generates a Facebook Ads Manager URL for ad account overview
 * @param adAccountId - The Facebook ad account ID
 * @returns URL to open the ad account in Facebook Ads Manager
 */
export function generateFacebookAdAccountUrl(adAccountId: string): string {
  return `https://www.facebook.com/adsmanager/manage?act=${adAccountId}`
}

/**
 * Opens a URL in a new tab/window
 * @param url - The URL to open
 */
export function openInNewTab(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Extracts campaign ID from various possible campaign identifier formats
 * @param campaignIdentifier - Could be campaign name, ID, or other identifier
 * @returns Cleaned campaign ID for Facebook URL
 */
export function extractCampaignId(campaignIdentifier: string): string {
  // If it's already a numeric ID, return as-is
  if (/^\d+$/.test(campaignIdentifier)) {
    return campaignIdentifier
  }

  // If it contains campaign ID pattern, extract it
  const idMatch = campaignIdentifier.match(/(\d{15,})/);
  if (idMatch) {
    return idMatch[1]
  }

  // Otherwise return the identifier as-is for search
  return campaignIdentifier
}

/**
 * Validates if a string looks like a Facebook campaign ID
 * @param campaignId - The ID to validate
 * @returns True if it looks like a valid Facebook campaign ID
 */
export function isValidFacebookCampaignId(campaignId: string): boolean {
  // Facebook campaign IDs are typically 15+ digit numbers
  return /^\d{15,}$/.test(campaignId)
}