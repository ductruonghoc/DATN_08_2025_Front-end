import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DMC PDF',
  description: 'DMC PDF help you know deeper about your device manuals',
  generator: 'DMC Team HCMUS & Mentor Ngô Ngọc Đăng KhoaKhoa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
