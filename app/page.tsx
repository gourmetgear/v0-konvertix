"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Users, Zap, Target, TrendingUp, Star, Check, Play } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold">Konvertix</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </a>
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <Button
            asChild
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="mb-6 bg-primary text-primary-foreground border-primary">
              Now Offering Full Funnel Reporting
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Grow Smarter. Scale Faster.</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Unlock the full potential of your marketing with AI-powered analytics that turn data into actionable
              insights for exponential growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Link href="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-muted bg-transparent">
                <Play className="mr-2 h-4 w-4" />
                View Pricing
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-card to-muted rounded-2xl p-6 border border-border shadow-2xl">
              <div className="bg-background rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
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
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-secondary">$48,392</div>
                      <div className="text-sm text-muted-foreground">Total Sales</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-chart-4">2.7%</div>
                      <div className="text-sm text-muted-foreground">Conversion</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-chart-3">1.2M</div>
                      <div className="text-sm text-muted-foreground">Impressions</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-chart-3/20 rounded-lg flex items-end justify-center p-4">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">Interactive Charts & Analytics</div>
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
            <h2 className="text-4xl font-bold mb-4">Our Services That Power Your Growth</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide modern digital solutions that transform ideas into powerful growth engines for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Paid Ads</CardTitle>
                <CardDescription>
                  Strategic paid advertising campaigns across platforms to maximize ROI and drive qualified traffic.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>SEO</CardTitle>
                <CardDescription>
                  Comprehensive SEO strategies to improve organic rankings and increase sustainable traffic growth.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Automation</CardTitle>
                <CardDescription>
                  Intelligent marketing automation workflows to nurture leads and optimize customer journeys.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Reporting</CardTitle>
                <CardDescription>
                  Advanced analytics and real-time reporting to track performance and optimize campaigns.
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
            <h2 className="text-4xl font-bold mb-4">From Challenge to Success</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-primary">Layers</CardTitle>
                    <CardDescription>SaaS Platform</CardDescription>
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">300%</div>
                <CardDescription>
                  <strong>Challenge:</strong> Low user engagement and high churn rate affecting growth metrics.
                  <br />
                  <br />
                  <strong>Solution:</strong> Implemented advanced user behavior analytics and personalized onboarding
                  flows.
                  <br />
                  <br />
                  <strong>Result:</strong> Achieved 300% increase in user engagement within 6 months.
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
                    <CardTitle className="text-secondary">Sisyphus</CardTitle>
                    <CardDescription>E-commerce</CardDescription>
                  </div>
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">300%</div>
                <CardDescription>
                  <strong>Challenge:</strong> Poor conversion rates and ineffective marketing campaigns.
                  <br />
                  <br />
                  <strong>Solution:</strong> Redesigned conversion funnels with A/B testing and targeted campaigns.
                  <br />
                  <br />
                  <strong>Result:</strong> Boosted conversion rates by 300% and improved ROI significantly.
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
                    <CardTitle className="text-chart-4">Quotient</CardTitle>
                    <CardDescription>Analytics Platform</CardDescription>
                  </div>
                </div>
                <div className="text-3xl font-bold text-chart-4 mb-2">300%</div>
                <CardDescription>
                  <strong>Challenge:</strong> Complex data visualization needs and poor user experience.
                  <br />
                  <br />
                  <strong>Solution:</strong> Built intuitive dashboards with real-time analytics and custom reporting.
                  <br />
                  <br />
                  <strong>Result:</strong> Enhanced user satisfaction by 300% with streamlined data insights.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose the Plan That Fits You Best</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold">
                  $10<span className="text-lg font-normal text-muted-foreground">/mth</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Access to all basic features
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Basic reporting and analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Up to 10 team members
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    20GB individual data
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Basic chat and email support
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative border-primary shadow-lg scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">
                  $20<span className="text-lg font-normal text-muted-foreground">/mth</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Access to all basic features
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Advanced reporting and analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Up to 20 team members
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    100GB individual data
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Priority chat and email support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Advanced integrations
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <div className="text-3xl font-bold">
                  $40<span className="text-lg font-normal text-muted-foreground">/mth</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Access to all basic features
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Advanced reporting and analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Up to 50 team members
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    200GB individual data
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Priority chat and email support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-chart-4 mr-2" />
                    Advanced integrations
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features Designed for You</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform is built with simplicity, speed, and scalability in mind to help you focus on growing your
              business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle>Reporting, Tracking & Analytics</CardTitle>
                <CardDescription>
                  Comprehensive analytics dashboard with real-time tracking and detailed performance insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-chart-5 to-chart-4 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-background" />
                </div>
                <CardTitle>Omnichannel Support</CardTitle>
                <CardDescription>
                  Seamless customer support across all channels with integrated communication tools.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-chart-3 to-chart-2 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-background" />
                </div>
                <CardTitle>Custom Solutions</CardTitle>
                <CardDescription>
                  Tailored solutions built to match your specific business needs and requirements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-chart-4 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-background" />
                </div>
                <CardTitle>Marketing Updates</CardTitle>
                <CardDescription>
                  Stay ahead with the latest marketing trends and automated campaign optimizations.
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
            <h2 className="text-4xl font-bold mb-4">Choose the Plan That Fits You Best</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Amanda Schmidt",
                role: "Marketing Director",
                company: "TechFlow Solutions",
                rating: 5,
                content:
                  "Konvertix transformed our marketing strategy completely. The analytics insights helped us increase our conversion rate by 300% in just 3 months.",
              },
              {
                name: "Marcus Chen",
                role: "Growth Manager",
                company: "StartupLab",
                rating: 5,
                content:
                  "The automation features saved us countless hours while improving our lead quality. Best investment we've made for our marketing stack.",
              },
              {
                name: "Sarah Williams",
                role: "CEO",
                company: "Digital Dynamics",
                rating: 5,
                content:
                  "Outstanding platform with incredible support. The team helped us scale from 10K to 100K monthly visitors with their strategic guidance.",
              },
              {
                name: "David Rodriguez",
                role: "Marketing Manager",
                company: "GrowthCorp",
                rating: 5,
                content:
                  "The reporting capabilities are unmatched. We finally have clear visibility into our marketing ROI across all channels.",
              },
              {
                name: "Lisa Thompson",
                role: "Digital Strategist",
                company: "InnovateLab",
                rating: 5,
                content:
                  "Konvertix's AI-powered insights helped us identify new opportunities we never knew existed. Game-changing platform.",
              },
              {
                name: "Michael Park",
                role: "VP Marketing",
                company: "ScaleUp Inc",
                rating: 5,
                content:
                  "From setup to execution, everything is seamless. The platform grows with your business needs perfectly.",
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
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses that trust Konvertix to power their growth and success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Link href="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border hover:bg-muted bg-transparent">
                <Link href="/dashboard">Get Started Now</Link>
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
                Empowering businesses with AI-powered marketing analytics for smarter growth and faster scaling.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help-center" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Get Sales Consulting</h4>
              <p className="text-muted-foreground mb-4">
                Need help with your marketing strategy? Our experts are here to help.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Link href="/dashboard">Book a Call</Link>
              </Button>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Konvertix. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Calendly Modal Component */}
      {/* <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} /> */}
    </div>
  )
}
