"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Users, Zap, Target, TrendingUp, Star, Check, Play } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function HomePage() {
  const { t } = useLanguage()
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [pricingTab, setPricingTab] = useState<"paid" | "seo" | "full">("paid")

  const pricingPlans: Record<typeof pricingTab, Array<{ title: string; price: string; items: string[]; highlight?: boolean; badge?: string }>> = {
    paid: [
      {
        title: t("landingPage.pricing.paid.basic.title"),
        price: t("landingPage.pricing.paid.basic.price"),
        items: [
          t("landingPage.pricing.paid.basic.features.0"),
          t("landingPage.pricing.paid.basic.features.1"),
          t("landingPage.pricing.paid.basic.features.2"),
          t("landingPage.pricing.paid.basic.features.3"),
          t("landingPage.pricing.paid.basic.features.4")
        ]
      },
      {
        title: t("landingPage.pricing.paid.business.title"),
        price: t("landingPage.pricing.paid.business.price"),
        highlight: true,
        badge: t("landingPage.pricing.bestValue"),
        items: [
          t("landingPage.pricing.paid.business.features.0"),
          t("landingPage.pricing.paid.business.features.1"),
          t("landingPage.pricing.paid.business.features.2"),
          t("landingPage.pricing.paid.business.features.3"),
          t("landingPage.pricing.paid.business.features.4"),
          t("landingPage.pricing.paid.business.features.5"),
          t("landingPage.pricing.paid.business.features.6"),
          t("landingPage.pricing.paid.business.features.7")
        ]
      },
      {
        title: t("landingPage.pricing.paid.enterprise.title"),
        price: t("landingPage.pricing.paid.enterprise.price"),
        items: [
          t("landingPage.pricing.paid.enterprise.features.0"),
          t("landingPage.pricing.paid.enterprise.features.1"),
          t("landingPage.pricing.paid.enterprise.features.2"),
          t("landingPage.pricing.paid.enterprise.features.3"),
          t("landingPage.pricing.paid.enterprise.features.4")
        ]
      },
    ],
    seo: [
      {
        title: t("landingPage.pricing.seoPlans.starter.title"),
        price: t("landingPage.pricing.seoPlans.starter.price"),
        items: [
          t("landingPage.pricing.seoPlans.starter.features.0"),
          t("landingPage.pricing.seoPlans.starter.features.1"),
          t("landingPage.pricing.seoPlans.starter.features.2"),
          t("landingPage.pricing.seoPlans.starter.features.3")
        ]
      },
      {
        title: t("landingPage.pricing.seoPlans.pro.title"),
        price: t("landingPage.pricing.seoPlans.pro.price"),
        highlight: true,
        badge: t("landingPage.pricing.bestValue"),
        items: [
          t("landingPage.pricing.seoPlans.pro.features.0"),
          t("landingPage.pricing.seoPlans.pro.features.1"),
          t("landingPage.pricing.seoPlans.pro.features.2"),
          t("landingPage.pricing.seoPlans.pro.features.3"),
          t("landingPage.pricing.seoPlans.pro.features.4"),
          t("landingPage.pricing.seoPlans.pro.features.5")
        ]
      },
      {
        title: t("landingPage.pricing.seoPlans.enterprise.title"),
        price: t("landingPage.pricing.seoPlans.enterprise.price"),
        items: [
          t("landingPage.pricing.seoPlans.enterprise.features.0"),
          t("landingPage.pricing.seoPlans.enterprise.features.1"),
          t("landingPage.pricing.seoPlans.enterprise.features.2"),
          t("landingPage.pricing.seoPlans.enterprise.features.3")
        ]
      },
    ],
    full: [
      {
        title: t("landingPage.pricing.full.starter.title"),
        price: t("landingPage.pricing.full.starter.price"),
        items: [
          t("landingPage.pricing.full.starter.features.0"),
          t("landingPage.pricing.full.starter.features.1"),
          t("landingPage.pricing.full.starter.features.2"),
          t("landingPage.pricing.full.starter.features.3")
        ]
      },
      {
        title: t("landingPage.pricing.full.suite.title"),
        price: t("landingPage.pricing.full.suite.price"),
        highlight: true,
        badge: t("landingPage.pricing.bestValue"),
        items: [
          t("landingPage.pricing.full.suite.features.0"),
          t("landingPage.pricing.full.suite.features.1"),
          t("landingPage.pricing.full.suite.features.2"),
          t("landingPage.pricing.full.suite.features.3")
        ]
      },
      {
        title: t("landingPage.pricing.full.enterprise.title"),
        price: t("landingPage.pricing.full.enterprise.price"),
        items: [
          t("landingPage.pricing.full.enterprise.features.0"),
          t("landingPage.pricing.full.enterprise.features.1"),
          t("landingPage.pricing.full.enterprise.features.2"),
          t("landingPage.pricing.full.enterprise.features.3")
        ]
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-[#1a1328] border-b border-[#2b2b2b]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-white">Konvertix</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white font-medium">{t("landingPage.header.home")}</a>
            <a href="#services" className="text-[#afafaf] hover:text-white transition-colors">{t("landingPage.header.services")}</a>
            <a href="#results" className="text-[#afafaf] hover:text-white transition-colors">{t("landingPage.header.caseStudies")}</a>
            <a href="#pricing" className="text-[#afafaf] hover:text-white transition-colors">{t("landingPage.header.pricing")}</a>
            <a href="#about" className="text-[#afafaf] hover:text-white transition-colors">{t("landingPage.header.about")}</a>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild variant="ghost" className="hidden sm:inline-flex text-[#afafaf] hover:text-white">
              <Link href="/contact">{t("landingPage.header.contact")}</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-[#f59e0b] to-[#f97316] hover:from-[#f59e0b]/90 hover:to-[#f97316]/90">
              <Link href="/contact">{t("landingPage.header.bookCall")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="mb-6 bg-primary text-primary-foreground border-primary">
              {t("landingPage.hero.badge")}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">{t("landingPage.hero.title")}</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              {t("landingPage.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Link href="/auth/signup">
                  {t("landingPage.hero.startTrial")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border hover:bg-muted bg-transparent">
                <Link href="/auth/login">
                  <Play className="mr-2 h-4 w-4" />
                  {t("landingPage.hero.login")}
                </Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-card to-muted rounded-2xl p-6 border border-border shadow-2xl">
              <div className="bg-background rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{t("landingPage.hero.analyticsTitle")}</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <div className="w-3 h-3 bg-chart-5 rounded-full"></div>
                    <div className="w-3 h-3 bg-chart-4 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">$2,847</div>
                      <div className="text-sm text-muted-foreground">{t("landingPage.hero.revenue")}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-secondary">$48,392</div>
                      <div className="text-sm text-muted-foreground">{t("landingPage.hero.totalSales")}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-chart-4">2.7%</div>
                      <div className="text-sm text-muted-foreground">{t("landingPage.hero.conversion")}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-chart-3">1.2M</div>
                      <div className="text-sm text-muted-foreground">{t("landingPage.hero.impressions")}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-chart-3/20 rounded-lg flex items-end justify-center p-4">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">{t("landingPage.hero.chartsTitle")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("landingPage.services.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("landingPage.services.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>{t("landingPage.services.paidAds.title")}</CardTitle>
                <CardDescription>
                  {t("landingPage.services.paidAds.description")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>{t("landingPage.services.seo.title")}</CardTitle>
                <CardDescription>
                  {t("landingPage.services.seo.description")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>{t("landingPage.services.automation.title")}</CardTitle>
                <CardDescription>
                  {t("landingPage.services.automation.description")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>{t("landingPage.services.reporting.title")}</CardTitle>
                <CardDescription>
                  {t("landingPage.services.reporting.description")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("landingPage.successStories.title")}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-primary">{t("landingPage.successStories.layers.title")}</CardTitle>
                    <CardDescription>{t("landingPage.successStories.layers.type")}</CardDescription>
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">300%</div>
                <CardDescription>
                  <strong>{t("landingPage.successStories.layers.challenge")}</strong> {t("landingPage.successStories.layers.challengeText")}
                  <br />
                  <br />
                  <strong>{t("landingPage.successStories.layers.solution")}</strong> {t("landingPage.successStories.layers.solutionText")}
                  <br />
                  <br />
                  <strong>{t("landingPage.successStories.layers.result")}</strong> {t("landingPage.successStories.layers.resultText")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-secondary">{t("landingPage.successStories.sisyphus.title")}</CardTitle>
                    <CardDescription>{t("landingPage.successStories.sisyphus.type")}</CardDescription>
                  </div>
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">300%</div>
                <CardDescription>
                  <strong>{t("landingPage.successStories.sisyphus.challenge")}</strong> {t("landingPage.successStories.sisyphus.challengeText")}
                  <br />
                  <br />
                  <strong>{t("landingPage.successStories.sisyphus.solution")}</strong> {t("landingPage.successStories.sisyphus.solutionText")}
                  <br />
                  <br />
                  <strong>{t("landingPage.successStories.sisyphus.result")}</strong> {t("landingPage.successStories.sisyphus.resultText")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-chart-4 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-background" />
                  </div>
                  <div>
                    <CardTitle className="text-chart-4">{t("landingPage.successStories.quotient.title")}</CardTitle>
                    <CardDescription>{t("landingPage.successStories.quotient.type")}</CardDescription>
                  </div>
                </div>
                <div className="text-3xl font-bold text-chart-4 mb-2">300%</div>
                <CardDescription>
                  <strong>{t("landingPage.successStories.quotient.challenge")}</strong> {t("landingPage.successStories.quotient.challengeText")}
                  <br />
                  <br />
                  <strong>{t("landingPage.successStories.quotient.solution")}</strong> {t("landingPage.successStories.quotient.solutionText")}
                  <br />
                  <br />
                  <strong>{t("landingPage.successStories.quotient.result")}</strong> {t("landingPage.successStories.quotient.resultText")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative container mx-auto px-4">
          <div className="text-left md:text-left mb-12">
            <span className="inline-block rounded-full border border-[#2b2b2b] bg-[#171226] px-3 py-1 text-xs text-white/90 mb-4">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("landingPage.pricing.title")}</h2>
          </div>

          {/* Toggle tabs (visual only) */}
          <div className="mb-10 flex items-center gap-2">
            <button onClick={() => setPricingTab("paid")} className={`px-6 py-2 rounded-md text-sm border border-[#2b2b2b] ${pricingTab==='paid' ? 'text-white bg-gradient-to-r from-[#a545b6] to-[#cd4f9d]' : 'text-[#afafaf] hover:text-white'}`}>{t("landingPage.pricing.paidAds")}</button>
            <button onClick={() => setPricingTab("seo")} className={`px-6 py-2 rounded-md text-sm border border-[#2b2b2b] ${pricingTab==='seo' ? 'text-white bg-gradient-to-r from-[#a545b6] to-[#cd4f9d]' : 'text-[#afafaf] hover:text-white'}`}>{t("landingPage.pricing.seo")}</button>
            <button onClick={() => setPricingTab("full")} className={`px-6 py-2 rounded-md text-sm border border-[#2b2b2b] ${pricingTab==='full' ? 'text-white bg-gradient-to-r from-[#a545b6] to-[#cd4f9d]' : 'text-[#afafaf] hover:text-white'}`}>{t("landingPage.pricing.fullServices")}</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-stretch max-w-6xl">
            {pricingPlans[pricingTab].map((p, i) => (
              <div key={p.title} className={`relative rounded-2xl border p-6 flex flex-col ${p.highlight ? 'bg-[#cd4f9d] border-[#cd4f9d]' : 'bg-[#1b1527] border-[#2b2b2b]'}`}>
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${p.highlight ? 'bg-white/20 text-white' : 'bg-white/10 text-white'}`}>
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M12 2l3 7h7l-5.5 4.5L19 21l-7-4l-7 4l2.5-7.5L2 9h7z"/></svg>
                </div>
                <h3 className="text-center text-xl font-semibold text-white">{p.title}</h3>
                {p.highlight && p.badge && (
                  <span className="absolute right-4 top-4 rounded-md bg-white/20 px-2 py-1 text-xs text-white">{p.badge}</span>
                )}
                <div className="my-4 text-center">
                  <div className="text-4xl font-extrabold text-white">{p.price}</div>
                  <div className={`text-sm mt-1 ${p.highlight ? 'text-white/90' : 'text-white/70'}`}>{t("landingPage.pricing.billedAnnually")}</div>
                </div>
                <ul className={`space-y-3 text-sm ${p.highlight ? 'text-white' : 'text-white/90'}`}>
                  {p.items.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${p.highlight ? 'bg-white/25' : 'bg-white/10'}`}>
                        <svg viewBox='0 0 24 24' className='w-3.5 h-3.5'><path fill='currentColor' d='m10 17l-4-4l1.4-1.4L10 14.2l6.6-6.6L18 9z'/></svg>
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link className="block" href="/dashboard">
                    <button className={`w-full rounded-md py-2 ${p.highlight ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white'}`}>{t("landingPage.pricing.getStarted")}</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("landingPage.features.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("landingPage.features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle>{t("landingPage.features.analytics.title")}</CardTitle>
                <CardDescription>
                  {t("landingPage.features.analytics.description")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-chart-5 to-chart-4 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-background" />
                </div>
                <CardTitle>{t("landingPage.features.omnichannel.title")}</CardTitle>
                <CardDescription>
                  {t("landingPage.features.omnichannel.description")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-chart-3 to-chart-2 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-background" />
                </div>
                <CardTitle>{t("landingPage.features.custom.title")}</CardTitle>
                <CardDescription>
                  {t("landingPage.features.custom.description")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-chart-4 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-background" />
                </div>
                <CardTitle>{t("landingPage.features.updates.title")}</CardTitle>
                <CardDescription>
                  {t("landingPage.features.updates.description")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("landingPage.testimonials.title")}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: t("landingPage.testimonials.reviews.0.name"),
                role: t("landingPage.testimonials.reviews.0.role"),
                company: t("landingPage.testimonials.reviews.0.company"),
                rating: 5,
                content: t("landingPage.testimonials.reviews.0.content"),
              },
              {
                name: t("landingPage.testimonials.reviews.1.name"),
                role: t("landingPage.testimonials.reviews.1.role"),
                company: t("landingPage.testimonials.reviews.1.company"),
                rating: 5,
                content: t("landingPage.testimonials.reviews.1.content"),
              },
              {
                name: t("landingPage.testimonials.reviews.2.name"),
                role: t("landingPage.testimonials.reviews.2.role"),
                company: t("landingPage.testimonials.reviews.2.company"),
                rating: 5,
                content: t("landingPage.testimonials.reviews.2.content"),
              },
              {
                name: t("landingPage.testimonials.reviews.3.name"),
                role: t("landingPage.testimonials.reviews.3.role"),
                company: t("landingPage.testimonials.reviews.3.company"),
                rating: 5,
                content: t("landingPage.testimonials.reviews.3.content"),
              },
              {
                name: t("landingPage.testimonials.reviews.4.name"),
                role: t("landingPage.testimonials.reviews.4.role"),
                company: t("landingPage.testimonials.reviews.4.company"),
                rating: 5,
                content: t("landingPage.testimonials.reviews.4.content"),
              },
              {
                name: t("landingPage.testimonials.reviews.5.name"),
                role: t("landingPage.testimonials.reviews.5.role"),
                company: t("landingPage.testimonials.reviews.5.company"),
                rating: 5,
                content: t("landingPage.testimonials.reviews.5.content"),
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-card to-muted/50">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <CardDescription>
                        {testimonial.role} at {testimonial.company}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-chart-5 text-chart-5" />
                    ))}
                  </div>
                  <CardDescription className="text-foreground">"{testimonial.content}"</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">{t("landingPage.cta.title")}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t("landingPage.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Link href="/dashboard">
                  {t("landingPage.cta.startTrial")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border hover:bg-muted bg-transparent">
                <Link href="/dashboard">{t("landingPage.cta.getStarted")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">K</span>
                </div>
                <span className="text-xl font-bold">Konvertix</span>
              </div>
              <p className="text-muted-foreground mb-4">
                {t("landingPage.footer.description")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("landingPage.footer.product")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.features")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.pricing")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.integrations")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.api")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("landingPage.footer.support")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help-center" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.helpCenter")}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.faq")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.contact")}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.status")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.community")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("landingPage.footer.legal")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/legal/privacy-policy" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms-of-service" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.termsOfService")}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookie-policy" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.cookiePolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/gdpr" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.gdpr")}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/data-processing" className="hover:text-foreground transition-colors">
                    {t("landingPage.footer.dataProcessing")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>{t("landingPage.footer.copyright")}</p>
          </div>
        </div>
      </footer>

      {/* Calendly Modal Component */}
      {/* <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} /> */}
    </div>
  )
}
