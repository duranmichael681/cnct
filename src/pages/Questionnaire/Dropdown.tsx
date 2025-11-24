import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface DropdownProps {
  label: string
  required?: boolean
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function Dropdown({
  label,
  required = false,
  options,
  value,
  onChange,
  placeholder = 'Please Select'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  return (
    <div className="w-full max-w-sm mx-auto mb-6">
      <label className="block text-sm font-bold text-[var(--text)] mb-2 text-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="w-full h-11 bg-white dark:bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-[50px] px-6 flex items-center justify-between cursor-pointer hover:border-[var(--primary)] transition-colors"
        >
          <span className={`text-sm font-bold ${value ? 'text-[var(--text)]' : 'text-gray-500'}`}>
            {value || placeholder}
          </span>
          {isOpen ? (
            <ChevronUp size={20} className="text-[var(--text)]" />
          ) : (
            <ChevronDown size={20} className="text-[var(--text)]" />
          )}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-lg shadow-xl overflow-hidden">
            {options.map((option, index) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`h-9 px-6 flex items-center cursor-pointer transition-colors ${
                  hoveredIndex === index || value === option
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'bg-white dark:bg-[var(--card-bg)]'
                }`}
              >
                <span className="text-sm font-bold text-[var(--text)]">{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
