import { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer'
import { Settings as SettingsIcon, User, Bell, Lock, Palette, LogOut, KeyRound, Moon, Sun, Trash2, X, AlertTriangle } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  
  // User data state
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [degreeProgram, setDegreeProgram] = useState('')
  const [eventReminders, setEventReminders] = useState(true)
  const [newFollowers, setNewFollowers] = useState(true)
  const [eventUpdates, setEventUpdates] = useState(false)
  const [isPublicProfile, setIsPublicProfile] = useState(true)
  const [showHostedEvents, setShowHostedEvents] = useState(true)
  const [allowComments, setAllowComments] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  
  useEffect(() => {
    document.title = 'CNCT | Settings';
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        navigate('/signin')
        return
      }

      setUserId(user.id)
      setEmail(user.email || '')

      // Fetch user profile from database
      const { data: profile, error } = await supabase
        .from('users')
        .select('first_name, last_name, description, pronouns, degree_program')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (profile) {
        setUsername(`${profile.first_name || ''} ${profile.last_name || ''}`.trim())
        setBio(profile.description || '')
        setPronouns(profile.pronouns || '')
        setDegreeProgram(profile.degree_program || '')
      }

      // Fetch user settings (allow_comments setting)
      const { data: settings } = await supabase
        .from('user_settings')
        .select('setting:settings(name), status')
        .eq('user_id', user.id)

      if (settings) {
        settings.forEach((s: any) => {
          if (s.setting?.name === 'public_profile') setIsPublicProfile(s.status)
          if (s.setting?.name === 'show_hosted_events') setShowHostedEvents(s.status)
          if (s.setting?.name === 'allow_comments') setAllowComments(s.status)
          if (s.setting?.name === 'event_reminders') setEventReminders(s.status)
          if (s.setting?.name === 'new_followers') setNewFollowers(s.status)
          if (s.setting?.name === 'event_updates') setEventUpdates(s.status)
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear any auth tokens/session data here when Supabase is integrated
    navigate('/signin')
  }

  const handleChangePassword = () => {
    navigate('/change-password')
  }

  const handleSaveSettings = async () => {
    try {
      setSaveLoading(true)
      setSaveError('')
      setSaveSuccess(false)

      // Update user profile (username and bio only - email is read-only)
      const nameParts = username.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const { error: profileError } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          description: bio.trim() || null,
          pronouns: pronouns.trim() || null,
          degree_program: degreeProgram.trim() || null
        })
        .eq('id', userId)

      if (profileError) throw profileError

      // Update settings directly in user_settings table
      const settingsToUpdate = [
        { name: 'public_profile', status: isPublicProfile },
        { name: 'show_hosted_events', status: showHostedEvents },
        { name: 'allow_comments', status: allowComments },
        { name: 'event_reminders', status: eventReminders },
        { name: 'new_followers', status: newFollowers },
        { name: 'event_updates', status: eventUpdates }
      ]

      for (const setting of settingsToUpdate) {
        // Get the setting_id - suppress error handling for non-existent settings
        const { data: settingData, error: settingError } = await supabase
          .from('settings')
          .select('id')
          .eq('name', setting.name)
          .maybeSingle()

        if (settingError || !settingData) {
          console.warn(`Setting '${setting.name}' not found in database, skipping...`)
          continue
        }

        if (settingData) {
          // Check if user_settings record exists
          const { data: existingSetting } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .eq('setting_id', settingData.id)
            .single()

          if (existingSetting) {
            // Update existing setting
            await supabase
              .from('user_settings')
              .update({ status: setting.status })
              .eq('user_id', userId)
              .eq('setting_id', settingData.id)
          } else {
            // Insert new setting
            await supabase
              .from('user_settings')
              .insert({
                user_id: userId,
                setting_id: settingData.id,
                status: setting.status
              })
          }
        }
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error saving settings:', error)
      setSaveError(error.message || 'Failed to save settings')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteError('')
    setDeleteLoading(true)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setDeleteError('Failed to verify user. Please log in again.')
        setDeleteLoading(false)
        return
      }

      // Verify email matches
      if (deleteEmail.trim().toLowerCase() !== user.email?.toLowerCase()) {
        setDeleteError(`Email does not match your account email (${user.email}).`);
        setDeleteLoading(false);
        return;
      }

      // Verify confirmation text
      if (confirmationText !== 'DELETE MY ACCOUNT') {
        setDeleteError('Please type "DELETE MY ACCOUNT" to confirm.')
        setDeleteLoading(false)
        return
      }

      // Verify password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: deleteEmail,
        password: deletePassword,
      })

      if (signInError) {
        setDeleteError('Incorrect password. Please try again.')
        setDeleteLoading(false)
        return
      }

      // Call backend API to delete user and associated data
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: deleteEmail,
          password: deletePassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setDeleteError(data.error || 'Failed to delete account.')
        setDeleteLoading(false)
        return
      }

      // Sign out and redirect
      await supabase.auth.signOut()
      navigate('/signin', { state: { message: 'Account deleted successfully' } })
    } catch (error) {
      console.error('Error deleting account:', error)
      setDeleteError('An unexpected error occurred. Please try again.')
      setDeleteLoading(false)
    }
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
            {/* Loading State */}
            {loading && (
              <div className="text-center py-10">
                <p className="text-[var(--text)]">Loading settings...</p>
              </div>
            )}

            {/* Save Success Message */}
            {saveSuccess && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg p-4">
                <p className="text-green-700 dark:text-green-300 font-semibold">✓ Settings saved successfully!</p>
              </div>
            )}

            {/* Save Error Message */}
            {saveError && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300 font-semibold">⚠ {saveError}</p>
              </div>
            )}

            {!loading && (
              <>
                {/* Account Settings */}
                <section className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                    <User size={20} />
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                        Email (Read-only)
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] cursor-not-allowed opacity-70"
                      />
                      <p className="text-xs text-[var(--text-secondary)] mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                        Pronouns
                      </label>
                      <input
                        type="text"
                        value={pronouns}
                        onChange={(e) => setPronouns(e.target.value)}
                        placeholder="e.g., she/her, he/him, they/them"
                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                        Major / Degree Program
                      </label>
                      <input
                        type="text"
                        value={degreeProgram}
                        onChange={(e) => setDegreeProgram(e.target.value)}
                        placeholder="e.g., Computer Science, Business Administration"
                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself... Share your interests, hobbies, or what you're looking for on campus!"
                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
                      <input 
                        type="checkbox" 
                        checked={eventReminders}
                        onChange={(e) => setEventReminders(e.target.checked)}
                        className="w-5 h-5 cursor-pointer" 
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-[var(--text)]">New Followers</span>
                      <input 
                        type="checkbox" 
                        checked={newFollowers}
                        onChange={(e) => setNewFollowers(e.target.checked)}
                        className="w-5 h-5 cursor-pointer" 
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-[var(--text)]">Event Updates</span>
                      <input 
                        type="checkbox" 
                        checked={eventUpdates}
                        onChange={(e) => setEventUpdates(e.target.checked)}
                        className="w-5 h-5 cursor-pointer" 
                      />
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
                      <div>
                        <span className="text-[var(--text)] font-medium">Public Profile</span>
                        <p className="text-xs text-[var(--text-secondary)]">Allow other users to view your full profile</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isPublicProfile}
                        onChange={(e) => setIsPublicProfile(e.target.checked)}
                        className="w-5 h-5 cursor-pointer" 
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-[var(--text)] font-medium">Show Hosted Events</span>
                        <p className="text-xs text-[var(--text-secondary)]">Display events you've created on your profile</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={showHostedEvents}
                        onChange={(e) => setShowHostedEvents(e.target.checked)}
                        className="w-5 h-5 cursor-pointer" 
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-[var(--text)] font-medium">Allow Comments on My Posts</span>
                        <p className="text-xs text-[var(--text-secondary)]">Let others comment on events you create</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={allowComments}
                        onChange={(e) => setAllowComments(e.target.checked)}
                        className="w-5 h-5 cursor-pointer" 
                      />
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
              </>
            )}

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

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[var(--background)] border-2 border-[var(--danger)] rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 size={20} className="text-[var(--danger)]" />
                    <span className="text-[var(--danger)] font-semibold">Delete Account</span>
                  </div>
                  <span className="text-[var(--danger)] group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </section>

            {/* Save Button */}
            {!loading && (
              <button 
                onClick={handleSaveSettings}
                disabled={saveLoading}
                className="w-full py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </main>
      </div>
      <Footer />

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] border-2 border-[var(--danger)] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={28} className="text-[var(--danger)]" />
                <h2 className="text-2xl font-bold text-[var(--danger)]">Delete Account</h2>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteError('')
                  setDeleteEmail('')
                  setDeletePassword('')
                  setConfirmationText('')
                }}
                className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-[var(--danger)] rounded-lg">
              <p className="text-[var(--text)] font-semibold mb-2">⚠️ Warning: This action cannot be undone!</p>
              <p className="text-[var(--text-secondary)] text-sm">
                Deleting your account will permanently remove:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] text-sm mt-2 space-y-1">
                <li>Your profile and personal information</li>
                <li>All posts you've created</li>
                <li>Your RSVPs and event attendance</li>
                <li>Your followers and following lists</li>
                <li>All comments and interactions</li>
              </ul>
            </div>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-[var(--danger)] rounded-lg">
                <p className="text-[var(--danger)] text-sm font-semibold">{deleteError}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                  Confirm Your Email
                </label>
                <input
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--danger)]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                  Confirm Your Password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--danger)]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                  Type "DELETE MY ACCOUNT" to confirm
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--danger)]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteError('')
                  setDeleteEmail('')
                  setDeletePassword('')
                  setConfirmationText('')
                }}
                className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--primary)] font-semibold rounded-lg hover:bg-[var(--secondary)] transition-colors cursor-pointer"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || !deleteEmail || !deletePassword || !confirmationText}
                className="flex-1 px-4 py-2 bg-[var(--danger)] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
