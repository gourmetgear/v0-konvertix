'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, Target, BarChart3, X } from "lucide-react"

interface DataGap {
  field: string
  impact: string
  recommended_collection: string
}

interface CampaignMetrics {
  spend: number
  revenue: number | null
  roas: number | null
  cpa: number | null
  ctr: number
  cpc: number
  cpm: number
  cvr: number | null
  frequency: number | null
  refusal: number | null
}

interface SegmentPerformance {
  level: string
  name: string
  metrics: CampaignMetrics
}

interface AnalysisResult {
  impact?: string
  recommended_collection?: string
  data_gaps?: DataGap[]
  appendix_segment_performance?: SegmentPerformance[]
  annotations?: {
    finish_reason: string
    usage: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
  }
  // Handle possible nested structure
  [key: string]: any
}

interface CampaignAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  analysisResult: AnalysisResult | null
  campaignName: string
}

export default function CampaignAnalysisModal({
  isOpen,
  onClose,
  analysisResult,
  campaignName
}: CampaignAnalysisModalProps) {
  if (!analysisResult) return null

  // Debug logging to understand the structure
  console.log('Modal received analysisResult:', analysisResult)
  console.log('Impact:', analysisResult.impact)
  console.log('Recommended collection:', analysisResult.recommended_collection)
  console.log('Data gaps:', analysisResult.data_gaps)
  console.log('Performance data:', analysisResult.appendix_segment_performance)

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A'
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A'
    return `${value.toFixed(2)}%`
  }

  const formatNumber = (value: number | null, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A'
    return value.toFixed(decimals)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-[#3f3f3f] text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5" />
              Campaign Analysis: {campaignName}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#afafaf] hover:text-white hover:bg-[#3f3f3f]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Impact Section */}
          <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Key Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#afafaf] mb-2">Impact:</p>
              <p className="font-medium text-white">{analysisResult.impact || 'No impact data available'}</p>

              <p className="text-sm text-[#afafaf] mt-4 mb-2">Recommended Collection:</p>
              <p className="text-sm text-white">{analysisResult.recommended_collection || 'No recommendation data available'}</p>

              {/* Debug display */}
              <details className="mt-4">
                <summary className="text-xs text-[#afafaf] cursor-pointer">Debug: Raw Data Structure</summary>
                <pre className="text-xs text-[#afafaf] mt-2 bg-[#1a1a1a] p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>

          {/* Data Gaps */}
          {analysisResult.data_gaps && analysisResult.data_gaps.length > 0 && (
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-red-500" />
                  Data Gaps ({analysisResult.data_gaps.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.data_gaps.map((gap, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive" className="text-xs">
                          Missing: {gap.field}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#afafaf] mb-2">
                        <strong className="text-white">Impact:</strong> {gap.impact}
                      </p>
                      <p className="text-sm text-[#afafaf]">
                        <strong className="text-white">Recommendation:</strong> {gap.recommended_collection}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaign Performance */}
          {analysisResult.appendix_segment_performance && analysisResult.appendix_segment_performance.length > 0 && (
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Campaign Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult.appendix_segment_performance.map((segment, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-[#3f3f3f] text-white">{segment.level}</Badge>
                      <h4 className="font-medium text-white">{segment.name}</h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-[#afafaf]">Spend</p>
                        <p className="font-medium text-white">{formatCurrency(segment.metrics.spend)}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#afafaf]">Revenue</p>
                        <p className="font-medium text-white">{formatCurrency(segment.metrics.revenue)}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#afafaf]">ROAS</p>
                        <p className="font-medium text-white">{formatNumber(segment.metrics.roas)}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#afafaf]">CPA</p>
                        <p className="font-medium text-white">{formatCurrency(segment.metrics.cpa)}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#afafaf]">CTR</p>
                        <p className="font-medium text-white">{formatPercentage(segment.metrics.ctr)}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#afafaf]">CPC</p>
                        <p className="font-medium text-white">{formatCurrency(segment.metrics.cpc)}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#afafaf]">CPM</p>
                        <p className="font-medium text-white">{formatCurrency(segment.metrics.cpm)}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#afafaf]">CVR</p>
                        <p className="font-medium text-white">{formatPercentage(segment.metrics.cvr)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Technical Details */}
          {analysisResult.annotations && (
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-sm text-white">Analysis Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-[#afafaf]">Prompt Tokens</p>
                    <p className="font-medium text-white">{analysisResult.annotations.usage.prompt_tokens.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[#afafaf]">Completion Tokens</p>
                    <p className="font-medium text-white">{analysisResult.annotations.usage.completion_tokens.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[#afafaf]">Total Tokens</p>
                    <p className="font-medium text-white">{analysisResult.annotations.usage.total_tokens.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}