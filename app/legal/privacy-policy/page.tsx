"use client"
import { useLanguage } from '@/contexts/LanguageContext'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()

  const sections = Array.from({ length: 8 }, (_, i) => ({
    title: t(`legal.privacyPolicy.sections.${i}.title`),
    content: t(`legal.privacyPolicy.sections.${i}.content`)
  }))



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
          <h1 className="text-4xl font-bold mb-4">{t("legal.privacyPolicy.title")}</h1>
          <p className="text-[#afafaf]">{t("legal.privacyPolicy.lastUpdated")}</p>
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
            {t("legal.privacyPolicy.contactText")}{" "}
            <a href="mailto:privacy@konvertix.com" className="text-[#a545b6] hover:text-white transition-colors">
              privacy@konvertix.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}