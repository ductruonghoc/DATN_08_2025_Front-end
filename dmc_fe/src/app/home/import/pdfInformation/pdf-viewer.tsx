"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerProps {
  pdfUrl: string
  currentPage: number
  onLoadSuccess: (data: { numPages: number }) => void
}

export default function PDFViewer({ pdfUrl, currentPage, onLoadSuccess }: PDFViewerProps) {
  const [scale, setScale] = useState(1.0)

  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
      <Document
        file={pdfUrl}
        onLoadSuccess={onLoadSuccess}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-[#4045ef] border-t-transparent rounded-full"></div>
          </div>
        }
        error={
          <div className="text-center text-red-500">
            <p>Failed to load PDF file.</p>
            <p className="text-sm">Please make sure the file is a valid PDF document.</p>
          </div>
        }
      >
        <Page
          pageNumber={currentPage}
          scale={scale}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="shadow-md"
        />
      </Document>
    </div>
  )
}

