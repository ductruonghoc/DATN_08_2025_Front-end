"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "@/node_modules/react-pdf/dist/esm/Page/AnnotationLayer.css"
import "@/node_modules/react-pdf/dist/esm/Page/TextLayer.css"

// Set workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`

interface PDFViewerProps {
  pdfUrl: string
  currentPage: number
  onLoadSuccess: (data: { numPages: number }) => void
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export default function PDFViewer({ pdfUrl, currentPage, onLoadSuccess }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [selectionRect, setSelectionRect] = useState<Rect | null>(null); // Lưu trữ tọa độ vùng chọn
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  const pageRef = useRef<HTMLDivElement>(null);

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

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    onLoadSuccess({ numPages })
  }

  const handleLoadError = (err: any) => {
    setError("Failed to load PDF file.")
    setIsLoading(false)
  }

  const handleMouseDown = useCallback((e: any) => {
    if (!pageRef.current) return;
    setIsDragging(true);
    const rect = pageRef.current.getBoundingClientRect();
    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setSelectionRect(null); // Reset vùng chọn khi bắt đầu kéo
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (!isDragging || !pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const x1 = Math.min(startPoint.x, currentX);
    const y1 = Math.min(startPoint.y, currentY);
    const x2 = Math.max(startPoint.x, currentX);
    const y2 = Math.max(startPoint.y, currentY);

    setSelectionRect({
      left: x1,
      top: y1,
      width: x2 - x1,
      height: y2 - y1,
    });
  }, [isDragging, startPoint]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (selectionRect && pageRef.current) {
      // Thực hiện capture vùng đã chọn
      captureArea(selectionRect);
    }
  }, [isDragging, selectionRect]);

  const captureArea = (rect: any) => {
    const canvas = pageRef?.current?.querySelector('canvas');
    if (!canvas) {
      console.error("Canvas element not found for capturing.");
      return;
    }

    const scaleX = canvas.width / canvas.offsetWidth; // Tỷ lệ giữa kích thước render và kích thước thực tế của canvas
    const scaleY = canvas.height / canvas.offsetHeight;

    // Tạo một canvas tạm thời để vẽ vùng đã chọn
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rect.width * scaleX;
    tempCanvas.height = rect.height * scaleY;
    const tempCtx = tempCanvas.getContext('2d');

    // Vẽ vùng đã chọn từ canvas gốc lên canvas tạm thời
    tempCtx?.drawImage(
      canvas,
      rect.left * scaleX,
      rect.top * scaleY,
      rect.width * scaleX,
      rect.height * scaleY,
      0, 0,
      rect.width * scaleX,
      rect.height * scaleY
    );

    // Lấy dữ liệu hình ảnh (ví dụ: base64)
    const imageData = tempCanvas.toDataURL('image/png');
    console.log('Captured image data:', imageData);
    // Ở đây bạn có thể hiển thị ảnh đã chụp, tải xuống, hoặc gửi đi
    // Ví dụ: hiển thị trong một <img>
    const img = document.createElement('img');
    img.src = imageData;
    document.body.appendChild(img); // Hoặc hiển thị trong một modal/component khác
  };

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
      <div
        className="bg-white shadow-md border border-gray-200 rounded-lg max-w-2xl w-full h-full overflow-y-auto"
        style={{ maxHeight: "55vh" }}
      >
        {/* Mock PDF Page */}
        <Document
          file={pdfUrl}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleLoadError}
          loading={
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin h-8 w-8 border-4 border-[#4045ef] border-t-transparent rounded-full mx-auto mb-4"></div>
              <div>Loading PDF...</div>
            </div>
          }
          error={
            <div className="text-center text-red-500 p-4">
              <p>Failed to load PDF file.</p>
              <p className="text-sm">Please make sure the file is a valid PDF document.</p>
            </div>
          }
        >
          <div
            ref={pageRef}
            className="relative inline-block"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Page
              pageNumber={currentPage}
              width={600}
              renderTextLayer={false}
              renderAnnotationLayer={true}
            />
            {selectionRect && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-100 opacity-50"
                style={{
                  pointerEvents: "none",
                  left: selectionRect.left,
                  top: selectionRect.top,
                  width: selectionRect.width,
                  height: selectionRect.height,
                }}
              > 
              </div>
            )}
          </div>
        </Document>
        <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-200">
          Page {currentPage} of {numPages}
        </div>
      </div>
    </div>
  )
}
