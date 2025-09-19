"use client"
import AuthGuard from "@/components/auth/AuthGuard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Settings,
  HeadphonesIcon,
  SearchIcon,
  Wrench,
  Calculator,
  Calendar,
  Zap,
  Copy,
  ExternalLink,
  Download,
  RefreshCw,
  Wand2,
} from "lucide-react"
import Link from "next/link"

export default function ToolsPage() {
  return (
    <AuthGuard>
      <ToolsContent />
    </AuthGuard>
  )
}

function ToolsContent() {
  const { t } = useLanguage()
  const navItems = [] as any

  const getTools = (t: (key: string) => string) => [
    {
      title: t("tools.roiCalculator.title"),
      description: t("tools.roiCalculator.description"),
      icon: Calculator,
      category: t("tools.categories.finance"),
    },
    {
      title: t("tools.abTestCalculator.title"),
      description: t("tools.abTestCalculator.description"),
      icon: BarChart3,
      category: t("tools.categories.testing"),
    },
    {
      title: t("tools.socialMediaScheduler.title"),
      description: t("tools.socialMediaScheduler.description"),
      icon: Calendar,
      category: t("tools.categories.socialMedia"),
    },
    {
      title: t("tools.conversionOptimizer.title"),
      description: t("tools.conversionOptimizer.description"),
      icon: Zap,
      category: t("tools.categories.optimization"),
    },
  ]

  const tools = getTools(t)

  return (
    <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{t("tools.title")}</h1>
              <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                <Download className="h-4 w-4 mr-2" />
                {t("tools.exportAllData")}
              </Button>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/tools/ad-generator">
                <Card className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6] transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <Wand2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{t("tools.adGenerator.title")}</CardTitle>
                        <Badge variant="secondary" className="bg-[#3f3f3f] text-[#afafaf] text-xs">
                          {t("tools.badges.aiPowered")}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#afafaf] mb-4">{t("tools.adGenerator.description")}</p>
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      {t("tools.launchTool")}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/target-audience-analyzer">
                <Card className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6] transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{t("tools.targetAudienceAnalyzer.title")}</CardTitle>
                        <Badge variant="secondary" className="bg-[#3f3f3f] text-[#afafaf] text-xs">
                          {t("tools.badges.aiPowered")}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#afafaf] mb-4">{t("tools.targetAudienceAnalyzer.description")}</p>
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      {t("tools.launchTool")}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/competitor-analysis">
                <Card className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6] transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{t("tools.competitorAnalysis.title")}</CardTitle>
                        <Badge variant="secondary" className="bg-[#3f3f3f] text-[#afafaf] text-xs">
                          {t("tools.badges.aiPowered")}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#afafaf] mb-4">{t("tools.competitorAnalysis.description")}</p>
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      {t("tools.launchTool")}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              {tools.map((tool, index) => (
                <Card
                  key={index}
                  className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6] transition-colors cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <tool.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{tool.title}</CardTitle>
                        <Badge variant="secondary" className="bg-[#3f3f3f] text-[#afafaf] text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#afafaf] mb-4">{tool.description}</p>
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      {t("tools.launchTool")}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>


            {/* ROI Calculator */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  {t("tools.roiCalculator.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investment" className="text-[#afafaf]">
                      {t("tools.roiCalculator.investment")}
                    </Label>
                    <Input
                      id="investment"
                      type="number"
                      placeholder="10000"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue" className="text-[#afafaf]">
                      {t("tools.roiCalculator.revenue")}
                    </Label>
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="15000"
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#afafaf]">{t("tools.roiCalculator.roi")}</Label>
                    <div className="p-3 bg-[#3f3f3f] rounded-lg">
                      <span className="text-green-500 font-bold text-lg">50%</span>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("tools.roiCalculator.calculate")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
      </main>
  )
}
