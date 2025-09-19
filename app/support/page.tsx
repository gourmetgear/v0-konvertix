"use client"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  Plus,
  MessageCircle,
  Paperclip,
  Mic,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"

export default function SupportPage() {
  const { t } = useLanguage()
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const navItems: any[] = []

  // FAQ Categories with questions
  const faqCategories = [
    {
      id: "accounting",
      title: t("support.faq.categories.accounting.title"),
      questions: [
        {
          id: "accounting-0",
          question: t("support.faq.categories.accounting.questions.0.question"),
          answer: t("support.faq.categories.accounting.questions.0.answer")
        },
        {
          id: "accounting-1",
          question: t("support.faq.categories.accounting.questions.1.question"),
          answer: t("support.faq.categories.accounting.questions.1.answer")
        },
        {
          id: "accounting-2",
          question: t("support.faq.categories.accounting.questions.2.question"),
          answer: t("support.faq.categories.accounting.questions.2.answer")
        },
        {
          id: "accounting-3",
          question: t("support.faq.categories.accounting.questions.3.question"),
          answer: t("support.faq.categories.accounting.questions.3.answer")
        }
      ]
    },
    {
      id: "campaigns",
      title: t("support.faq.categories.campaigns.title"),
      questions: [
        {
          id: "campaigns-0",
          question: t("support.faq.categories.campaigns.questions.0.question"),
          answer: t("support.faq.categories.campaigns.questions.0.answer")
        },
        {
          id: "campaigns-1",
          question: t("support.faq.categories.campaigns.questions.1.question"),
          answer: t("support.faq.categories.campaigns.questions.1.answer")
        },
        {
          id: "campaigns-2",
          question: t("support.faq.categories.campaigns.questions.2.question"),
          answer: t("support.faq.categories.campaigns.questions.2.answer")
        },
        {
          id: "campaigns-3",
          question: t("support.faq.categories.campaigns.questions.3.question"),
          answer: t("support.faq.categories.campaigns.questions.3.answer")
        }
      ]
    },
    {
      id: "reports",
      title: t("support.faq.categories.reports.title"),
      questions: [
        {
          id: "reports-0",
          question: t("support.faq.categories.reports.questions.0.question"),
          answer: t("support.faq.categories.reports.questions.0.answer")
        },
        {
          id: "reports-1",
          question: t("support.faq.categories.reports.questions.1.question"),
          answer: t("support.faq.categories.reports.questions.1.answer")
        },
        {
          id: "reports-2",
          question: t("support.faq.categories.reports.questions.2.question"),
          answer: t("support.faq.categories.reports.questions.2.answer")
        },
        {
          id: "reports-3",
          question: t("support.faq.categories.reports.questions.3.question"),
          answer: t("support.faq.categories.reports.questions.3.answer")
        }
      ]
    },
    {
      id: "technical",
      title: t("support.faq.categories.technical.title"),
      questions: [
        {
          id: "technical-0",
          question: t("support.faq.categories.technical.questions.0.question"),
          answer: t("support.faq.categories.technical.questions.0.answer")
        },
        {
          id: "technical-1",
          question: t("support.faq.categories.technical.questions.1.question"),
          answer: t("support.faq.categories.technical.questions.1.answer")
        },
        {
          id: "technical-2",
          question: t("support.faq.categories.technical.questions.2.question"),
          answer: t("support.faq.categories.technical.questions.2.answer")
        },
        {
          id: "technical-3",
          question: t("support.faq.categories.technical.questions.3.question"),
          answer: t("support.faq.categories.technical.questions.3.answer")
        }
      ]
    },
    {
      id: "general",
      title: t("support.faq.categories.general.title"),
      questions: [
        {
          id: "general-0",
          question: t("support.faq.categories.general.questions.0.question"),
          answer: t("support.faq.categories.general.questions.0.answer")
        },
        {
          id: "general-1",
          question: t("support.faq.categories.general.questions.1.question"),
          answer: t("support.faq.categories.general.questions.1.answer")
        },
        {
          id: "general-2",
          question: t("support.faq.categories.general.questions.2.question"),
          answer: t("support.faq.categories.general.questions.2.answer")
        },
        {
          id: "general-3",
          question: t("support.faq.categories.general.questions.3.question"),
          answer: t("support.faq.categories.general.questions.3.answer")
        }
      ]
    }
  ]

  // Filter FAQ items based on search term and selected category
  const filteredFAQs = useMemo(() => {
    let filtered = faqCategories

    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(category => category.id === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.map(category => ({
        ...category,
        questions: category.questions.filter(
          q =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    }

    return filtered
  }, [searchTerm, selectedCategory, faqCategories])

  return (
    <div className="flex-1 flex flex-col">
        {/* Support Content */}
        <main className="flex-1 p-6 flex gap-6">
          {/* Left Side - Support Form and FAQ */}
          <div className="flex-1 space-y-8">
            {/* Page Header */}
            <h1 className="text-3xl font-bold">{t("support.title")}</h1>

            {/* Create Ticket Form */}
            <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">{t("support.createTicket.title")}</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("support.createTicket.subject")}</label>
                    <Input
                      placeholder={t("support.createTicket.subjectPlaceholder")}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t("support.createTicket.description")}</label>
                    <Textarea
                      placeholder={t("support.createTicket.descriptionPlaceholder")}
                      rows={4}
                      className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t("support.createTicket.priority.label")}</label>
                    <Select defaultValue="low">
                      <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                        <SelectItem value="low">{t("support.createTicket.priority.low")}</SelectItem>
                        <SelectItem value="medium">{t("support.createTicket.priority.medium")}</SelectItem>
                        <SelectItem value="high">{t("support.createTicket.priority.high")}</SelectItem>
                        <SelectItem value="urgent">{t("support.createTicket.priority.urgent")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                    {t("support.createTicket.submit")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{t("support.faq.title")}</h2>
                <p className="text-[#afafaf] mb-4">{t("support.faq.subtitle")}</p>

                {/* FAQ Search */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder={t("support.faq.searchPlaceholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-[#2b2b2b] border-[#3f3f3f] text-white"
                    />
                  </div>
                  <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
                    <SelectTrigger className="w-48 bg-[#2b2b2b] border-[#3f3f3f] text-white">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2b2b2b] border-[#3f3f3f]">
                      <SelectItem value="">All Categories</SelectItem>
                      {faqCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-white hover:bg-[#3f3f3f]">
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* FAQ Results */}
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8 text-[#afafaf]">
                  <p>{t("support.faq.noResults")}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFAQs.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <h3 className="text-lg font-medium text-white border-b border-[#3f3f3f] pb-2">
                        {category.title}
                      </h3>
                      <div className="space-y-2">
                        {category.questions.map((question) => (
                          <Collapsible
                            key={question.id}
                            open={openFAQ === question.id}
                            onOpenChange={(open) => setOpenFAQ(open ? question.id : null)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-between bg-[#2b2b2b] hover:bg-[#3f3f3f] border border-[#3f3f3f] text-white p-4 h-auto text-left"
                              >
                                <span className="text-left font-medium">{question.question}</span>
                                <Plus className={`h-4 w-4 transition-transform ${openFAQ === question.id ? 'rotate-45' : ''}`} />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="bg-[#1a1a1a] border border-t-0 border-[#3f3f3f] p-4 text-[#afafaf]">
                              <p className="leading-relaxed">{question.answer}</p>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Chat Widget */}
          <div className="w-80">
            <Card className="bg-[#2b2b2b] border-[#3f3f3f] h-fit">
              <CardContent className="p-0">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#3f3f3f]">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{t("support.chat.title")}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white">T</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">{t("support.chat.botName")}</span>
                        <span className="text-xs text-[#afafaf]">4:05 pm</span>
                      </div>
                      <div className="bg-[#3f3f3f] rounded-lg p-3 text-sm">
                        {t("support.chat.welcomeMessage")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-[#3f3f3f] space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      {t("support.chat.actions.startTrial")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      {t("support.chat.actions.question")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      {t("support.chat.actions.support")}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      {t("support.chat.actions.bookDemo")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      {t("support.chat.actions.liveAgent")}
                    </Button>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-[#3f3f3f]">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder={t("support.chat.messagePlaceholder")}
                      className="flex-1 bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                    />
                    <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  )
}
