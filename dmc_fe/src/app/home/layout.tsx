"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

import Navigator from "../components/navigator";
import { SidebarOpen } from "lucide-react"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-white">
      <Navigator sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}/>
      {/* Main content */}
      <div
        className={cn("flex flex-1 flex-col transition-all duration-300 ease-in-out", sidebarOpen ? "ml-64" : "ml-16")}
      >
        <header className="flex h-16 items-center justify-end border-b px-4">
          <div className="flex items-center gap-4">
            <Link href="/Login" className="text-[#2d336b] hover:underline">
              Login
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  )
}

