import SideBar from '../components/SideBar'
import Footer from '../components/Footer'
import { Settings as SettingsIcon, User, Bell, Lock, Palette, LogOut, KeyRound, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear any auth tokens/session data here when Supabase is integrated
    navigate('/signin')
  }

  const handleChangePassword = () => {
    navigate('/change-password')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-6 flex items-center gap-3">
            <SettingsIcon size={32} />
            Settings
          </h1>

          <div className="space-y-6">
            {/* Account Settings */}
            <section className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <User size={20} />
                Account Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue="@username"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="user@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Tell us about yourself..."
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </section>

            {/* Notification Settings */}
            <section className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <Bell size={20} />
                Notifications
              </h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Event Reminders</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">New Followers</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Event Updates</span>
                  <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                </label>
              </div>
            </section>

            {/* Privacy Settings */}
            <section className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <Lock size={20} />
                Privacy
              </h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Public Profile</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Show Hosted Events</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Allow Friend Requests</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                </label>
              </div>
            </section>

            {/* Appearance */}
            <section className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <Palette size={20} />
                Appearance
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isDark ? (
                      <Sun size={24} className="text-[var(--primary)]" />
                    ) : (
                      <Moon size={24} className="text-[var(--primary)]" />
                    )}
                    <div>
                      <p className="text-[var(--text)] font-semibold">Theme</p>
                      <p className="text-[var(--text-secondary)] text-sm">
                        {isDark ? 'Dark Mode' : 'Light Mode'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-6 py-2 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Toggle Theme
                  </button>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <Lock size={20} />
                Security
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleChangePassword}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg hover:bg-[var(--secondary)] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <KeyRound size={20} className="text-[var(--primary)]" />
                    <span className="text-[var(--primary)] font-semibold">Change Password</span>
                  </div>
                  <span className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">→</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[var(--background)] border border-[var(--danger)] rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={20} className="text-[var(--danger)]" />
                    <span className="text-[var(--danger)] font-semibold">Logout</span>
                  </div>
                  <span className="text-[var(--danger)] group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </section>

            {/* Save Button */}
            <button className="w-full py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </div>
  )
}
