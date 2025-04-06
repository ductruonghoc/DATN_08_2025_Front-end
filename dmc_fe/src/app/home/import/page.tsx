"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ImportPDFPage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        alert("Please upload a PDF file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        alert("Please upload a PDF file")
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true)

      try {
        // Create a blob URL for the PDF file
        const pdfUrl = URL.createObjectURL(selectedFile)

        // Store the PDF URL in sessionStorage
        sessionStorage.setItem("uploadedPdfUrl", pdfUrl)
        sessionStorage.setItem("uploadedPdfName", selectedFile.name)

        // Navigate to the PDF information page
        router.push("/home/import/pdfInformation")
      } catch (error) {
        console.error("Upload failed:", error)
        setIsUploading(false)
        alert("Upload failed. Please try again.")
      }
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-[#4045ef] text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 13h6" />
                <path d="M9 17h3" />
              </svg>
            </div>
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#4045ef] text-white">
              <Upload className="h-4 w-4" />
            </div>
          </div>
        </div>

        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mb-6 cursor-pointer rounded-lg border-2 border-dashed p-8 transition-colors ${
              isDragging ? "border-[#4045ef] bg-[#f1f6ff]" : "border-gray-300"
            }`}
            onClick={handleUploadClick}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
            <p className="mb-2 text-sm text-gray-500">Drag and drop your PDF here, or click to browse</p>
            <p className="text-xs text-gray-400">Supports PDF files up to 10MB</p>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border p-4">
            <p className="mb-2 font-medium">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        <Button
          onClick={selectedFile ? handleUpload : handleUploadClick}
          className="w-full rounded-full bg-[#2D336B] py-6 text-white hover:bg-[#2d336b]/90"
          disabled={isUploading}
        >
          {isUploading ? "Processing..." : selectedFile ? "Upload PDF" : "New Upload"}
        </Button>
      </div>
    </div>
  )
}

