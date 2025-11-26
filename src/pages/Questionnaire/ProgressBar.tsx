interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      {/* Progress Bar */}
      <div className="relative h-9 bg-[var(--secondary)] rounded-[50px] overflow-hidden mb-3">
        <div
          className="absolute top-0 left-0 h-full bg-[var(--primary)] transition-all duration-500 ease-out rounded-[50px]"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Question ${currentStep} of ${totalSteps}, ${percentage}% complete`}
        />
      </div>

      {/* Progress Text */}
      <div className="flex justify-center gap-4 text-[var(--text)] text-sm font-bold">
        <span>{currentStep}/{totalSteps}</span>
        <span>{percentage}%</span>
      </div>
    </div>
  )
}
