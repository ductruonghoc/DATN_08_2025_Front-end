"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import BASEURL from "@/src/app/api/backend/dmc_api_gateway/baseurl"

interface Device {
  device_id: number
  device_name: string
  category: string
  brand: string
}

interface Conversation {
  id: string
  title: string
  deviceId?: string
  lastMessage: string
  timestamp: string // Store as ISO string for sessionStorage
  messages?: { id: string; content: string; sender: "user" | "ai"; timestamp: string }[]
}

export default function ConversationPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)
  const [showBrandFilter, setShowBrandFilter] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(false)
  const [prevPageExisted, setPrevPageExisted] = useState(false)
  const [nextPageExisted, setNextPageExisted] = useState(false)
  const [allBrands, setAllBrands] = useState<string[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [categorySearch, setCategorySearch] = useState("")
  const [brandSearch, setBrandSearch] = useState("")

  // Fetch devices from API
  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append("offset", currentPage.toString())
        if (searchQuery) params.append("name", searchQuery)
        if (selectedBrand) params.append("brand", selectedBrand)
        if (selectedCategory) params.append("category", selectedCategory)

        const res = await fetch(`${BASEURL}/pdf_process/devices_for_chat?${params.toString()}`)
        const json = await res.json()
        if (json.status && json.data && Array.isArray(json.data.devices)) {
          setDevices(json.data.devices)
          setPrevPageExisted(!!json.data.PrevPageExisted)
          setNextPageExisted(!!json.data.NextPageExisted)
        } else if (json.status && json.data && json.data.devices) {
          // In case devices is a single object, not array
          setDevices([json.data.devices])
          setPrevPageExisted(!!json.data.PrevPageExisted)
          setNextPageExisted(!!json.data.NextPageExisted)
        } else {
          setDevices([])
          setPrevPageExisted(false)
          setNextPageExisted(false)
        }
      } catch (e) {
        setDevices([])
        setPrevPageExisted(false)
        setNextPageExisted(false)
      }
      setLoading(false)
    }
    fetchDevices()
  }, [searchQuery, selectedBrand, selectedCategory, currentPage])

  // Fetch all brands and device types on mount
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
  }, [])


  const toggleCategoryFilter = () => {
    setShowCategoryFilter(!showCategoryFilter)
    if (showBrandFilter) setShowBrandFilter(false)
  }

  const toggleBrandFilter = () => {
    setShowBrandFilter(!showBrandFilter)
    if (showCategoryFilter) setShowCategoryFilter(false)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setShowCategoryFilter(false)
    setCurrentPage(1)
  }

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand)
    setShowBrandFilter(false)
    setCurrentPage(1)
  }

  const generateConversationId = () => {
    return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Update handleDeviceSelect to use API device fields
  const handleDeviceSelect = (device: Device) => {
    try {
      sessionStorage.setItem("selectedDeviceId", device.device_id.toString())
      router.push("/admin/features/conversation/chat/new")
    } catch (error) {
      console.error("Error saving device id to sessionStorage:", error)
    }
  }

  const handleSkip = () => {
    try {
      router.push(`/admin/features/conversation/chat/new`)
    } catch (error) {
      console.error("Error saving conversation to sessionStorage:", error)
    }
  }

  // Helper functions using fetched data
  const getCategoriesForLetter = (letter: string): string[] => {
    return allCategories
      .filter((cat) => cat[0]?.toUpperCase() === letter)
      .filter((cat) => cat.toLowerCase().includes(categorySearch.toLowerCase()))
  }
  const getBrandsForLetter = (letter: string): string[] => {
    return allBrands.filter((brand) => brand[0]?.toUpperCase() === letter)
  }

  return (
    <div className="flex flex-col h-full p-6 bg-white pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3139]">CHOOSE YOUR DEVICE</h1>
        <Button
          variant="outline"
          className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={handleSkip}
        >
          Skip
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search device"
            className="pl-9 pr-4 py-2 rounded-full border-gray-200 bg-[#f5f6fa]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>

        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-1 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={toggleCategoryFilter}
          >
            Category
            {showCategoryFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-1 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={toggleBrandFilter}
          >
            Brand
            {showBrandFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      {showCategoryFilter && (
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
          <div className="p-6">
            <div className="flex mb-4">
              <Input
                placeholder="Search categories..."
                className="w-full border-gray-300"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-8 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {[
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
              ].map((letter) => {
                const letterCategories = getCategoriesForLetter(letter)
                if (letterCategories.length === 0) return null
                return (
                  <div key={letter} className="space-y-3">
                    <h3 className="text-xl font-bold sticky top-0 bg-white py-2 z-10 border-b border-gray-100">
                      {letter}
                    </h3>
                    <div className="space-y-1">
                      {letterCategories.map((category, idx) => (
                        <button
                          key={`${letter}-${idx}`}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm transition-colors duration-150"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Brand Filter */}
      {showBrandFilter && (
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
          <div className="p-6">
            <div className="flex mb-4">
              <Input
                placeholder="Search brands..."
                className="w-full border-gray-300"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-8 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {[
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
              ].map((letter) => {
                const letterBrands = getBrandsForLetter(letter)
                if (letterBrands.length === 0) return null
                return (
                  <div key={letter} className="space-y-3">
                    <h3 className="text-xl font-bold sticky top-0 bg-white py-2 z-10 border-b border-gray-100">
                      {letter}
                    </h3>
                    <div className="space-y-1">
                      {letterBrands.map((brand, idx) => (
                        <button
                          key={`${letter}-${idx}`}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm transition-colors duration-150"
                          onClick={() => handleBrandSelect(brand)}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Device Table */}
      <div className="border border-gray-200 rounded-md overflow-hidden mb-6 flex-1">
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {loading ? (
            <div className="flex justify-center items-center h-40">Loading...</div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Device</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Brand</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device, index) => (
                  <tr
                    key={device.device_id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors`}
                    onClick={() => handleDeviceSelect(device)}
                  >
                    <td className="py-4 px-4 text-[#2e3139]">{device.device_name}</td>
                    <td className="py-4 px-4 text-[#2e3139]">{device.category}</td>
                    <td className="py-4 px-4 text-[#2e3139]">{device.brand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!prevPageExisted || currentPage === 1}
            className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ‹ Prev
          </button>
          <span className="px-3 py-1 font-semibold text-[#2d336b] bg-gray-100 rounded">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!nextPageExisted}
            className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  )
}