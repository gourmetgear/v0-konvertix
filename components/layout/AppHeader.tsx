"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, ChevronDown } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function AppHeader() {
  const { t } = useLanguage()

  return (
    <header className="bg-[#201b2d] border-b border-[#2b2b2b] p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
            <Input
              placeholder={t('common.search')}
              className="pl-10 bg-[#2b2b2b] border-[#3f3f3f] text-white placeholder-[#afafaf] w-80"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-[#afafaf] hover:text-white">
            Select Business Manager
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="w-8 h-8 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-full" />
        </div>
      </div>
    </header>
  )
}

