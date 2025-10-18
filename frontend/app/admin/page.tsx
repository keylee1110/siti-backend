"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function AdminDashboard() {
  const { isAuthenticated, isInitialLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isInitialLoading, router])

  if (isInitialLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Quản lý sự kiện</h2>
                <p className="text-muted-foreground mb-6">
                  Tạo, chỉnh sửa và xóa các sự kiện. Quản lý trạng thái và tải lên hình ảnh.
                </p>
                <Link href="/admin/events">
                  <Button className="bg-primary hover:bg-primary/90">Đi tới quản lý sự kiện</Button>
                </Link>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Quản lý liên hệ</h2>
                <p className="text-muted-foreground mb-6">
                  Xem và quản lý các yêu cầu hợp tác từ các đối tác tiềm năng.
                </p>
                <Link href="/admin/inquiries">
                  <Button className="bg-primary hover:bg-primary/90">Đi tới quản lý liên hệ</Button>
                </Link>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
