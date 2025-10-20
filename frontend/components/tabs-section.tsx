"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

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
  const [direction, setDirection] = useState(1)

  const handleTabChange = (newTabId: string) => {
    const newTabIndex = tabs.findIndex((tab) => tab.id === newTabId)
    const oldTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
    setDirection(newTabIndex > oldTabIndex ? 1 : -1)
    setActiveTab(newTabId)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative mt-8 min-h-[450px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeTab}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute w-full"
              >
                {tabs.map((tab) => (
                  tab.id === activeTab && (
                    <div key={tab.id} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="flex flex-col justify-start">
                          <p className="text-2xl font-medium text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: tab.description }}></p>
                        </div>
                        {tab.image && (
                          <div className="relative flex justify-center w-full max-w-md h-96">
                            <Image
                              src={tab.image || "/placeholder.svg"}
                              alt={tab.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
