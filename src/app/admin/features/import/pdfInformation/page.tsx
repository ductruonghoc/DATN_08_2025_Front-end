"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check, Pencil, Save, Trash2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import BASEURL from "@/src/app/api/backend/dmc_api_gateway/baseurl"

const PDFViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center">
        <div className="mb-4">Loading PDF viewer...</div>
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  ),
})

interface ImageData {
  id: number
  src: string
  description: string
  checked: boolean
}

export default function PDFInformationPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfName, setPdfName] = useState<string>("")
  const [deviceInfo, setDeviceInfo] = useState({ name: "", brand: "", type: "" })
  const [checkedPages, setCheckedPages] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState<"texts" | "images">("texts")
  const [paragraph, setParagraph] = useState<string>("")
  const [images, setImages] = useState<ImageData[]>([])
  const [scale, setScale] = useState(1.0)
  const [snipping, setSnipping] = useState(false)
  const [snipRect, setSnipRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [snipStart, setSnipStart] = useState<{ x: number; y: number } | null>(null)
  const [snipImage, setSnipImage] = useState<string | null>(null)
  const [snipReady, setSnipReady] = useState(false)
  const [pdfId, setPdfId] = useState<number | null>(null)
  const pdfViewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    //const storedPdfId = sessionStorage.getItem("pdf_id") // Lấy pdf_id từ sessionStorage
    const storedPdfId = 17 //mocked pdf_id
    if (!storedPdfId) {
      // Nếu không tồn tại pdf_id, chuyển hướng về trang import
      toast.error("PDF ID is missing. Please start from the beginning.")
      router.push("/admin/features/import")
    } else {
      setPdfId(storedPdfId)
      // Fetch initial PDF state
      fetch(`${BASEURL}/pdf_process/get_pdf_initial_state?pdf_id=${storedPdfId}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text())
          return res.json()
        })
        .then((json) => {
          if (!json.success) throw new Error(json.message)
          const data = json.data
          if (!data.pdf_ocr_flag) {
            toast.error("PDF OCR failed. Please re-import.")
            router.push("/admin/features/import")
            return
          }
          setPdfName(data.pdf_name || "")
          setPdfUrl(data.pdf_gcs_signed_read_url || null)
          setParagraph(data.page_paragraph?.context || "")
          setImages(
            (data.images || []).map((img: any) => ({
              id: img.id,
              src: `/placeholder.svg?id=${img.id}`, // Replace with real image src if available
              description: img.alt || "",
              checked: !!img.modified,
            }))
          )
          // If all images and paragraph are modified, mark as checked
          if (
            data.page_paragraph?.modified &&
            (data.images || []).every((img: any) => img.modified)
          ) {
            setCheckedPages((prev) => new Set(prev).add(1)) // Assuming page 1 for initial load
          }
        })
        .catch((err) => {
          toast.error("Failed to load PDF state: " + err.message)
          router.push("/admin/features/import")
        })
    }
  }, [router, setPdfId])

  // Fetch single page data when currentPage changes
  useEffect(() => {
    if (!pdfId) return
    // Replace this with your real API call
    async function fetchPageData() {
      // Example fetch, replace with your endpoint
      // const res = await fetch(`/api/pdf/${pdfId}/page/${currentPage}`)
      // const data = await res.json()
      // setParagraph(data.paragraph)
      // setImages(data.images)
      // For demo:
      setParagraph(`Sample paragraph for page ${currentPage} of ${deviceInfo.name} manual.`)
      setImages(
        Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, idx) => ({
          id: idx + 1,
          src: `/placeholder.svg?page=${currentPage}&img=${idx + 1}&device=${deviceInfo.name}`,
          description: "",
          checked: false,
        }))
      )
    }
    fetchPageData()
  }, [currentPage, pdfId, deviceInfo.name])

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages)
  }

  // Save paragraph (call API here if needed)
  const handleParagraphChange = (value: string) => {
    setParagraph(value)
    // Optionally, debounce and save to server
  }

  // const handleCheckPage = () => {
  //   const newCheckedPages = new Set(checkedPages)
  //   if (checkedPages.has(currentPage)) {
  //     newCheckedPages.delete(currentPage)
  //     toast.info(`Page ${currentPage} unchecked`)
  //   } else {
  //     if (images.some((img) => !img.description)) {
  //       toast.error("Please describe all images before checking the page")
  //       return
  //     }
  //     newCheckedPages.add(currentPage)
  //     toast.success(`Page ${currentPage} checked`)
  //   }
  //   setCheckedPages(newCheckedPages)
  //   if (newCheckedPages.size === totalPages) {
  //     toast.success("All pages processed successfully!")
  //     setTimeout(() => router.push("/admin/features/track-progress/finish"), 1000)
  //   }
  // }

  const handleImageDescriptionChange = (imageId: number, description: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, description } : img))
    )
  }

  const handleCheckImage = (imageId: number) => {
    const image = images.find((img) => img.id === imageId)
    if (!image || !image.description || image.description.trim() === "") {
      toast.error("Image description required")
      return
    }
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, checked: true } : img))
    )
    toast.success(`Image ${imageId} description saved`)
  }

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5))
  const handleZoomReset = () => setScale(1.0)

  const handleSnipMouseDown = (e: React.MouseEvent) => {
    if (!snipping || !pdfViewerRef.current) return
    const rect = pdfViewerRef.current.getBoundingClientRect()
    const scrollLeft = pdfViewerRef.current.scrollLeft
    const scrollTop = pdfViewerRef.current.scrollTop
    const startX = e.clientX - rect.left + scrollLeft
    const startY = e.clientY - rect.top + scrollTop
    setSnipStart({ x: startX, y: startY })
    setSnipRect({ x: startX, y: startY, w: 0, h: 0 })
  }

  const handleSnipMouseMove = (e: React.MouseEvent) => {
    if (!snipping || !snipStart || !pdfViewerRef.current) return
    const rect = pdfViewerRef.current.getBoundingClientRect()
    const scrollLeft = pdfViewerRef.current.scrollLeft
    const scrollTop = pdfViewerRef.current.scrollTop
    const contentWidth = pdfViewerRef.current.clientWidth
    const contentHeight = pdfViewerRef.current.clientHeight
    let currX = e.clientX - rect.left + scrollLeft
    let currY = e.clientY - rect.top + scrollTop
    currX = Math.max(0, Math.min(currX, contentWidth))
    currY = Math.max(0, Math.min(currY, contentHeight))
    setSnipRect({
      x: Math.min(snipStart.x, currX),
      y: Math.min(snipStart.y, currY),
      w: Math.abs(currX - snipStart.x),
      h: Math.abs(currY - snipStart.y),
    })
  }

  const handleSnipMouseUp = async () => {
    setSnipStart(null)
    setSnipping(false)
    if (pdfViewerRef.current && snipRect && snipRect.w > 5 && snipRect.h > 5) {
      const newImageSrc = `/placeholder.svg?page=${currentPage}&snip=true&device=${deviceInfo.name}`
      setSnipImage(newImageSrc)
      setImages((prev) => [
        ...prev,
        { id: prev.length + 1, src: newImageSrc, description: "", checked: false },
      ])
      toast.success("Area snipped and added to images")
    }
    setSnipRect(null)
  }

  const isCurrentPageChecked = checkedPages.has(currentPage)

  return (
    <div className="flex flex-col h-full pt-6 bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      {/* Header with Device Info */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 max-w-2xl w-full">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Processing Manual - {pdfName}</h1>
            {/* <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{deviceInfo.brand}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{deviceInfo.type}</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{pdfName}</span>
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 px-6 pb-6">
        {/* PDF Viewer */}
        <div className="w-[60%] flex flex-col">
          <div
            ref={pdfViewerRef}
            className="flex-1 border border-gray-200 rounded-lg flex items-center justify-center bg-white overflow-hidden mb-4 relative shadow-sm"
            style={{
              userSelect: snipping ? "none" : undefined,
              cursor: snipping ? "crosshair" : undefined,
            }}
            onMouseDown={snipping ? handleSnipMouseDown : undefined}
            onMouseMove={snipping && snipStart ? handleSnipMouseMove : undefined}
            onMouseUp={snipping && snipStart ? handleSnipMouseUp : undefined}
          >
            {/* Controls */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md">
                <div className="flex items-center gap-2">
                  {!snipReady ? (
                    <Button
                      onClick={() => {
                        setSnipping(true)
                        setSnipRect(null)
                        setSnipImage(null)
                        setSnipReady(true)
                      }}
                      className={`px-3 py-1 text-sm ${snipping ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      disabled={snipping}
                    >
                      {snipping ? <Check className="w-4 h-4 mr-1" /> : null}
                      {snipping ? "Ready to Snip" : "Snip Area"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setSnipReady(false)
                        setSnipping(false)
                        setSnipImage(null)
                      }}
                      className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Confirm Snip
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleZoomOut} variant="outline" size="sm" className="px-2 py-1 text-xs">
                    -
                  </Button>
                  <span className="text-xs text-gray-800 min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
                  <Button onClick={handleZoomIn} variant="outline" size="sm" className="px-2 py-1 text-xs">
                    +
                  </Button>
                  <Button onClick={handleZoomReset} variant="outline" size="sm" className="px-2 py-1 text-xs">
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* PDF Content */}
            {pdfUrl ? (
              <div className = "pt-[80px]" style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
                <PDFViewer pdfUrl={pdfUrl} currentPage={currentPage} onLoadSuccess={handleDocumentLoadSuccess} />
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            )}

            {/* Snipping overlay */}
            {snipping && snipRect && (
              <div
                style={{
                  position: "absolute",
                  left: snipRect.x,
                  top: snipRect.y,
                  width: snipRect.w,
                  height: snipRect.h,
                  border: "2px dashed indigo-600",
                  background: "rgba(79,70,229,0.1)",
                  pointerEvents: "none",
                  zIndex: 20,
                }}
              />
            )}

            {/* Snip preview */}
            {snipImage && (
              <div className="absolute bottom-4 left-4 z-30 bg-white p-2 rounded-lg shadow-md border max-w-[200px]">
                <img src={snipImage || "/placeholder.svg"} alt="Snipped area" className="w-full h-auto rounded" />
                <Button
                  onClick={() => {
                    setSnipImage(null)
                    setSnipReady(false)
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs"
                >
                  Close Preview
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center bg-indigo-50 rounded-lg">
              <button
                onClick={prevPage}
                className="p-2 text-indigo-600 disabled:text-gray-400"
                disabled={currentPage === 1 || !pdfUrl}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 text-sm text-gray-800">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={nextPage}
                className="p-2 text-indigo-600 disabled:text-gray-400"
                disabled={currentPage === totalPages || !pdfUrl}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div
              className={`rounded-lg px-6 py-2 ${isCurrentPageChecked
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
            >
              {isCurrentPageChecked ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Checked
                </>
              ) : (
                "In progress"
              )}
            </div>
          </div>
        </div>

        {/* Processing Panel */}
        <div className="w-[40%]">
          <div className="space-y-6 h-full flex flex-col bg-white rounded-xl shadow-lg p-6">
            {/* Tab Navigation */}
            <div className="flex rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveTab("texts")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${activeTab === "texts"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-indigo-50 text-gray-600 hover:bg-indigo-100"
                  }`}
              >
                Text Processing
              </button>
              <button
                onClick={() => setActiveTab("images")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${activeTab === "images"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-indigo-50 text-gray-600 hover:bg-indigo-100"
                  }`}
              >
                Image Labeling
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "texts" && (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Page Paragraph - Page {currentPage}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <textarea
                      className="w-full h-72 p-4 border rounded-lg text-base resize-none transition-all duration-200 border-indigo-600 ring-2 ring-indigo-600/20 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
                      value={paragraph}
                      onChange={(e) => handleParagraphChange(e.target.value)}
                      placeholder="Write or edit the full page paragraph here, like in Google Docs or Notion..."
                    />
                  </div>
                </div>
              )}

              {activeTab === "images" && (
                <div className="space-y-6 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Image Labeling - Page {currentPage}</h3>
                    <div className="text-sm text-gray-500">{images.length} images</div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {images.map((image) => (
                      <div key={image.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={`Image ${image.id}`}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <div className="space-y-4">
                          <label className="block text-sm font-medium text-gray-700">Image Description</label>
                          <textarea
                            value={image.description}
                            onChange={(e) => handleImageDescriptionChange(image.id, e.target.value)}
                            placeholder="Describe what you see in this image..."
                            className="w-full p-3 border border-gray-200 rounded-lg resize-none h-20 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                          />
                          {!image.description && (
                            <p className="text-red-500 text-xs">● Please input image description</p>
                          )}
                          <Button
                            onClick={() => handleCheckImage(image.id)}
                            disabled={!image.description}
                            className={`w-full ${image.checked
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : image.description
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              } rounded-lg`}
                          >
                            {image.checked ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Checked
                              </>
                            ) : (
                              "Check Image"
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">
                Current page: {currentPage}/{totalPages}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
