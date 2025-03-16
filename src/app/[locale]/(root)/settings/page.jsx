"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import LeftSidebar from "@/app/[locale]/(root)/settings/(components)/left-sidebar"
import AccountSection from "@/app/[locale]/(root)/settings/(sections)/account-section"
import NotificationsSection from "@/app/[locale]/(root)/settings/(sections)/notifications-section"
import AppearanceSection from "@/app/[locale]/(root)/settings/(sections)/appearance-section"
import SecuritySection from "@/app/[locale]/(root)/settings/(sections)/security-section"

export default function SettingsPage() {
    const t = useTranslations('Settings')
    const [activeTab, setActiveTab] = useState("account")

    return (
        <div className="container mx-auto space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                <p className="text-muted-foreground">{t("title_description")}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left sidebar with tabs */}
                <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

                {/* Main content area */}
                <div className="flex-1">
                    {activeTab === "account" && (
                        <AccountSection />
                    )}

                    {activeTab === "notifications" && (
                        <NotificationsSection />
                    )}

                    {activeTab === "appearance" && (
                        <AppearanceSection />
                    )}

                    {activeTab === "security" && (
                        <SecuritySection />
                    )}
                </div>
            </div>
        </div>
    )
}

