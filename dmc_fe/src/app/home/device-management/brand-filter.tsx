"use client"

interface BrandFilterProps {
  onSelect: (brand: string) => void
  onClose: () => void
}

export default function BrandFilter({ onSelect, onClose }: BrandFilterProps) {
  // Alphabetically organized brands
  const brands = {
    A: ["Apple", "Acer", "Asus"],
    B: ["Bose", "Beats"],
    D: ["Dell"],
    H: ["HP", "Huawei"],
    L: ["Lenovo", "LG", "Logitech"],
    M: ["Microsoft"],
    N: ["NEXARIS", "Nokia"],
    S: ["Samsung", "Sony"],
    T: ["Toshiba"],
  }

  // Get all letters that have brands
  const letters = Object.keys(brands).filter((letter) => brands[letter].length > 0)

  // Group letters into columns (3 columns)
  const columns = [
    letters.slice(0, Math.ceil(letters.length / 3)),
    letters.slice(Math.ceil(letters.length / 3), Math.ceil(letters.length / 3) * 2),
    letters.slice(Math.ceil(letters.length / 3) * 2),
  ]

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="grid grid-cols-3 gap-4 p-4">
        {columns.map((columnLetters, columnIndex) => (
          <div key={`column-${columnIndex}`} className="space-y-6">
            {columnLetters.map((letter) => (
              <div key={letter} className="space-y-2">
                <h3 className="text-xl font-bold">{letter}</h3>
                {brands[letter].map((brand) => (
                  <div
                    key={brand}
                    className="py-1 cursor-pointer hover:text-[#4045ef]"
                    onClick={() => {
                      onSelect(brand)
                      onClose()
                    }}
                  >
                    {brand}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
