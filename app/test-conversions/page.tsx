"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TestConversionsPage() {
  const [userId, setUserId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [testType, setTestType] = useState('pageview')
  const [provider, setProvider] = useState<'facebook' | 'google'>('facebook')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  // Validation test states
  const [validationLoading, setValidationLoading] = useState(false)
  const [pixelId, setPixelId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [developerToken, setDeveloperToken] = useState('')

  const runConversionTest = async () => {
    if (!userId || !accountId) {
      setError('Please provide userId and accountId')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/conversions/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          accountId,
          provider,
          testType
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Test failed')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const runValidationTest = async () => {
    setValidationLoading(true)
    setError('')
    setResult(null)

    try {
      const params = new URLSearchParams({
        provider
      })

      if (provider === 'facebook') {
        if (!pixelId || !accessToken) {
          setError('Please provide Pixel ID and Access Token for Facebook')
          return
        }
        params.append('pixelId', pixelId)
        params.append('accessToken', accessToken)
      } else if (provider === 'google') {
        if (!customerId || !accessToken || !developerToken) {
          setError('Please provide Customer ID, Access Token, and Developer Token for Google')
          return
        }
        params.append('customerId', customerId)
        params.append('accessToken', accessToken)
        params.append('developerToken', developerToken)
      }

      const response = await fetch(`/api/conversions/test?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Validation failed')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setValidationLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Conversions API Test</h1>
        
        {/* Conversion Test */}
        <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
          <CardHeader>
            <CardTitle>Test Conversion Sending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">User ID</label>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID"
                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Account ID</label>
                <Input
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="Enter account ID"
                  className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <Select value={provider} onValueChange={(value: 'facebook' | 'google') => setProvider(value)}>
                  <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Test Type</label>
                <Select value={testType} onValueChange={setTestType}>
                  <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                    <SelectItem value="pageview">Page View</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={runConversionTest} 
              disabled={loading}
              className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
            >
              {loading ? 'Testing...' : 'Run Conversion Test'}
            </Button>
          </CardContent>
        </Card>

        {/* Connection Validation */}
        <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
          <CardHeader>
            <CardTitle>Test Connection Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Provider</label>
              <Select value={provider} onValueChange={(value: 'facebook' | 'google') => setProvider(value)}>
                <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {provider === 'facebook' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pixel ID</label>
                  <Input
                    value={pixelId}
                    onChange={(e) => setPixelId(e.target.value)}
                    placeholder="Enter Facebook Pixel ID"
                    className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Access Token</label>
                  <Input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="Enter access token"
                    className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Customer ID</label>
                  <Input
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="123-456-7890"
                    className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Access Token</label>
                  <Input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="OAuth token"
                    className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Developer Token</label>
                  <Input
                    type="password"
                    value={developerToken}
                    onChange={(e) => setDeveloperToken(e.target.value)}
                    placeholder="Developer token"
                    className="bg-[#3f3f3f] border-[#4f4f4f] text-white"
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={runValidationTest} 
              disabled={validationLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600/90 hover:to-blue-500/90"
            >
              {validationLoading ? 'Validating...' : 'Test Connection'}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-900/20 border-red-500">
            <CardContent className="pt-6">
              <h3 className="text-red-400 font-semibold mb-2">Error</h3>
              <pre className="text-red-300 text-sm whitespace-pre-wrap">{error}</pre>
            </CardContent>
          </Card>
        )}

        {/* Result Display */}
        {result && (
          <Card className="bg-green-900/20 border-green-500">
            <CardContent className="pt-6">
              <h3 className="text-green-400 font-semibold mb-2">Success</h3>
              <pre className="text-green-300 text-sm whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Testing Conversions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                <li>First, configure your CAPI settings in the Settings page</li>
                <li>Enter the User ID and Account ID from your configuration</li>
                <li>Select the provider (Facebook or Google Ads)</li>
                <li>Choose a test type (Page View, Purchase, or Lead)</li>
                <li>Click "Run Conversion Test"</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Testing Connection:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                <li>Select your provider (Facebook or Google Ads)</li>
                <li>Enter the required credentials directly</li>
                <li>Click "Test Connection" to validate</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold">API Endpoints:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li><code>/api/conversions</code> - Unified conversion sending</li>
                <li><code>/api/conversions/facebook</code> - Facebook-specific endpoint</li>
                <li><code>/api/conversions/google</code> - Google Ads-specific endpoint</li>
                <li><code>/api/conversions/test</code> - Testing utilities</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}