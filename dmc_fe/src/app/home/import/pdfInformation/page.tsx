"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Mail, HelpCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

// Dynamically import the PDF viewer to avoid SSR issues
const PDFViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center">
        <div className="mb-4">Loading PDF viewer...</div>
        <div className="animate-spin h-8 w-8 border-4 border-[#4045ef] border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  ),
})

export default function PDFInformationPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfName, setPdfName] = useState<string>("")

  useEffect(() => {
    // Get the PDF URL from sessionStorage
    const storedPdfUrl = sessionStorage.getItem("uploadedPdfUrl")
    const storedPdfName = sessionStorage.getItem("uploadedPdfName")

    if (storedPdfUrl) {
      setPdfUrl(storedPdfUrl)
    }

    if (storedPdfName) {
      setPdfName(storedPdfName)
    }
  }, [])

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress Steps */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center max-w-2xl w-full">
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-[#4045ef] text-white flex items-center justify-center mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <span className="text-xs text-[#2d336b]">Device Info</span>
          </div>
          <div className="h-0.5 bg-[#d5d5d5] flex-1"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full border-2 border-[#d5d5d5] flex items-center justify-center mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d5d5d5]"></div>
            </div>
            <span className="text-xs text-[#6f6f6f]">Data Preprocessing</span>
          </div>
          <div className="h-0.5 bg-[#d5d5d5] flex-1"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full border-2 border-[#d5d5d5] flex items-center justify-center mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d5d5d5]"></div>
            </div>
            <span className="text-xs text-[#6f6f6f]">Confirmation</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6">
        {/* PDF Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 border border-[#d5d5d5] rounded-md flex items-center justify-center bg-white overflow-hidden">
            {pdfUrl ? (
              <PDFViewer pdfUrl={pdfUrl} currentPage={currentPage} onLoadSuccess={handleDocumentLoadSuccess} />
            ) : (
              <div className="text-center p-4">
                <p>No PDF file loaded. Please upload a PDF file first.</p>
              </div>
            )}
          </div>

          {/* Page Navigation */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center bg-[#f1f6ff] rounded-md">
              <button
                onClick={prevPage}
                className="p-2 text-[#4045ef] disabled:text-[#a9b5df]"
                disabled={currentPage === 1 || !pdfUrl}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 text-sm text-[#2d336b]">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={nextPage}
                className="p-2 text-[#4045ef] disabled:text-[#a9b5df]"
                disabled={currentPage === totalPages || !pdfUrl}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Button className="ml-4 bg-[#f1f6ff] text-[#4045ef] hover:bg-[#d3e0fe] rounded-md">
              <span className="mr-2">Checked</span>
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-[#4045ef]">+</span>
            </Button>
          </div>
        </div>

        {/* Device Information */}
        <div className="w-80">
          <div className="bg-[#d3e0fe] p-4 rounded-md mb-4">
            <h2 className="text-lg font-medium text-center text-[#2d336b] mb-4">Device Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-[#2e3139] mb-2">Device brand</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#425583] z-10">
                  <Mail className="w-5 h-5" />
                </div>
                <Select>
                  <SelectTrigger className="pl-10 py-2 w-full border-[#a9b5df] rounded-full focus:border-[#4045ef] focus:ring-2 focus:ring-[#4045ef]/20">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lenovo">Lenovo</SelectItem>
                    <SelectItem value="hp">HP</SelectItem>
                    <SelectItem value="dell">Dell</SelectItem>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="asus">Asus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center mt-1 text-sm text-[#4045ef]">
                <HelpCircle className="w-4 h-4 mr-1" />
                <span>Helper Text</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#2e3139] mb-2">Device type</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#425583] z-10">
                  <Mail className="w-5 h-5" />
                </div>
                <Select>
                  <SelectTrigger className="pl-10 py-2 w-full border-[#a9b5df] rounded-full focus:border-[#4045ef] focus:ring-2 focus:ring-[#4045ef]/20">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center mt-1 text-sm text-[#4045ef]">
                <HelpCircle className="w-4 h-4 mr-1" />
                <span>Helper Text</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#2e3139] mb-2">Device name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#425583] z-10">
                  <Mail className="w-5 h-5" />
                </div>
                <Select>
                  <SelectTrigger className="pl-10 py-2 w-full border-[#a9b5df] rounded-full focus:border-[#4045ef] focus:ring-2 focus:ring-[#4045ef]/20">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thinkpad-t570">ThinkPad T570</SelectItem>
                    <SelectItem value="thinkpad-p51s">ThinkPad P51s</SelectItem>
                    <SelectItem value="thinkpad-x1">ThinkPad X1 Carbon</SelectItem>
                    <SelectItem value="thinkpad-yoga">ThinkPad Yoga</SelectItem>
                    <SelectItem value="thinkpad-e15">ThinkPad E15</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center mt-1 text-sm text-[#4045ef]">
                <HelpCircle className="w-4 h-4 mr-1" />
                <span>Helper Text</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
