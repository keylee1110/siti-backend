"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/events", label: "Quản lý sự kiện", icon: "📅" },
    { href: "/admin/inquiries", label: "Quản lý liên hệ", icon: "💬" },
  ]

  return (
    <aside className="w-64 border-r border-border bg-muted/50 min-h-screen">
      <nav className="p-6 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <span>{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
