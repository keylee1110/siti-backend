"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/events", label: "Sự kiện" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Liên hệ" },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
      // Close sheet if on mobile
      setIsSheetOpen(false)
    } else {
      // Allow default navigation and close sheet on mobile
      setIsSheetOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center font-bold text-xl">
          <Image
            src="/siti-logo.png"
            alt="SiTiGroup Logo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={cn(
                "text-sm font-medium hover:text-primary transition-colors",
                pathname === link.href && "text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile Navigation */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-0">
              <div className="p-4 border-b">
                <Link href="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center font-bold text-xl">
                  <Image
                    src="/siti-logo.png"
                    alt="SiTiGroup Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                </Link>
              </div>
              <nav className="flex-grow grid gap-2 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      "text-center p-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted text-lg font-medium",
                      pathname === link.href && "bg-accent text-accent-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t mt-auto">
                {isAuthenticated ? (
                  <Link href="/admin" onClick={() => setIsSheetOpen(false)}>
                    <Button variant="default" className="w-full">Admin</Button>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                    <Button variant="outline" className="w-full">Đăng nhập</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {isAuthenticated ? (
            <Link href="/admin">
              <Button size="sm" variant="default" className="hidden sm:inline-flex">
                Admin
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline" className="hidden sm:inline-flex">
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
