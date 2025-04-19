"use client"

interface CategoryFilterProps {
  onSelect: (category: string) => void
  onClose: () => void
}

export default function CategoryFilter({ onSelect, onClose }: CategoryFilterProps) {
  // Alphabetically organized categories
  const categories = {
    A: ["Ab", "Abc", "Abcd", "Abcde"],
    B: ["Bi", "Bit", "Bitc"],
    C: [],
    H: ["H", "He", "Hen", "Hent"],
    I: ["IKEA", "Ishowmeat"],
    J: ["JFK"],
    S: ["Say Gex", "S", "SS", "SSS"],
    T: ["To", "Tu"],
    U: ["U+"],
  }

  // Get all letters that have categories
  const letters = Object.keys(categories).filter((letter) => categories[letter].length > 0)

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
                {categories[letter].map((category) => (
                  <div
                    key={category}
                    className="py-1 cursor-pointer hover:text-[#4045ef]"
                    onClick={() => {
                      onSelect(category)
                      onClose()
                    }}
                  >
                    {category}
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
