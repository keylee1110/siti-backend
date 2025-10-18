"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { getPartnerInquiries, updateInquiryStatus } from "@/lib/api"
import type { PartnerInquiry, PaginatedResponse } from "@/lib/types"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function InquiriesManagementPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [inquiries, setInquiries] = useState<PartnerInquiry[]>([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [selectedInquiry, setSelectedInquiry] = useState<PartnerInquiry | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadInquiries = useCallback(async (page: number) => {
    setIsLoading(true)
    try {
      const response = await getPartnerInquiries(page, 10, statusFilter || undefined)
      if (response.data) {
        const data = response.data as PaginatedResponse<PartnerInquiry>
        setInquiries(data.content)
        setPagination({ page: data.number, totalPages: data.totalPages })
      }
    } catch (error) {
      console.error("Failed to load inquiries:", error)
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      loadInquiries(0)
    }
  }, [isAuthenticated, router, loadInquiries])

  async function handleStatusUpdate(id: string, newStatus: string) {
    setUpdatingId(id)
    try {
      const response = await updateInquiryStatus(id, newStatus)
      if (!response.error) {
        loadInquiries(pagination.page)
        setSelectedInquiry(null)
      }
    } catch (error) {
      console.error("Failed to update inquiry:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800"
      case "REVIEWING":
        return "bg-yellow-100 text-yellow-800"
      case "DONE":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "NEW":
        return "Mới"
      case "REVIEWING":
        return "Đang xem xét"
      case "DONE":
        return "Hoàn thành"
      default:
        return status
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
            <h1 className="text-3xl font-bold mb-8">Quản lý liên hệ</h1>

            <div className="mb-6 flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  loadInquiries(0)
                }}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="NEW">Mới</option>
                <option value="REVIEWING">Đang xem xét</option>
                <option value="DONE">Hoàn thành</option>
              </select>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Đang tải liên hệ...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không có liên hệ nào.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {inquiries.map((inquiry) => (
                    <Card
                      key={inquiry.id}
                      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{inquiry.organization || "Không xác định"}</h3>
                          <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}
                        >
                          {getStatusLabel(inquiry.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{inquiry.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(inquiry.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </Card>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 0}
                      onClick={() => loadInquiries(pagination.page - 1)}
                    >
                      Trước
                    </Button>
                    <span className="flex items-center px-4">
                      Trang {pagination.page + 1} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={pagination.page >= pagination.totalPages - 1}
                      onClick={() => loadInquiries(pagination.page + 1)}
                    >
                      Tiếp
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Detail Modal */}
            {selectedInquiry && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-96 overflow-auto p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold">Chi tiết liên hệ</h2>
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="text-2xl text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tổ chức</p>
                      <p className="font-semibold">{selectedInquiry.organization || "Không xác định"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">
                        {selectedInquiry.email}
                      </a>
                    </div>
                    {selectedInquiry.phone && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Điện thoại</p>
                        <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline">
                          {selectedInquiry.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tin nhắn</p>
                      <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ngày gửi</p>
                      <p>{new Date(selectedInquiry.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <p className="text-sm font-medium mb-4">Cập nhật trạng thái</p>
                    <div className="flex gap-2">
                      {["NEW", "REVIEWING", "DONE"].map((status) => (
                        <Button
                          key={status}
                          variant={selectedInquiry.status === status ? "default" : "outline"}
                          size="sm"
                          disabled={updatingId === selectedInquiry.id}
                          onClick={() => handleStatusUpdate(selectedInquiry.id, status)}
                          className={
                            selectedInquiry.status === status ? "bg-primary hover:bg-primary/90" : "bg-transparent"
                          }
                        >
                          {getStatusLabel(status)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
