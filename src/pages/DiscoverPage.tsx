import SideBar from '../components/SideBar'
import PostCard from '../components/PostCard'

export default function DiscoverPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-6">Discover Events</h1>
          
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search events..."
              className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <select className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
              <option>All Categories</option>
              <option>Sports</option>
              <option>Academic</option>
              <option>Social</option>
            </select>
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((id) => (
              <PostCard key={id} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
