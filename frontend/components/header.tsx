"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center font-bold text-xl">
          <Image
            src="https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/logositi%20-%20Copy.png"
            alt="SiTiGroup Logo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              pathname === "/" && "text-primary"
            )}
          >
            Trang chủ
          </Link>
          <Link
            href="/events"
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              pathname === "/events" && "text-primary"
            )}
          >
            Sự kiện
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              pathname === "/contact" && "text-primary"
            )}
          >
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
