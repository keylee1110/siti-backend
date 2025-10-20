"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { getAllEvents, deleteEvent, updateEvent } from "@/lib/api"
import type { Event, PaginatedResponse } from "@/lib/types"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { EventForm } from "@/components/event-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EventsManagementPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>()
  const [statusFilter, setStatusFilter] = useState<string>("")

  const loadEvents = useCallback(async (page: number) => {
    setIsLoading(true)
    try {
      const response = await getAllEvents(page, 10, statusFilter || undefined)
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
  }, [statusFilter])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      loadEvents(0)
    }
  }, [isAuthenticated, router, loadEvents])

  async function handleStatusChange(eventId: string, status: string) {
    try {
      const response = await updateEvent(eventId, { status })
      if (!response.error) {
        loadEvents(pagination.page)
      }
    } catch (error) {
      console.error("Failed to update event status:", error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return

    try {
      const response = await deleteEvent(id)
      if (!response.error) {
        loadEvents(pagination.page)
      }
    } catch (error) {
      console.error("Failed to delete event:", error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            {showForm ? (
              <EventForm
                event={selectedEvent}
                onSuccess={() => {
                  setShowForm(false)
                  setSelectedEvent(undefined)
                  loadEvents(pagination.page)
                }}
                onCancel={() => {
                  setShowForm(false)
                  setSelectedEvent(undefined)
                }}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">Quản lý sự kiện</h1>
                  <Button
                    onClick={() => {
                      setSelectedEvent(undefined)
                      setShowForm(true)
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    + Tạo sự kiện mới
                  </Button>
                </div>

                <div className="mb-6 flex gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      loadEvents(0)
                    }}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="DRAFT">Nháp</option>
                    <option value="PUBLISHED">Công bố</option>
                    <option value="ARCHIVED">Lưu trữ</option>
                  </select>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Đang tải sự kiện...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Không có sự kiện nào.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8">
                      {events.map((event) => (
                        <Card key={event.id} className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{event.summary}</p>
                              <div className="flex gap-4 text-sm">
                                <span>
                                  <strong>Ngày:</strong> {new Date(event.startAt).toLocaleDateString("vi-VN")}
                                </span>
                                <span>
                                  <strong>Trạng thái:</strong>{" "}
                                  <Select
                                    value={event.status}
                                    onValueChange={(newStatus) => handleStatusChange(event.id, newStatus)}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="DRAFT">Nháp</SelectItem>
                                      <SelectItem value="PUBLISHED">Công bố</SelectItem>
                                      <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedEvent(event)
                                  setShowForm(true)
                                }}
                              >
                                Sửa
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10 bg-transparent"
                                onClick={() => handleDelete(event.id)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
