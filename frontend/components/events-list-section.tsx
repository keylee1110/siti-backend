import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/types"
import { Calendar, MapPin } from "lucide-react"

interface EventsListSectionProps {
  events: Event[]
}

export function EventsListSection({ events }: EventsListSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Sự kiện chính của SiTiGroup</h2>

        <div className="grid gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-6 p-6">
                {event.coverImage && (
                  <div className="md:col-span-1">
                    <img
                      src={event.coverImage || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className={event.coverImage ? "md:col-span-2" : "md:col-span-3"}>
                  <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                  {event.summary && <p className="text-muted-foreground mb-4">{event.summary}</p>}

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.startAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    {event.location?.name && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location.name}</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/events/${event.id}`}>
                    <Button>Xem chi tiết</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Không có sự kiện nào hiện tại</p>
          </div>
        )}
      </div>
    </section>
  )
}
