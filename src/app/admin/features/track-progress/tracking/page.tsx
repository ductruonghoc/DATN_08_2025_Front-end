"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/form/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/form/select"
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
  uploadAt: string
  device: {
    brand: string
    category: string
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
      uploadAt: "Dec 24, 2024",
      device: {
        brand: "Lenovo",
        category: "Laptop",
        model: "Thinkpad T570",
      },
    },
    {
      id: "2",
      filename: "BN81-25561C-620_EUG_ROPDVBEUD_EU_ENG_2408 26.0.pdf",
      lastAccess: "12h ago",
      progress: {
        current: 122,
        total: 122,
        status: "complete",
      },
      uploadAt: "Dec 24, 2024",
      device: {
        brand: "Lenovo",
        category: "Laptop",
        model: "Thinkpad T570",
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
      uploadAt: "Dec 24, 2024",
      device: {
        brand: "Lenovo",
        category: "Laptop",
        model: "Thinkpad T570",
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
      uploadAt: "Dec 24, 2024",
      device: {
        brand: "Lenovo",
        category: "Laptop",
        model: "Thinkpad T570",
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
      uploadAt: "Dec 24, 2024",
      device: {
        brand: "Lenovo",
        category: "Laptop",
        model: "Thinkpad T570",
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
      uploadAt: "Dec 24, 2024",
      device: {
        brand: "Lenovo",
        category: "Laptop",
        model: "Thinkpad T570",
      },
    },
  ]

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
    <div className="flex h-full bg-gray-50">
      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${selectedFile ? "mr-80" : ""}`}>
        <div className="p-6 h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-[#2e3139]">PROGRESS DASHBOARD</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-9 pr-4 py-2 w-64 border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 border-gray-300 rounded-md">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Filename</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Last Access</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Progress</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedFile?.id === file.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleRowClick(file)}
                  >
                    <td className="py-4 px-4 text-sm text-[#2e3139]">{file.filename}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{file.lastAccess}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                          <div
                            className={`h-2 rounded-full ${
                              file.progress.status === "complete" ? "bg-green-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${(file.progress.current / file.progress.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          Pages: {file.progress.current}/{file.progress.total}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            file.progress.status === "complete" ? "bg-green-500" : "bg-blue-500"
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${
                            file.progress.status === "complete" ? "text-green-600" : "text-blue-600"
                          }`}
                        >
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
      </div>

      {/* PDF Details Sidebar */}
      {selectedFile && (
        <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg z-40 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-bold text-[#2e3139] mb-6">PDF DETAIL</h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <label className="text-sm text-gray-500 block mb-1">Filename</label>
                <p className="text-sm text-[#2e3139] break-words">{selectedFile.filename}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Pages</label>
                  <p className="text-sm text-[#2e3139]">{selectedFile.progress.total}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Finished</label>
                  <p className="text-sm text-[#2e3139]">
                    {Math.round((selectedFile.progress.current / selectedFile.progress.total) * 100)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Upload at</label>
                  <p className="text-sm text-[#2e3139]">{selectedFile.uploadAt}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Last access</label>
                  <p className="text-sm text-[#2e3139]">{selectedFile.lastAccess}</p>
                </div>
              </div>

              {/* Device Details */}
              <div>
                <h3 className="text-sm font-medium text-[#2e3139] mb-3">Device detail</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Brand</label>
                      <p className="text-sm text-[#2e3139]">{selectedFile.device.brand}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Category</label>
                      <p className="text-sm text-[#2e3139]">{selectedFile.device.category}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Device</label>
                      <p className="text-sm text-[#2e3139]">{selectedFile.device.model}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Button */}
            <div className="mt-8">
              <Button
                onClick={handleProcessPDF}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
              >
                Process PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
