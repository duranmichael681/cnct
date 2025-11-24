import { useState } from 'react'
import { X } from 'lucide-react'

interface MultiSelectProps {
  label: string
  required?: boolean
  predefinedOptions: string[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export default function MultiSelect({
  label,
  required = false,
  predefinedOptions,
  selectedValues,
  onChange,
  placeholder = 'Select or type your own'
}: MultiSelectProps) {
  const [inputValue, setInputValue] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)

  const handleToggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option))
    } else {
      onChange([...selectedValues, option])
    }
  }

  const handleAddCustomTag = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !selectedValues.includes(trimmed)) {
      onChange([...selectedValues, trimmed])
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCustomTag()
    }
  }

  const handleRemoveTag = (tag: string) => {
    onChange(selectedValues.filter(v => v !== tag))
  }

  return (
    <div className="w-full max-w-lg mx-auto mb-6">
      <label className="block text-sm font-bold text-[var(--text)] mb-2 text-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Predefined Options */}
      <div className="space-y-2 mb-4">
        {predefinedOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleToggleOption(option)}
            className={`w-full h-10 px-6 rounded-[50px] text-sm font-bold transition-all cursor-pointer ${
              selectedValues.includes(option)
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white dark:bg-[var(--card-bg)] border-2 border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder={placeholder}
          className={`w-full h-11 bg-white dark:bg-[var(--card-bg)] border-2 rounded-[50px] px-6 text-sm font-bold text-[var(--text)] placeholder:text-gray-500 transition-colors ${
            isInputFocused ? 'border-[var(--primary)]' : 'border-[var(--border)]'
          }`}
        />
        {inputValue && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleAddCustomTag}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded-full hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
          >
            Add
          </button>
        )}
      </div>

      {/* Selected Tags */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedValues.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-full text-sm font-bold"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
                aria-label={`Remove ${tag}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {required && selectedValues.length === 0 && (
        <p className="text-xs text-red-500 mt-2 text-center">Please select at least one option</p>
      )}
    </div>
  )
}
