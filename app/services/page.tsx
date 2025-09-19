"use client"
import { useLanguage } from "@/contexts/LanguageContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Settings,
  HeadphonesIcon,
  Zap,
  Mail,
  PieChart,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

const getServices = (t: (key: string) => string) => [
  {
    name: t("services.paidAds.name"),
    icon: DollarSign,
    status: t("services.paidAds.status"),
    description: t("services.paidAds.description"),
    buttonText: t("services.paidAds.buttonText"),
    isActive: true,
  },
  {
    name: t("services.seo.name"),
    icon: Search,
    status: t("services.seo.status"),
    description: t("services.seo.description"),
    buttonText: t("services.seo.buttonText"),
    isActive: false,
  },
  {
    name: t("services.automation.name"),
    icon: Zap,
    status: t("services.automation.status"),
    description: t("services.automation.description"),
    buttonText: t("services.automation.buttonText"),
    isActive: false,
  },
  {
    name: t("services.reporting.name"),
    icon: BarChart3,
    status: t("services.reporting.status"),
    description: t("services.reporting.description"),
    buttonText: t("services.reporting.buttonText"),
    isActive: true,
  },
  {
    name: t("services.emailMarketing.name"),
    icon: Mail,
    status: t("services.emailMarketing.status"),
    description: t("services.emailMarketing.description"),
    buttonText: t("services.emailMarketing.buttonText"),
    isActive: false,
  },
  {
    name: t("services.analytics.name"),
    icon: PieChart,
    status: t("services.analytics.status"),
    description: t("services.analytics.description"),
    buttonText: t("services.analytics.buttonText"),
    isActive: true,
  },
]

export default function ServicesPage() {
  const { t } = useLanguage()
  const services = getServices(t)

  return (
    <div className="flex-1 flex flex-col">
        {/* Services Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t("services.title")}</h1>
            <Button className="bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90">
              {t("services.requestUpgrade")}
            </Button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="bg-[#2b2b2b] border-[#3f3f3f] hover:border-[#a545b6]/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  {/* Service Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-lg flex items-center justify-center">
                        <service.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                    </div>
                    <Badge
                      className={`${
                        service.isActive
                          ? "bg-green-600 hover:bg-green-600/90 text-white"
                          : "bg-red-600 hover:bg-red-600/90 text-white"
                      }`}
                    >
                      {service.status}
                    </Badge>
                  </div>

                  {/* Service Description */}
                  <p className="text-[#afafaf] text-sm leading-relaxed">{service.description}</p>

                  {/* Service Action */}
                  <Button
                    variant={service.isActive ? "ghost" : "outline"}
                    className={`w-full ${
                      service.isActive
                        ? "text-[#afafaf] hover:text-white border-[#3f3f3f] hover:bg-[#3f3f3f]"
                        : "border-[#3f3f3f] text-white hover:bg-[#3f3f3f] hover:text-white"
                    }`}
                  >
                    {service.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
    </div>
  )
}
