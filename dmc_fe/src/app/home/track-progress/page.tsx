"use client"

import { useState } from "react"
import { Search, FileText, Calendar, Clock, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

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
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

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

  const filteredFiles =
    statusFilter === "all"
      ? pdfFiles
      : pdfFiles.filter((file) =>
          statusFilter === "complete" ? file.progress.status === "complete" : file.progress.status === "in-progress",
        )

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#2e3139]">PDF PROCESSING DASHBOARD</h1>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search" className="pl-9 pr-4 py-2 rounded-md border-gray-200" />
        </div>
      </div>

      <div className="flex flex-1 gap-6">
        {/* PDF Files Table */}
        <div className="flex-1 bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="flex justify-end p-3 border-b">
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-[#f9f0f0] text-[#2e3139]">
                  <span>Status</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-[#2e3139]">
                  <th className="px-4 py-3 font-medium">Filename</th>
                  <th className="px-4 py-3 font-medium">Last Access</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className={`border-b hover:bg-gray-50 cursor-pointer ${
                      selectedFile?.id === file.id ? "bg-[#f1f6ff]" : ""
                    }`}
                    onClick={() => handleRowClick(file)}
                  >
                    <td className="px-4 py-3 text-sm">{file.filename}</td>
                    <td className="px-4 py-3 text-sm">{file.lastAccess}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              file.progress.status === "complete" ? "bg-green-500" : "bg-[#4045ef]"
                            }`}
                            style={{ width: `${(file.progress.current / file.progress.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
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
                        <span className="text-sm">
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
            <Button className="w-full bg-[#4045ef] hover:bg-[#2d336b] text-white rounded-md py-1.5 text-sm">
              Process PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

