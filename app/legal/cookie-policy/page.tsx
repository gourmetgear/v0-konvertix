"use client"
import { useLanguage } from '@/contexts/LanguageContext'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CookiePolicyPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Cookie Policy",
      lastUpdated: "Last updated: January 15, 2024",
      sections: [
        {
          title: "1. What Are Cookies",
          content: `Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.`
        },
        {
          title: "2. Types of Cookies We Use",
          content: `Essential Cookies:
• Required for the website to function properly
• Cannot be disabled without affecting site functionality
• Include authentication, security, and basic site operations

Performance Cookies:
• Help us understand how visitors interact with our website
• Collect anonymous information about page visits and user behavior
• Used to improve website performance and user experience

Functionality Cookies:
• Remember your preferences and settings
• Personalize content and features
• Enhance user experience across visits

Marketing Cookies:
• Track your browsing habits across websites
• Used to display relevant advertisements
• Help measure advertising campaign effectiveness`
        },
        {
          title: "3. Third-Party Cookies",
          content: `We may use third-party services that place cookies on your device:

• Google Analytics - for website traffic analysis
• Facebook Pixel - for advertising and conversion tracking
• LinkedIn Insight Tag - for B2B marketing analytics
• Hotjar - for user behavior analysis
• Intercom - for customer support chat

These third parties have their own privacy policies and cookie practices.`
        },
        {
          title: "4. Cookie Management",
          content: `You can control cookies through:

Browser Settings:
• Most browsers allow you to view, delete, and block cookies
• Check your browser's help section for specific instructions
• Disabling cookies may affect website functionality

Our Cookie Preferences:
• Use our cookie consent banner to customize preferences
• Access cookie settings from our privacy policy page
• Update your choices at any time`
        },
        {
          title: "5. Cookie Retention",
          content: `Session Cookies:
• Temporary cookies that expire when you close your browser
• Used for essential website functionality

Persistent Cookies:
• Remain on your device for a set period or until manually deleted
• Retention periods vary from 30 days to 2 years
• Used for preferences and analytics`
        },
        {
          title: "6. Mobile Apps",
          content: `Our mobile applications may use similar tracking technologies:

• App analytics and performance monitoring
• Push notification preferences
• User behavior analysis
• Crash reporting and debugging

You can manage these through your device settings or app preferences.`
        },
        {
          title: "7. Updates to This Policy",
          content: `We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our business practices. We will notify you of significant changes through our website or email.`
        },
        {
          title: "8. Contact Us",
          content: `If you have questions about our use of cookies:

Email: privacy@konvertix.com
Address: [Company Address]
Phone: [Company Phone]

You can also contact us to request information about the cookies we have stored about you.`
        }
      ]
    },
    de: {
      title: "Cookie-Richtlinie",
      lastUpdated: "Zuletzt aktualisiert: 15. Januar 2024",
      sections: [
        {
          title: "1. Was sind Cookies",
          content: `Cookies sind kleine Textdateien, die auf Ihrem Gerät platziert werden, wenn Sie unsere Website besuchen. Sie helfen uns dabei, Ihnen eine bessere Erfahrung zu bieten, indem sie sich Ihre Präferenzen merken und verstehen, wie Sie unseren Service nutzen.`
        },
        {
          title: "2. Arten von Cookies, die wir verwenden",
          content: `Notwendige Cookies:
• Erforderlich für das ordnungsgemäße Funktionieren der Website
• Können nicht deaktiviert werden, ohne die Site-Funktionalität zu beeinträchtigen
• Umfassen Authentifizierung, Sicherheit und grundlegende Site-Operationen

Leistungs-Cookies:
• Helfen uns zu verstehen, wie Besucher mit unserer Website interagieren
• Sammeln anonyme Informationen über Seitenbesuche und Benutzerverhalten
• Werden zur Verbesserung der Website-Leistung und Benutzererfahrung verwendet

Funktionalitäts-Cookies:
• Merken sich Ihre Präferenzen und Einstellungen
• Personalisieren Inhalte und Funktionen
• Verbessern die Benutzererfahrung bei wiederholten Besuchen

Marketing-Cookies:
• Verfolgen Ihre Browsing-Gewohnheiten auf Websites
• Werden verwendet, um relevante Werbung anzuzeigen
• Helfen bei der Messung der Wirksamkeit von Werbekampagnen`
        },
        {
          title: "3. Drittanbieter-Cookies",
          content: `Wir können Drittanbieterdienste verwenden, die Cookies auf Ihrem Gerät platzieren:

• Google Analytics - für Website-Traffic-Analyse
• Facebook Pixel - für Werbung und Conversion-Tracking
• LinkedIn Insight Tag - für B2B-Marketing-Analysen
• Hotjar - für Benutzerverhalten-Analyse
• Intercom - für Kundensupport-Chat

Diese Drittanbieter haben ihre eigenen Datenschutzrichtlinien und Cookie-Praktiken.`
        },
        {
          title: "4. Cookie-Verwaltung",
          content: `Sie können Cookies kontrollieren durch:

Browser-Einstellungen:
• Die meisten Browser ermöglichen es Ihnen, Cookies anzuzeigen, zu löschen und zu blockieren
• Überprüfen Sie den Hilfebereich Ihres Browsers für spezifische Anweisungen
• Das Deaktivieren von Cookies kann die Website-Funktionalität beeinträchtigen

Unsere Cookie-Präferenzen:
• Verwenden Sie unser Cookie-Zustimmungsbanner, um Präferenzen anzupassen
• Greifen Sie auf Cookie-Einstellungen von unserer Datenschutzrichtlinien-Seite zu
• Aktualisieren Sie Ihre Auswahl jederzeit`
        },
        {
          title: "5. Cookie-Aufbewahrung",
          content: `Sitzungs-Cookies:
• Temporäre Cookies, die ablaufen, wenn Sie Ihren Browser schließen
• Werden für wesentliche Website-Funktionalität verwendet

Persistente Cookies:
• Verbleiben für einen festgelegten Zeitraum oder bis zur manuellen Löschung auf Ihrem Gerät
• Aufbewahrungszeiten variieren von 30 Tagen bis 2 Jahren
• Werden für Präferenzen und Analysen verwendet`
        },
        {
          title: "6. Mobile Apps",
          content: `Unsere mobilen Anwendungen können ähnliche Tracking-Technologien verwenden:

• App-Analysen und Leistungsüberwachung
• Push-Benachrichtigungs-Präferenzen
• Benutzerverhalten-Analyse
• Absturzberichte und Debugging

Sie können diese über Ihre Geräteeinstellungen oder App-Präferenzen verwalten.`
        },
        {
          title: "7. Aktualisierungen dieser Richtlinie",
          content: `Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren, um Änderungen in der Technologie, rechtlichen Anforderungen oder unseren Geschäftspraktiken zu reflektieren. Wir werden Sie über bedeutende Änderungen durch unsere Website oder E-Mail benachrichtigen.`
        },
        {
          title: "8. Kontaktieren Sie uns",
          content: `Wenn Sie Fragen zu unserer Verwendung von Cookies haben:

E-Mail: privacy@konvertix.com
Adresse: [Firmenadresse]
Telefon: [Firmentelefon]

Sie können uns auch kontaktieren, um Informationen über die Cookies anzufordern, die wir über Sie gespeichert haben.`
        }
      ]
    }
  }

  const currentContent = content[language] || content.en

  return (
    <div className="min-h-screen bg-[#0b021c] text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-[#a545b6] hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{currentContent.title}</h1>
          <p className="text-[#afafaf]">{currentContent.lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {currentContent.sections.map((section, index) => (
            <section key={index} className="bg-[#1b1527] rounded-lg p-6 border border-[#2b2b2b]">
              <h2 className="text-2xl font-semibold mb-4 text-white">{section.title}</h2>
              <div className="text-[#afafaf] whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#2b2b2b] text-center">
          <p className="text-[#afafaf] text-sm">
            For questions about our cookie practices, contact us at{" "}
            <a href="mailto:privacy@konvertix.com" className="text-[#a545b6] hover:text-white transition-colors">
              privacy@konvertix.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}