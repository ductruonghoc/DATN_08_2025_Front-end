"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, ChevronRight } from "lucide-react"
import Link from "next/link"

interface PageStatus {
  id: number
  status: "completed" | "error"
}

export default function FinishPage() {
  const [pages] = useState<PageStatus[]>([
    { id: 1, status: "completed" },
    { id: 2, status: "completed" },
    { id: 3, status: "completed" },
    { id: 4, status: "error" },
    { id: 5, status: "completed" },
    { id: 6, status: "completed" },
    { id: 7, status: "error" },
    { id: 8, status: "error" },
    { id: 9, status: "completed" },
  ])

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-center mb-2">
        <div className="flex items-center max-w-2xl w-full">
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-[#4045ef] text-white flex items-center justify-center mb-1">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs text-[#2d336b] dark:text-white">Device Info</span>
          </div>
          <div className="h-0.5 bg-[#4045ef] flex-1"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-[#4045ef] text-white flex items-center justify-center mb-1">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs text-[#2d336b] dark:text-white">Data Preprocessing</span>
          </div>
          <div className="h-0.5 bg-[#d5d5d5] dark:bg-gray-700 flex-1"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full border-2 border-[#d5d5d5] dark:border-gray-700 flex items-center justify-center mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d5d5d5] dark:bg-gray-700"></div>
            </div>
            <span className="text-xs text-[#6f6f6f] dark:text-gray-400">Confirmation</span>
          </div>
        </div>
      </div>

      {/* Page List */}
      <div className="max-w-3xl mx-auto w-full border border-gray-200 dark:border-gray-700 rounded-[10px] overflow-hidden shadow-sm">
        <div className="bg-[#4045ef] text-white p-3 text-center font-medium">Page Processing Results</div>
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    page.status === "completed" ? "bg-green-500" : "bg-orange-400"
                  }`}
                >
                  {page.status === "completed" ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <X className="w-5 h-5 text-white" />
                  )}
                </div>
                <span className="font-medium text-[#2e3139] dark:text-white">Page {page.id}</span>
              </div>
              <button className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Finish Button */}
      <div className="flex justify-center">
        <Link href="/home">
          <Button className="bg-[#4045ef] hover:bg-[#2d336b] text-white px-12 py-6 rounded-[10px] text-lg font-medium transition-colors shadow-md hover:shadow-lg">
            FINISH
          </Button>
        </Link>
      </div>
    </div>
  )
}
