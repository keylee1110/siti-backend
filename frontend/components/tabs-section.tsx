"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface TabItem {
  id: string
  label: string
  title: string
  description: string
  image?: string
}

interface TabsSectionProps {
  tabs: TabItem[]
}

export function TabsSection({ tabs }: TabsSectionProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "")

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-start min-h-96">
                <div className="flex flex-col justify-start">
                  <h3 className="text-3xl font-bold mb-4">{tab.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{tab.description}</p>
                </div>
                {tab.image && (
                  <div className="relative flex justify-center w-full max-w-md h-96">
                    <Image
                      src={tab.image || "/placeholder.svg"}
                      alt={tab.title}
                      fill
                      className="rounded-lg shadow-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
