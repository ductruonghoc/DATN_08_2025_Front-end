"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/form/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/form/select"
import { useRouter } from "next/navigation"
import BASEURL from "../../../../api/backend/dmc_api_gateway/baseurl"; // Adjust the import path as necessary
import { set } from "date-fns"

interface PDFFile {
  id: string
  filename: string
  lastAccess: string
  progress: {
    current: number
    total: number
    status: "need-ocr" | "not-full-embeded" | "complete"
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
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([])
  const [loading, setLoading] = useState(false)
  const [brandFilter, setBrandFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [hasPrev, setHasPrev] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [page, setPage] = useState(1)
  const [allBrands, setAllBrands] = useState<string[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])


  // Fetch PDF files with filters and pagination
  useEffect(() => {
    const fetchPDFs = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append("offset", String(page))
        if (searchQuery) params.append("nameQuery", searchQuery)
         
        if (brandFilter) params.append("brand", brandFilter === "*" ? "" : brandFilter)
        if (categoryFilter) params.append("category", categoryFilter === "*" ? "" : categoryFilter)
        params.append("sort", "scoring")
        // Scoring filter
        if (statusFilter === "in-progress") {
          params.append("min_scoring", "1")
          params.append("max_scoring", "2")
        } else if (statusFilter === "complete") {
          params.append("min_scoring", "3")
          params.append("max_scoring", "3")
        } else {
          params.append("min_scoring", "1")
          params.append("max_scoring", "3")
        }

        const res = await fetch(`${BASEURL}/pdf_process/list_pdfs_states?${params.toString()}`)
        const json = await res.json()
        if (json.status && json.data && Array.isArray(json.data.pdfs)) {
          const mapped: PDFFile[] = json.data.pdfs.map((item: any) => ({
            id: String(item.pdf_id),
            filename: item.pdf_label || `Device_${item.device_id}.pdf`,
            lastAccess: item.pdf_lastModified
              ? new Date(item.pdf_lastModified).toLocaleString()
              : "N/A",
            progress: {
              current: item.pdf_scoring || 0,
              total: 3,
              status:
                item.pdf_scoring === 1
                  ? "need-ocr"
                  : item.pdf_scoring === 2
                    ? "not-full-embeded"
                    : item.pdf_scoring === 3
                      ? "complete"
                      : "need-ocr",
            },
            uploadAt: item.pdf_lastModified
              ? new Date(item.pdf_lastModified).toLocaleString()
              : "N/A",
            device: {
              brand: item.brand || "Unknown",
              category: item.category || "Unknown",
              model: `Device ${item.device_id}`,
            },
          }))
          setPdfFiles(mapped)
          setHasPrev(!!json.data.prevPage)
          setHasNext(!!json.data.nextPage)
        } else {
          setPdfFiles([])
          setHasPrev(false)
          setHasNext(false)
        }
      } catch (e) {
        setPdfFiles([])
        setHasPrev(false)
        setHasNext(false)
      }
      setLoading(false)
    }
    fetchPDFs()
  }, [searchQuery, statusFilter, brandFilter, categoryFilter, page])
  // Fetch all brands and categories for filters
  useEffect(() => {
    const fetchBrandsAndTypes = async () => {
      try {
        const res = await fetch(`${BASEURL}/pdf_process/get_brands_and_device_types`)
        const json = await res.json()
        if (json.success && json.data) {
          setAllBrands((json.data.brands || []).map((b: any) => b.label))
          setAllCategories((json.data.deviceTypes || json.data.devices || []).map((d: any) => d.label))
        }
      } catch (e) {
        setAllBrands([])
        setAllCategories([])
      }
    }
    fetchBrandsAndTypes()
  }, [setAllBrands, setAllCategories])

  const handleRowClick = (file: PDFFile) => {
    setSelectedFile(file)
  }

  const handleProcessPDF = () => {

    if (selectedFile && selectedFile.progress.current >= 2) {
      sessionStorage.setItem("pdf_id", selectedFile.id)
      router.push("/admin/features/track-progress/finish")
    } else if (selectedFile?.progress.current === 1) {
      sessionStorage.setItem("pdf_id", selectedFile.id);
      router.push("/admin/features/import?scoring=1");
    }
    else {
      // Optionally show a warning or do nothing
      alert("PDF must be at least OCR processed before importing information.")
    }

  }

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
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-32 border-gray-300 rounded-md">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*">All Brands</SelectItem>
                  {allBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                  {/* Add more brands as needed */}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32 border-gray-300 rounded-md">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*">All Categories</SelectItem>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  {/* Add more categories as needed */}
                </SelectContent>
              </Select>
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
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2">Filename</th>
                    <th className="px-4 py-2">Brand</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Progress</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {pdfFiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-400">No PDF files found.</td>
                    </tr>
                  ) : (
                    pdfFiles.map((file) => {
                      let barColor = "";
                      if (file.progress.status === "not-full-embeded") barColor = "bg-yellow-200"; // orange yellow
                      else if (file.progress.status === "need-ocr") barColor = "bg-sky-200"; // sky blue
                      else if (file.progress.status === "complete") barColor = "bg-green-200"; // mint green
                      const percent = Math.round((file.progress.current / file.progress.total) * 100);

                      return (
                        <tr
                          key={file.id}
                          className={`hover:bg-gray-50 cursor-pointer`}
                          onClick={() => handleRowClick(file)}
                        >
                          <td className="px-4 py-2">{file.filename}</td>
                          <td className="px-4 py-2">{file.device.brand}</td>
                          <td className="px-4 py-2">{file.device.category}</td>
                          <td className="px-4 py-2 w-40">
                            <div className="w-full bg-gray-200 rounded h-3 relative">
                              <div
                                className={`h-3 rounded ${barColor}`}
                                style={{ width: `${percent}%` }}
                              ></div>

                            </div>
                          </td>
                          <td className="px-4 py-2 capitalize">{file.progress.status.replace("-", " ")}</td>
                          <td className="px-4 py-2">{file.lastAccess}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              disabled={!hasPrev || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!hasNext || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
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
