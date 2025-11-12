import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
}

const categories = [
  'All Categories',
  'Sports',
  'Academic',
  'Social',
  'Arts',
  'Career'
]

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange(category)
    setIsOpen(false)
  }

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      {/* Main Category Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[var(--secondary)] dark:bg-[var(--tertiary)] hover:bg-[var(--primary)] dark:hover:bg-[var(--primary)] text-white rounded-full font-bold text-sm sm:text-base transition-all cursor-pointer shadow-md hover:shadow-lg whitespace-nowrap"
      >
        <span className="truncate max-w-[120px] sm:max-w-none">{selectedCategory}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-3rem)] max-w-xs sm:w-64 bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-lg shadow-2xl z-30 overflow-hidden">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`w-full px-4 py-3 text-left transition-colors font-semibold text-sm sm:text-base cursor-pointer ${
                selectedCategory === category
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--background)] hover:bg-[var(--menucard)] text-[var(--text)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
