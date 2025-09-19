"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ContactPage() {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    budget: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
              {t("navigation.home")}
            </Link>
            <a href="/#services" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("navigation.services")}
            </a>
            <a href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("navigation.pricing")}
            </a>
            <Link href="/contact" className="text-foreground font-medium">
              {t("navigation.contact")}
            </Link>
          </nav>

          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              {t("cta.getStarted")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">{t("contact.title")}</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-8">{t("contact.contactInfo.title")}</h2>

              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{t("contact.contactInfo.email")}</h3>
                        <p className="text-muted-foreground">hello@konvertix.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary to-chart-4 rounded-lg flex items-center justify-center">
                        <Phone className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{t("contact.contactInfo.phone")}</h3>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-chart-3 to-chart-4 rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-background" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{t("contact.contactInfo.address")}</h3>
                        <p className="text-muted-foreground">{t("contact.contactInfo.addressValue")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-chart-5/10 to-chart-5/5 border-chart-5/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-chart-5 to-primary rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-background" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{t("contact.contactInfo.hours")}</h3>
                        <p className="text-muted-foreground">{t("contact.contactInfo.hoursValue")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-card to-muted/30 border-border">
                <CardHeader>
                  <CardTitle className="text-2xl">{t("contact.form.title")}</CardTitle>
                  <CardDescription>{t("contact.form.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("contact.form.name")} *</Label>
                        <Input
                          id="name"
                          placeholder={t("contact.form.namePlaceholder")}
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("contact.form.email")} *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t("contact.form.emailPlaceholder")}
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company">{t("contact.form.company")}</Label>
                        <Input
                          id="company"
                          placeholder={t("contact.form.companyPlaceholder")}
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">{t("contact.form.budget")}</Label>
                        <Select onValueChange={(value) => handleInputChange("budget", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("contact.form.budgetPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-5k">{t("contact.budgetOptions.under5k")}</SelectItem>
                            <SelectItem value="5k-15k">{t("contact.budgetOptions.5k-15k")}</SelectItem>
                            <SelectItem value="15k-50k">{t("contact.budgetOptions.15k-50k")}</SelectItem>
                            <SelectItem value="50k-plus">{t("contact.budgetOptions.over100k")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t("contact.form.subject")} *</Label>
                      <Input
                        id="subject"
                        placeholder={t("contact.form.subjectPlaceholder")}
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t("contact.form.message")} *</Label>
                      <Textarea
                        id="message"
                        placeholder={t("contact.form.messagePlaceholder")}
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {t("contact.form.submit")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("contact.faq.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("contact.faq.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  {t("contact.faq.questions.0.question")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("contact.faq.questions.0.answer")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  {t("contact.faq.questions.1.question")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("contact.faq.questions.1.answer")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  {t("contact.faq.questions.2.question")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("contact.faq.questions.2.answer")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  {t("contact.faq.questions.3.question")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("contact.faq.questions.3.answer")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">K</span>
                </div>
                <span className="text-xl font-bold">Konvertix</span>
              </Link>
              <p className="text-muted-foreground mb-4">
                {t("footer.description")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("footer.product")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="/#services" className="hover:text-foreground transition-colors">
                    {t("footer.features")}
                  </a>
                </li>
                <li>
                  <a href="/#pricing" className="hover:text-foreground transition-colors">
                    {t("footer.pricing")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.integrations")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.api")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.helpCenter")}
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    {t("footer.contact")}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.status")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.community")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.about")}
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    {t("footer.contact")}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.careers")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.privacy")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
