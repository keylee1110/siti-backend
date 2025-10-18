"use client"

import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

export function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center font-bold text-xl">
          <Image
            src="/images/design-mode/logositi - Copy.png"
            alt="SiTiGroup Logo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
            Sự kiện
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Liên hệ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/admin">
              <Button size="sm" variant="default">
                Admin
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
