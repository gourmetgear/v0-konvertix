"use client"
import { useLanguage } from '@/contexts/LanguageContext'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DataProcessingPage() {
  const { t } = useLanguage()

  const sections = Array.from({ length: 4 }, (_, i) => ({
    title: t(`legal.dataProcessing.sections.${i}.title`),
    content: t(`legal.dataProcessing.sections.${i}.content`)
  }))

  // Removed hardcoded content object - now using translation system
  const oldContent = {
    en: {
      title: "Data Processing Agreement",
      lastUpdated: "Last updated: January 15, 2024",
      sections: [
        {
          title: "1. Purpose and Scope",
          content: `This Data Processing Agreement (DPA) governs the processing of personal data by Konvertix on behalf of our customers in connection with our marketing analytics services. This agreement ensures compliance with applicable data protection laws, including GDPR.`
        },
        {
          title: "2. Definitions",
          content: `For the purposes of this DPA:

Controller: The entity that determines the purposes and means of processing personal data (typically our customer).

Processor: Konvertix, acting as the entity that processes personal data on behalf of the Controller.

Personal Data: Any information relating to an identified or identifiable natural person.

Processing: Any operation performed on personal data, including collection, storage, analysis, and deletion.

Sub-processor: Any third party engaged by Konvertix to process personal data on behalf of the Controller.

Data Subject: The identified or identifiable natural person to whom personal data relates.`
        },
        {
          title: "3. Data Processing Details",
          content: `Subject Matter:
Marketing analytics and campaign performance tracking

Duration:
For the term of the service agreement and data retention periods specified in our Privacy Policy

Nature and Purpose:
• Campaign performance analysis
• Audience segmentation and targeting
• Conversion tracking and attribution
• Marketing ROI measurement
• Reporting and dashboard services

Categories of Data Subjects:
• Website visitors
• Marketing campaign audiences
• Email subscribers
• Social media followers
• Advertising platform users

Types of Personal Data:
• Identifiers (email addresses, user IDs, device IDs)
• Demographic information
• Behavioral data (clicks, views, conversions)
• Location data (IP addresses, geographic regions)
• Engagement metrics`
        },
        {
          title: "4. Controller and Processor Obligations",
          content: `Controller Obligations:
• Ensure lawful basis for processing
• Provide necessary instructions for processing
• Ensure data subjects' rights can be exercised
• Conduct Data Protection Impact Assessments when required
• Maintain records of processing activities

Processor Obligations (Konvertix):
• Process personal data only on documented instructions
• Ensure confidentiality of processing
• Implement appropriate security measures
• Assist with data subject rights requests
• Assist with security incident response
• Delete or return data upon termination`
        },
        {
          title: "5. Security Measures",
          content: `We implement appropriate technical and organizational measures:

Technical Measures:
• Encryption of data in transit and at rest (AES-256)
• Access controls with multi-factor authentication
• Network security and firewall protection
• Regular security monitoring and threat detection
• Secure development practices and code reviews
• Data anonymization and pseudonymization techniques

Organizational Measures:
• Staff background checks and confidentiality agreements
• Regular security training and awareness programs
• Access management on a need-to-know basis
• Incident response and business continuity plans
• Regular security audits and assessments
• Vendor management and due diligence processes`
        },
        {
          title: "6. Sub-processing",
          content: `Authorized Sub-processors:
We may engage the following categories of sub-processors:

Cloud Infrastructure Providers:
• AWS (Amazon Web Services) - hosting and storage
• Google Cloud Platform - analytics and machine learning
• Microsoft Azure - backup and disaster recovery

Analytics and Monitoring:
• Google Analytics - website traffic analysis
• Mixpanel - product analytics
• Sentry - error monitoring and debugging

Communication Services:
• SendGrid - email delivery
• Twilio - SMS and communication APIs
• Intercom - customer support and messaging

General Authorization:
By entering into this DPA, Controller provides general authorization for the engagement of sub-processors listed above and in our current sub-processor list.

New Sub-processors:
We will notify Controller of any changes to sub-processors with at least 30 days' notice. Controller may object to new sub-processors within 15 days of notification.`
        },
        {
          title: "7. Data Subject Rights",
          content: `We will assist Controller in responding to data subject requests:

Right of Access:
• Provide data export functionality
• Assist in locating relevant personal data
• Support data portability requests

Right to Rectification:
• Enable data correction through our platform
• Process correction requests within 30 days

Right to Erasure:
• Provide data deletion functionality
• Ensure deletion across all systems and backups
• Confirm deletion completion

Right to Restrict Processing:
• Implement processing restrictions as instructed
• Maintain restricted data separately

Right to Object:
• Stop processing for specific purposes
• Implement opt-out mechanisms

We will respond to requests within 30 days and provide necessary technical assistance to Controller.`
        },
        {
          title: "8. Data Transfers",
          content: `International Transfers:
Personal data may be transferred to countries outside the EU/EEA. We ensure appropriate safeguards:

Adequacy Decisions:
Transfers to countries with EU Commission adequacy decisions

Standard Contractual Clauses:
EU-approved contractual terms for international transfers

Certification Schemes:
• SOC 2 Type II certification
• ISO 27001 compliance
• Privacy Shield (where applicable)

We maintain a register of all international transfers and applicable safeguards.`
        },
        {
          title: "9. Data Breach Notification",
          content: `Personal Data Breach Response:

Immediate Response (within 24 hours):
• Contain and assess the breach
• Preserve evidence for investigation
• Implement immediate remediation measures

Notification to Controller (within 72 hours):
• Description of the breach and affected data
• Likely consequences and risk assessment
• Measures taken and recommended actions
• Contact details for further information

Ongoing Support:
• Assist with supervisory authority notifications
• Support individual notifications if required
• Provide detailed forensic reports
• Implement additional security measures`
        },
        {
          title: "10. Audits and Compliance",
          content: `Audit Rights:
Controller has the right to audit our compliance with this DPA:

Documentation Access:
• Security policies and procedures
• Compliance certifications and reports
• Sub-processor agreements and assessments

On-site Audits:
• Upon reasonable notice (minimum 30 days)
• During normal business hours
• Conducted by qualified auditors
• Subject to confidentiality agreements

Remote Audits:
• Virtual compliance reviews
• Documentation review and verification
• Interview with key personnel
• Review of security controls and measures

We will provide reasonable cooperation and assistance during all audit activities.`
        },
        {
          title: "11. Data Retention and Deletion",
          content: `Data Retention:
• Personal data retained only as long as necessary for specified purposes
• Retention periods defined in our Privacy Policy
• Regular review and deletion of outdated data

Data Deletion:
Upon termination of services or upon Controller's request:
• Secure deletion of all personal data within 90 days
• Deletion from all systems, backups, and sub-processor systems
• Certification of deletion provided upon request
• Option to return data before deletion

Exceptions:
Data may be retained longer if required by law or for legitimate business purposes (e.g., financial records, legal disputes).`
        },
        {
          title: "12. Liability and Indemnification",
          content: `Limitation of Liability:
Each party's liability is limited to direct damages and capped at the annual service fees paid.

Indemnification:
• Konvertix indemnifies Controller for damages resulting from our breach of this DPA
• Controller indemnifies Konvertix for damages resulting from Controller's instructions or breach
• Mutual indemnification for third-party claims

Insurance:
We maintain appropriate cyber liability and professional indemnity insurance coverage.`
        },
        {
          title: "13. Contact Information",
          content: `For questions about this Data Processing Agreement:

Data Protection Officer:
Email: dpo@konvertix.com
Phone: [DPO Phone]

Legal Department:
Email: legal@konvertix.com
Address: [Legal Address]

Technical Support:
Email: support@konvertix.com
Phone: [Support Phone]

Please specify "DPA Inquiry" in your communications.`
        }
      ]
    },
    de: {
      title: "Auftragsverarbeitungsvertrag",
      lastUpdated: "Zuletzt aktualisiert: 15. Januar 2024",
      sections: [
        {
          title: "1. Zweck und Umfang",
          content: `Dieser Auftragsverarbeitungsvertrag (AVV) regelt die Verarbeitung personenbezogener Daten durch Konvertix im Auftrag unserer Kunden in Verbindung mit unseren Marketing-Analyse-Diensten. Diese Vereinbarung gewährleistet die Einhaltung geltender Datenschutzgesetze, einschließlich der DSGVO.`
        },
        {
          title: "2. Definitionen",
          content: `Für die Zwecke dieses AVV:

Verantwortlicher: Die Entität, die die Zwecke und Mittel der Verarbeitung personenbezogener Daten bestimmt (typischerweise unser Kunde).

Auftragsverarbeiter: Konvertix, handelnd als Entität, die personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.

Personenbezogene Daten: Alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen.

Verarbeitung: Jeder Vorgang, der mit personenbezogenen Daten durchgeführt wird, einschließlich Erhebung, Speicherung, Analyse und Löschung.

Unterauftragsverarbeiter: Jeder Dritte, den Konvertix zur Verarbeitung personenbezogener Daten im Auftrag des Verantwortlichen beauftragt.

Betroffene Person: Die identifizierte oder identifizierbare natürliche Person, auf die sich personenbezogene Daten beziehen.`
        },
        {
          title: "3. Details zur Datenverarbeitung",
          content: `Gegenstand:
Marketing-Analysen und Kampagnen-Performance-Tracking

Dauer:
Für die Laufzeit der Dienstvereinbarung und Datenaufbewahrungszeiten, die in unserer Datenschutzerklärung angegeben sind

Art und Zweck:
• Kampagnen-Performance-Analyse
• Zielgruppensegmentierung und -ausrichtung
• Conversion-Tracking und Attribution
• Marketing-ROI-Messung
• Berichterstattung und Dashboard-Services

Kategorien betroffener Personen:
• Website-Besucher
• Marketing-Kampagnen-Zielgruppen
• E-Mail-Abonnenten
• Social-Media-Follower
• Werbeplattform-Nutzer

Arten personenbezogener Daten:
• Identifikatoren (E-Mail-Adressen, Benutzer-IDs, Geräte-IDs)
• Demografische Informationen
• Verhaltensdaten (Klicks, Ansichten, Conversions)
• Standortdaten (IP-Adressen, geografische Regionen)
• Engagement-Metriken`
        },
        {
          title: "4. Verpflichtungen von Verantwortlichem und Auftragsverarbeiter",
          content: `Verpflichtungen des Verantwortlichen:
• Sicherstellung der Rechtsgrundlage für die Verarbeitung
• Bereitstellung notwendiger Weisungen für die Verarbeitung
• Sicherstellung, dass Rechte betroffener Personen ausgeübt werden können
• Durchführung von Datenschutz-Folgenabschätzungen bei Bedarf
• Führung von Verarbeitungsverzeichnissen

Verpflichtungen des Auftragsverarbeiters (Konvertix):
• Verarbeitung personenbezogener Daten nur nach dokumentierten Weisungen
• Gewährleistung der Vertraulichkeit der Verarbeitung
• Umsetzung angemessener Sicherheitsmaßnahmen
• Unterstützung bei Anfragen zu Betroffenenrechten
• Unterstützung bei der Reaktion auf Sicherheitsvorfälle
• Löschung oder Rückgabe von Daten bei Beendigung`
        },
        {
          title: "5. Sicherheitsmaßnahmen",
          content: `Wir implementieren angemessene technische und organisatorische Maßnahmen:

Technische Maßnahmen:
• Verschlüsselung von Daten bei Übertragung und Speicherung (AES-256)
• Zugangskontrollen mit Multi-Faktor-Authentifizierung
• Netzwerksicherheit und Firewall-Schutz
• Regelmäßige Sicherheitsüberwachung und Bedrohungserkennung
• Sichere Entwicklungspraktiken und Code-Reviews
• Datenanonymisierung und Pseudonymisierungstechniken

Organisatorische Maßnahmen:
• Mitarbeiter-Hintergrundprüfungen und Vertraulichkeitsvereinbarungen
• Regelmäßige Sicherheitsschulungen und Sensibilisierungsprogramme
• Zugangsmanagement nach dem Need-to-Know-Prinzip
• Incident-Response- und Business-Continuity-Pläne
• Regelmäßige Sicherheitsaudits und -bewertungen
• Lieferantenmanagement und Due-Diligence-Prozesse`
        },
        {
          title: "6. Unterauftragsverarbeitung",
          content: `Autorisierte Unterauftragsverarbeiter:
Wir können folgende Kategorien von Unterauftragsverarbeitern beauftragen:

Cloud-Infrastruktur-Anbieter:
• AWS (Amazon Web Services) - Hosting und Speicherung
• Google Cloud Platform - Analysen und maschinelles Lernen
• Microsoft Azure - Backup und Disaster Recovery

Analyse und Überwachung:
• Google Analytics - Website-Traffic-Analyse
• Mixpanel - Produktanalyse
• Sentry - Fehlerüberwachung und Debugging

Kommunikationsdienste:
• SendGrid - E-Mail-Zustellung
• Twilio - SMS und Kommunikations-APIs
• Intercom - Kundensupport und Messaging

Allgemeine Autorisierung:
Durch Abschluss dieses AVV erteilt der Verantwortliche eine allgemeine Autorisierung für die Beauftragung der oben aufgeführten und in unserer aktuellen Unterauftragsverarbeiter-Liste genannten Unterauftragsverarbeiter.

Neue Unterauftragsverarbeiter:
Wir werden den Verantwortlichen über Änderungen bei Unterauftragsverarbeitern mit mindestens 30 Tagen Vorlaufzeit benachrichtigen. Der Verantwortliche kann innerhalb von 15 Tagen nach der Benachrichtigung Einwände gegen neue Unterauftragsverarbeiter erheben.`
        },
        {
          title: "7. Betroffenenrechte",
          content: `Wir unterstützen den Verantwortlichen bei der Beantwortung von Anfragen betroffener Personen:

Auskunftsrecht:
• Bereitstellung von Datenexport-Funktionalität
• Unterstützung beim Auffinden relevanter personenbezogener Daten
• Unterstützung bei Datenportabilitätsanfragen

Recht auf Berichtigung:
• Ermöglichung von Datenkorrekturen über unsere Plattform
• Bearbeitung von Korrekturanfragen innerhalb von 30 Tagen

Recht auf Löschung:
• Bereitstellung von Datenlöschungsfunktionalität
• Sicherstellung der Löschung in allen Systemen und Backups
• Bestätigung der vollständigen Löschung

Recht auf Einschränkung der Verarbeitung:
• Umsetzung von Verarbeitungsbeschränkungen nach Weisung
• Separate Aufbewahrung eingeschränkter Daten

Widerspruchsrecht:
• Stopp der Verarbeitung für bestimmte Zwecke
• Umsetzung von Opt-out-Mechanismen

Wir antworten auf Anfragen innerhalb von 30 Tagen und bieten dem Verantwortlichen notwendige technische Unterstützung.`
        },
        {
          title: "8. Datenübertragungen",
          content: `Internationale Übertragungen:
Personenbezogene Daten können in Länder außerhalb der EU/EWR übertragen werden. Wir stellen angemessene Schutzmaßnahmen sicher:

Angemessenheitsbeschlüsse:
Übertragungen in Länder mit EU-Kommissions-Angemessenheitsbeschlüssen

Standardvertragsklauseln:
EU-genehmigte Vertragsbedingungen für internationale Übertragungen

Zertifizierungssysteme:
• SOC 2 Typ II Zertifizierung
• ISO 27001 Konformität
• Privacy Shield (wo anwendbar)

Wir führen ein Register aller internationalen Übertragungen und anwendbarer Schutzmaßnahmen.`
        },
        {
          title: "9. Benachrichtigung bei Datenschutzverletzungen",
          content: `Reaktion auf Verletzungen personenbezogener Daten:

Sofortige Reaktion (innerhalb von 24 Stunden):
• Eindämmung und Bewertung der Verletzung
• Beweissicherung für Untersuchung
• Umsetzung sofortiger Abhilfemaßnahmen

Benachrichtigung des Verantwortlichen (innerhalb von 72 Stunden):
• Beschreibung der Verletzung und betroffener Daten
• Wahrscheinliche Folgen und Risikobewertung
• Ergriffene Maßnahmen und empfohlene Aktionen
• Kontaktdaten für weitere Informationen

Laufende Unterstützung:
• Unterstützung bei Benachrichtigungen der Aufsichtsbehörde
• Unterstützung bei individuellen Benachrichtigungen falls erforderlich
• Bereitstellung detaillierter forensischer Berichte
• Umsetzung zusätzlicher Sicherheitsmaßnahmen`
        },
        {
          title: "10. Audits und Compliance",
          content: `Auditrechte:
Der Verantwortliche hat das Recht, unsere Einhaltung dieses AVV zu auditieren:

Dokumentenzugang:
• Sicherheitsrichtlinien und -verfahren
• Compliance-Zertifizierungen und -berichte
• Unterauftragsverarbeiter-Vereinbarungen und -bewertungen

Vor-Ort-Audits:
• Nach angemessener Ankündigung (mindestens 30 Tage)
• Während normaler Geschäftszeiten
• Durchgeführt von qualifizierten Auditoren
• Vorbehaltlich von Vertraulichkeitsvereinbarungen

Remote-Audits:
• Virtuelle Compliance-Reviews
• Dokumentenprüfung und -verifizierung
• Interviews mit Schlüsselpersonal
• Überprüfung von Sicherheitskontrollen und -maßnahmen

Wir bieten angemessene Kooperation und Unterstützung bei allen Auditaktivitäten.`
        },
        {
          title: "11. Datenaufbewahrung und -löschung",
          content: `Datenaufbewahrung:
• Personenbezogene Daten nur so lange aufbewahrt, wie für die angegebenen Zwecke notwendig
• Aufbewahrungszeiten in unserer Datenschutzerklärung definiert
• Regelmäßige Überprüfung und Löschung veralteter Daten

Datenlöschung:
Bei Beendigung der Dienste oder auf Anfrage des Verantwortlichen:
• Sichere Löschung aller personenbezogenen Daten innerhalb von 90 Tagen
• Löschung aus allen Systemen, Backups und Unterauftragsverarbeiter-Systemen
• Löschungsbestätigung auf Anfrage bereitgestellt
• Option zur Datenrückgabe vor Löschung

Ausnahmen:
Daten können länger aufbewahrt werden, wenn gesetzlich vorgeschrieben oder für berechtigte Geschäftszwecke (z.B. Finanzunterlagen, Rechtsstreitigkeiten).`
        },
        {
          title: "12. Haftung und Freistellung",
          content: `Haftungsbeschränkung:
Die Haftung jeder Partei ist auf direkte Schäden begrenzt und auf die jährlichen Servicegebühren gedeckelt.

Freistellung:
• Konvertix stellt den Verantwortlichen für Schäden frei, die aus unserer Verletzung dieses AVV resultieren
• Der Verantwortliche stellt Konvertix für Schäden frei, die aus den Weisungen oder Verletzungen des Verantwortlichen resultieren
• Gegenseitige Freistellung für Drittansprüche

Versicherung:
Wir unterhalten angemessene Cyber-Haftpflicht- und Berufshaftpflichtversicherung.`
        },
        {
          title: "13. Kontaktinformationen",
          content: `Für Fragen zu diesem Auftragsverarbeitungsvertrag:

Datenschutzbeauftragter:
E-Mail: dpo@konvertix.com
Telefon: [DSB-Telefon]

Rechtsabteilung:
E-Mail: legal@konvertix.com
Adresse: [Rechtsadresse]

Technischer Support:
E-Mail: support@konvertix.com
Telefon: [Support-Telefon]

Bitte geben Sie "AVV-Anfrage" in Ihrer Kommunikation an.`
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
          <h1 className="text-4xl font-bold mb-4">{t("legal.dataProcessing.title")}</h1>
          <p className="text-[#afafaf]">{t("legal.dataProcessing.lastUpdated")}</p>
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
            {t("legal.dataProcessing.contactText")}{" "}
            <a href="mailto:dpo@konvertix.com" className="text-[#a545b6] hover:text-white transition-colors">
              dpo@konvertix.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}