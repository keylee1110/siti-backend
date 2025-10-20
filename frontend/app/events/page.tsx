"use client"

import { useState, useEffect, useCallback } from "react"
import { getPublishedEvents, searchEvents } from "@/lib/api"
import type { Event, PaginatedResponse } from "@/lib/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const loadEvents = useCallback(async (page: number) => {
    setIsLoading(true)
    try {
      const response = searchQuery
        ? await searchEvents(searchQuery, page, 10)
        : await getPublishedEvents(page, 10)

      if (response.data) {
        const data = response.data as PaginatedResponse<Event>
        setEvents(data.content)
        setPagination({ page: data.number, totalPages: data.totalPages })
      }
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      loadEvents(0)
    }, 500) // Debounce search

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, loadEvents])

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sự kiện</h1>
            <p className="text-lg text-muted-foreground mb-6">Khám phá các sự kiện sắp tới của SiTi Club</p>
            <Input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Đang tải sự kiện...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không có sự kiện nào được công bố.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {events.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                        {event.posterImage && (
                          <div className="relative w-full aspect-square overflow-hidden">
                            <Image
                              src={event.posterImage || "/placeholder.svg"}
                              alt={event.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {event.summary || event.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">
                              {new Date(event.startAt).toLocaleDateString("vi-VN")}
                            </span>
                            <Button size="sm" variant="ghost">
                              Chi tiết →
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 0}
                      onClick={() => loadEvents(pagination.page - 1)}
                    >
                      Trước
                    </Button>
                    <span className="flex items-center px-4">
                      Trang {pagination.page + 1} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={pagination.page >= pagination.totalPages - 1}
                      onClick={() => loadEvents(pagination.page + 1)}
                    >
                      Tiếp
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
