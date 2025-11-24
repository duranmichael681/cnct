import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  useEffect(() => {
    document.title = 'CNCT | Change Password';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields')
      return
    }
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }
    
    // Mock success - integrate with Supabase later
    alert('Password changed successfully!')
    navigate('/settings')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <div className="flex flex-1">
        <SideBar />

        <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px]">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] mb-4 cursor-pointer transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-semibold">Back to Settings</span>
              </button>
              
              <h1 className="text-3xl font-bold text-[var(--text)] flex items-center gap-3">
                <KeyRound size={32} className="text-[var(--primary)]" />
                Change Password
              </h1>
              <p className="text-[var(--text-secondary)] mt-2">
                Update your password to keep your account secure
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Password Requirements:</h3>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                  <li className={newPassword.length >= 8 ? 'text-green-500' : ''}>
                    • At least 8 characters long
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'text-green-500' : ''}>
                    • Contains an uppercase letter
                  </li>
                  <li className={/[a-z]/.test(newPassword) ? 'text-green-500' : ''}>
                    • Contains a lowercase letter
                  </li>
                  <li className={/[0-9]/.test(newPassword) ? 'text-green-500' : ''}>
                    • Contains a number
                  </li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="flex-1 py-3 border border-[var(--border)] text-[var(--primary)] font-semibold rounded-lg hover:bg-[var(--secondary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>

            {/* Security Tips */}
            <div className="mt-6 bg-[var(--card-bg)] rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-[var(--text)] mb-3">Security Tips</h3>
              <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                <li>• Use a unique password that you don't use anywhere else</li>
                <li>• Avoid common words and personal information</li>
                <li>• Consider using a password manager to generate and store strong passwords</li>
                <li>• Change your password regularly to maintain account security</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
