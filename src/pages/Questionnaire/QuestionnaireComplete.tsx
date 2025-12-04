import { useNavigate } from 'react-router-dom'
import { LinkIcon, LogIn } from 'lucide-react'

export default function QuestionnaireComplete() {
  const navigate = useNavigate()

  const handleSignIn = () => {
    // TODO: Save questionnaire data to Supabase
    const questionnaireData = localStorage.getItem('questionnaireData')
    console.log('Saving questionnaire data:', questionnaireData)
    
    // Clear questionnaire data after saving
    localStorage.removeItem('questionnaireData')
    
    // Navigate to sign in
    navigate('/signin')
  }

  const handleBackToForm = () => {
    // Return to last question without clearing data
    navigate('/questionnaire/5')
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* CNCT Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-[var(--card-bg)] rounded-full flex items-center justify-center shadow-lg border-4 border-[var(--text)]">
            <LinkIcon size={48} className="text-[var(--text)]" />
          </div>
        </div>

        {/* Thank You Message */}
        <div className="bg-[var(--card-bg)] rounded-lg p-8 shadow-xl mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text)] dark:text-[var(--primary)] mb-4">
            Thank you for taking the time to create a profile with us!
          </h1>
          <p className="text-sm md:text-base font-bold text-[var(--text-secondary)] dark:text-[var(--primary)]">
            You can now login to your newly created profile.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleBackToForm}
            className="w-full sm:w-auto px-6 py-3 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white dark:text-[var(--primary)] text-sm font-bold rounded-[50px] transition-all cursor-pointer shadow-lg"
          >
            I'm Not Done Yet!
          </button>

          <button
            onClick={handleSignIn}
            className="w-full sm:w-auto px-6 py-3 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white dark:text-[var(--primary)] text-sm font-bold rounded-[50px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <span>Sign In</span>
            <LogIn size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
