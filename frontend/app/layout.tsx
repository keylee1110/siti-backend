import React from 'react';
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Montserrat } from "next/font/google";
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
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

