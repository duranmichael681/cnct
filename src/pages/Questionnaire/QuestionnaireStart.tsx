import { Link, useNavigate } from 'react-router-dom'
import { LinkIcon, PawPrint } from 'lucide-react'

export default function QuestionnaireStart() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Paws - Desktop Only */}
      <div className="hidden lg:block">
        {/* Left Side Paws */}
        {[69, 192, 315, 438, 561, 684].map((top, i) => (
          <div
            key={`left-${i}`}
            className="absolute w-24 h-24 left-[75px] opacity-80"
            style={{ top: `${top}px` }}
          >
            <PawPrint size={96} color="var(--primary)" />
          </div>
        ))}
        {/* Right Side Paws */}
        {[69, 192, 315, 438, 561, 684].map((top, i) => (
          <div
            key={`right-${i}`}
            className="absolute w-24 h-24 right-[75px] opacity-80"
            style={{ top: `${top}px` }}
          >
            <PawPrint size={96} color="var(--primary)" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full z-10 mt-8">
        {/* Hero Image */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/src/assets/learning-assistant-pic1 1.png" 
            alt="Get Started" 
            className="w-full max-w-[729px] h-auto rounded-[50px] shadow-2xl object-cover"
          />
        </div>

        {/* Description */}
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)] dark:text-[var(--primary)] text-center mb-8 px-4">
          To get us started, let's start by finding out some things about you to create your profile!
        </h1>

        {/* CNCT Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-[var(--card-bg)] rounded-full flex items-center justify-center shadow-lg border-4 border-[var(--primary)]">
            <LinkIcon size={48} color="var(--primary)" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <Link
            to="/"
            className="w-full sm:w-80 h-20 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white dark:text-[var(--primary)] text-xl md:text-2xl font-bold rounded-[50px] flex items-center justify-center transition-all cursor-pointer shadow-lg hover:shadow-xl"
          >
            Back to Welcome Page
          </Link>
          
          <button
            onClick={() => navigate('/questionnaire/1')}
            className="w-full sm:w-80 h-20 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white dark:text-[var(--primary)] text-xl md:text-3xl font-bold rounded-[50px] flex items-center justify-center transition-all cursor-pointer shadow-lg hover:shadow-xl"
          >
            Let's do it!
          </button>
        </div>

        {/* Already have an account link */}
        <p className="text-center mt-6 text-[var(--primary)] dark:text-[var(--primary)] text-sm mb-32">
          Already have an account?{' '}
          <Link to="/signin" className="text-[var(--primary)] dark:text-[var(--primary)] hover:underline cursor-pointer font-semibold">
            Click here to sign in
          </Link>
        </p>
      </div>

      {/* Mobile Paws - At very bottom with proper spacing */}
      <div className="lg:hidden fixed bottom-4 left-0 right-0 flex justify-center gap-4 z-0">
        {[1, 2, 3, 4].map((i) => (
          <PawPrint key={i} size={48} color="var(--primary)" className="opacity-80" />
        ))}
      </div>
    </div>
  )
}
