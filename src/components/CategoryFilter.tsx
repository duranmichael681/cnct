import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getAllTags, type Tag } from '../services/api'

interface CategoryFilterProps {
  onCategoryChange: (category: string, tagId?: number) => void
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('All Filters')
  const [tags, setTags] = useState<Tag[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch tags from database
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getAllTags()
        setTags(tagsData)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }

    fetchTags()
  }, [])

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

  const handleFilterSelect = (filter: string, tagId?: number) => {
    setSelectedFilter(filter)
    onCategoryChange(filter, tagId)
    setIsOpen(false)
  }

  const otherFilters = [
    { label: 'Friends are going', value: 'friends_going' },
    { label: 'Friends are organizing', value: 'friends_organizing' },
    { label: 'This week', value: 'this_week' }
  ]

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      {/* Main Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[var(--secondary)] dark:bg-[var(--tertiary)] hover:bg-[var(--primary)] dark:hover:bg-[var(--primary)] text-white rounded-full font-bold text-sm sm:text-base transition-all cursor-pointer shadow-md hover:shadow-lg whitespace-nowrap"
      >
        <span className="truncate max-w-[120px] sm:max-w-none">{selectedFilter}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-3rem)] max-w-xs sm:w-64 bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-lg shadow-2xl z-30 overflow-hidden">
          {/* All Filters Option */}
          <button
            onClick={() => handleFilterSelect('All Filters')}
            className={`w-full px-4 py-3 text-left transition-colors font-semibold text-sm sm:text-base cursor-pointer ${
              selectedFilter === 'All Filters'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--background)] hover:bg-[var(--menucard)] text-[var(--text)]'
            }`}
          >
            All Filters
          </button>

          {/* Tags Section */}
          {tags.length > 0 && (
            <>
              <div className="px-4 py-2 bg-[var(--menucard)] text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">
                Tags
              </div>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleFilterSelect(tag.code, tag.id)}
                  className={`w-full px-4 py-3 text-left transition-colors font-semibold text-sm sm:text-base cursor-pointer pl-8 ${
                    selectedFilter === tag.code
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--background)] hover:bg-[var(--menucard)] text-[var(--text)]'
                  }`}
                >
                  {tag.code}
                </button>
              ))}
            </>
          )}

          {/* Other Section */}
          <div className="px-4 py-2 bg-[var(--menucard)] text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">
            Other
          </div>
          {otherFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterSelect(filter.label)}
              className={`w-full px-4 py-3 text-left transition-colors font-semibold text-sm sm:text-base cursor-pointer pl-8 ${
                selectedFilter === filter.label
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--background)] hover:bg-[var(--menucard)] text-[var(--text)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
