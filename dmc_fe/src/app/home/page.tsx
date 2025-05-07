import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Settings, MessageSquare } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-[#2d336b]">Welcome to QueryPDF</h1>
        <p className="mb-12 text-center text-gray-600">
          Your intelligent PDF assistant. Upload, manage, and interact with your documents.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload PDF Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#f1f6ff] flex items-center justify-center mr-4">
                <Upload className="h-5 w-5 text-[#4045ef]" />
              </div>
              <h2 className="text-xl font-semibold text-[#2e3139]">Upload PDF</h2>
            </div>
            <p className="text-gray-600 mb-6">Upload your PDF documents and start querying them instantly.</p>
            <Link href="/home/import">
              <Button className="w-full rounded-md bg-[#4045ef] text-white hover:bg-[#2d336b]/90">Upload a PDF</Button>
            </Link>
          </div>

          {/* New Conversation Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#f1f6ff] flex items-center justify-center mr-4">
                <MessageSquare className="h-5 w-5 text-[#4045ef]" />
              </div>
              <h2 className="text-xl font-semibold text-[#2e3139]">New Conversation</h2>
            </div>
            <p className="text-gray-600 mb-6">Start a new conversation with your PDF assistant.</p>
            <Link href="/home/conservation">
              <Button className="w-full rounded-md bg-[#4045ef] text-white hover:bg-[#2d336b]/90">
                Start Conversation
              </Button>
            </Link>
          </div>

          {/* Track Progress Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#f1f6ff] flex items-center justify-center mr-4">
                <FileText className="h-5 w-5 text-[#4045ef]" />
              </div>
              <h2 className="text-xl font-semibold text-[#2e3139]">Track Progress</h2>
            </div>
            <p className="text-gray-600 mb-6">Monitor the processing status of your PDF documents.</p>
            <Link href="/home/track-progress/tracking">
              <Button className="w-full rounded-md bg-[#4045ef] text-white hover:bg-[#2d336b]/90">View Progress</Button>
            </Link>
          </div>

          {/* Device Management Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#f1f6ff] flex items-center justify-center mr-4">
                <Settings className="h-5 w-5 text-[#4045ef]" />
              </div>
              <h2 className="text-xl font-semibold text-[#2e3139]">Device Management</h2>
            </div>
            <p className="text-gray-600 mb-6">Manage your connected devices and settings.</p>
            <Link href="/home/device-management">
              <Button className="w-full rounded-md bg-[#4045ef] text-white hover:bg-[#2d336b]/90">
                Manage Devices
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
