"use client"

import { useState } from "react"
import { Search, FileText, Calendar, Clock, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface PDFFile {
  id: string
  filename: string
  lastAccess: string
  progress: {
    current: number
    total: number
    status: "in-progress" | "complete"
  }
}

interface PDFDetail {
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

export default function TrackProgressPage() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const pdfFiles: PDFFile[] = [
    {
      id: "1",
      filename: "Report_2023.pdf",
      lastAccess: "January 24, 2025",
      progress: {
        current: 65,
        total: 100,
        status: "in-progress",
      },
    },
    {
      id: "2",
      filename: "BN81-25561C-620_EUG_ROPD",
      lastAccess: "12h ago",
      progress: {
        current: 122,
        total: 122,
        status: "complete",
      },
    },
    {
      id: "3",
      filename: "Report_2023.pdf",
      lastAccess: "January 24, 2025",
      progress: {
        current: 65,
        total: 100,
        status: "in-progress",
      },
    },
    {
      id: "4",
      filename: "Report_2023.pdf",
      lastAccess: "January 24, 2025",
      progress: {
        current: 65,
        total: 100,
        status: "in-progress",
      },
    },
    {
      id: "5",
      filename: "Report_2023.pdf",
      lastAccess: "January 24, 2025",
      progress: {
        current: 65,
        total: 100,
        status: "in-progress",
      },
    },
    {
      id: "6",
      filename: "Report_2023.pdf",
      lastAccess: "2 weeks ago",
      progress: {
        current: 22,
        total: 22,
        status: "complete",
      },
    },
  ]

  const pdfDetail: PDFDetail = {
    filename: "BN81-25561C-620_EUG_ROPDVBE UD_EU_ENG_2408 26.0.pdf",
    pages: 122,
    finished: "100%",
    uploadAt: "Dec 24, 2024",
    lastAccess: "12h ago",
    device: {
      brand: "Lenovo",
      type: "Laptop",
      model: "Thinkpad T570",
    },
  }

  const handleRowClick = (file: PDFFile) => {
    setSelectedFile(file)
  }

  const handleProcessPDF = () => {
    router.push("/home/track-progress/finish")
  }

  const filteredFiles = pdfFiles
    .filter((file) => {
      // Filter by status
      if (statusFilter !== "all") {
        return statusFilter === "complete"
          ? file.progress.status === "complete"
          : file.progress.status === "in-progress"
      }
      return true
    })
    .filter((file) => {
      // Filter by search query
      if (searchQuery) {
        return file.filename.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    })

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#2e3139] dark:text-white">PDF PROCESSING DASHBOARD</h1>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-9 pr-4 py-2 rounded-[10px] border-gray-200 dark:border-gray-700 bg-[#f5f6fa] dark:bg-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 gap-4">
        {/* PDF Files Table */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-[10px] border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="flex justify-end p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-[#f9f0f0] dark:bg-gray-700 text-[#2e3139] dark:text-white rounded-[10px] border-0">
                  <span>
                    Status: {statusFilter === "all" ? "All" : statusFilter === "complete" ? "Complete" : "In Progress"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#4045ef] text-white">
                  <th className="px-4 py-3 font-medium text-left rounded-tl-[10px]">Filename</th>
                  <th className="px-4 py-3 font-medium text-left">Last Access</th>
                  <th className="px-4 py-3 font-medium text-left">Progress</th>
                  <th className="px-4 py-3 font-medium text-left rounded-tr-[10px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className={`border-b hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      selectedFile?.id === file.id ? "bg-[#f1f6ff] dark:bg-gray-700" : ""
                    }`}
                    onClick={() => handleRowClick(file)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-[#2e3139] dark:text-white">{file.filename}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{file.lastAccess}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-48 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              file.progress.status === "complete" ? "bg-green-500" : "bg-[#4045ef]"
                            }`}
                            style={{ width: `${(file.progress.current / file.progress.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Pages: {file.progress.current}/{file.progress.total}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            file.progress.status === "complete" ? "bg-green-500" : "bg-[#4045ef]"
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {file.progress.status === "complete" ? "Complete" : "In Progress"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PDF Details - Improved and more compact */}
        <div className="w-80 bg-white dark:bg-gray-800 rounded-[10px] border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col">
          <div className="p-3 bg-[#4045ef] text-white rounded-t-[10px]">
            <h2 className="text-sm font-medium text-center uppercase tracking-wide">PDF Detail</h2>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {/* Filename section */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 text-[#4045ef] mr-2" />
                <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Filename</h3>
              </div>
              <p className="text-xs font-medium text-[#2e3139] dark:text-white pl-6 break-words">
                {pdfDetail.filename}
              </p>
            </div>

            {/* Key metrics in a grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#f9f9f9] dark:bg-gray-700 p-3 rounded-[10px]">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pages</p>
                <p className="text-sm font-semibold text-[#2e3139] dark:text-white">{pdfDetail.pages}</p>
              </div>

              <div className="bg-[#f9f9f9] dark:bg-gray-700 p-3 rounded-[10px]">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Finished</p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">{pdfDetail.finished}</p>
              </div>

              <div className="bg-[#f9f9f9] dark:bg-gray-700 p-3 rounded-[10px] flex items-start">
                <Calendar className="h-3.5 w-3.5 text-[#4045ef] mt-0.5 mr-1" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Upload at</p>
                  <p className="text-xs font-medium text-[#2e3139] dark:text-white">{pdfDetail.uploadAt}</p>
                </div>
              </div>

              <div className="bg-[#f9f9f9] dark:bg-gray-700 p-3 rounded-[10px] flex items-start">
                <Clock className="h-3.5 w-3.5 text-[#4045ef] mt-0.5 mr-1" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Last access</p>
                  <p className="text-xs font-medium text-[#2e3139] dark:text-white">{pdfDetail.lastAccess}</p>
                </div>
              </div>
            </div>

            {/* Device details */}
            <div className="bg-[#f1f6ff] dark:bg-gray-700 p-4 rounded-[10px] mb-4">
              <div className="flex items-center mb-3">
                <Laptop className="h-4 w-4 text-[#4045ef] mr-2" />
                <h3 className="text-xs font-semibold uppercase text-[#4045ef] dark:text-blue-300">Device detail</h3>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-[10px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Brand</p>
                  <p className="text-xs font-medium text-[#2e3139] dark:text-white">{pdfDetail.device.brand}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-2 rounded-[10px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                  <p className="text-xs font-medium text-[#2e3139] dark:text-white">{pdfDetail.device.type}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-2 rounded-[10px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Model</p>
                  <p className="text-xs font-medium text-[#2e3139] dark:text-white">{pdfDetail.device.model}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <Button
              className="w-full bg-[#4045ef] hover:bg-[#2d336b] text-white rounded-[10px] py-2 text-sm font-medium transition-colors"
              onClick={handleProcessPDF}
            >
              Process PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
