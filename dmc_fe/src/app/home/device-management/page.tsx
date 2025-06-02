"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, MoreVertical, Pen, Trash2, ChevronDown, Plus } from "lucide-react"
import { Input } from "@/components/form/input"
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
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const categoryMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const brandMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const [categorySearchQuery, setCategorySearchQuery] = useState("")
  const [brandSearchQuery, setBrandSearchQuery] = useState("")

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showAddBrandModal, setShowAddBrandModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [showEditBrandModal, setShowEditBrandModal] = useState(false)
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)
  const [showDeleteBrandModal, setShowDeleteBrandModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newBrandName, setNewBrandName] = useState("")
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editBrandName, setEditBrandName] = useState("")

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
      name: "Bosch EasyGrassCut / EasyMower 18V 1 × 4.0Ah Li-Ion Power for All Cordless Landscape...",
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
    { id: "cat-3", name: "Smartphone" },
    { id: "cat-4", name: "Laptop" },
    { id: "cat-5", name: "Smart TV" },
    { id: "cat-6", name: "Refrigerator" },
    { id: "cat-7", name: "Washing Machine" },
    { id: "cat-8", name: "Lawnmower" },
  ]

  // Mock brands data
  const brands: Brand[] = [
    { id: "brand-1", name: "Brand 1" },
    { id: "brand-2", name: "Brand 2" },
    { id: "brand-3", name: "Brand 3" },
    { id: "brand-4", name: "Brand 4" },
    { id: "brand-5", name: "Brand 5" },
    { id: "brand-6", name: "Brand 6" },
    { id: "brand-7", name: "Brand 7" },
    { id: "brand-8", name: "Brand 8" },
    { id: "brand-9", name: "Brand 9" },
    { id: "brand-10", name: "Brand 10" },
    { id: "brand-11", name: "Brand 11" },
    { id: "brand-12", name: "Brand 12" },
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

  // Filter devices based on search query and selected filters
  const filteredDevices = devices.filter((device) => {
    let matches = true

    if (searchQuery) {
      matches =
        matches &&
        (device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedCategory) {
      matches = matches && device.category === selectedCategory
    }

    if (selectedBrand) {
      matches = matches && device.brand === selectedBrand
    }

    return matches
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
    const category = categories.find((c) => c.id === categoryId)
    if (category) {
      setEditingCategory(category)
      setEditCategoryName(category.name)
      setShowEditCategoryModal(true)
    }
    setActiveCategoryMenu(null)
  }

  const handleDeleteCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const category = categories.find((c) => c.id === categoryId)
    if (category) {
      setDeletingCategory(category)
      setShowDeleteCategoryModal(true)
    }
    setActiveCategoryMenu(null)
  }

  const handleEditBrand = (brandId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const brand = brands.find((b) => b.id === brandId)
    if (brand) {
      setEditingBrand(brand)
      setEditBrandName(brand.name)
      setShowEditBrandModal(true)
    }
    setActiveBrandMenu(null)
  }

  const handleDeleteBrand = (brandId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const brand = brands.find((b) => b.id === brandId)
    if (brand) {
      setDeletingBrand(brand)
      setShowDeleteBrandModal(true)
    }
    setActiveBrandMenu(null)
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: newCategoryName.trim(),
      }
      // In a real app, you would add this to your state/database
      console.log("Adding category:", newCategory)
      setNewCategoryName("")
      setShowAddCategoryModal(false)
    }
  }

  const handleAddBrand = () => {
    if (newBrandName.trim()) {
      const newBrand: Brand = {
        id: `brand-${Date.now()}`,
        name: newBrandName.trim(),
      }
      // In a real app, you would add this to your state/database
      console.log("Adding brand:", newBrand)
      setNewBrandName("")
      setShowAddBrandModal(false)
    }
  }

  const handleConfirmEditCategory = () => {
    if (editingCategory && editCategoryName.trim()) {
      // In a real app, you would update this in your state/database
      console.log("Editing category:", editingCategory.id, "to:", editCategoryName)
      setShowEditCategoryModal(false)
      setEditingCategory(null)
      setEditCategoryName("")
    }
  }

  const handleConfirmEditBrand = () => {
    if (editingBrand && editBrandName.trim()) {
      // In a real app, you would update this in your state/database
      console.log("Editing brand:", editingBrand.id, "to:", editBrandName)
      setShowEditBrandModal(false)
      setEditingBrand(null)
      setEditBrandName("")
    }
  }

  const handleConfirmDeleteCategory = () => {
    if (deletingCategory) {
      // In a real app, you would delete this from your state/database
      console.log("Deleting category:", deletingCategory.id)
      setShowDeleteCategoryModal(false)
      setDeletingCategory(null)
    }
  }

  const handleConfirmDeleteBrand = () => {
    if (deletingBrand) {
      // In a real app, you would delete this from your state/database
      console.log("Deleting brand:", deletingBrand.id)
      setShowDeleteBrandModal(false)
      setDeletingBrand(null)
    }
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
    <div className="bg-white rounded-lg shadow-sm h-full overflow-auto p-6">
      {/* Bookmark-style Tab Navigation */}
      <div className="mb-6">
        {/* Tab Headers - Bookmark style */}
        <div className="flex gap-1 mb-0">
          <button
            className={`px-6 py-3 text-center transition-all duration-200 relative ${
              activeTab === "device"
                ? "bg-[#2d336b] text-white border border-[#2d336b] z-20"
                : "bg-white text-[#2d336b] border border-gray-300 hover:bg-gray-50 z-10"
            }`}
            onClick={() => setActiveTab("device")}
            style={{
              borderTopLeftRadius: "0.5rem",
              borderTopRightRadius: "0.5rem",
              borderBottom: activeTab === "device" ? "none" : "1px solid #d1d5db",
              marginBottom: activeTab === "device" ? "0" : "-1px",
            }}
          >
            Device
          </button>
          <button
            className={`px-6 py-3 text-center transition-all duration-200 relative ${
              activeTab === "brand-category"
                ? "bg-[#2d336b] text-white border border-[#2d336b] z-20"
                : "bg-white text-[#2d336b] border border-gray-300 hover:bg-gray-50 z-10"
            }`}
            onClick={() => setActiveTab("brand-category")}
            style={{
              borderTopLeftRadius: "0.5rem",
              borderTopRightRadius: "0.5rem",
              borderBottom: activeTab === "brand-category" ? "none" : "1px solid #d1d5db",
              marginBottom: activeTab === "brand-category" ? "0" : "-1px",
            }}
          >
            Brand & Category
          </button>
        </div>

        {/* Content Area - with border that active tab overlaps */}
        <div
          className="bg-white border border-gray-300 rounded-lg rounded-tl-none"
          style={{
            borderTopLeftRadius: activeTab === "device" ? "0" : "0.5rem",
          }}
        >
          {/* Device Tab Content */}
          {activeTab === "device" && (
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search device"
                    className="pl-9 pr-4 py-2 rounded-md border-gray-300 bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>

                <div className="relative">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 rounded-md border-gray-300 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      setShowCategoryDropdown(!showCategoryDropdown)
                      setShowBrandDropdown(false)
                    }}
                  >
                    Category
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  {showCategoryDropdown && (
                    <div className="absolute top-full mt-1 w-[800px] right-0 bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-96 overflow-y-auto">
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-8">
                          {/* Column A-F */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-bold mb-2">A</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Air conditioner")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Air conditioner
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Air fryer")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Air fryer
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Air purifier")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Air purifier
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Alarm clock")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Alarm clock
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">B</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Barcode scanner")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Barcode scanner
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Battery charger")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Battery charger
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Blender")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Blender
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Bluetooth speaker")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Bluetooth speaker
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">C</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Camera")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Camera
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Computer")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Computer
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Cooker")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Cooker
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Column G-M */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-bold mb-2">H</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Hair dryer")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Hair dryer
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Headphones")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Headphones
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Heater")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Heater
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Humidifier")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Humidifier
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">I</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Ice maker")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Ice maker
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Iron")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Iron
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Incubator")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Incubator
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">J</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Juicer")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Juicer
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">K</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Kettle")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Kettle
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Column N-Z */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-bold mb-2">S</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Scanner")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Scanner
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Shaver")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Shaver
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Speaker")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Speaker
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Smartphone")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Smartphone
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Smartwatch")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Smartwatch
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">T</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Tablet")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Tablet
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Television")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Television
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Toaster")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Toaster
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Treadmill")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Treadmill
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("Trimmer")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  Trimmer
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">U</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("USB drive")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  USB drive
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedCategory("USC")
                                    setShowCategoryDropdown(false)
                                  }}
                                >
                                  USC
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 rounded-md border-gray-300 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      setShowBrandDropdown(!showBrandDropdown)
                      setShowCategoryDropdown(false)
                    }}
                  >
                    Brand
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  {showBrandDropdown && (
                    <div className="absolute top-full mt-1 w-[800px] right-0 bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-96 overflow-y-auto">
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-8">
                          {/* Column A-F */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-bold mb-2">A</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Acer")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Acer
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Alienware")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Alienware
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Apple")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Apple
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Asus")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Asus
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">B</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Bang & Olufsen")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Bang & Olufsen
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("BenQ")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  BenQ
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("BlackBerry")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  BlackBerry
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Bosch")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Bosch
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">C</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Canon")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Canon
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("CyberPowerPC")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  CyberPowerPC
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("CyberQuest")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  CyberQuest
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Column G-M */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-bold mb-2">H</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Harman Kardon")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Harman Kardon
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("HP")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  HP
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Huawei")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Huawei
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("HyperX")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  HyperX
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">I</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("ICONIQ Motors")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  ICONIQ Motors
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Infinix")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Infinix
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("iRobot")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  iRobot
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">J</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Jam Audio")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Jam Audio
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("JBL")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  JBL
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("JVC")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  JVC
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("J-TEC")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  J-TEC
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Column N-Z */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-bold mb-2">S</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Samsung")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Samsung
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Sharp")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Sharp
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Sony")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Sony
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">T</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("TCL")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  TCL
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Toshiba")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Toshiba
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Tronsmart")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Tronsmart
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">U</h3>
                              <div className="space-y-1">
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Ultratec")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Ultratec
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Unicom Electrics")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Unicom Electrics
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("UniRoss")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  UniRoss
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("UpRight")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  UpRight
                                </button>
                                <button
                                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                  onClick={() => {
                                    setSelectedBrand("Unisys")
                                    setShowBrandDropdown(false)
                                  }}
                                >
                                  Unisys
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Device</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Brand</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDevices.map((device) => (
                      <tr key={device.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-[#2e3139]">{device.name}</td>
                        <td className="py-3 px-4 text-[#2e3139]">{device.category}</td>
                        <td className="py-3 px-4 text-[#2e3139]">{device.brand}</td>
                        <td className="py-3 px-4 relative">
                          <button
                            onClick={(e) => toggleMenu(device.id, e)}
                            className="text-gray-500 hover:text-[#4045ef]"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>

                          {activeMenu === device.id && (
                            <div
                              ref={(el) => (menuRefs.current[device.id] = el)}
                              className="absolute right-10 top-4 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40"
                            >
                              <button
                                onClick={(e) => handleEditDevice(device.id, e)}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#2e3139] hover:bg-gray-100"
                              >
                                <Pen className="h-4 w-4" />
                                <span>Edit device</span>
                              </button>
                              <button
                                onClick={(e) => handleDeleteDevice(device.id, e)}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-center flex-1">Category</h2>
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search"
                          className="pl-9 pr-4 py-2 rounded-md border-gray-300 bg-gray-50"
                          value={categorySearchQuery}
                          onChange={(e) => setCategorySearchQuery(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => setShowAddCategoryModal(true)}
                        className="bg-[#2D336B] rounded-full p-2 hover:bg-[#1e2347] transition-colors"
                      >
                        <Plus className="h-5 w-5 text-white" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                        >
                          <span className="text-[#2e3139]">{category.name}</span>
                          <div className="relative">
                            <button
                              onClick={(e) => toggleCategoryMenu(category.id, e)}
                              className="text-gray-500 hover:text-[#4045ef]"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>

                            {activeCategoryMenu === category.id && (
                              <div
                                ref={(el) => (categoryMenuRefs.current[category.id] = el)}
                                className="absolute right-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40"
                              >
                                <button
                                  onClick={(e) => handleEditCategory(category.id, e)}
                                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#2e3139] hover:bg-gray-100"
                                >
                                  <Pen className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={(e) => handleDeleteCategory(category.id, e)}
                                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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

                {/* Brand Section */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-center flex-1">Brand</h2>
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search"
                          className="pl-9 pr-4 py-2 rounded-md border-gray-300 bg-gray-50"
                          value={brandSearchQuery}
                          onChange={(e) => setBrandSearchQuery(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => setShowAddBrandModal(true)}
                        className="bg-[#2D336B] rounded-full p-2 hover:bg-[#1e2347] transition-colors"
                      >
                        <Plus className="h-5 w-5 text-white" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredBrands.map((brand) => (
                        <div key={brand.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                          <span className="text-[#2e3139]">{brand.name}</span>
                          <div className="relative">
                            <button
                              onClick={(e) => toggleBrandMenu(brand.id, e)}
                              className="text-gray-500 hover:text-[#4045ef]"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>

                            {activeBrandMenu === brand.id && (
                              <div
                                ref={(el) => (brandMenuRefs.current[brand.id] = el)}
                                className="absolute right-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40"
                              >
                                <button
                                  onClick={(e) => handleEditBrand(brand.id, e)}
                                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#2e3139] hover:bg-gray-100"
                                >
                                  <Pen className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={(e) => handleDeleteBrand(brand.id, e)}
                                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-[#2e3139]">Add a category</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2e3139] mb-2">Name:</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Lawn Mower"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4045ef]"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowAddCategoryModal(false)
                  setNewCategoryName("")
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {showAddBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-[#2e3139]">Add a brand</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2e3139] mb-2">Name:</label>
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Lawn Mower"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4045ef]"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowAddBrandModal(false)
                  setNewBrandName("")
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBrand}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-[#2e3139]">Edit category</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2e3139] mb-2">Name:</label>
              <input
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4045ef]"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowEditCategoryModal(false)
                  setEditingCategory(null)
                  setEditCategoryName("")
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEditCategory}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {showEditBrandModal && editingBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-[#2e3139]">Edit brand</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2e3139] mb-2">Name:</label>
              <input
                type="text"
                value={editBrandName}
                onChange={(e) => setEditBrandName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4045ef]"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowEditBrandModal(false)
                  setEditingBrand(null)
                  setEditBrandName("")
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEditBrand}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteCategoryModal && deletingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-[#2e3139]">Are you sure you want to delete this category?</h2>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowDeleteCategoryModal(false)
                  setDeletingCategory(null)
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteCategory}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Brand Modal */}
      {showDeleteBrandModal && deletingBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-[#2e3139]">Are you sure you want to delete this brand?</h2>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowDeleteBrandModal(false)
                  setDeletingBrand(null)
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteBrand}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
