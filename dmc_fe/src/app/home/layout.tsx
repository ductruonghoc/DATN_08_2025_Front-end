"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, Upload, Plus, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - collapses to icon-only mode */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#fff2f2] transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16",
        )}
      >
        <div className={cn("flex h-16 items-center px-4", sidebarOpen ? "justify-between" : "justify-center")}>
          {sidebarOpen && (
            <Link href="/home" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#4045ef] text-white">
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
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#2d336b]">DMC</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "flex items-center justify-center rounded-md p-2 hover:bg-white/50",
              sidebarOpen ? "" : "mx-auto",
            )}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-[#2d336b]" />
          </button>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <div className={cn("px-4", sidebarOpen ? "" : "flex justify-center")}>
            <button
              className={cn(
                "flex items-center gap-2 rounded-full bg-white shadow-sm",
                sidebarOpen ? "w-full px-4 py-2 text-sm text-gray-700" : "h-10 w-10 justify-center",
              )}
            >
              <Plus className="h-4 w-4" />
              {sidebarOpen && <span>New conversation</span>}
            </button>
          </div>
          <nav className={cn("mt-6", sidebarOpen ? "px-2" : "flex flex-col items-center px-0")}>
            <Link
              href="/home/import"
              className={cn(
                "flex items-center gap-3 rounded-lg hover:bg-white/50",
                sidebarOpen ? "px-3 py-2 text-[#2d336b]" : "h-10 w-10 justify-center my-2",
              )}
            >
              <Upload className="h-5 w-5 text-[#2d336b]" />
              {sidebarOpen && <span>Upload PDF</span>}
            </Link>

            <Link
              href="/home/device-management"
              className={cn(
                "flex items-center gap-3 rounded-lg hover:bg-white/50",
                sidebarOpen ? "px-3 py-2 text-[#2d336b]" : "h-10 w-10 justify-center my-2",
              )}
            >
              <Settings className="h-5 w-5 text-[#2d336b]" />
              {sidebarOpen && <span>Device Management</span>}
            </Link>

            <Link
              href="/home/track-progress"
              className={cn(
                "flex items-center gap-3 rounded-lg hover:bg-white/50",
                sidebarOpen ? "px-3 py-2 text-[#2d336b]" : "h-10 w-10 justify-center my-2",
              )}
            >
              <FileText className="h-5 w-5 text-[#2d336b]" />
              {sidebarOpen && <span>Track Progress</span>}
            </Link>
          </nav>
        </div>
      </div>

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

