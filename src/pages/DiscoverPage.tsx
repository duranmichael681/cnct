import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer'
import SortFilter from '../components/SortFilter'
import CategoryFilter from '../components/CategoryFilter'
import { getAllEvents, type Event } from '../services/api'
import { LoadingSpinner, ErrorMessage, EmptyState, EventCard } from '../components/ui/UIComponents'
import { formatEventDate } from '../utils/helpers'

export default function DiscoverPage() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'tags' | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch events from backend
  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      try {
        setLoading(true)
        const data = await getAllEvents()
        if (mounted) {
          setEvents(data)
          setFilteredEvents(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching events:', err)
          setError('Failed to load events. Make sure the backend server is running.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchEvents()
    return () => { mounted = false }
  }, [])

  // Filter and sort events when search, category, or sort changes
  useEffect(() => {
    let result = [...events]

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.building && event.building.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort events
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    setFilteredEvents(result)
  }, [searchQuery, sortBy, selectedCategory, events])

  const handleSortChange = (sort: 'newest' | 'oldest' | 'tags', tags?: string[]) => {
    setSortBy(sort)
    if (tags) {
      setSelectedTags(tags)
    } else {
      setSelectedTags([])
    }
    console.log('Sorting by:', sort, 'Tags:', tags)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    console.log('Selected category:', category)
  }

  const handleJoinEvent = async (eventId: string) => {
    // TODO: Implement with real user ID from auth
    console.log('Join event:', eventId)
    alert('Please log in to join events')
  }

  const getAttendeeCount = (event: Event) => {
    return event.attendees && event.attendees.length > 0 ? event.attendees[0].count : 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-[var(--background)]"
    >      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--text)] mb-6">Discover Events</h1>
            
            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-text"
              />
              <CategoryFilter onCategoryChange={handleCategoryChange} />
              <SortFilter onSortChange={handleSortChange} />
            </div>

            {/* Loading State */}
            {loading && <LoadingSpinner size="lg" message="Loading events from Supabase..." />}

            {/* Error State */}
            {error && <ErrorMessage message={error} actionText="Retry" onAction={() => window.location.reload()} />}

            {/* No Results */}
            {!loading && !error && filteredEvents.length === 0 && (
              <EmptyState
                icon="🔍"
                title={searchQuery ? `No events found for "${searchQuery}"` : 'No events available'}
                message="Try adjusting your search or filters"
              />
            )}

            {/* Event Grid */}
            {!loading && !error && filteredEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EventCard
                      title={event.title}
                      description={event.body}
                      location={event.building || 'Location TBD'}
                      date={formatEventDate(event.start_date)}
                      maxAttendees={getAttendeeCount(event)}
                      onViewDetails={() => console.log('View', event.id)}
                      onJoin={() => handleJoinEvent(event.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </motion.div>
  )
}
