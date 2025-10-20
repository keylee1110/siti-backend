import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              {event.posterImage && (
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={event.posterImage || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                {event.summary && <p className="text-muted-foreground mb-4 flex-grow">{event.summary}</p>}

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

                <Link href={`/events/${event.id}`} className="mt-auto">
                  <Button className="w-full">Xem chi tiết</Button>
                </Link>
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
