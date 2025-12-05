import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type SortOption = 'newest' | 'oldest'

interface SortFilterProps {
  onSortChange: (sortBy: SortOption) => void
}

const eventTagOptions = [
  'Academic & Career',
  'Arts & Culture',
  'Athletics & Recreation',
  'Campus Life & Community',
  'Information Sessions & Fairs'
]

export default function SortFilter({ onSortChange }: SortFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null)
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

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option)
    onSortChange(option)
    setIsOpen(false)
  }

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      {/* Main Sort Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[var(--secondary)] dark:bg-[var(--tertiary)] hover:bg-[var(--primary)] dark:hover:bg-[var(--primary)] text-white rounded-full font-bold text-sm sm:text-base transition-all cursor-pointer shadow-md hover:shadow-lg"
      >
        <span>Sort By</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-3rem)] max-w-xs sm:w-56 bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-lg shadow-2xl z-30 overflow-hidden">
          {/* Newest Option */}
          <button
            onClick={() => handleSortSelect('newest')}
            className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between font-semibold text-sm sm:text-base cursor-pointer ${
              selectedSort === 'newest'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--background)] hover:bg-[var(--menucard)] text-[var(--text)]'
            }`}
          >
            Newest Post
          </button>

          {/* Oldest Option */}
          <button
            onClick={() => handleSortSelect('oldest')}
            className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between font-semibold text-sm sm:text-base cursor-pointer ${
              selectedSort === 'oldest'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--background)] hover:bg-[var(--menucard)] text-[var(--text)]'
            }`}
          >
            Oldest Post
          </button>
        </div>
      )}
    </div>
  )
}
