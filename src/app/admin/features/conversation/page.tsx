"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, ChevronUp, Filter, X } from "lucide-react"
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

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedBrand(null)
    setCurrentPage(1)
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
    return allBrands
      .filter((brand) => brand[0]?.toUpperCase() === letter)
      .filter((brand) => brand.toLowerCase().includes(brandSearch.toLowerCase()))
  }

  const hasActiveFilters = selectedCategory || selectedBrand

  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Choose Your Device
          </h1>
          <p className="text-slate-600 text-sm">
            Select a device to start your conversation or skip to continue
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm font-medium px-6"
          onClick={handleSkip}
        >
          Skip
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search devices..."
            className="pl-12 pr-4 py-3 rounded-2xl border-slate-200 bg-white shadow-sm focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-slate-700 placeholder:text-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="outline"
              className={`flex items-center gap-2 rounded-2xl border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm font-medium px-6 py-3 ${
                selectedCategory ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white'
              }`}
              onClick={toggleCategoryFilter}
            >
              Category
              {selectedCategory && (
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  1
                </span>
              )}
              {showCategoryFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className={`flex items-center gap-2 rounded-2xl border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm font-medium px-6 py-3 ${
                selectedBrand ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white'
              }`}
              onClick={toggleBrandFilter}
            >
              Brand
              {selectedBrand && (
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  1
                </span>
              )}
              {showBrandFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 px-4 py-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-3 mb-6">
          {selectedCategory && (
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory(null)}
                className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedBrand && (
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Brand: {selectedBrand}
              <button
                onClick={() => setSelectedBrand(null)}
                className="ml-1 hover:bg-green-200 rounded-full p-1 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Category Filter */}
      {showCategoryFilter && (
        <div className="mb-6 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-lg backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Select Category</h3>
              <button
                onClick={() => setShowCategoryFilter(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex mb-4">
              <Input
                placeholder="Search categories..."
                className="w-full border-slate-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-8 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              {[
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
                "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
              ].map((letter) => {
                const letterCategories = getCategoriesForLetter(letter)
                if (letterCategories.length === 0) return null
                return (
                  <div key={letter} className="space-y-3">
                    <h4 className="text-lg font-bold sticky top-0 bg-white py-2 z-10 border-b border-slate-100 text-slate-800">
                      {letter}
                    </h4>
                    <div className="space-y-1">
                      {letterCategories.map((category, idx) => (
                        <button
                          key={`${letter}-${idx}`}
                          className="block w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm transition-all duration-200 text-slate-700 font-medium"
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
        <div className="mb-6 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-lg backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Select Brand</h3>
              <button
                onClick={() => setShowBrandFilter(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex mb-4">
              <Input
                placeholder="Search brands..."
                className="w-full border-slate-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-8 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              {[
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
                "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
              ].map((letter) => {
                const letterBrands = getBrandsForLetter(letter)
                if (letterBrands.length === 0) return null
                return (
                  <div key={letter} className="space-y-3">
                    <h4 className="text-lg font-bold sticky top-0 bg-white py-2 z-10 border-b border-slate-100 text-slate-800">
                      {letter}
                    </h4>
                    <div className="space-y-1">
                      {letterBrands.map((brand, idx) => (
                        <button
                          key={`${letter}-${idx}`}
                          className="block w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm transition-all duration-200 text-slate-700 font-medium"
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
      <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6 flex-1 bg-white shadow-sm">
        <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="ml-2 text-slate-600 font-medium">Loading devices...</span>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 bg-slate-50">Device Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 bg-slate-50">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 bg-slate-50">Brand</th>
                </tr>
              </thead>
              <tbody>
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center space-y-2">
                        <Search className="h-8 w-8 text-slate-300" />
                        <span className="font-medium">No devices found</span>
                        <span className="text-sm">Try adjusting your search or filters</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  devices.map((device, index) => (
                    <tr
                      key={device.device_id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      } border-b border-slate-100 hover:bg-blue-50 hover:shadow-sm cursor-pointer transition-all duration-200 group`}
                      onClick={() => handleDeviceSelect(device)}
                    >
                      <td className="py-4 px-6 text-slate-800 font-medium group-hover:text-blue-700 transition-colors">
                        {device.device_name}
                      </td>
                      <td className="py-4 px-6 text-slate-600 group-hover:text-slate-800 transition-colors">
                        {device.category}
                      </td>
                      <td className="py-4 px-6 text-slate-600 group-hover:text-slate-800 transition-colors">
                        {device.brand}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center">
        <div className="flex items-center space-x-1 bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!prevPageExisted || currentPage === 1}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium"
          >
            Previous 
          </button>
          <span className="px-4 py-2 font-semibold text-blue-700 bg-blue-50 rounded-lg border border-blue-200">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!nextPageExisted}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium"
          >
             Next 
          </button>
        </div>
      </div>
    </div>
  )
}