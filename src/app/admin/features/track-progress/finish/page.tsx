"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, ChevronRight } from "lucide-react"
import Loader from "@/components/loader/loader"
import Link from "next/link"
import { useRouter } from "next/navigation"
import BASEURL from "@/src/app/api/backend/dmc_api_gateway/baseurl"

interface PageStatus {
  id: number
  status: "completed" | "error"
}

export default function FinishPage() {
  const [pages, setPages] = useState<PageStatus[]>([])
  const [loading, setLoading] = useState(true)
  //session storage
  const pdfId = sessionStorage.getItem("pdf_id")
  //next nav
  const router = useRouter()

  useEffect(() => {

    if (!pdfId) {
      setPages([])
      setLoading(false)
      return
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${BASEURL}/pdf_process/pdf_pages_embedding_status?pdf_id=${pdfId}`)
        const json = await res.json()
 
        if (json.status && json.data && Array.isArray(json.data.embedded_statuses)) {
          setPages(
            json.data.embedded_statuses.map((p: any) => ({
              id: p.page_number,
              status: p.done ? "completed" : "error",
            }))
          )
        } else {
          setPages([])
        }
      } catch (e) {
        setPages([])
      }
      setLoading(false)
    }
    fetchStatus()
  }, [pdfId])

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-center mb-2">
        <div className="flex items-center max-w-2xl w-full">
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-[#4045ef] text-white flex items-center justify-center mb-1">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs text-[#2d336b]">Device Info</span>
          </div>
          <div className="h-0.5 bg-[#4045ef] flex-1"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-[#4045ef] text-white flex items-center justify-center mb-1">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs text-[#2d336b]">Data Preprocessing</span>
          </div>
          <div className="h-0.5 bg-[#d5d5d5] flex-1"></div>
          <div className="flex flex-col items-center flex-1">
            <div className={
              // If all pages are completed, show blue check, else gray dot
              pages.length > 0 && pages.every(p => p.status === "completed")
                ? "w-8 h-8 rounded-full bg-[#4045ef] text-white flex items-center justify-center mb-1"
                : "w-8 h-8 rounded-full border-2 border-[#d5d5d5] flex items-center justify-center mb-1"
            }>
              {pages.length > 0 && pages.every(p => p.status === "completed") ? (
                <Check className="w-4 h-4" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[#d5d5d5]"></div>
              )}
            </div>
            <span className="text-xs text-[#6f6f6f]">Confirmation</span>
          </div>
        </div>
      </div>

      {/* Page List */}
      <div className="max-w-3xl mx-auto w-full border border-gray-200 rounded-[10px] overflow-hidden shadow-sm">
        <div className="bg-[#4045ef] text-white p-3 text-center font-medium">Page Processing Results</div>
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader />
            </div>
          ) : pages.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No PDF selected or no page data.</div>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${page.status === "completed" ? "bg-green-500" : "bg-orange-400"
                      }`}
                  >
                    {page.status === "completed" ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <X className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="font-medium text-[#2e3139]">Page {page.id}</span>
                </div>
                <button
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    if (pdfId && page.id) {
                      sessionStorage.setItem("pdf_id", String(pdfId));
                      router.push(`/admin/features/import/pdfInformation?page_number=${page.id}`);
                    }
                  }}>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Finish Button */}
      <div className="flex justify-center">
        <Link href="/admin/features">
          <Button className="bg-[#4045ef] hover:bg-[#2d336b] text-white px-12 py-6 rounded-[10px] text-lg font-medium transition-colors shadow-md hover:shadow-lg">
            FINISH
          </Button>
        </Link>
      </div>
    </div >
  )
}
