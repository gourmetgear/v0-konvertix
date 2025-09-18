"use client"
import { useLanguage } from '@/contexts/LanguageContext'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: January 15, 2024",
      sections: [
        {
          title: "1. Information We Collect",
          content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include:

• Personal information (name, email address, phone number)
• Account credentials and preferences
• Marketing campaign data and analytics
• Usage data and interaction with our platform
• Payment information (processed securely through third-party providers)`
        },
        {
          title: "2. How We Use Your Information",
          content: `We use the information we collect to:

• Provide, maintain, and improve our marketing analytics services
• Process transactions and send related information
• Send technical notices, updates, and support messages
• Respond to your comments, questions, and customer service requests
• Monitor and analyze trends, usage, and activities
• Personalize and improve your experience`
        },
        {
          title: "3. Information Sharing and Disclosure",
          content: `We may share your information in the following circumstances:

• With your consent or at your direction
• With third-party vendors, consultants, and service providers
• To comply with laws, regulations, or legal requests
• To protect the rights, property, and safety of Konvertix and others
• In connection with a merger, acquisition, or sale of assets`
        },
        {
          title: "4. Data Security",
          content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.`
        },
        {
          title: "5. Your Rights and Choices",
          content: `You have the right to:

• Access, update, or delete your personal information
• Object to processing of your personal information
• Request data portability
• Withdraw consent where we rely on your consent
• Lodge a complaint with a supervisory authority`
        },
        {
          title: "6. Cookies and Tracking Technologies",
          content: `We use cookies and similar tracking technologies to collect and use personal information about you. For more information about our use of cookies, please see our Cookie Policy.`
        },
        {
          title: "7. International Data Transfers",
          content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in accordance with applicable data protection laws.`
        },
        {
          title: "8. Contact Us",
          content: `If you have any questions about this Privacy Policy, please contact us at:

Email: privacy@konvertix.com
Address: [Company Address]
Phone: [Company Phone]`
        }
      ]
    },
    de: {
      title: "Datenschutzerklärung",
      lastUpdated: "Zuletzt aktualisiert: 15. Januar 2024",
      sections: [
        {
          title: "1. Informationen, die wir sammeln",
          content: `Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, z.B. wenn Sie ein Konto erstellen, unsere Dienste nutzen oder uns für Support kontaktieren. Dazu gehören:

• Persönliche Informationen (Name, E-Mail-Adresse, Telefonnummer)
• Kontoanmeldedaten und Präferenzen
• Marketing-Kampagnendaten und Analysen
• Nutzungsdaten und Interaktionen mit unserer Plattform
• Zahlungsinformationen (sicher über Drittanbieter verarbeitet)`
        },
        {
          title: "2. Wie wir Ihre Informationen verwenden",
          content: `Wir verwenden die gesammelten Informationen, um:

• Unsere Marketing-Analyse-Dienste bereitzustellen, zu warten und zu verbessern
• Transaktionen zu verarbeiten und verwandte Informationen zu senden
• Technische Hinweise, Updates und Support-Nachrichten zu senden
• Auf Ihre Kommentare, Fragen und Kundenservice-Anfragen zu antworten
• Trends, Nutzung und Aktivitäten zu überwachen und zu analysieren
• Ihre Erfahrung zu personalisieren und zu verbessern`
        },
        {
          title: "3. Weitergabe und Offenlegung von Informationen",
          content: `Wir können Ihre Informationen unter folgenden Umständen weitergeben:

• Mit Ihrer Zustimmung oder auf Ihre Anweisung
• An Drittanbieter, Berater und Dienstleister
• Um Gesetze, Vorschriften oder rechtliche Anfragen zu erfüllen
• Um die Rechte, das Eigentum und die Sicherheit von Konvertix und anderen zu schützen
• Im Zusammenhang mit einer Fusion, Übernahme oder dem Verkauf von Vermögenswerten`
        },
        {
          title: "4. Datensicherheit",
          content: `Wir implementieren angemessene technische und organisatorische Maßnahmen zum Schutz Ihrer persönlichen Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung. Jedoch ist keine Übertragungsmethode über das Internet 100% sicher.`
        },
        {
          title: "5. Ihre Rechte und Wahlmöglichkeiten",
          content: `Sie haben das Recht:

• Auf Zugang, Aktualisierung oder Löschung Ihrer persönlichen Daten
• Der Verarbeitung Ihrer persönlichen Daten zu widersprechen
• Datenportabilität zu beantragen
• Die Einwilligung zu widerrufen, wo wir auf Ihre Einwilligung angewiesen sind
• Eine Beschwerde bei einer Aufsichtsbehörde einzureichen`
        },
        {
          title: "6. Cookies und Tracking-Technologien",
          content: `Wir verwenden Cookies und ähnliche Tracking-Technologien, um persönliche Informationen über Sie zu sammeln und zu verwenden. Weitere Informationen über unsere Verwendung von Cookies finden Sie in unserer Cookie-Richtlinie.`
        },
        {
          title: "7. Internationale Datenübertragungen",
          content: `Ihre Informationen können in andere Länder als Ihrem eigenen übertragen und verarbeitet werden. Wir stellen sicher, dass angemessene Schutzmaßnahmen für solche Übertragungen gemäß den geltenden Datenschutzgesetzen vorhanden sind.`
        },
        {
          title: "8. Kontaktieren Sie uns",
          content: `Wenn Sie Fragen zu dieser Datenschutzerklärung haben, kontaktieren Sie uns bitte unter:

E-Mail: privacy@konvertix.com
Adresse: [Firmenadresse]
Telefon: [Firmentelefon]`
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
            For questions about this policy, contact us at{" "}
            <a href="mailto:privacy@konvertix.com" className="text-[#a545b6] hover:text-white transition-colors">
              privacy@konvertix.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}