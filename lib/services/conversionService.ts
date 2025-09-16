// Unified conversion service for Facebook and Google Ads
import { supabase } from '@/lib/supabase/client'

export interface ConversionEvent {
  eventName: string
  eventTime?: number
  eventSourceUrl?: string
  userData?: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    city?: string
    state?: string
    zip?: string
    country?: string
    clientIpAddress?: string
    clientUserAgent?: string
    fbc?: string // Facebook click ID
    fbp?: string // Facebook browser ID
    gclid?: string // Google click ID
  }
  customData?: {
    currency?: string
    value?: number
    orderId?: string
    contentName?: string
    contentCategory?: string
    contentIds?: string[]
    contentType?: string
    numItems?: number
    searchString?: string
    status?: string
  }
}

export interface GoogleConversion {
  gclid?: string
  conversionActionId: string
  conversionDateTime: string
  value?: number
  currencyCode?: string
  orderId?: string
  userAgent?: string
  userIdentifiers?: {
    hashedEmail?: string
    hashedPhoneNumber?: string
    addressInfo?: {
      hashedFirstName?: string
      hashedLastName?: string
      city?: string
      state?: string
      countryCode?: string
      postalCode?: string
    }
  }
}

export interface CapiConfig {
  provider: 'facebook' | 'google'
  accountId: string
  pixelId?: string // Facebook
  customerId?: string // Google
  accessToken: string
  domain?: string
  events?: string[]
  testEventCode?: string // Facebook
  developerToken?: string // Google
  refreshToken?: string // Google
  conversionActions?: string[] // Google
}

export class ConversionService {
  
  // Get CAPI configuration for a user and account
  static async getCapiConfig(userId: string, accountId: string): Promise<CapiConfig | null> {
    try {
      const { data, error } = await supabase
        .from('capiconfig')
        .select('*')
        .eq('user_id', userId)
        .eq('account_id', accountId)
        .single()

      if (error) {
        console.error('Failed to fetch CAPI config:', error)
        return null
      }

      return data as CapiConfig
    } catch (error) {
      console.error('Error getting CAPI config:', error)
      return null
    }
  }

  // Send conversions to Facebook
  static async sendFacebookConversions(
    config: CapiConfig, 
    events: ConversionEvent[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('/api/conversions/facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pixelId: config.pixelId,
          accessToken: config.accessToken,
          events,
          testEventCode: config.testEventCode,
          domain: config.domain
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Facebook API request failed' }
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Facebook conversion error:', error)
      return { success: false, error: 'Network error sending to Facebook' }
    }
  }

  // Send conversions to Google Ads
  static async sendGoogleConversions(
    config: CapiConfig, 
    conversions: GoogleConversion[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('/api/conversions/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: config.customerId || config.pixelId, // Support legacy field mapping
          conversions,
          accessToken: config.accessToken,
          developerToken: config.developerToken || config.testEventCode // Support legacy field mapping
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Google Ads API request failed' }
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Google Ads conversion error:', error)
      return { success: false, error: 'Network error sending to Google Ads' }
    }
  }

  // Send conversions to the appropriate provider
  static async sendConversions(
    userId: string,
    accountId: string,
    events: ConversionEvent[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const config = await this.getCapiConfig(userId, accountId)
    
    if (!config) {
      return { success: false, error: 'No CAPI configuration found for this account' }
    }

    if (config.provider === 'facebook') {
      return this.sendFacebookConversions(config, events)
    } else if (config.provider === 'google') {
      // Convert Facebook-style events to Google conversions
      const googleConversions: GoogleConversion[] = events.map(event => ({
        gclid: event.userData?.gclid,
        conversionActionId: config.conversionActions?.[0] || '', // Use first conversion action
        conversionDateTime: new Date(event.eventTime ? event.eventTime * 1000 : Date.now()).toISOString(),
        value: event.customData?.value,
        currencyCode: event.customData?.currency || 'USD',
        orderId: event.customData?.orderId,
        userAgent: event.userData?.clientUserAgent,
        userIdentifiers: {
          hashedEmail: event.userData?.email,
          hashedPhoneNumber: event.userData?.phone,
          addressInfo: {
            hashedFirstName: event.userData?.firstName,
            hashedLastName: event.userData?.lastName,
            city: event.userData?.city,
            state: event.userData?.state,
            countryCode: event.userData?.country,
            postalCode: event.userData?.zip
          }
        }
      }))
      
      return this.sendGoogleConversions(config, googleConversions)
    }

    return { success: false, error: 'Unsupported provider: ' + config.provider }
  }

  // Validate Facebook pixel connection
  static async validateFacebookPixel(
    pixelId: string, 
    accessToken: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`/api/conversions/facebook?pixelId=${pixelId}&accessToken=${accessToken}`)
      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Pixel validation failed' }
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Pixel validation error:', error)
      return { success: false, error: 'Network error validating pixel' }
    }
  }

  // Get Google Ads conversion actions
  static async getGoogleConversionActions(
    customerId: string,
    accessToken: string,
    developerToken: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`/api/conversions/google?customerId=${customerId}&accessToken=${accessToken}&developerToken=${developerToken}`)
      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch conversion actions' }
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Conversion actions fetch error:', error)
      return { success: false, error: 'Network error fetching conversion actions' }
    }
  }
}

// Helper function to create a standard conversion event
export function createConversionEvent(
  eventName: string,
  userData: Partial<ConversionEvent['userData']> = {},
  customData: Partial<ConversionEvent['customData']> = {},
  eventSourceUrl?: string
): ConversionEvent {
  return {
    eventName,
    eventTime: Math.floor(Date.now() / 1000),
    eventSourceUrl,
    userData,
    customData
  }
}

export default ConversionService