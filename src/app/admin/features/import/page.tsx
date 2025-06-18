"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Mail, HelpCircle, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/form/select"
import { Input } from "@/components/form/input"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ImportPDFPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [pdfName, setPdfName] = useState("")
  const [deviceName, setDeviceName] = useState("")
  const [deviceBrand, setDeviceBrand] = useState("")
  const [deviceType, setDeviceType] = useState("")
  const [showAddBrandModal, setShowAddBrandModal] = useState(false)
  const [showAddTypeModal, setShowAddTypeModal] = useState(false)
  const [newBrandName, setNewBrandName] = useState("")
  const [newTypeName, setNewTypeName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNextStep = () => {
    if (!deviceName.trim() || !deviceBrand || !deviceType) {
      toast.error("Please fill in all required device information")
      return
    }
    sessionStorage.setItem("deviceName", deviceName)
    sessionStorage.setItem("deviceBrand", deviceBrand)
    sessionStorage.setItem("deviceType", deviceType)
    setStep(2)
    toast.success("Device information saved. Please upload PDF file.")
  }

  const handleBackStep = () => setStep(1)

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
        setPdfName(file.name.replace(/\.pdf$/, ""))
      } else {
        toast.error("Please upload a PDF file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
        setPdfName(file.name.replace(/\.pdf$/, ""))
      } else {
        toast.error("Please upload a PDF file")
      }
    }
  }

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true)
      try {
        const pdfUrl = URL.createObjectURL(selectedFile)
        const finalPdfName = pdfName.trim() ? `${pdfName.trim()}.pdf` : selectedFile.name
        sessionStorage.setItem("uploadedPdfUrl", pdfUrl)
        sessionStorage.setItem("uploadedPdfName", finalPdfName)
        toast.success("PDF uploaded successfully!")
        router.push("/home/import/pdfInformation")
      } catch (error) {
        console.error("Upload failed:", error)
        setIsUploading(false)
        toast.error("Upload failed. Please try again.")
      }
    }
  }

  const handleAddBrand = () => {
    if (newBrandName.trim()) {
      toast.success(`Brand "${newBrandName}" added successfully`)
      setShowAddBrandModal(false)
      setNewBrandName("")
    } else {
      toast.error("Brand name cannot be empty")
    }
  }

  const handleAddType = () => {
    if (newTypeName.trim()) {
      toast.success(`Device type "${newTypeName}" added successfully`)
      setShowAddTypeModal(false)
      setNewTypeName("")
    } else {
      toast.error("Device type cannot be empty")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      {/* Progress Steps */}
      <div className="flex justify-center w-full max-w-lg my-4">
        <div className="flex items-center w-full">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                step >= 1 ? "bg-indigo-600 text-white" : "border-2 border-gray-300 text-gray-300"
              }`}
            >
              {step > 1 ? "✓" : "1"}
            </div>
            <span className={`text-xs ${step >= 1 ? "text-gray-800" : "text-gray-500"}`}>Device Info</span>
          </div>
          <div className={`h-0.5 flex-1 ${step >= 2 ? "bg-indigo-600" : "bg-gray-300"}`}></div>
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                step >= 2 ? "bg-indigo-600 text-white" : "border-2 border-gray-300 text-gray-300"
              }`}
            >
              {step > 2 ? "✓" : "2"}
            </div>
            <span className={`text-xs ${step >= 2 ? "text-gray-800" : "text-gray-500"}`}>PDF Upload</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-lg p-4">
        {step === 1 ? (
          /* Device Information Step */
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-white"
                  >
                    <rect width="20" height="14" x="2" y="3" rx="2" ry="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Device Information</h2>
              <p className="text-sm text-gray-600">Enter device details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Device Brand <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Select onValueChange={setDeviceBrand} value={deviceBrand}>
                    <SelectTrigger className="w-full border-gray-300 rounded focus:border-indigo-600">
                      <SelectValue placeholder="Select brand..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lenovo">Lenovo</SelectItem>
                      <SelectItem value="hp">HP</SelectItem>
                      <SelectItem value="dell">Dell</SelectItem>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="asus">Asus</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => setShowAddBrandModal(true)}
                    className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <div className="flex items-center mt-1 text-xs text-indigo-600">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  <span>Select or add a brand</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Device Type <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Select onValueChange={setDeviceType} value={deviceType}>
                    <SelectTrigger className="w-full border-gray-300 rounded focus:border-indigo-600">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="smartphone">Smartphone</SelectItem>
                      <SelectItem value="server">Server</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => setShowAddTypeModal(true)}
                    className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <div className="flex items-center mt-1 text-xs text-indigo-600">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  <span>Select or add a type</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Device Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="e.g., ThinkPad T570"
                    className="pl-8 py-2 w-full border-gray-300 rounded focus:border-indigo-600"
                  />
                </div>
                <div className="flex items-center mt-1 text-xs text-indigo-600">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  <span>Enter a unique device name</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleNextStep}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 text-base"
            >
              Continue to PDF Upload
            </Button>
          </div>
        ) : (
          /* PDF Upload Step */
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-indigo-600 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M9 13h6" />
                      <path d="M9 17h3" />
                    </svg>
                  </div>
                  <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white">
                    <Upload className="h-2 w-2" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Upload Device Manual</h2>
              <p className="text-sm text-gray-600">Upload PDF for {deviceName}</p>
            </div>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mb-4 cursor-pointer rounded border-2 border-dashed p-6 transition-colors ${
                  isDragging ? "border-indigo-600 bg-indigo-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={handleUploadClick}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Drag and drop PDF or click to browse</p>
                  <p className="text-xs text-gray-400">PDF up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="mb-4 space-y-3">
                <div className="rounded border border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="pdfName" className="block text-xs font-medium text-gray-700 mb-1">
                    PDF Name (Optional)
                  </label>
                  <Input
                    type="text"
                    id="pdfName"
                    value={pdfName}
                    onChange={(e) => setPdfName(e.target.value)}
                    placeholder="Enter custom PDF name"
                    className="w-full rounded border-gray-300 focus:border-indigo-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">Default: {selectedFile.name}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleBackStep} variant="outline" className="flex-1 rounded py-2 text-base">
                Back
              </Button>
              <Button
                onClick={selectedFile ? handleUpload : handleUploadClick}
                className="flex-1 rounded bg-indigo-600 hover:bg-indigo-700 py-2 text-base text-white"
                disabled={isUploading}
              >
                {isUploading ? "Processing..." : selectedFile ? "Process PDF" : "Select PDF"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Brand Modal */}
      {showAddBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-4 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Add New Brand</h2>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Brand Name</label>
              <Input
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="w-full"
              />
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setShowAddBrandModal(false)
                  setNewBrandName("")
                  toast.info("Action cancelled")
                }}
                variant="outline"
                className="rounded"
              >
                Cancel
              </Button>
              <Button onClick={handleAddBrand} className="bg-green-600 hover:bg-green-700 rounded">
                Add Brand
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Type Modal */}
      {showAddTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-4 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Add New Device Type</h2>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Type Name</label>
              <Input
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="Enter device type"
                className="w-full"
              />
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setShowAddTypeModal(false)
                  setNewTypeName("")
                  toast.info("Action cancelled")
                }}
                variant="outline"
                className="rounded"
              >
                Cancel
              </Button>
              <Button onClick={handleAddType} className="bg-green-600 hover:bg-green-700 rounded">
                Add Type
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}