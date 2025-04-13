"use client"

import { useState } from "react"
import Image from "next/image"
import Navigator from "../components/navigator"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocumentProcessor() {
  const [imageDescription, setImageDescription] = useState("")
  const [showError, setShowError] = useState(false)
  const [activeTab, setActiveTab] = useState("texts")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleCheck = () => {
    // If the description is empty, show error and switch to images tab
    if (!imageDescription.trim()) {
      setShowError(true)
      setActiveTab("images")
    } else {
      setShowError(false)
      // Here you would handle the successful submission
      console.log("Document checked successfully")
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar
      <div className="w-64 bg-F-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <Menu className="h-5 w-5" />
          <div className="flex items-center gap-2">
            <Image src="/logo.svg?height=24&width=24" alt="DMC Logo" width={24} height={24} className="text-blue-700" />
            <span className="text-xl font-bold text-blue-900">TechBot</span>
          </div>
        </div>

        <div className="p-4">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 w-full rounded-md bg-white p-2 shadow-sm">
            <span className="text-gray-400">+</span> New conversation
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 w-full p-2 hover:bg-gray-100 rounded-md">
            <Upload className="h-5 w-5" />
            Upload PDF
          </button>
          <button className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 w-full p-2 hover:bg-gray-100 rounded-md">
            <Shield className="h-5 w-5" />
            Device Management
          </button>
        </nav>
      </div> */}

      <Navigator setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className={`flex flex-col
        h-screen
        overflow-hidden
      ${sidebarOpen ? "pl-[260px]" : "pl-[68px]"} grow`}>
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center border-b">
          <div></div>
          <div className="flex items-center gap-4">
            <Button variant="outline">Donat</Button>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">👤</span>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className={`bg-white p-4 border-b
          
        `}>
          <div className="flex justify-center items-center max-w-2xl mx-auto">
            <div className="flex items-center w-full">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">1</div>
                <span className="text-sm mt-1">Device Info</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2">
                <div className="h-full bg-blue-600"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">2</div>
                <span className="text-sm mt-1">Data Preprocessing</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                  3
                </div>
                <span className="text-sm mt-1">Confirmation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 p-4 flex flex-col md:flex-row gap-4
        h-[calc(100%-72px-72px-88px)]">
          <div className="flex-1 bg-white border rounded-md p-4 flex items-center justify-center
          overflow-hidden">
            <div className="max-w-md ">
              <Image
                src="/text-process.jpg?height=400&width=400"
                alt="Document Preview"
                width={350}
                height={350}
                className="mx-auto"
              />
            </div>
          </div>

          <div className="w-full md:w-96 space-y-4 h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="texts"
                  className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md mr-2 font-semibold hover:font-bold"
                >
                  Texts
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md ml-2 font-semibold hover:font-bold"
                >
                  Images
                </TabsTrigger>
              </TabsList>
              <TabsContent value="texts" className="border rounded-md p-4 bg-white h-[calc(100vh-72px-72px-88px-40px-16px-8px-16px)] overflow-y-auto">
                <div className="space-y-4">
                  <div className="border rounded-md p-3">
                    <p className="text-sm">
                      Note: For the user-installable wireless module, ensure that you use only a Lenovo-authorized
                      wireless module for the computer. Otherwise, an error message will be displayed and the computer
                      will beep when you turn on the computer.
                    </p>
                  </div>

                  <div className="border rounded-md p-3">
                    <p className="text-sm">Labels for the Windows operating systems</p>
                  </div>

                  <div className="border rounded-md p-3">
                    <p className="text-sm">Windows 7 Certificate of Authenticity</p>
                  </div>

                  <div className="border rounded-md p-3">
                    <p className="text-sm">
                      Computer models preinstalled with the Windows 7 operating system have a Certificate of
                      Authenticity label affixed to the computer cover or inside the battery compartment. The
                      Certificate of Authenticity is your indication that the computer is licensed for a Windows 7
                      product and is preinstalled with a Windows 7 genuine version. In some cases, an earlier Windows
                      version might be preinstalled under the terms of the Windows 7 Professional license downgrade
                      rights. Printed on the Certificate of Authenticity is the Windows 7 version for which the computer
                      is licensed and the Product ID. The Product ID is important when you reinstall the Windows 7
                      operating system from a source other than a Lenovo product recovery disc set.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="images" className="border rounded-md p-4 bg-white h-[400px] overflow-y-auto">
                <div className="flex flex-col h-full">
                  <div className="flex-1 border rounded-md overflow-hidden mb-4">
                    <Image
                      src="/image-process.svg?height=300&width=400"
                      alt="Device component"
                      width={400}
                      height={400}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Input image description..."
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${showError ? "border-red-500 ring-1 ring-red-500" : ""
                        }`}
                      value={imageDescription}
                      onChange={(e) => {
                        setImageDescription(e.target.value)
                        if (e.target.value.trim()) {
                          setShowError(false)
                        }
                      }}
                    />
                    {showError && (
                      <div className="mt-2 flex items-center text-red-500 text-sm">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-xs mr-2">
                          !
                        </span>
                        Please input image description before continue
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Footer */}
        <footer className="bg-white p-4 border-t flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Button>
            <span className="text-sm">1/180</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Button className="bg-green-500 hover:bg-green-600" onClick={handleCheck}>
            <Check className="h-4 w-4 mr-2" />
            Checked
          </Button>
        </footer>
      </div>
    </div >
  )
}

