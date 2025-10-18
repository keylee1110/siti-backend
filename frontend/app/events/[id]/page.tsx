"use client"

import { useState, useEffect } from "react"
import { getEventById } from "@/lib/api"
import type { Event } from "@/lib/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvent() {
      try {
        const response = await getEventById(eventId)
        if (response.error) {
          setError(response.error.message)
        } else {
          setEvent(response.data as Event)
        }
      } catch (err) {
        setError("Failed to load event")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {isLoading ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-muted-foreground">Đang tải sự kiện...</p>
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Link href="/events">
              <Button variant="outline">Quay lại danh sách sự kiện</Button>
            </Link>
          </div>
        ) : event ? (
          <>
            {event.coverImage && (
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={event.coverImage || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <section className="py-12 md:py-20">
              <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/events" className="text-primary hover:underline mb-6 inline-block">
                  ← Quay lại danh sách sự kiện
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>

                <div className="grid md:grid-cols-3 gap-6 mb-12 p-6 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Ngày bắt đầu</p>
                    <p className="font-semibold">{new Date(event.startAt).toLocaleDateString("vi-VN")}</p>
                    <p className="text-sm">{new Date(event.startAt).toLocaleTimeString("vi-VN")}</p>
                  </div>
                  {event.endAt && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Ngày kết thúc</p>
                      <p className="font-semibold">{new Date(event.endAt).toLocaleDateString("vi-VN")}</p>
                      <p className="text-sm">{new Date(event.endAt).toLocaleTimeString("vi-VN")}</p>
                    </div>
                  )}
                  {event.location?.name && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Địa điểm</p>
                      <p className="font-semibold">{event.location.name}</p>
                    </div>
                  )}
                </div>

                {event.summary && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Tóm tắt</h2>
                    <p className="text-lg text-muted-foreground">{event.summary}</p>
                  </div>
                )}

                {event.description && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Chi tiết</h2>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{event.description}</p>
                    </div>
                  </div>
                )}

                {event.gallery && event.gallery.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Thư viện ảnh</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {event.gallery.map((image, idx) => (
                        <img
                          key={idx}
                          src={image || "/placeholder.svg"}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
