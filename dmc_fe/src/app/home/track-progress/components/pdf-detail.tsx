"use client"

import { FileText, Calendar, Clock, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PDFDetailProps {
  pdfDetail: {
    filename: string
    pages: number
    finished: string
    uploadAt: string
    lastAccess: string
    device: {
      brand: string
      type: string
      model: string
    }
  }
}

export default function PDFDetail({ pdfDetail }: PDFDetailProps) {
  const router = useRouter()

  const handleProcessPDF = () => {
    router.push("/home/track-progress/finish")
  }

  return (
    <div className="w-72 bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-3 bg-[#4045ef] text-white">
        <h2 className="text-sm font-medium text-center uppercase tracking-wide">PDF Detail</h2>
      </div>

      <div className="p-3">
        {/* Filename section */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <FileText className="h-3.5 w-3.5 text-[#4045ef] mr-1.5" />
            <h3 className="text-xs font-semibold uppercase text-gray-500">Filename</h3>
          </div>
          <p className="text-xs font-medium text-[#2e3139] pl-5 break-words">{pdfDetail.filename}</p>
        </div>

        {/* Key metrics in a grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#f9f9f9] p-2 rounded">
            <p className="text-xs text-gray-500 mb-1">Pages</p>
            <p className="text-sm font-semibold">{pdfDetail.pages}</p>
          </div>

          <div className="bg-[#f9f9f9] p-2 rounded">
            <p className="text-xs text-gray-500 mb-1">Finished</p>
            <p className="text-sm font-semibold text-green-600">{pdfDetail.finished}</p>
          </div>

          <div className="bg-[#f9f9f9] p-2 rounded flex items-start">
            <Calendar className="h-3.5 w-3.5 text-[#4045ef] mt-0.5 mr-1" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Upload at</p>
              <p className="text-xs font-medium">{pdfDetail.uploadAt}</p>
            </div>
          </div>

          <div className="bg-[#f9f9f9] p-2 rounded flex items-start">
            <Clock className="h-3.5 w-3.5 text-[#4045ef] mt-0.5 mr-1" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Last access</p>
              <p className="text-xs font-medium">{pdfDetail.lastAccess}</p>
            </div>
          </div>
        </div>

        {/* Device details */}
        <div className="bg-[#f1f6ff] p-3 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <Laptop className="h-3.5 w-3.5 text-[#4045ef] mr-1.5" />
            <h3 className="text-xs font-semibold uppercase text-[#4045ef]">Device detail</h3>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Brand</p>
              <p className="text-xs font-medium">{pdfDetail.device.brand}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-xs font-medium">{pdfDetail.device.type}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Model</p>
              <p className="text-xs font-medium">{pdfDetail.device.model}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <Button
          className="w-full bg-[#4045ef] hover:bg-[#2d336b] text-white rounded-md py-1.5 text-sm"
          onClick={handleProcessPDF}
        >
          Process PDF
        </Button>
      </div>
    </div>
  )
}
