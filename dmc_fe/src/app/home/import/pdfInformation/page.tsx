"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Mail, HelpCircle, Check, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/form/select"
import { useRouter } from "next/navigation"
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
  const [checkedPages, setCheckedPages] = useState<Set<number>>(new Set())
  const [showImageProcessing, setShowImageProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<"texts" | "images">("texts")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageDescriptions, setImageDescriptions] = useState<{ [key: number]: string }>({})

  const [showAddBrandModal, setShowAddBrandModal] = useState(false)
  const [showAddTypeModal, setShowAddTypeModal] = useState(false)
  const [showAddNameModal, setShowAddNameModal] = useState(false)
  const [newBrandName, setNewBrandName] = useState("")
  const [newTypeName, setNewTypeName] = useState("")
  const [newDeviceName, setNewDeviceName] = useState("")

  // Mock images data
  const [images] = useState<ImageData[]>([
    {
      id: 1,
      src: "/placeholder.svg?height=200&width=300",
      description: "",
      checked: false,
    },
    {
      id: 2,
      src: "/placeholder.svg?height=200&width=300",
      description: "",
      checked: false,
    },
    {
      id: 3,
      src: "/placeholder.svg?height=200&width=300",
      description: "",
      checked: false,
    },
  ])

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

  const handleCheckPage = () => {
    const newCheckedPages = new Set(checkedPages)
    if (checkedPages.has(currentPage)) {
      newCheckedPages.delete(currentPage)
    } else {
      newCheckedPages.add(currentPage)
    }
    setCheckedPages(newCheckedPages)

    // If all pages are checked, move to image processing
    if (newCheckedPages.size === totalPages && !showImageProcessing) {
      setShowImageProcessing(true)
      setActiveTab("images")
    }
  }

  const handleImageDescriptionChange = (description: string) => {
    setImageDescriptions({
      ...imageDescriptions,
      [currentImageIndex]: description,
    })
  }

  const handleCheckImage = () => {
    const description = imageDescriptions[currentImageIndex]
    if (!description || description.trim() === "") {
      return // Don't allow checking without description
    }

    // Move to next image or finish
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    } else {
      // All images processed, redirect to finish page
      router.push("/home/track-progress/finish")
    }
  }

  const isCurrentImageDescribed = () => {
    const description = imageDescriptions[currentImageIndex]
    return description && description.trim() !== ""
  }

  const allPagesChecked = checkedPages.size === totalPages
  const isCurrentPageChecked = checkedPages.has(currentPage)

  return (
    <div className="flex flex-col h-full pt-6">
      {/* Progress Steps */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center max-w-2xl w-full">
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-[#4045ef] text-white flex items-center justify-center mb-1">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs text-[#2d336b]">Device Info</span>
          </div>
          <div className={`h-0.5 flex-1 ${showImageProcessing ? "bg-[#4045ef]" : "bg-[#d5d5d5]"}`}></div>
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                showImageProcessing ? "bg-[#4045ef] text-white" : "border-2 border-[#d5d5d5] text-[#d5d5d5]"
              }`}
            >
              {showImageProcessing ? (
                <Check className="w-4 h-4" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[#d5d5d5]"></div>
              )}
            </div>
            <span className={`text-xs ${showImageProcessing ? "text-[#2d336b]" : "text-[#6f6f6f]"}`}>
              Data Preprocessing
            </span>
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
      <div className="flex flex-1 gap-6 px-6 pb-6">
        {/* PDF Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 border border-[#d5d5d5] rounded-md flex items-center justify-center bg-white overflow-hidden mb-4">
            {pdfUrl ? (
              <PDFViewer pdfUrl={pdfUrl} currentPage={currentPage} onLoadSuccess={handleDocumentLoadSuccess} />
            ) : (
              <div className="text-center p-4">
                <p>No PDF file loaded. Please upload a PDF file first.</p>
              </div>
            )}
          </div>

          {/* Page Navigation */}
          <div className="flex justify-center">
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

            {!showImageProcessing && (
              <Button
                onClick={handleCheckPage}
                className={`ml-4 rounded-md px-6 py-2 ${
                  isCurrentPageChecked
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-[#f1f6ff] text-[#4045ef] hover:bg-[#d3e0fe]"
                }`}
              >
                {isCurrentPageChecked ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Checked
                  </>
                ) : (
                  "Check"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80">
          {!showImageProcessing ? (
            /* Device Information Panel */
            <>
              <div className="bg-[#d3e0fe] p-4 rounded-md mb-6">
                <h2 className="text-lg font-medium text-center text-[#2d336b] mb-4">Device Information</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm text-[#2e3139] mb-3">Device brand</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
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
                    <button
                      onClick={() => setShowAddBrandModal(true)}
                      className="w-8 h-8 rounded-full bg-[#A9B5DF] hover:bg-[#9AA5D5] flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-[#4045ef]">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    <span>Helper Text</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#2e3139] mb-3">Device type</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
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
                    <button
                      onClick={() => setShowAddTypeModal(true)}
                      className="w-8 h-8 rounded-full bg-[#A9B5DF] hover:bg-[#9AA5D5] flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-[#4045ef]">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    <span>Helper Text</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#2e3139] mb-3">Device name</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
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
                    {/* <button
                      onClick={() => setShowAddNameModal(true)}
                      className="w-8 h-8 rounded-full bg-[#A9B5DF] hover:bg-[#9AA5D5] flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button> */}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-[#4045ef]">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    <span>Helper Text</span>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-8 p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-600 mb-2">
                  Pages checked: {checkedPages.size}/{totalPages}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#4045ef] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(checkedPages.size / totalPages) * 100}%` }}
                  ></div>
                </div>
              </div>
            </>
          ) : (
            /* Image Processing Panel */
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex rounded-md overflow-hidden">
                <button
                  onClick={() => setActiveTab("texts")}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    activeTab === "texts"
                      ? "bg-[#a8b3ff] text-[#2d336b]"
                      : "bg-[#e8ebff] text-[#6b7280] hover:bg-[#d1d5ff]"
                  }`}
                >
                  Texts
                </button>
                <button
                  onClick={() => setActiveTab("images")}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    activeTab === "images"
                      ? "bg-[#6366f1] text-white"
                      : "bg-[#e8ebff] text-[#6b7280] hover:bg-[#d1d5ff]"
                  }`}
                >
                  Images
                </button>
              </div>

              {/* Image Content */}
              {activeTab === "images" && (
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-md p-4">
                    <img
                      src={images[currentImageIndex]?.src || "/placeholder.svg"}
                      alt={`Image ${currentImageIndex + 1}`}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Input image description</label>
                      <textarea
                        value={imageDescriptions[currentImageIndex] || ""}
                        onChange={(e) => handleImageDescriptionChange(e.target.value)}
                        placeholder="Describe what you see in this image..."
                        className="w-full p-3 border border-gray-300 rounded-md resize-none h-20 text-sm"
                      />

                      {!isCurrentImageDescribed() && (
                        <p className="text-red-500 text-xs">● Please input image description before continue</p>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    Image {currentImageIndex + 1} of {images.length}
                  </div>

                  <Button
                    onClick={handleCheckImage}
                    disabled={!isCurrentImageDescribed()}
                    className={`w-full py-3 rounded-md font-medium ${
                      isCurrentImageDescribed()
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {currentImageIndex === images.length - 1 ? "Finish" : "Checked"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Add Brand Modal */}
      {showAddBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#2e3139]">Add New Brand</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2e3139] mb-2">Brand Name</label>
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4045ef]"
              />
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setShowAddBrandModal(false)
                  setNewBrandName("")
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle adding new brand here
                  console.log("Adding brand:", newBrandName)
                  setShowAddBrandModal(false)
                  setNewBrandName("")
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Type Modal */}
      {showAddTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#2e3139]">Add New Device Type</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2e3139] mb-2">Type Name</label>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="Enter device type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4045ef]"
              />
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setShowAddTypeModal(false)
                  setNewTypeName("")
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle adding new type here
                  console.log("Adding type:", newTypeName)
                  setShowAddTypeModal(false)
                  setNewTypeName("")
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Device Name Modal */}
      {showAddNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#2e3139]">Add New Device Name</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2e3139] mb-2">Device Name</label>
              <input
                type="text"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                placeholder="Enter device name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4045ef]"
              />
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setShowAddNameModal(false)
                  setNewDeviceName("")
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle adding new device name here
                  console.log("Adding device name:", newDeviceName)
                  setShowAddNameModal(false)
                  setNewDeviceName("")
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
