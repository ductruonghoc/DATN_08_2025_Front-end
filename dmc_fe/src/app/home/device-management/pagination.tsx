"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pageNumbers = []

    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // If current page is among the first 3 pages
      if (currentPage <= 3) {
        pageNumbers.push(2, 3, 4, "...", totalPages)
      }
      // If current page is among the last 3 pages
      else if (currentPage >= totalPages - 2) {
        pageNumbers.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      }
      // If current page is somewhere in the middle
      else {
        pageNumbers.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }

    return pageNumbers
  }

  return (
    <div className="flex justify-center items-center">
      <Link
        href={currentPage > 1 ? `/home/device-management/page/${currentPage - 1}` : "#"}
        className={`w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 mr-2 ${
          currentPage === 1 ? "opacity-50 pointer-events-none" : ""
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {getPaginationNumbers().map((number, index) =>
        number === "..." ? (
          <span key={`ellipsis-${index}`} className="mx-1">
            ...
          </span>
        ) : (
          <Link
            key={`page-${number}`}
            href={`/home/device-management/page/${number}`}
            className={`w-8 h-8 flex items-center justify-center rounded-md mx-1 ${
              currentPage === number ? "bg-[#2d336b] text-white" : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {number}
          </Link>
        ),
      )}

      <Link
        href={currentPage < totalPages ? `/home/device-management/page/${currentPage + 1}` : "#"}
        className={`w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 ml-2 ${
          currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
