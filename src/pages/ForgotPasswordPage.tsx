import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(true)

  const validateEmail = (email: string) => {
    // Check basic email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValidFormat = emailRegex.test(email)
    
    // Check if it's an FIU email address
    const isFIUEmail = email.toLowerCase().endsWith('@fiu.edu') || 
                       email.toLowerCase().endsWith('@myfiu.edu')
    
    return isValidFormat && isFIUEmail
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !validateEmail(email)) {
      setIsValidEmail(false)
      return
    }
    
    setIsValidEmail(true)
    // TODO: Integrate with Supabase to send password reset email
    console.log('Sending password reset email to:', email)
    setEmailSent(true)
  }

  const handleResend = () => {
    // TODO: Integrate with Supabase to resend password reset email
    console.log('Resending password reset email to:', email)
    alert('Email sent successfully!')
  }

  const handleCancel = () => {
    navigate('/signin')
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {!emailSent ? (
          // Email Input Form
          <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-8">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] mb-6 cursor-pointer transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-semibold">Back to Login</span>
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
                Forgot Password?
              </h1>
              <p className="text-[var(--text-secondary)]">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setIsValidEmail(true)
                    }}
                    placeholder="Enter your email address"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      !isValidEmail 
                        ? 'border-red-500' 
                        : 'border-[var(--border)]'
                    } bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
                  />
                </div>
                {!isValidEmail && (
                  <p className="text-red-500 text-sm mt-2">
                    Please enter a valid FIU email address (@fiu.edu or @myfiu.edu)
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 border border-[var(--border)] text-[var(--primary)] font-semibold rounded-lg hover:bg-[var(--secondary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                Remember your password?{' '}
                <button
                  onClick={handleCancel}
                  className="text-[var(--primary)] hover:underline cursor-pointer font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        ) : (
          // Email Sent Confirmation
          <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
                Email Sent!
              </h1>
              <p className="text-[var(--text-secondary)] mb-4">
                We've sent a password reset link to
              </p>
              <p className="text-[var(--primary)] font-semibold mb-6">
                {email}
              </p>
              <p className="text-[var(--text-secondary)] text-sm">
                Click the link in the email to reset your password
              </p>
            </div>

            <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 mb-6">
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                Can't see your email?
              </p>
              <button
                onClick={handleResend}
                className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold hover:underline cursor-pointer"
              >
                Resend here
              </button>
            </div>

            <button
              onClick={handleCancel}
              className="w-full py-3 border border-[var(--border)] text-[var(--primary)] font-semibold rounded-lg hover:bg-[var(--secondary)] transition-all cursor-pointer"
            >
              Back to Login
            </button>

            <div className="mt-6">
              <p className="text-xs text-[var(--text-secondary)]">
                Check your spam folder if you don't see the email within a few minutes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
