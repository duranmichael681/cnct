import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer'
import SortFilter from '../components/SortFilter'
import CategoryFilter from '../components/CategoryFilter'
import { getAllPosts, type Event } from '../services/api'
import { LoadingSpinner, ErrorMessage, EmptyState, EventCard } from '../components/ui/UIComponents'
import { formatEventDate } from '../utils/helpers'

export default function DiscoverPage() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'tags' | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [posts, setPosts] = useState<Event[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch posts from backend
  useEffect(() => {
    let mounted = true;

    async function fetchPosts() {
      try {
        setLoading(true)
        const data = await getAllPosts()
        if (mounted) {
          setPosts(data)
          setFilteredPosts(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching posts:', err)
          setError('Failed to load posts. Make sure the backend server is running.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPosts()
    return () => { mounted = false }
  }, [])

  // Filter and sort posts when search, category, or sort changes
  useEffect(() => {
    let result = [...posts]

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.building && post.building.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort posts
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    setFilteredPosts(result)
  }, [searchQuery, sortBy, selectedCategory, posts])

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

  const handleJoinPost = async (postId: string) => {
    // TODO: Implement with real user ID from auth
    console.log('Join post:', postId)
    alert('Please log in to join posts')
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
            <h1 className="text-3xl font-bold text-[var(--text)] mb-6">Discover Posts</h1>
            
            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-text"
              />
              <CategoryFilter onCategoryChange={handleCategoryChange} />
              <SortFilter onSortChange={handleSortChange} />
            </div>

            {/* Loading State */}
            {loading && <LoadingSpinner size="lg" message="Loading posts from Supabase..." />}

            {/* Error State */}
            {error && <ErrorMessage message={error} actionText="Retry" onAction={() => window.location.reload()} />}

            {/* No Results */}
            {!loading && !error && filteredPosts.length === 0 && (
              <EmptyState
                icon="🔍"
                title={searchQuery ? `No posts found for "${searchQuery}"` : 'No posts available'}
                message="Try adjusting your search or filters"
              />
            )}

            {/* Post Grid */}
            {!loading && !error && filteredPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EventCard
                      title={post.title}
                      description={post.body}
                      location={post.building || 'Location TBD'}
                      date={formatEventDate(post.start_date)}
                      maxAttendees={getAttendeeCount(post)}
                      onViewDetails={() => console.log('View', post.id)}
                      onJoin={() => handleJoinPost(post.id)}
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
