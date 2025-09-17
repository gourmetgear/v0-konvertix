'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Sidebar from '@/components/nav/Sidebar'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Image, Link as LinkIcon, MessageSquare, MousePointer, AlertCircle, Upload } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'

interface CreativeFormData {
  name: string
  message: string
  website_url: string
  call_to_action_type: string
  image_hash: string
  image_name: string
  image_url: string
}

interface CapiConfig {
  access_token: string
  page_id: string
  website_url: string
}

export default function CreateCreativePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [capiConfig, setCapiConfig] = useState<CapiConfig | null>(null)
  const [formData, setFormData] = useState<CreativeFormData>({
    name: '',
    message: 'Jetzt dein Camper-Deal sichern!',
    website_url: '',
    call_to_action_type: 'SHOP_NOW',
    image_hash: '',
    image_name: '',
    image_url: ''
  })

  const callToActionTypes = [
    { value: 'SHOP_NOW', label: 'Shop Now' },
    { value: 'LEARN_MORE', label: 'Learn More' },
    { value: 'SIGN_UP', label: 'Sign Up' },
    { value: 'DOWNLOAD', label: 'Download' },
    { value: 'BOOK_TRAVEL', label: 'Book Travel' },
    { value: 'CONTACT_US', label: 'Contact Us' },
    { value: 'APPLY_NOW', label: 'Apply Now' },
    { value: 'SUBSCRIBE', label: 'Subscribe' },
    { value: 'WATCH_MORE', label: 'Watch More' },
    { value: 'GET_QUOTE', label: 'Get Quote' }
  ]

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser()
        if (userRes.user) {
          setUserId(userRes.user.id)
          await loadCapiConfig(userRes.user.id)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setError('Failed to load user data')
      }
    }

    loadUserData()
  }, [])

  const loadCapiConfig = async (userId: string) => {
    try {
      const { data: config, error: configError } = await supabase
        .from('capiconfig')
        .select('token, page_id, website_url')
        .eq('user_id', userId)
        .eq('provider', 'facebook')
        .single()

      if (configError || !config) {
        setError('Facebook CAPI configuration not found. Please configure your Facebook settings first.')
        return
      }

      const capiData: CapiConfig = {
        access_token: config.token,
        page_id: config.page_id,
        website_url: config.website_url
      }

      setCapiConfig(capiData)

      // Pre-fill website URL from config
      setFormData(prev => ({
        ...prev,
        website_url: config.website_url || ''
      }))

    } catch (error) {
      console.error('Error loading CAPI config:', error)
      setError('Failed to load Facebook configuration')
    }
  }

  const handleInputChange = (field: keyof CreativeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageSelected = (imageUrl: string, imageName: string, imageHash?: string) => {
    console.log('Image selected:', { imageUrl, imageName, imageHash })
    setFormData(prev => ({
      ...prev,
      image_hash: imageHash || '',
      image_name: imageName,
      image_url: imageUrl
    }))
  }

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Creative name is required'
    if (!formData.message.trim()) return 'Message is required'
    if (!formData.website_url.trim()) return 'Website URL is required'
    if (!formData.call_to_action_type) return 'Call to action type is required'
    if (!formData.image_name) return 'Please select an image'
    if (!capiConfig) return 'Facebook configuration not found'

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const creativePayload = {
        name: formData.name,
        message: formData.message,
        website_url: formData.website_url,
        call_to_action_type: formData.call_to_action_type,
        image_url: formData.image_url,
        image_name: formData.image_name,
        userId: userId
      }

      console.log('Creating creative with payload:', creativePayload)

      const response = await fetch('/api/create-creative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creativePayload)
      })

      if (!response.ok) {
        const errorResult = await response.json()
        throw new Error(errorResult.error || `Failed to create creative: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Creative created successfully:', result)

      setSuccess(true)

      // Redirect to creatives list after success
      setTimeout(() => {
        router.push('/creatives')
      }, 2000)

    } catch (error) {
      console.error('Error creating creative:', error)
      setError(error instanceof Error ? error.message : 'Failed to create creative')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#0b021c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link href="/creatives">
                <Button variant="ghost" size="sm" className="text-[#afafaf] hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Create Creative</h1>
                <p className="text-[#afafaf]">Create a new Facebook ad creative</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="bg-red-900/20 border-red-500/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Message */}
            {success && (
              <Card className="bg-green-900/20 border-green-500/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-green-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>Creative created successfully! Redirecting...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Creative Form */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Creative Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Creative Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Creative Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter creative name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      Message <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="message"
                      type="text"
                      placeholder="Enter creative message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                      required
                    />
                    <p className="text-xs text-[#afafaf]">This will be displayed as the main text of your ad</p>
                  </div>

                  {/* Website URL */}
                  <div className="space-y-2">
                    <Label htmlFor="website_url" className="text-white">
                      <LinkIcon className="h-4 w-4 inline mr-1" />
                      Website URL <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="website_url"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                      className="bg-[#1a1a1a] border-[#3f3f3f] text-white placeholder-[#afafaf]"
                      required
                    />
                    <p className="text-xs text-[#afafaf]">URL where users will be directed when they click your ad</p>
                  </div>

                  {/* Call to Action */}
                  <div className="space-y-2">
                    <Label htmlFor="cta" className="text-white">
                      <MousePointer className="h-4 w-4 inline mr-1" />
                      Call to Action <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.call_to_action_type}
                      onValueChange={(value) => handleInputChange('call_to_action_type', value)}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-[#3f3f3f] text-white">
                        <SelectValue placeholder="Select call to action type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                        {callToActionTypes.map((cta) => (
                          <SelectItem key={cta.value} value={cta.value} className="text-white hover:bg-[#3f3f3f]">
                            {cta.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-[#afafaf]">Button text that will appear on your ad</p>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-white">
                      <Upload className="h-4 w-4 inline mr-1" />
                      Creative Image <span className="text-red-400">*</span>
                    </Label>
                    <ImageUpload
                      onImageSelected={handleImageSelected}
                      selectedImageName={formData.image_name}
                    />
                    <p className="text-xs text-[#afafaf]">Select an image for your creative from your uploaded assets</p>
                  </div>

                  {/* Configuration Status */}
                  {capiConfig && (
                    <Card className="bg-[#1a1a1a] border-[#3f3f3f]">
                      <CardContent className="p-4">
                        <h4 className="text-sm font-medium text-white mb-2">Facebook Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[#afafaf]">Page ID:</span>
                            <span className="text-white ml-2">{capiConfig.page_id}</span>
                          </div>
                          <div>
                            <span className="text-[#afafaf]">Access Token:</span>
                            <span className="text-white ml-2">***{capiConfig.access_token.slice(-6)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !capiConfig}
                      className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Image className="h-4 w-4 mr-2" />
                          Create Creative
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}