"use client"
import { useLanguage } from '@/contexts/LanguageContext'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfServicePage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: January 15, 2024",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: `By accessing and using Konvertix's marketing analytics platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use our services.`
        },
        {
          title: "2. Description of Service",
          content: `Konvertix provides AI-powered marketing analytics and campaign management tools designed to help businesses optimize their marketing performance. Our services include:

• Campaign analytics and reporting
• Performance tracking and optimization
• Marketing automation tools
• Data visualization and insights
• Integration with advertising platforms`
        },
        {
          title: "3. User Accounts and Responsibilities",
          content: `To use our services, you must:

• Provide accurate, current, and complete information
• Maintain the security of your account credentials
• Be responsible for all activities under your account
• Notify us immediately of any unauthorized use
• Use the service in compliance with all applicable laws`
        },
        {
          title: "4. Acceptable Use Policy",
          content: `You may not use our service to:

• Violate any applicable laws or regulations
• Infringe on intellectual property rights
• Transmit harmful, offensive, or illegal content
• Attempt to gain unauthorized access to our systems
• Interfere with the proper functioning of the service
• Use the service for competitive intelligence gathering`
        },
        {
          title: "5. Subscription and Payment",
          content: `• Subscriptions are billed in advance on a monthly or annual basis
• All fees are non-refundable except as required by law
• We may change pricing with 30 days' notice
• Failure to pay may result in service suspension
• You are responsible for applicable taxes`
        },
        {
          title: "6. Intellectual Property",
          content: `• Konvertix retains all rights to our platform and technology
• You retain ownership of your data and content
• You grant us license to use your data to provide services
• You may not reverse engineer or copy our software
• All trademarks and copyrights remain with their respective owners`
        },
        {
          title: "7. Data and Privacy",
          content: `• Your data privacy is governed by our Privacy Policy
• We implement industry-standard security measures
• You are responsible for the accuracy of data you provide
• We may aggregate anonymized data for service improvement
• Data retention periods are outlined in our Privacy Policy`
        },
        {
          title: "8. Service Availability",
          content: `• We strive for 99.9% uptime but cannot guarantee uninterrupted service
• Scheduled maintenance will be announced in advance
• We are not liable for service interruptions beyond our control
• Service credits may be available for extended outages`
        },
        {
          title: "9. Limitation of Liability",
          content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, KONVERTIX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE.`
        },
        {
          title: "10. Termination",
          content: `• Either party may terminate this agreement at any time
• We may suspend service for violation of these terms
• Upon termination, you lose access to the service
• Data export options are available for a limited time
• Certain provisions survive termination`
        },
        {
          title: "11. Changes to Terms",
          content: `We reserve the right to modify these terms at any time. We will notify users of material changes via email or platform notification. Continued use constitutes acceptance of modified terms.`
        },
        {
          title: "12. Contact Information",
          content: `For questions about these Terms of Service:

Email: legal@konvertix.com
Address: [Company Address]
Phone: [Company Phone]`
        }
      ]
    },
    de: {
      title: "Nutzungsbedingungen",
      lastUpdated: "Zuletzt aktualisiert: 15. Januar 2024",
      sections: [
        {
          title: "1. Annahme der Bedingungen",
          content: `Durch den Zugriff und die Nutzung der Marketing-Analytics-Plattform von Konvertix akzeptieren Sie die Bedingungen und Bestimmungen dieser Vereinbarung und erklären sich damit einverstanden. Wenn Sie diesen Bedingungen nicht zustimmen, sollten Sie unsere Dienste nicht nutzen.`
        },
        {
          title: "2. Beschreibung des Dienstes",
          content: `Konvertix bietet KI-gesteuerte Marketing-Analysen und Kampagnenmanagement-Tools, die Unternehmen dabei helfen, ihre Marketing-Performance zu optimieren. Unsere Dienste umfassen:

• Kampagnen-Analysen und Berichterstattung
• Performance-Tracking und Optimierung
• Marketing-Automatisierungstools
• Datenvisualisierung und Erkenntnisse
• Integration mit Werbeplattformen`
        },
        {
          title: "3. Benutzerkonten und Verantwortlichkeiten",
          content: `Um unsere Dienste zu nutzen, müssen Sie:

• Genaue, aktuelle und vollständige Informationen bereitstellen
• Die Sicherheit Ihrer Kontoanmeldedaten wahren
• Für alle Aktivitäten unter Ihrem Konto verantwortlich sein
• Uns unverzüglich über unbefugte Nutzung benachrichtigen
• Den Dienst in Übereinstimmung mit allen geltenden Gesetzen nutzen`
        },
        {
          title: "4. Akzeptable Nutzungsrichtlinie",
          content: `Sie dürfen unseren Dienst nicht verwenden, um:

• Geltende Gesetze oder Vorschriften zu verletzen
• Urheberrechte zu verletzen
• Schädliche, beleidigende oder illegale Inhalte zu übertragen
• Unbefugten Zugriff auf unsere Systeme zu erlangen
• Das ordnungsgemäße Funktionieren des Dienstes zu stören
• Den Dienst für Competitive Intelligence zu nutzen`
        },
        {
          title: "5. Abonnement und Zahlung",
          content: `• Abonnements werden im Voraus monatlich oder jährlich abgerechnet
• Alle Gebühren sind nicht erstattungsfähig, außer gesetzlich vorgeschrieben
• Wir können Preise mit 30 Tagen Vorlaufzeit ändern
• Zahlungsausfall kann zur Aussetzung des Dienstes führen
• Sie sind für anfallende Steuern verantwortlich`
        },
        {
          title: "6. Geistiges Eigentum",
          content: `• Konvertix behält alle Rechte an unserer Plattform und Technologie
• Sie behalten das Eigentum an Ihren Daten und Inhalten
• Sie gewähren uns eine Lizenz zur Nutzung Ihrer Daten für die Dienstbereitstellung
• Sie dürfen unsere Software nicht zurückentwickeln oder kopieren
• Alle Marken und Urheberrechte verbleiben bei ihren jeweiligen Eigentümern`
        },
        {
          title: "7. Daten und Datenschutz",
          content: `• Ihr Datenschutz wird durch unsere Datenschutzerklärung geregelt
• Wir implementieren branchenübliche Sicherheitsmaßnahmen
• Sie sind für die Genauigkeit der von Ihnen bereitgestellten Daten verantwortlich
• Wir können anonymisierte Daten für Serviceverbesserungen aggregieren
• Datenaufbewahrungszeiten sind in unserer Datenschutzerklärung beschrieben`
        },
        {
          title: "8. Dienstverfügbarkeit",
          content: `• Wir streben 99,9% Betriebszeit an, können aber unterbrechungsfreien Service nicht garantieren
• Geplante Wartungsarbeiten werden im Voraus angekündigt
• Wir haften nicht für Dienstunterbrechungen außerhalb unserer Kontrolle
• Service-Credits können für längere Ausfälle verfügbar sein`
        },
        {
          title: "9. Haftungsbeschränkung",
          content: `IM MAXIMAL GESETZLICH ZULÄSSIGEN UMFANG HAFTET KONVERTIX NICHT FÜR INDIREKTE, ZUFÄLLIGE, BESONDERE, FOLGE- ODER STRAFSCHÄDEN, EINSCHLIESSLICH ABER NICHT BESCHRÄNKT AUF GEWINNVERLUSTE, DATEN ODER NUTZUNG.`
        },
        {
          title: "10. Kündigung",
          content: `• Jede Partei kann diese Vereinbarung jederzeit kündigen
• Wir können den Service bei Verletzung dieser Bedingungen aussetzen
• Bei Kündigung verlieren Sie den Zugang zum Service
• Datenexport-Optionen sind für begrenzte Zeit verfügbar
• Bestimmte Bestimmungen überdauern die Kündigung`
        },
        {
          title: "11. Änderungen der Bedingungen",
          content: `Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Wir benachrichtigen Benutzer über wesentliche Änderungen per E-Mail oder Plattform-Benachrichtigung. Fortgesetzte Nutzung stellt Annahme der geänderten Bedingungen dar.`
        },
        {
          title: "12. Kontaktinformationen",
          content: `Für Fragen zu diesen Nutzungsbedingungen:

E-Mail: legal@konvertix.com
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
            For questions about these terms, contact us at{" "}
            <a href="mailto:legal@konvertix.com" className="text-[#a545b6] hover:text-white transition-colors">
              legal@konvertix.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}