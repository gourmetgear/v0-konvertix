'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import Link from 'next/link'

export default function AnalyzePage() {
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!productName.trim() || !productDescription.trim()) {
      setError('Please provide both product name and description')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('https://n8n.konvertix.de/webhook/create-description/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: productName,
          product_description: productDescription,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error('Error posting to webhook:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze product description')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Analyze Product Description</h1>
            <p className="text-muted-foreground">
              Generate enhanced product descriptions using AI analysis
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Product Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="Enter product name..."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Current Description</Label>
              <Textarea
                id="productDescription"
                placeholder="Enter current product description..."
                className="min-h-[200px] resize-none"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Provide the current product description to generate an enhanced version
              </p>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !productName.trim() || !productDescription.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Analyze Description
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter product information and click "Analyze Description" to see results</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing product description...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Analysis Complete</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-white mb-2">Raw Response:</h4>
                    <div className="bg-muted/20 p-3 rounded-md">
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {result.enhanced_description && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Enhanced Description:</h4>
                      <div className="bg-muted/20 p-3 rounded-md">
                        <div className="prose-invert">
                          {result.enhanced_description}
                        </div>
                      </div>
                    </div>
                  )}

                  {result.suggestions && Array.isArray(result.suggestions) && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Suggestions:</h4>
                      <ul className="space-y-1">
                        {result.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                            <span className="text-primary">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">1</Badge>
                <span className="font-medium">Enter Product Details</span>
              </div>
              <p className="text-muted-foreground">
                Provide the product name and current description that you want to enhance.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">2</Badge>
                <span className="font-medium">Analyze</span>
              </div>
              <p className="text-muted-foreground">
                Click "Analyze Description" to send the data to the AI enhancement service.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">3</Badge>
                <span className="font-medium">Review Results</span>
              </div>
              <p className="text-muted-foreground">
                Review the enhanced description and suggestions for improvement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}