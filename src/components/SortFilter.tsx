import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

type SortOption = 'newest' | 'oldest' | 'tags'

interface SortFilterProps {
  onSortChange: (sortBy: SortOption, tags?: string[]) => void
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
  const [showTagInput, setShowTagInput] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowTagInput(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option)
    
    if (option === 'tags') {
      setShowTagInput(true)
    } else {
      setShowTagInput(false)
      setSelectedTags([])
      onSortChange(option)
      setIsOpen(false)
    }
  }

  const handleTagAdd = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag]
      setSelectedTags(newTags)
      onSortChange('tags', newTags)
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove)
    setSelectedTags(newTags)
    if (newTags.length > 0) {
      onSortChange('tags', newTags)
    } else {
      setSelectedSort(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      handleTagAdd(tagInput.trim())
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
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
        <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-lg shadow-2xl z-30 overflow-hidden">
          {/* Newest Option */}
          <button
            onClick={() => handleSortSelect('newest')}
            className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between font-semibold text-sm sm:text-base ${
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
            className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between font-semibold text-sm sm:text-base ${
              selectedSort === 'oldest'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--background)] hover:bg-[var(--menucard)] text-[var(--text)]'
            }`}
          >
            Oldest Post
          </button>

          {/* Tags Option */}
          <button
            onClick={() => handleSortSelect('tags')}
            className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between font-semibold text-sm sm:text-base ${
              selectedSort === 'tags'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--background)] hover:bg-[var(--menucard)] text-[var(--text)]'
            }`}
          >
            Tags
          </button>

          {/* Tag Selection Interface */}
          {showTagInput && (
            <div className="p-4 bg-[var(--background)] border-t-2 border-[var(--border)]">
              <p className="text-xs sm:text-sm font-semibold text-[var(--text)] mb-2">
                Select or type tags:
              </p>
              
              {/* Tag Input */}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type tag and press Enter"
                className="w-full px-3 py-2 mb-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] text-sm placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />

              {/* Predefined Tag Options */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {eventTagOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagAdd(tag)}
                    disabled={selectedTags.includes(tag)}
                    className={`px-2 py-1 text-xs rounded-full transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-[var(--primary)] text-white cursor-not-allowed opacity-50'
                        : 'bg-[var(--menucard)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white cursor-pointer'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[var(--text)]">
                    Selected Tags:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-[var(--primary)] text-white text-xs rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleTagRemove(tag)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
