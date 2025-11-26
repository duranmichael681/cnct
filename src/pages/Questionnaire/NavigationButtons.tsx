import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavigationButtonsProps {
  onBack?: () => void
  onNext: () => void
  canProceed: boolean
  isFirstStep?: boolean
  buttonClassName?: string
}

export default function NavigationButtons({
  onBack,
  onNext,
  canProceed,
  isFirstStep = false,
  buttonClassName = ''
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center gap-4 max-w-md mx-auto mt-6">
      {/* Back Button */}
      {!isFirstStep && onBack && (
        <button
          onClick={onBack}
          className={`w-16 h-9 rounded-[50px] flex items-center justify-center transition-all cursor-pointer shadow-lg ${buttonClassName}`}
          aria-label="Previous question"
        >
          <ChevronLeft size={34} />
        </button>
      )}

      {isFirstStep && <div className="w-16" />}

      {/* Forward Button */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`w-16 h-9 rounded-[50px] flex items-center justify-center transition-all shadow-lg ${
          canProceed
            ? `${buttonClassName} cursor-pointer`
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
        }`}
        aria-label="Next question"
      >
        <ChevronRight size={34} />
      </button>
    </div>
  )
}
