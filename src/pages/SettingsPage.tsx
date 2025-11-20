import SideBar from '../components/SideBar'
import Footer from '../components/Footer'
import { Settings as SettingsIcon, User, Bell, Lock, Palette } from 'lucide-react'

export default function SettingsPage() {
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
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">New Followers</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Event Updates</span>
                  <input type="checkbox" className="w-5 h-5" />
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
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Show Hosted Events</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Allow Friend Requests</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>
            </section>

            {/* Appearance */}
            <section className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <Palette size={20} />
                Appearance
              </h2>
              <div className="space-y-3">
                <p className="text-[var(--text-secondary)] text-sm">
                  Use the moon/sun icon in the sidebar to toggle between light and dark mode.
                </p>
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
