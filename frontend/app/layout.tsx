import React from 'react';
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Montserrat } from "next/font/google";
import './globals.css'

export const metadata: Metadata = {
  title: "SiTiGroup",
  description: "Cộng đồng Sinh viên Tình nguyện SiTiGroup - Keep Loving by Sharing",
  icons: {
    icon: "/siti-logo.png",
  },
}

const montserrat = Montserrat({
  subsets: ["vietnamese"], 
  weight: ["400", "700", "800", "900"], 
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body
        className={`${montserrat.className} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}

