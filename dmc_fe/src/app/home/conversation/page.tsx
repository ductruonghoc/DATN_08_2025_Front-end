"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Device {
  id: string
  name: string
  category: string
  brand: string
}

interface Conversation {
  id: string
  title: string
  deviceId: string
  lastMessage: string
  timestamp: Date
}

export default function ConservationPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)
  const [showBrandFilter, setShowBrandFilter] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Mock conversations data
  const [conversations] = useState<Conversation[]>([
    {
      id: "chat-1685432789000-device-1",
      title: "Galaxy S25 Ultra",
      deviceId: "device-1",
      lastMessage: "How to get the screen?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "chat-1685346389000-device-4",
      title: "Aspire Vero 14 Laptop",
      deviceId: "device-4",
      lastMessage: "What's the best lens for portraits?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
  ])

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
      name: "Toshiba AW-DUN1800MV(SG)",
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
    {
      id: "device-11",
      name: "iPhone 15 Pro Max",
      category: "Smartphone",
      brand: "Apple",
    },
    {
      id: "device-12",
      name: "MacBook Pro 16-inch M3",
      category: "Laptop",
      brand: "Apple",
    },
    {
      id: "device-13",
      name: "Sony WH-1000XM5 Wireless Headphones",
      category: "Headphones",
      brand: "Sony",
    },
    {
      id: "device-14",
      name: "Canon EOS R5 Mirrorless Camera",
      category: "Camera",
      brand: "Canon",
    },
    {
      id: "device-15",
      name: "Nintendo Switch OLED",
      category: "Gaming Console",
      brand: "Nintendo",
    },
    {
      id: "device-16",
      name: "Tesla Model S Plaid",
      category: "Electric Vehicle",
      brand: "Tesla",
    },
    {
      id: "device-17",
      name: "Dyson V15 Detect Cordless Vacuum",
      category: "Vacuum Cleaner",
      brand: "Dyson",
    },
    {
      id: "device-18",
      name: "KitchenAid Artisan Stand Mixer",
      category: "Kitchen Appliance",
      brand: "KitchenAid",
    },
    {
      id: "device-19",
      name: "Nest Learning Thermostat",
      category: "Smart Home",
      brand: "Google",
    },
    {
      id: "device-20",
      name: "Ring Video Doorbell Pro 2",
      category: "Security Camera",
      brand: "Ring",
    },
    {
      id: "device-21",
      name: "Bose QuietComfort 45 Headphones",
      category: "Headphones",
      brand: "Bose",
    },
    {
      id: "device-22",
      name: "iPad Pro 12.9-inch M2",
      category: "Tablet",
      brand: "Apple",
    },
    {
      id: "device-23",
      name: "Microsoft Surface Pro 9",
      category: "Tablet",
      brand: "Microsoft",
    },
    {
      id: "device-24",
      name: "HP Spectre x360 14",
      category: "Laptop",
      brand: "HP",
    },
    {
      id: "device-25",
      name: "Lenovo ThinkPad X1 Carbon Gen 11",
      category: "Laptop",
      brand: "Lenovo",
    },
  ]

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
  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage)
  const paginatedDevices = filteredDevices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  const handleDeviceSelect = (device: Device) => {
    // Store selected device in sessionStorage
    sessionStorage.setItem("selectedDevice", JSON.stringify(device))

    // Check if there's already a conversation for this device in our mock data
    // In a real app, this would be fetched from an API or database
    const existingConversation = conversations.find((conv) => conv.deviceId === device.id)

    if (existingConversation) {
      // If conversation exists, navigate to it
      router.push(`/home/conservation/chat/${existingConversation.id}`)
    } else {
      // If no conversation exists, create a new one with a logical ID
      const newChatId = `chat-${Date.now()}-${device.id}`

      // In a real app, you would save this new conversation to your database
      // For our mock implementation, we'll store it in sessionStorage
      const newConversation = {
        id: newChatId,
        title: device.name,
        deviceId: device.id,
        lastMessage: "",
        timestamp: new Date(),
      }

      // Store the new conversation in sessionStorage
      const existingConversations = JSON.parse(sessionStorage.getItem("conversations") || "[]")
      sessionStorage.setItem("conversations", JSON.stringify([...existingConversations, newConversation]))

      // Navigate to the new chat
      router.push(`/home/conservation/chat/${newChatId}`)
    }
  }

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // Enhanced helper functions with more comprehensive data
  const getCategoriesForLetter = (letter: string): string[] => {
    const allCategories = {
      A: [
        "Air conditioner",
        "Air fryer",
        "Air purifier",
        "Alarm clock",
        "Audio equipment",
        "Amplifier",
        "Antenna",
        "Adapter",
      ],
      B: [
        "Barcode scanner",
        "Battery charger",
        "Blender",
        "Bluetooth speaker",
        "Boiler",
        "Bread maker",
        "Binoculars",
        "Bicycle",
      ],
      C: ["Camera", "Computer", "Cooker", "Coffee maker", "Ceiling fan", "Charger", "Clock", "Cleaner", "Calculator"],
      D: ["Dishwasher", "Dryer", "Drone", "Digital camera", "DVD player", "Dehumidifier", "Desk lamp", "Door bell"],
      E: [
        "Electric kettle",
        "Electric toothbrush",
        "Earphones",
        "Electric grill",
        "Exercise bike",
        "Electric blanket",
        "Espresso machine",
      ],
      F: [
        "Fan",
        "Freezer",
        "Food processor",
        "Fitness tracker",
        "Flash drive",
        "Fire alarm",
        "Fax machine",
        "Flashlight",
      ],
      G: ["Gaming console", "GPS device", "Guitar", "Garage door opener", "Gas stove", "Grinder", "Generator", "Grill"],
      H: ["Hair dryer", "Headphones", "Heater", "Humidifier", "Home theater", "Hard drive", "Helmet", "Hand mixer"],
      I: ["Ice maker", "Iron", "Incubator", "Intercom", "Inverter", "iPad", "iPhone", "Induction cooker"],
      J: ["Juicer", "Jukebox", "Joystick", "Jacket", "Jet ski"],
      K: ["Kettle", "Keyboard", "Keurig", "Kitchen scale", "Knife sharpener"],
      L: ["Laptop", "Lawnmower", "LED light", "Lamp", "Laser printer", "Loudspeaker", "Lock", "Ladder"],
      M: ["Microwave", "Monitor", "Mouse", "Mixer", "Modem", "Mobile phone", "Music player", "Massage chair"],
      N: ["Network router", "Nintendo", "Notebook", "Night light", "Nail dryer", "Navigation system"],
      O: ["Oven", "Oscilloscope", "Outdoor grill", "Oil heater", "Optical drive"],
      P: ["Printer", "Projector", "Phone", "Power bank", "Pressure cooker", "PlayStation", "Piano", "Purifier"],
      Q: ["Quadcopter", "Quartz heater"],
      R: ["Refrigerator", "Remote control", "Radio", "Router", "Rice cooker", "Robotic vacuum", "Record player"],
      S: [
        "Scanner",
        "Shaver",
        "Speaker",
        "Smartphone",
        "Smartwatch",
        "Smart TV",
        "Stereo",
        "Security camera",
        "Sewing machine",
      ],
      T: ["Tablet", "Television", "Toaster", "Treadmill", "Trimmer", "Turntable", "Thermometer", "Timer"],
      U: ["USB drive", "Umbrella", "UPS", "Ultrasonic cleaner"],
      V: ["Vacuum cleaner", "VR headset", "Video camera", "Ventilator", "Voice recorder", "Voltage regulator"],
      W: ["Washing machine", "Water heater", "Webcam", "WiFi router", "Watch", "Walkie talkie", "Weather station"],
      X: ["Xbox", "X-ray machine"],
      Y: ["Yoga mat", "Yard trimmer"],
      Z: ["Zoom lens", "Zone heater"],
    }

    return allCategories[letter] || []
  }

  const getBrandsForLetter = (letter: string): string[] => {
    const allBrands = {
      A: ["Acer", "Alienware", "Apple", "Asus", "AMD", "Amazon", "Anker", "AOC", "Aorus", "Avermedia"],
      B: ["Bang & Olufsen", "BenQ", "BlackBerry", "Bosch", "Bose", "Brother", "Buffalo", "Beats", "Belkin"],
      C: ["Canon", "CyberPowerPC", "Corsair", "Cooler Master", "Cisco", "Crucial", "Creative", "Chromebook", "Compaq"],
      D: ["Dell", "Dyson", "DJI", "D-Link", "Drobo", "Ducky", "Dahua", "Denon"],
      E: ["Electrolux", "Epson", "EVGA", "Eizo", "Elgato", "Element", "Ericsson", "EKWB", "Edifier"],
      F: ["Fitbit", "Fujitsu", "Fractal Design", "Fujifilm", "Fossil", "Foscam", "Filco"],
      G: ["Google", "GoPro", "Gigabyte", "Garmin", "Grado", "G.Skill", "Gateway", "Glorious"],
      H: ["Harman Kardon", "HP", "Huawei", "HyperX", "HTC", "Hisense", "Honeywell", "Hikvision"],
      I: ["ICONIQ Motors", "Infinix", "iRobot", "Intel", "IBM", "Insta360", "Inwin", "Iiyama", "Incase", "Iomega"],
      J: ["Jam Audio", "JBL", "JVC", "Jabra", "Jura", "Juniper", "Jaybird", "Jamo"],
      K: ["Kenwood", "KitchenAid", "Kingston", "Keychron", "Kensington", "Kyocera", "Klipsch", "Kodak", "Koss"],
      L: ["LG", "Lenovo", "Logitech", "Lexar", "Lian Li", "Leopold", "Linksys", "Leica"],
      M: ["Microsoft", "Motorola", "MSI", "Micron", "Marshall", "Miele", "Maxtor", "Monoprice"],
      N: ["Nintendo", "Nokia", "Nikon", "NZXT", "Netgear", "NEC", "Noctua"],
      O: ["OnePlus", "Oppo", "Olympus", "Oculus", "OWC", "Optoma", "Orico"],
      P: ["Panasonic", "Philips", "Pioneer", "PNY", "Patriot", "Polk Audio", "Pentax"],
      Q: ["Qualcomm", "Qnap", "Quantum", "Quanta", "Qpad"],
      R: ["Razer", "Roku", "Raspberry Pi", "Roland", "Rosewill", "Ricoh", "Realtek", "Rode"],
      S: ["Samsung", "Sharp", "Sony", "Seagate", "SteelSeries", "Sennheiser", "Synology", "Sapphire"],
      T: ["TCL", "Toshiba", "Tronsmart", "Thermaltake", "Thrustmaster", "Turtle Beach", "Tenda", "Tyan"],
      U: ["Ultratec", "Ultimate Ears", "Uniden", "Ugreen", "Urbanears", "Ultrasone"],
      V: ["Vizio", "ViewSonic", "Varmilo", "Vantec", "Verbatim", "Verizon", "Vivo", "Velodyne"],
      W: ["Western Digital", "Whirlpool", "Wacom", "Withings", "Wiko", "Westone", "Wyze", "Wharfedale"],
      X: ["Xiaomi", "Xbox", "XFX", "Xerox", "X-Rite", "XYZprinting"],
      Y: ["Yamaha", "Yubikey", "Yealink", "Yubico", "Yanmai", "Yeston"],
      Z: ["Zotac", "ZTE", "Zalman", "Zebra", "Zowie", "Zoom", "Zhiyun"],
    }

    return allBrands[letter] || []
  }

  return (
    <div className="flex flex-col h-full p-6 bg-white pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3139]">CHOOSE YOUR DEVICE</h1>
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

      {/* Category Filter - Made taller and more comprehensive */}
      {showCategoryFilter && (
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
          <div className="p-6">
            <div className="flex mb-4">
              <Input
                placeholder="Search categories..."
                className="w-full border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Increased height from 400px to 600px for better visibility */}
            <div className="grid grid-cols-3 gap-8 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {/* Generate category sections dynamically */}
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

                // Only show sections that have categories
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

      {/* Brand Filter - Made taller and more comprehensive */}
      {showBrandFilter && (
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
          <div className="p-6">
            <div className="flex mb-4">
              <Input
                placeholder="Search brands..."
                className="w-full border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Increased height from 400px to 600px for better visibility */}
            <div className="grid grid-cols-3 gap-8 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {/* Generate brand sections dynamically */}
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

                // Only show sections that have brands
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
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-4 font-medium text-gray-600">Device</th>
                <th className="text-left py-4 px-4 font-medium text-gray-600">Category</th>
                <th className="text-left py-4 px-4 font-medium text-gray-600">Brand</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDevices.map((device, index) => (
                <tr
                  key={device.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors`}
                  onClick={() => handleDeviceSelect(device)}
                >
                  <td className="py-4 px-4 text-[#2e3139]">{device.name}</td>
                  <td className="py-4 px-4 text-[#2e3139]">{device.category}</td>
                  <td className="py-4 px-4 text-[#2e3139]">{device.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ‹
          </button>

          {getPaginationNumbers().map((pageNumber, index) =>
            pageNumber === "..." ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={`page-${pageNumber}`}
                onClick={() => setCurrentPage(pageNumber as number)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNumber ? "bg-[#2d336b] text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </div>
  )
}
