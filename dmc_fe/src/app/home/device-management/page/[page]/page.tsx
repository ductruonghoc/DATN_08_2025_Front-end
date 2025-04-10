"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Pagination from "../../pagination"

interface Device {
  id: string
  name: string
  category: string
  brand: string
}

export default function DeviceManagementPageNumber({ params }: { params: { page: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"category" | "brand">("category")
  const [searchQuery, setSearchQuery] = useState("")

  // Parse page number from params
  const pageNumber = Number.parseInt(params.page)

  // Validate page number and redirect if invalid
  useEffect(() => {
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 10) {
      router.push("/home/device-management")
    }
  }, [pageNumber, router])

  // Generate devices for this specific page
  const devices: Device[] = Array.from({ length: 16 }, (_, i) => {
    const deviceIndex = (pageNumber - 1) * 16 + i + 1
    return {
      id: `device-${deviceIndex}`,
      name: `Device ${deviceIndex}`,
      category: deviceIndex % 2 === 0 ? "Laptop" : "Tablet",
      brand: deviceIndex % 4 === 0 ? "Lenovo" : deviceIndex % 4 === 1 ? "HP" : deviceIndex % 4 === 2 ? "Dell" : "Apple",
    }
  })

  // Total number of pages
  const totalPages = 10

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3139]">Choose your device</h1>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-9 pr-4 py-2 rounded-full border-gray-200 bg-[#f5f6fa]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          className={`px-8 py-2 rounded-md font-medium ${
            activeTab === "category" ? "bg-[#2d336b] text-white" : "bg-white text-[#2d336b] border border-[#2d336b]"
          }`}
          onClick={() => setActiveTab("category")}
        >
          Category
        </button>
        <button
          className={`px-8 py-2 rounded-md font-medium ml-4 ${
            activeTab === "brand" ? "bg-[#2d336b] text-white" : "bg-white text-[#2d336b] border border-[#2d336b]"
          }`}
          onClick={() => setActiveTab("brand")}
        >
          Brand
        </button>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {devices.map((device) => (
          <div
            key={device.id}
            className="border border-[#2d336b] rounded-md p-4 h-24 flex items-center justify-center hover:bg-[#f1f6ff] cursor-pointer"
          >
            <span className="text-[#2d336b] font-medium">{device.name}</span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={pageNumber} totalPages={totalPages} />
    </div>
  )
}
