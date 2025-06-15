"use client"

import { useState, useEffect } from "react"

interface PDFViewerProps {
  pdfUrl: string
  currentPage: number
  onLoadSuccess: (data: { numPages: number }) => void
}

export default function PDFViewer({ pdfUrl, currentPage, onLoadSuccess }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock PDF with 10 pages
  const totalPages = 10

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      onLoadSuccess({ numPages: totalPages })
    }, 1000)

    return () => clearTimeout(timer)
  }, [onLoadSuccess, totalPages])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#4045ef] border-t-transparent rounded-full mx-auto mb-4"></div>
          <div>Loading PDF viewer...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Failed to load PDF file.</p>
        <p className="text-sm">Please make sure the file is a valid PDF document.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-2xl w-full">
        {/* Mock PDF Page */}
        <div className="aspect-[8.5/11] bg-white p-8 border border-gray-300">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Device Manual</h1>
              <div className="w-full h-px bg-gray-300"></div>
            </div>

            {/* Content based on current page */}
            <div className="flex-1">
              {currentPage === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700">Table of Contents</h2>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>1. Introduction</span>
                      <span>3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2. Getting Started</span>
                      <span>5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3. Basic Operations</span>
                      <span>8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>4. Advanced Features</span>
                      <span>12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>5. Troubleshooting</span>
                      <span>15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>6. Specifications</span>
                      <span>18</span>
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700">Safety Information</h2>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      ⚠️ <strong>Warning:</strong> Read all safety instructions before use.
                    </p>
                    <p>• Keep device away from water and moisture</p>
                    <p>• Do not expose to extreme temperatures</p>
                    <p>• Use only approved power adapters</p>
                    <p>• Ensure proper ventilation during operation</p>
                  </div>
                </div>
              )}

              {currentPage === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700">Introduction</h2>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      Welcome to your new device. This manual will guide you through the setup and operation of your
                      device.
                    </p>
                    <p>Your device comes with the following features:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>High-performance processor</li>
                      <li>Advanced connectivity options</li>
                      <li>Energy-efficient design</li>
                      <li>User-friendly interface</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentPage >= 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700">Page {currentPage}</h2>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>This is page {currentPage} of the device manual.</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                    <p>
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                      consequat.
                    </p>
                    <div className="bg-gray-100 p-3 rounded border-l-4 border-blue-500">
                      <p className="font-medium">Note:</p>
                      <p>Important information about device operation can be found in this section.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-200">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
