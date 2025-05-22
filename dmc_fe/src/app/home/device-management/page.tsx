"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, MoreVertical, Pen, Trash2, ChevronDown, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Device {
  id: string
  name: string
  category: string
  brand: string
}

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

export default function DeviceManagementPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("device")
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeCategoryMenu, setActiveCategoryMenu] = useState<string | null>(null)
  const [activeBrandMenu, setActiveBrandMenu] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const categoryMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const brandMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const [categorySearchQuery, setCategorySearchQuery] = useState("")
  const [brandSearchQuery, setBrandSearchQuery] = useState("")

  // Mock devices data
  const devices: Device[] = [
    {
      id: "device-1",
      name: "Galaxy S25 Ultra",
      category: "Smartphone",
      brand: "Samsung",
    },
    {
      id: "device-2",
      name: "Titan 18V 1 × 5Ah Li-Ion EXT Cordless Lawnmower & Grass Trimmer Set",
      category: "Lawnmower",
      brand: "Titan",
    },
    {
      id: "device-3",
      name: "Bosch EasyGrassCut / EasyMower 18V 1 × 4.0Ah Li-Ion Power for All Cordless Landscape",
      category: "Lawnmower",
      brand: "Bosch",
    },
    {
      id: "device-4",
      name: "Aspire Vero 14 Laptop - AV14-52P-55N4",
      category: "Laptop",
      brand: "Acer",
    },
    {
      id: "device-5",
      name: "TV LG QNED 75QNED80TSA",
      category: "Smart TV",
      brand: "LG",
    },
    {
      id: "device-6",
      name: "AQUA Refrigerator Inverter AQR-T238FA(FB)",
      category: "Refrigerator",
      brand: "Aqua",
    },
    {
      id: "device-7",
      name: "Toshiba AW-DUN1600MV(SG)",
      category: "Washing Machine",
      brand: "Toshiba",
    },
    {
      id: "device-8",
      name: "MITSUBISHI ELECTRIC MSY-JW60VF",
      category: "Air Conditioner",
      brand: "Mitsubishi",
    },
    {
      id: "device-9",
      name: "Dell Inspiron 15 3520",
      category: "Laptop",
      brand: "Dell",
    },
    {
      id: "device-10",
      name: "Xiaomi Redmi Note 14 Pro+",
      category: "Smartphone",
      brand: "Xiaomi",
    },
  ]

  // Mock categories data
  const categories: Category[] = [
    { id: "cat-1", name: "Air Conditioner" },
    { id: "cat-2", name: "Alarm Clock" },
    { id: "cat-3", name: "Air Conditioner" },
    { id: "cat-4", name: "Air Conditioner" },
    { id: "cat-5", name: "Air Conditioner" },
    { id: "cat-6", name: "Air Conditioner" },
    { id: "cat-7", name: "Air Conditioner" },
    { id: "cat-8", name: "Air Conditioner" },
    { id: "cat-9", name: "Air Conditioner" },
    { id: "cat-10", name: "Air Conditioner" },
    { id: "cat-11", name: "Air Conditioner" },
    { id: "cat-12", name: "Air Conditioner" },
  ]

  // Mock brands data
  const brands: Brand[] = [
    { id: "brand-1", name: "Lenovo" },
    { id: "brand-2", name: "LG" },
    { id: "brand-3", name: "Logitech" },
  ]

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) => {
    if (categorySearchQuery) {
      return category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    }
    return true
  })

  // Filter brands based on search query
  const filteredBrands = brands.filter((brand) => {
    if (brandSearchQuery) {
      return brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
    }
    return true
  })

  // Filter devices based on search query
  const filteredDevices = devices.filter((device) => {
    if (searchQuery) {
      return (
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage)
  const paginatedDevices = filteredDevices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleMenu = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveMenu(activeMenu === deviceId ? null : deviceId)
  }

  const toggleCategoryMenu = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveCategoryMenu(activeCategoryMenu === categoryId ? null : categoryId)
  }

  const toggleBrandMenu = (brandId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveBrandMenu(activeBrandMenu === brandId ? null : brandId)
  }

  const handleEditDevice = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Edit device:", deviceId)
    setActiveMenu(null)
  }

  const handleDeleteDevice = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Delete device:", deviceId)
    setActiveMenu(null)
  }

  const handleEditCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Edit category:", categoryId)
    setActiveCategoryMenu(null)
  }

  const handleDeleteCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Delete category:", categoryId)
    setActiveCategoryMenu(null)
  }

  const handleEditBrand = (brandId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Edit brand:", brandId)
    setActiveBrandMenu(null)
  }

  const handleDeleteBrand = (brandId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Delete brand:", brandId)
    setActiveBrandMenu(null)
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !menuRefs.current[activeMenu]?.contains(event.target as Node)) {
        setActiveMenu(null)
      }
      if (activeCategoryMenu && !categoryMenuRefs.current[activeCategoryMenu]?.contains(event.target as Node)) {
        setActiveCategoryMenu(null)
      }
      if (activeBrandMenu && !brandMenuRefs.current[activeBrandMenu]?.contains(event.target as Node)) {
        setActiveBrandMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeMenu, activeCategoryMenu, activeBrandMenu])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full overflow-auto">
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`px-6 py-3 text-center ${
            activeTab === "device"
              ? "bg-[#2d336b] text-white"
              : "bg-white text-[#2d336b] hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("device")}
        >
          Device
        </button>
        <button
          className={`px-6 py-3 text-center ${
            activeTab === "brand-category"
              ? "bg-[#2d336b] text-white"
              : "bg-white text-[#2d336b] hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("brand-category")}
        >
          Brand & Category
        </button>
      </div>

      {/* Device Tab Content */}
      {activeTab === "device" && (
        <div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search device"
                  className="pl-9 pr-4 py-2 rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Sort by:</span>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-1 rounded-full border-gray-200">
                    Category
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1 rounded-full border-gray-200">
                    Brand
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Device</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Brand</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 text-[#2e3139] dark:text-white">{device.name}</td>
                    <td className="py-3 px-4 text-[#2e3139] dark:text-white">{device.category}</td>
                    <td className="py-3 px-4 text-[#2e3139] dark:text-white">{device.brand}</td>
                    <td className="py-3 px-4 relative">
                      <button
                        onClick={(e) => toggleMenu(device.id, e)}
                        className="text-gray-500 hover:text-[#4045ef] dark:text-gray-400 dark:hover:text-white"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {activeMenu === device.id && (
                        <div
                          ref={(el) => (menuRefs.current[device.id] = el)}
                          className="absolute right-10 top-4 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 w-40"
                        >
                          <button
                            onClick={(e) => handleEditDevice(device.id, e)}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#2e3139] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Pen className="h-4 w-4" />
                            <span>Edit device</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteDevice(device.id, e)}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete device</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center p-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                «
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNumber = i + 1
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={currentPage === pageNumber ? "bg-[#2d336b]" : ""}
                  >
                    {pageNumber}
                  </Button>
                )
              })}

              {totalPages > 5 && <span>...</span>}

              {totalPages > 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(10)}
                  className={currentPage === 10 ? "bg-[#2d336b] text-white" : ""}
                >
                  10
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Brand & Category Tab Content */}
      {activeTab === "brand-category" && (
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Category Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Category</h2>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-9 pr-4 py-2 rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                />
              </div>
              <div className="border rounded-md overflow-hidden">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="text-[#2e3139] dark:text-white">{category.name}</span>
                    <div className="relative">
                      <button
                        onClick={(e) => toggleCategoryMenu(category.id, e)}
                        className="text-gray-500 hover:text-[#4045ef] dark:text-gray-400 dark:hover:text-white"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {activeCategoryMenu === category.id && (
                        <div
                          ref={(el) => (categoryMenuRefs.current[category.id] = el)}
                          className="absolute right-0 top-full mt-1 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 w-40"
                        >
                          <button
                            onClick={(e) => handleEditCategory(category.id, e)}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#2e3139] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Pen className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteCategory(category.id, e)}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Brand</h2>
              <div className="flex justify-between items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="pl-9 pr-4 py-2 rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    value={brandSearchQuery}
                    onChange={(e) => setBrandSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="ml-2 bg-white border border-gray-200 rounded-md p-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                </Button>
              </div>
              <div className="border rounded-md overflow-hidden">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="text-[#2e3139] dark:text-white">{brand.name}</span>
                    <div className="relative">
                      <button
                        onClick={(e) => toggleBrandMenu(brand.id, e)}
                        className="text-gray-500 hover:text-[#4045ef] dark:text-gray-400 dark:hover:text-white"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {activeBrandMenu === brand.id && (
                        <div
                          ref={(el) => (brandMenuRefs.current[brand.id] = el)}
                          className="absolute right-0 top-full mt-1 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 w-40"
                        >
                          <button
                            onClick={(e) => handleEditBrand(brand.id, e)}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#2e3139] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Pen className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteBrand(brand.id, e)}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
