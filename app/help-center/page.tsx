"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  Users,
  Settings,
  BarChart3,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of Konvertix",
      articles: 12,
      color: "from-primary to-secondary",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Understanding your data and metrics",
      articles: 18,
      color: "from-chart-3 to-chart-4",
    },
    {
      icon: Settings,
      title: "Account & Billing",
      description: "Manage your account and subscription",
      articles: 8,
      color: "from-chart-5 to-primary",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Collaborate with your team",
      articles: 6,
      color: "from-secondary to-chart-3",
    },
  ]

  const popularArticles = [
    {
      title: "How to set up your first campaign",
      category: "Getting Started",
      readTime: "5 min read",
      views: "2.1k views",
    },
    {
      title: "Understanding conversion tracking",
      category: "Analytics",
      readTime: "8 min read",
      views: "1.8k views",
    },
    {
      title: "Integrating with Google Analytics",
      category: "Integrations",
      readTime: "6 min read",
      views: "1.5k views",
    },
    {
      title: "Setting up team permissions",
      category: "Team Management",
      readTime: "4 min read",
      views: "1.2k views",
    },
  ]

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Get help from our support team",
      action: "Start Chat",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      action: "Watch Now",
    },
    {
      icon: FileText,
      title: "API Documentation",
      description: "Technical documentation for developers",
      action: "View Docs",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold">Konvertix</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">How can we help you?</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers, get support, and learn how to make the most of Konvertix
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for articles, guides, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg bg-background/80 backdrop-blur border-border"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <action.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    variant="outline"
                    className="group-hover:border-primary group-hover:text-primary bg-transparent"
                  >
                    {action.action}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">Find the information you need organized by topic</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <category.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                  <div className="flex items-center justify-between pt-4">
                    <Badge variant="secondary">{category.articles} articles</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Articles</h2>
            <p className="text-muted-foreground">Most viewed and helpful articles from our community</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{article.category}</Badge>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {article.readTime}
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {article.views}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How do I get started with Konvertix?",
                answer:
                  "Simply sign up for a free account, complete the onboarding process, and start creating your first campaign. Our setup wizard will guide you through each step.",
              },
              {
                question: "What integrations are available?",
                answer:
                  "Konvertix integrates with Google Analytics, Facebook Ads, Google Ads, Shopify, WooCommerce, and many other popular marketing and e-commerce platforms.",
              },
              {
                question: "Can I upgrade or downgrade my plan anytime?",
                answer:
                  "Yes, you can change your subscription plan at any time. Changes take effect immediately, and billing is prorated accordingly.",
              },
              {
                question: "Is there a mobile app available?",
                answer:
                  "Currently, Konvertix is available as a web application optimized for mobile browsers. A dedicated mobile app is in development.",
              },
            ].map((faq, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-left group-hover:text-primary transition-colors">{faq.question}</CardTitle>
                  <CardDescription className="text-left">{faq.answer}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-8">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </Link>
              <Button variant="outline">
                <Video className="mr-2 h-4 w-4" />
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">K</span>
            </div>
            <span className="text-lg font-bold">Konvertix Help Center</span>
          </div>
          <p className="text-muted-foreground">
            &copy; 2024 Konvertix. All rights reserved. |{" "}
            <Link href="/" className="hover:text-foreground transition-colors">
              Back to Konvertix
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
