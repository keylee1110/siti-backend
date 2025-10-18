"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isProcessing, error, isAuthenticated, isInitialLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialLoading && isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, isInitialLoading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      router.push("/admin")
    }
  }

  if (isInitialLoading || (!isInitialLoading && isAuthenticated)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground mx-auto mb-4">
            S
          </div>
          <h1 className="text-2xl font-bold">SiTi Admin</h1>
          <p className="text-sm text-muted-foreground mt-2">Đăng nhập để quản lý sự kiện</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@siti.dev"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" disabled={isProcessing} className="w-full bg-primary hover:bg-primary/90">
            {isProcessing ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-primary hover:underline">
            Quay lại trang chủ
          </Link>
        </div>
      </Card>
    </div>
  )
}
