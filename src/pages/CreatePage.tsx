import SideBar from '../components/SideBar'
import { Calendar, MapPin, Users, Link as LinkIcon } from 'lucide-react'

export default function CreatePage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-6">Create Event</h1>

          <form className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6 space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                Event Name
              </label>
              <input
                type="text"
                placeholder="Enter event name"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe your event..."
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Location
              </label>
              <input
                type="text"
                placeholder="Event location"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Max Attendees */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                <Users size={16} />
                Max Attendees (optional)
              </label>
              <input
                type="number"
                placeholder="Leave blank for unlimited"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Event Link */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                <LinkIcon size={16} />
                Event Link (optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                Tags
              </label>
              <input
                type="text"
                placeholder="Add tags separated by commas (e.g., #Sports, #Social)"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                Event Image
              </label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center bg-[var(--background)] hover:bg-[var(--menucard)] transition-colors cursor-pointer">
                <p className="text-[var(--text-secondary)]">Click to upload or drag and drop</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Event
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
