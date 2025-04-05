import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-6 text-3xl font-bold text-[#2d336b]">Welcome to QueryPDF</h1>
        <p className="mb-8 text-gray-600">Upload your PDF documents and start querying them instantly.</p>
        <Link href="/home/import">
          <Button className="w-full rounded-full bg-[#2D336B] py-6 text-white hover:bg-[#2d336b]/90">
            <Upload className="mr-2 h-5 w-5" />
            Upload a PDF
          </Button>
        </Link>
      </div>
    </div>
  )
}

