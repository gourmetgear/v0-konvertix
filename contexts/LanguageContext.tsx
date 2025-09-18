'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import enMessages from '@/messages/en.json'
import deMessages from '@/messages/de.json'

type Language = 'en' | 'de'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Flatten nested JSON structure for dot notation access
function flattenTranslations(obj: any, prefix = ''): Record<string, string> {
  const flattened: Record<string, string> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, flattenTranslations(value, fullKey))
      } else {
        flattened[fullKey] = value
      }
    }
  }

  return flattened
}

const translations = {
  en: flattenTranslations(enMessages),
  de: flattenTranslations(deMessages)
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'en' || saved === 'de')) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    console.log('Setting language to:', lang)
    setLanguage(lang)
    if (isClient) {
      localStorage.setItem('language', lang)
    }
    console.log('Language set to:', lang)
  }

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]] || key
    console.log(`Translating "${key}" in ${language}:`, translation)
    return translation
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}