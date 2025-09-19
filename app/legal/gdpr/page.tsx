"use client"
import { useLanguage } from '@/contexts/LanguageContext'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function GDPRPage() {
  const { t } = useLanguage()

  const sections = Array.from({ length: 8 }, (_, i) => ({
    title: t(`legal.gdpr.sections.${i}.title`),
    content: t(`legal.gdpr.sections.${i}.content`)
  }))

  // Removed hardcoded content object - now using translation system
  const oldContent = {
    en: {
      title: "GDPR Compliance",
      lastUpdated: "Last updated: January 15, 2024",
      sections: [
        {
          title: "1. Our Commitment to GDPR",
          content: `Konvertix is committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR). This page outlines how we comply with GDPR requirements and protect your rights as a data subject.`
        },
        {
          title: "2. Legal Basis for Processing",
          content: `We process your personal data based on the following legal grounds:

Consent:
• When you provide explicit consent for marketing communications
• For optional features that require your agreement
• Can be withdrawn at any time

Contract Performance:
• To provide our marketing analytics services
• To process payments and manage subscriptions
• To fulfill our contractual obligations

Legitimate Interest:
• To improve our services and user experience
• For security and fraud prevention
• For analytics and business intelligence (anonymized data)

Legal Obligation:
• To comply with accounting and tax requirements
• To respond to legal requests and court orders`
        },
        {
          title: "3. Your Rights Under GDPR",
          content: `As a data subject, you have the following rights:

Right of Access (Article 15):
• Request information about what personal data we hold about you
• Receive a copy of your personal data
• Understand how your data is being processed

Right to Rectification (Article 16):
• Correct inaccurate or incomplete personal data
• Update your account information at any time

Right to Erasure (Article 17):
• Request deletion of your personal data ("right to be forgotten")
• Subject to certain legal and business requirements

Right to Restrict Processing (Article 18):
• Limit how we use your personal data
• Temporarily suspend processing under certain conditions

Right to Data Portability (Article 20):
• Receive your personal data in a structured, machine-readable format
• Transfer your data to another service provider

Right to Object (Article 21):
• Object to processing for direct marketing purposes
• Object to processing based on legitimate interest

Rights Related to Automated Decision-Making (Article 22):
• Protection against automated profiling and decision-making
• Request human intervention in automated processes`
        },
        {
          title: "4. Data Protection Officer",
          content: `We have appointed a Data Protection Officer (DPO) to oversee our GDPR compliance:

DPO Contact Information:
Email: dpo@konvertix.com
Address: [DPO Address]

The DPO is responsible for:
• Monitoring GDPR compliance
• Conducting privacy impact assessments
• Serving as point of contact for supervisory authorities
• Providing guidance on data protection matters`
        },
        {
          title: "5. Data Transfers",
          content: `When transferring personal data outside the EU/EEA, we ensure appropriate safeguards:

Adequacy Decisions:
• Transfers to countries with EU adequacy decisions
• Currently includes Canada, Japan, and others

Standard Contractual Clauses (SCCs):
• EU-approved contract terms for data transfers
• Binding legal obligations for data protection

Binding Corporate Rules:
• Internal data protection rules for multinational organizations
• Approved by EU supervisory authorities

Your consent:
• Explicit consent for specific data transfers
• Clear information about risks and safeguards`
        },
        {
          title: "6. Data Retention",
          content: `We retain personal data only as long as necessary:

Account Data:
• Retained while your account is active
• Deleted within 30 days of account closure (unless legal obligation requires retention)

Marketing Data:
• Retained until consent is withdrawn
• Automatically reviewed every 2 years

Analytics Data:
• Anonymized data may be retained indefinitely
• Personal identifiers removed after 26 months

Legal and Financial Records:
• Retained for legal and tax obligations
• Typically 7 years for financial records`
        },
        {
          title: "7. Data Security Measures",
          content: `We implement appropriate technical and organizational measures:

Technical Measures:
• Encryption in transit and at rest
• Access controls and authentication
• Regular security assessments and monitoring
• Secure development practices

Organizational Measures:
• Staff training on data protection
• Privacy by design and by default
• Regular policy reviews and updates
• Incident response procedures`
        },
        {
          title: "8. Breach Notification",
          content: `In case of a personal data breach:

Supervisory Authority Notification:
• Notification within 72 hours of becoming aware
• Assessment of risk to rights and freedoms
• Description of measures taken

Individual Notification:
• Direct notification if high risk to rights and freedoms
• Clear and plain language explanation
• Advice on protective measures to take`
        },
        {
          title: "9. Privacy Impact Assessments",
          content: `We conduct Privacy Impact Assessments (PIAs) for:

• New products or services involving personal data
• Changes to existing data processing activities
• High-risk processing operations
• Use of new technologies

PIAs help us identify and mitigate privacy risks before processing begins.`
        },
        {
          title: "10. Supervisory Authority",
          content: `You have the right to lodge a complaint with a supervisory authority if you believe we have violated GDPR. The lead supervisory authority for Konvertix is:

[Supervisory Authority Name]
Address: [Authority Address]
Website: [Authority Website]
Email: [Authority Email]

You can also contact the supervisory authority in your country of residence.`
        },
        {
          title: "11. Contact Us",
          content: `For GDPR-related questions or to exercise your rights:

Data Protection Officer: dpo@konvertix.com
General Privacy: privacy@konvertix.com
Address: [Company Address]
Phone: [Company Phone]

Please include "GDPR Request" in your subject line and provide sufficient information to verify your identity.`
        }
      ]
    },
    de: {
      title: "DSGVO-Konformität",
      lastUpdated: "Zuletzt aktualisiert: 15. Januar 2024",
      sections: [
        {
          title: "1. Unser Engagement für die DSGVO",
          content: `Konvertix verpflichtet sich, Ihre personenbezogenen Daten in Übereinstimmung mit der Datenschutz-Grundverordnung (DSGVO) zu schützen. Diese Seite erklärt, wie wir die DSGVO-Anforderungen erfüllen und Ihre Rechte als betroffene Person schützen.`
        },
        {
          title: "2. Rechtsgrundlage für die Verarbeitung",
          content: `Wir verarbeiten Ihre personenbezogenen Daten auf folgenden Rechtsgrundlagen:

Einwilligung:
• Wenn Sie ausdrückliche Einwilligung für Marketing-Kommunikation geben
• Für optionale Funktionen, die Ihre Zustimmung erfordern
• Kann jederzeit widerrufen werden

Vertragserfüllung:
• Zur Bereitstellung unserer Marketing-Analyse-Dienste
• Zur Verarbeitung von Zahlungen und Verwaltung von Abonnements
• Zur Erfüllung unserer vertraglichen Verpflichtungen

Berechtigtes Interesse:
• Zur Verbesserung unserer Dienste und Benutzererfahrung
• Für Sicherheit und Betrugsprävention
• Für Analysen und Business Intelligence (anonymisierte Daten)

Rechtliche Verpflichtung:
• Zur Erfüllung von Buchhaltungs- und Steueranforderungen
• Zur Beantwortung rechtlicher Anfragen und Gerichtsbeschlüsse`
        },
        {
          title: "3. Ihre Rechte unter der DSGVO",
          content: `Als betroffene Person haben Sie folgende Rechte:

Recht auf Auskunft (Artikel 15):
• Informationen darüber anfordern, welche personenbezogenen Daten wir über Sie haben
• Eine Kopie Ihrer personenbezogenen Daten erhalten
• Verstehen, wie Ihre Daten verarbeitet werden

Recht auf Berichtigung (Artikel 16):
• Unrichtige oder unvollständige personenbezogene Daten korrigieren
• Ihre Kontoinformationen jederzeit aktualisieren

Recht auf Löschung (Artikel 17):
• Löschung Ihrer personenbezogenen Daten beantragen ("Recht auf Vergessenwerden")
• Vorbehaltlich bestimmter rechtlicher und geschäftlicher Anforderungen

Recht auf Einschränkung der Verarbeitung (Artikel 18):
• Begrenzen, wie wir Ihre personenbezogenen Daten verwenden
• Verarbeitung unter bestimmten Bedingungen vorübergehend aussetzen

Recht auf Datenübertragbarkeit (Artikel 20):
• Ihre personenbezogenen Daten in einem strukturierten, maschinenlesbaren Format erhalten
• Ihre Daten an einen anderen Dienstanbieter übertragen

Widerspruchsrecht (Artikel 21):
• Widerspruch gegen Verarbeitung für Direktmarketing-Zwecke
• Widerspruch gegen Verarbeitung aufgrund berechtigten Interesses

Rechte bezüglich automatisierter Entscheidungsfindung (Artikel 22):
• Schutz vor automatisiertem Profiling und Entscheidungsfindung
• Menschliches Eingreifen in automatisierte Prozesse beantragen`
        },
        {
          title: "4. Datenschutzbeauftragter",
          content: `Wir haben einen Datenschutzbeauftragten (DSB) zur Überwachung unserer DSGVO-Konformität ernannt:

DSB-Kontaktinformationen:
E-Mail: dpo@konvertix.com
Adresse: [DSB-Adresse]

Der DSB ist verantwortlich für:
• Überwachung der DSGVO-Konformität
• Durchführung von Datenschutz-Folgenabschätzungen
• Ansprechpartner für Aufsichtsbehörden
• Beratung zu Datenschutzangelegenheiten`
        },
        {
          title: "5. Datenübertragungen",
          content: `Bei der Übertragung personenbezogener Daten außerhalb der EU/EWR stellen wir angemessene Schutzmaßnahmen sicher:

Angemessenheitsbeschlüsse:
• Übertragungen in Länder mit EU-Angemessenheitsbeschlüssen
• Derzeit umfasst dies Kanada, Japan und andere

Standardvertragsklauseln (SVK):
• EU-genehmigte Vertragsbedingungen für Datenübertragungen
• Bindende rechtliche Verpflichtungen für Datenschutz

Verbindliche Unternehmensregeln:
• Interne Datenschutzregeln für multinationale Organisationen
• Von EU-Aufsichtsbehörden genehmigt

Ihre Einwilligung:
• Ausdrückliche Einwilligung für spezifische Datenübertragungen
• Klare Informationen über Risiken und Schutzmaßnahmen`
        },
        {
          title: "6. Datenaufbewahrung",
          content: `Wir bewahren personenbezogene Daten nur so lange wie nötig auf:

Kontodaten:
• Aufbewahrt, solange Ihr Konto aktiv ist
• Gelöscht innerhalb von 30 Tagen nach Kontoschließung (es sei denn, rechtliche Verpflichtung erfordert Aufbewahrung)

Marketing-Daten:
• Aufbewahrt bis Einwilligung widerrufen wird
• Automatisch alle 2 Jahre überprüft

Analyse-Daten:
• Anonymisierte Daten können unbegrenzt aufbewahrt werden
• Persönliche Identifikatoren nach 26 Monaten entfernt

Rechtliche und Finanzunterlagen:
• Aufbewahrt für rechtliche und steuerliche Verpflichtungen
• Typischerweise 7 Jahre für Finanzunterlagen`
        },
        {
          title: "7. Datensicherheitsmaßnahmen",
          content: `Wir implementieren angemessene technische und organisatorische Maßnahmen:

Technische Maßnahmen:
• Verschlüsselung bei Übertragung und Speicherung
• Zugangskontrollen und Authentifizierung
• Regelmäßige Sicherheitsbewertungen und Überwachung
• Sichere Entwicklungspraktiken

Organisatorische Maßnahmen:
• Mitarbeiterschulung zum Datenschutz
• Datenschutz durch Technikgestaltung und datenschutzfreundliche Voreinstellungen
• Regelmäßige Richtlinienüberprüfungen und Updates
• Verfahren zur Reaktion auf Vorfälle`
        },
        {
          title: "8. Benachrichtigung bei Datenschutzverletzungen",
          content: `Im Fall einer Verletzung personenbezogener Daten:

Benachrichtigung der Aufsichtsbehörde:
• Benachrichtigung innerhalb von 72 Stunden nach Kenntniserlangung
• Bewertung des Risikos für Rechte und Freiheiten
• Beschreibung der ergriffenen Maßnahmen

Individuelle Benachrichtigung:
• Direkte Benachrichtigung bei hohem Risiko für Rechte und Freiheiten
• Klare und verständliche Erklärung
• Ratschläge zu Schutzmaßnahmen`
        },
        {
          title: "9. Datenschutz-Folgenabschätzungen",
          content: `Wir führen Datenschutz-Folgenabschätzungen (DSFA) durch für:

• Neue Produkte oder Dienste, die personenbezogene Daten betreffen
• Änderungen an bestehenden Datenverarbeitungsaktivitäten
• Hochrisiko-Verarbeitungsvorgänge
• Verwendung neuer Technologien

DSFAs helfen uns, Datenschutzrisiken zu identifizieren und zu mindern, bevor die Verarbeitung beginnt.`
        },
        {
          title: "10. Aufsichtsbehörde",
          content: `Sie haben das Recht, eine Beschwerde bei einer Aufsichtsbehörde einzureichen, wenn Sie glauben, dass wir gegen die DSGVO verstoßen haben. Die federführende Aufsichtsbehörde für Konvertix ist:

[Name der Aufsichtsbehörde]
Adresse: [Behördenadresse]
Website: [Behörden-Website]
E-Mail: [Behörden-E-Mail]

Sie können auch die Aufsichtsbehörde in Ihrem Wohnsitzland kontaktieren.`
        },
        {
          title: "11. Kontaktieren Sie uns",
          content: `Für DSGVO-bezogene Fragen oder zur Ausübung Ihrer Rechte:

Datenschutzbeauftragter: dpo@konvertix.com
Allgemeiner Datenschutz: privacy@konvertix.com
Adresse: [Firmenadresse]
Telefon: [Firmentelefon]

Bitte fügen Sie "DSGVO-Anfrage" in Ihre Betreffzeile ein und geben Sie ausreichende Informationen zur Verifizierung Ihrer Identität an.`
        }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-[#0b021c] text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-[#a545b6] hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("navigation.backToHome")}
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("legal.gdpr.title")}</h1>
          <p className="text-[#afafaf]">{t("legal.gdpr.lastUpdated")}</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {sections.map((section, index) => (
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
            {t("legal.gdpr.contactText")}{" "}
            <a href="mailto:dpo@konvertix.com" className="text-[#a545b6] hover:text-white transition-colors">
              dpo@konvertix.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}