"use client"
import { useState } from "react"
import { useLanguage } from '@/contexts/LanguageContext'
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronRight, Search, MessageCircle, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function FAQPage() {
  const { language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<number[]>([])

  const faqCategories = [
    {
      name: t("faq.categories.0.name"),
      faqs: [
        {
          question: t("faq.categories.0.faqs.0.question"),
          answer: t("faq.categories.0.faqs.0.answer")
        },
        {
          question: t("faq.categories.0.faqs.1.question"),
          answer: t("faq.categories.0.faqs.1.answer")
        },
        {
          question: t("faq.categories.0.faqs.2.question"),
          answer: t("faq.categories.0.faqs.2.answer")
        },
        {
          question: t("faq.categories.0.faqs.3.question"),
          answer: t("faq.categories.0.faqs.3.answer")
        }
      ]
    },
    {
      name: t("faq.categories.1.name"),
      faqs: [
        {
          question: t("faq.categories.1.faqs.0.question"),
          answer: t("faq.categories.1.faqs.0.answer")
        },
        {
          question: t("faq.categories.1.faqs.1.question"),
          answer: t("faq.categories.1.faqs.1.answer")
        },
        {
          question: t("faq.categories.1.faqs.2.question"),
          answer: t("faq.categories.1.faqs.2.answer")
        },
        {
          question: t("faq.categories.1.faqs.3.question"),
          answer: t("faq.categories.1.faqs.3.answer")
        }
      ]
    },
    {
      name: t("faq.categories.2.name"),
      faqs: [
        {
          question: t("faq.categories.2.faqs.0.question"),
          answer: t("faq.categories.2.faqs.0.answer")
        },
        {
          question: t("faq.categories.2.faqs.1.question"),
          answer: t("faq.categories.2.faqs.1.answer")
        },
        {
          question: t("faq.categories.2.faqs.2.question"),
          answer: t("faq.categories.2.faqs.2.answer")
        },
        {
          question: t("faq.categories.2.faqs.3.question"),
          answer: t("faq.categories.2.faqs.3.answer")
        }
      ]
    },
    {
      name: t("faq.categories.3.name"),
      faqs: [
        {
          question: t("faq.categories.3.faqs.0.question"),
          answer: t("faq.categories.3.faqs.0.answer")
        },
        {
          question: t("faq.categories.3.faqs.1.question"),
          answer: t("faq.categories.3.faqs.1.answer")
        },
        {
          question: t("faq.categories.3.faqs.2.question"),
          answer: t("faq.categories.3.faqs.2.answer")
        }
      ]
    }
  ]

  // Filter FAQs based on search term
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
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
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t("faq.title")}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t("faq.subtitle")}</p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={t("faq.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* FAQ Content */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{t("faq.noResults")}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
                  <div className="space-y-3">
                    {category.faqs.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex
                      const isOpen = openItems.includes(globalIndex)

                      return (
                        <div key={faqIndex} className="border border-border rounded-lg">
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-medium">{faq.question}</span>
                            {isOpen ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4">
                              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Support Section */}
          <div className="mt-16 bg-muted/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">{t("faq.stillNeedHelp")}</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {t("faq.contactSupport")}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t("faq.emailSupport")}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t("faq.callUs")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}