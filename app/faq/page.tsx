"use client"
import { useState } from "react"
import { useLanguage } from '@/contexts/LanguageContext'
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronRight, Search, MessageCircle, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function FAQPage() {
  const { language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<number[]>([])

  const content = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about Konvertix",
      searchPlaceholder: "Search for answers...",
      noResults: "No results found. Try different keywords or contact support.",
      stillNeedHelp: "Still need help?",
      contactSupport: "Contact Support",
      emailSupport: "Email Support",
      callUs: "Call Us",
      categories: [
        {
          name: "Getting Started",
          faqs: [
            {
              question: "How do I get started with Konvertix?",
              answer: "Getting started is easy! Simply sign up for a free account, connect your marketing platforms (Facebook Ads, Google Ads, etc.), and our AI will automatically start analyzing your campaigns. You'll see your first insights within minutes."
            },
            {
              question: "What marketing platforms does Konvertix support?",
              answer: "Konvertix integrates with all major marketing platforms including Facebook Ads, Google Ads, LinkedIn Ads, Twitter Ads, TikTok Ads, Snapchat Ads, Pinterest Ads, and more. We also support email marketing platforms like Mailchimp, Klaviyo, and SendGrid."
            },
            {
              question: "Do I need technical knowledge to use Konvertix?",
              answer: "Not at all! Konvertix is designed for marketers of all technical levels. Our intuitive interface and AI-powered insights make it easy to understand your marketing performance without any coding or technical setup required."
            },
            {
              question: "How long does it take to see results?",
              answer: "You'll start seeing basic analytics within minutes of connecting your accounts. For AI-powered insights and recommendations, our system typically processes your data within 24-48 hours to provide meaningful analysis."
            }
          ]
        },
        {
          name: "Features & Functionality",
          faqs: [
            {
              question: "What types of analytics does Konvertix provide?",
              answer: "Konvertix offers comprehensive marketing analytics including campaign performance tracking, audience insights, conversion attribution, ROI analysis, competitor benchmarking, and predictive analytics. Our AI identifies optimization opportunities and provides actionable recommendations."
            },
            {
              question: "Can I create custom reports and dashboards?",
              answer: "Yes! Konvertix offers fully customizable dashboards and reports. You can create widgets, set up automated reports, schedule email deliveries, and share dashboards with your team or clients with different permission levels."
            },
            {
              question: "Does Konvertix offer real-time data?",
              answer: "Yes, we provide real-time data synchronization for most platforms. Your dashboards update automatically, and you can set up real-time alerts for important metrics like budget overspend, campaign performance drops, or conversion spikes."
            },
            {
              question: "What is the AI optimization feature?",
              answer: "Our AI analyzes your campaign data to identify patterns, predict performance, and automatically suggest optimizations. It can recommend budget reallocation, audience adjustments, ad creative improvements, and bidding strategies to maximize your ROI."
            }
          ]
        },
        {
          name: "Pricing & Plans",
          faqs: [
            {
              question: "What pricing plans are available?",
              answer: "We offer flexible pricing plans for businesses of all sizes: Starter ($99/month) for small businesses, Professional ($299/month) for growing companies, and Enterprise (custom pricing) for large organizations. All plans include a 14-day free trial."
            },
            {
              question: "Is there a free trial available?",
              answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can explore all our analytics, create reports, and experience our AI insights before committing to a paid plan."
            },
            {
              question: "Can I change or cancel my plan anytime?",
              answer: "Absolutely! You can upgrade, downgrade, or cancel your plan at any time from your account settings. Changes take effect at the next billing cycle, and we offer prorated billing for upgrades."
            },
            {
              question: "Do you offer discounts for annual payments?",
              answer: "Yes, we offer a 20% discount when you pay annually. Additionally, we provide special pricing for non-profits, educational institutions, and startups. Contact our sales team for custom pricing options."
            }
          ]
        },
        {
          name: "Data & Security",
          faqs: [
            {
              question: "How secure is my data with Konvertix?",
              answer: "Data security is our top priority. We use enterprise-grade encryption (AES-256), secure data centers, regular security audits, and comply with SOC 2 Type II standards. All data transmission is encrypted and we maintain strict access controls."
            },
            {
              question: "Do you comply with GDPR and other privacy regulations?",
              answer: "Yes, we are fully GDPR compliant and also adhere to CCPA, PIPEDA, and other global privacy regulations. We have a dedicated Data Protection Officer and provide tools for data subject requests, consent management, and data portability."
            },
            {
              question: "Who has access to my marketing data?",
              answer: "Only you and authorized team members have access to your data. Our support team can only access your account with explicit permission for troubleshooting. We never share, sell, or use your data for any purpose other than providing our services."
            },
            {
              question: "Can I export my data if I decide to leave?",
              answer: "Yes, you can export all your data at any time in standard formats (CSV, JSON, PDF). We provide comprehensive data export tools and will help you transition your data if you decide to discontinue our service."
            }
          ]
        },
        {
          name: "Support & Training",
          faqs: [
            {
              question: "What support options are available?",
              answer: "We offer multiple support channels: 24/7 chat support, email support (response within 4 hours), phone support for Enterprise customers, comprehensive documentation, video tutorials, and weekly live training sessions."
            },
            {
              question: "Do you provide onboarding and training?",
              answer: "Yes! All customers receive personalized onboarding. Professional and Enterprise plans include dedicated account managers, custom training sessions, and ongoing optimization consultations to ensure you get maximum value."
            },
            {
              question: "Is there a knowledge base or documentation?",
              answer: "We maintain an extensive knowledge base with step-by-step guides, video tutorials, best practices, and troubleshooting articles. Our documentation is searchable and regularly updated with new features and use cases."
            },
            {
              question: "Can you help with campaign strategy and optimization?",
              answer: "Absolutely! Our customer success team includes certified marketing experts who can help with campaign strategy, optimization recommendations, and best practices. Enterprise customers get dedicated strategist support."
            }
          ]
        },
        {
          name: "Integrations & Technical",
          faqs: [
            {
              question: "How do I connect my marketing accounts?",
              answer: "Connecting accounts is simple through our integrations page. We use secure OAuth authentication - just click connect, authorize Konvertix, and we'll automatically start importing your data. No API keys or technical setup required."
            },
            {
              question: "What if a platform I use isn't supported?",
              answer: "We're constantly adding new integrations. If you need a specific platform, contact us and we'll prioritize it in our development roadmap. We also offer custom integrations for Enterprise customers."
            },
            {
              question: "Can I use Konvertix's API for custom integrations?",
              answer: "Yes, we offer a comprehensive REST API for custom integrations, data export, and building internal tools. API access is available on Professional and Enterprise plans with detailed documentation and support."
            },
            {
              question: "Do you offer white-label solutions?",
              answer: "Yes, we offer white-label solutions for agencies and consultants who want to provide analytics services under their own brand. This includes custom branding, domain setup, and client management features."
            }
          ]
        }
      ]
    },
    de: {
      title: "Häufig gestellte Fragen",
      subtitle: "Finden Sie Antworten auf häufige Fragen zu Konvertix",
      searchPlaceholder: "Nach Antworten suchen...",
      noResults: "Keine Ergebnisse gefunden. Versuchen Sie andere Suchbegriffe oder kontaktieren Sie den Support.",
      stillNeedHelp: "Benötigen Sie noch Hilfe?",
      contactSupport: "Support kontaktieren",
      emailSupport: "E-Mail Support",
      callUs: "Anrufen",
      categories: [
        {
          name: "Erste Schritte",
          faqs: [
            {
              question: "Wie fange ich mit Konvertix an?",
              answer: "Der Einstieg ist einfach! Melden Sie sich einfach für ein kostenloses Konto an, verbinden Sie Ihre Marketing-Plattformen (Facebook Ads, Google Ads, etc.), und unsere KI wird automatisch mit der Analyse Ihrer Kampagnen beginnen. Sie sehen Ihre ersten Erkenntnisse innerhalb von Minuten."
            },
            {
              question: "Welche Marketing-Plattformen unterstützt Konvertix?",
              answer: "Konvertix integriert sich mit allen wichtigen Marketing-Plattformen einschließlich Facebook Ads, Google Ads, LinkedIn Ads, Twitter Ads, TikTok Ads, Snapchat Ads, Pinterest Ads und mehr. Wir unterstützen auch E-Mail-Marketing-Plattformen wie Mailchimp, Klaviyo und SendGrid."
            },
            {
              question: "Brauche ich technisches Wissen, um Konvertix zu nutzen?",
              answer: "Überhaupt nicht! Konvertix ist für Marketer aller technischen Ebenen konzipiert. Unsere intuitive Benutzeroberfläche und KI-gesteuerte Erkenntnisse machen es einfach, Ihre Marketing-Performance zu verstehen, ohne dass Programmierung oder technische Einrichtung erforderlich ist."
            },
            {
              question: "Wie lange dauert es, bis ich Ergebnisse sehe?",
              answer: "Sie werden grundlegende Analysen innerhalb von Minuten nach der Verbindung Ihrer Konten sehen. Für KI-gesteuerte Erkenntnisse und Empfehlungen verarbeitet unser System typischerweise Ihre Daten innerhalb von 24-48 Stunden, um aussagekräftige Analysen zu liefern."
            }
          ]
        },
        {
          name: "Features & Funktionalität",
          faqs: [
            {
              question: "Welche Arten von Analysen bietet Konvertix?",
              answer: "Konvertix bietet umfassende Marketing-Analysen einschließlich Kampagnen-Performance-Tracking, Zielgruppen-Insights, Conversion-Attribution, ROI-Analyse, Konkurrenz-Benchmarking und prädiktive Analysen. Unsere KI identifiziert Optimierungsmöglichkeiten und bietet umsetzbare Empfehlungen."
            },
            {
              question: "Kann ich benutzerdefinierte Berichte und Dashboards erstellen?",
              answer: "Ja! Konvertix bietet vollständig anpassbare Dashboards und Berichte. Sie können Widgets erstellen, automatisierte Berichte einrichten, E-Mail-Lieferungen planen und Dashboards mit Ihrem Team oder Kunden mit verschiedenen Berechtigungsebenen teilen."
            },
            {
              question: "Bietet Konvertix Echtzeit-Daten?",
              answer: "Ja, wir bieten Echtzeit-Datensynchronisation für die meisten Plattformen. Ihre Dashboards aktualisieren sich automatisch, und Sie können Echtzeit-Benachrichtigungen für wichtige Metriken wie Budgetüberschreitungen, Kampagnen-Performance-Rückgänge oder Conversion-Spitzen einrichten."
            },
            {
              question: "Was ist die KI-Optimierungsfunktion?",
              answer: "Unsere KI analysiert Ihre Kampagnendaten, um Muster zu identifizieren, Performance vorherzusagen und automatisch Optimierungen vorzuschlagen. Sie kann Budget-Umverteilungen, Zielgruppen-Anpassungen, Anzeigen-Kreativ-Verbesserungen und Gebots-Strategien empfehlen, um Ihren ROI zu maximieren."
            }
          ]
        },
        {
          name: "Preise & Pläne",
          faqs: [
            {
              question: "Welche Preispläne sind verfügbar?",
              answer: "Wir bieten flexible Preispläne für Unternehmen aller Größen: Starter (99€/Monat) für kleine Unternehmen, Professional (299€/Monat) für wachsende Unternehmen und Enterprise (individueller Preis) für große Organisationen. Alle Pläne beinhalten eine 14-tägige kostenlose Testversion."
            },
            {
              question: "Gibt es eine kostenlose Testversion?",
              answer: "Ja! Wir bieten eine 14-tägige kostenlose Testversion mit vollem Zugang zu allen Funktionen. Keine Kreditkarte erforderlich zum Starten. Sie können alle unsere Analysen erkunden, Berichte erstellen und unsere KI-Erkenntnisse erleben, bevor Sie sich für einen kostenpflichtigen Plan entscheiden."
            },
            {
              question: "Kann ich meinen Plan jederzeit ändern oder kündigen?",
              answer: "Absolut! Sie können Ihren Plan jederzeit in Ihren Kontoeinstellungen upgraden, downgraden oder kündigen. Änderungen werden im nächsten Abrechnungszyklus wirksam, und wir bieten anteilige Abrechnung für Upgrades."
            },
            {
              question: "Bieten Sie Rabatte für jährliche Zahlungen?",
              answer: "Ja, wir bieten 20% Rabatt bei jährlicher Zahlung. Zusätzlich bieten wir Sonderpreise für gemeinnützige Organisationen, Bildungseinrichtungen und Startups. Kontaktieren Sie unser Verkaufsteam für individuelle Preisoptionen."
            }
          ]
        },
        {
          name: "Daten & Sicherheit",
          faqs: [
            {
              question: "Wie sicher sind meine Daten bei Konvertix?",
              answer: "Datensicherheit ist unsere oberste Priorität. Wir verwenden Unternehmens-Verschlüsselung (AES-256), sichere Rechenzentren, regelmäßige Sicherheitsaudits und entsprechen SOC 2 Typ II Standards. Alle Datenübertragungen sind verschlüsselt und wir pflegen strenge Zugriffskontrollen."
            },
            {
              question: "Entsprechen Sie der DSGVO und anderen Datenschutzbestimmungen?",
              answer: "Ja, wir sind vollständig DSGVO-konform und halten auch CCPA, PIPEDA und andere globale Datenschutzbestimmungen ein. Wir haben einen dedizierten Datenschutzbeauftragten und bieten Tools für Betroffenenanfragen, Einwilligungsmanagement und Datenportabilität."
            },
            {
              question: "Wer hat Zugang zu meinen Marketing-Daten?",
              answer: "Nur Sie und autorisierte Teammitglieder haben Zugang zu Ihren Daten. Unser Support-Team kann nur mit ausdrücklicher Genehmigung für Fehlerbehebung auf Ihr Konto zugreifen. Wir teilen, verkaufen oder verwenden Ihre Daten niemals für andere Zwecke als die Bereitstellung unserer Dienste."
            },
            {
              question: "Kann ich meine Daten exportieren, wenn ich gehe?",
              answer: "Ja, Sie können jederzeit alle Ihre Daten in Standardformaten (CSV, JSON, PDF) exportieren. Wir bieten umfassende Datenexport-Tools und helfen Ihnen beim Übergang Ihrer Daten, wenn Sie sich entscheiden, unseren Service zu beenden."
            }
          ]
        },
        {
          name: "Support & Schulung",
          faqs: [
            {
              question: "Welche Support-Optionen sind verfügbar?",
              answer: "Wir bieten mehrere Support-Kanäle: 24/7 Chat-Support, E-Mail-Support (Antwort innerhalb von 4 Stunden), Telefon-Support für Enterprise-Kunden, umfassende Dokumentation, Video-Tutorials und wöchentliche Live-Schulungssessions."
            },
            {
              question: "Bieten Sie Onboarding und Schulungen?",
              answer: "Ja! Alle Kunden erhalten personalisiertes Onboarding. Professional- und Enterprise-Pläne beinhalten dedizierte Account Manager, individuelle Schulungssessions und laufende Optimierungsberatungen, um sicherzustellen, dass Sie maximalen Wert erhalten."
            },
            {
              question: "Gibt es eine Wissensdatenbank oder Dokumentation?",
              answer: "Wir pflegen eine umfassende Wissensdatenbank mit Schritt-für-Schritt-Anleitungen, Video-Tutorials, Best Practices und Fehlerbehebungsartikeln. Unsere Dokumentation ist durchsuchbar und wird regelmäßig mit neuen Funktionen und Anwendungsfällen aktualisiert."
            },
            {
              question: "Können Sie bei Kampagnenstrategie und Optimierung helfen?",
              answer: "Absolut! Unser Kundenerfolgs-Team umfasst zertifizierte Marketing-Experten, die bei Kampagnenstrategie, Optimierungsempfehlungen und Best Practices helfen können. Enterprise-Kunden erhalten dedizierten Strategist-Support."
            }
          ]
        },
        {
          name: "Integrationen & Technisches",
          faqs: [
            {
              question: "Wie verbinde ich meine Marketing-Konten?",
              answer: "Das Verbinden von Konten ist einfach über unsere Integrationsseite. Wir verwenden sichere OAuth-Authentifizierung - klicken Sie einfach auf Verbinden, autorisieren Sie Konvertix, und wir beginnen automatisch mit dem Import Ihrer Daten. Keine API-Schlüssel oder technische Einrichtung erforderlich."
            },
            {
              question: "Was ist, wenn eine Plattform, die ich nutze, nicht unterstützt wird?",
              answer: "Wir fügen ständig neue Integrationen hinzu. Wenn Sie eine spezifische Plattform benötigen, kontaktieren Sie uns und wir werden sie in unserer Entwicklungs-Roadmap priorisieren. Wir bieten auch individuelle Integrationen für Enterprise-Kunden."
            },
            {
              question: "Kann ich Konvertix's API für individuelle Integrationen verwenden?",
              answer: "Ja, wir bieten eine umfassende REST-API für individuelle Integrationen, Datenexport und das Erstellen interner Tools. API-Zugang ist in Professional- und Enterprise-Plänen mit detaillierter Dokumentation und Support verfügbar."
            },
            {
              question: "Bieten Sie White-Label-Lösungen?",
              answer: "Ja, wir bieten White-Label-Lösungen für Agenturen und Berater, die Analyse-Services unter ihrer eigenen Marke anbieten möchten. Dies umfasst individuelles Branding, Domain-Setup und Kundenverwaltungsfeatures."
            }
          ]
        }
      ]
    }
  }

  const currentContent = content[language] || content.en

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Filter FAQs based on search term
  const filteredCategories = currentContent.categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="min-h-screen bg-[#0b021c] text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-[#a545b6] hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{currentContent.title}</h1>
          <p className="text-xl text-[#afafaf] mb-8">{currentContent.subtitle}</p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
            <Input
              placeholder={currentContent.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#2b2b2b] border-[#3f3f3f] text-white placeholder-[#afafaf]"
            />
          </div>
        </div>

        {/* FAQ Content */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#afafaf] mb-8">{currentContent.noResults}</p>
            <div className="flex justify-center">
              <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
                <MessageCircle className="h-4 w-4 mr-2" />
                {currentContent.contactSupport}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCategories.map((category, categoryIndex) => (
              <section key={categoryIndex}>
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-[#2b2b2b] pb-3">
                  {category.name}
                </h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex
                    const isOpen = openItems.includes(globalIndex)

                    return (
                      <div
                        key={faqIndex}
                        className="bg-[#1b1527] rounded-lg border border-[#2b2b2b] overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-[#2b2b2b] transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-white pr-4">
                            {faq.question}
                          </h3>
                          {isOpen ? (
                            <ChevronDown className="h-5 w-5 text-[#a545b6] flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-[#afafaf] flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6">
                            <div className="pt-4 border-t border-[#2b2b2b]">
                              <p className="text-[#afafaf] leading-relaxed whitespace-pre-line">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Contact Support Section */}
        <div className="mt-16 bg-[#1b1527] rounded-lg p-8 border border-[#2b2b2b]">
          <h2 className="text-2xl font-bold mb-4 text-center">{currentContent.stillNeedHelp}</h2>
          <p className="text-[#afafaf] text-center mb-8">
            Our support team is here to help you get the most out of Konvertix.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#a545b6] rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{currentContent.contactSupport}</h3>
              <p className="text-[#afafaf] text-sm mb-4">24/7 live chat support</p>
              <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                Start Chat
              </Button>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#a545b6] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{currentContent.emailSupport}</h3>
              <p className="text-[#afafaf] text-sm mb-4">Response within 4 hours</p>
              <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                <a href="mailto:support@konvertix.com">Send Email</a>
              </Button>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#a545b6] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{currentContent.callUs}</h3>
              <p className="text-[#afafaf] text-sm mb-4">Enterprise customers</p>
              <Button variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#3f3f3f] bg-transparent">
                <a href="tel:+1234567890">Call Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}