"use client"

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  console.log('LanguageSwitcher current language:', language)

  const handleLanguageClick = (newLang: 'en' | 'de') => {
    console.log('Language button clicked:', newLang)
    setLanguage(newLang)
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageClick('en')}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          language === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => handleLanguageClick('de')}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          language === 'de'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        🇩🇪 DE
      </button>
    </div>
  )
}