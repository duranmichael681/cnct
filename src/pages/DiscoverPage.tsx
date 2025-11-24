import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SideBar from '../components/SideBar'
import PostCard from '../components/PostCard'
import Footer from '../components/Footer'
import SortFilter from '../components/SortFilter'
import CategoryFilter from '../components/CategoryFilter'

export default function DiscoverPage() {
  useEffect(() => {
    document.title = 'CNCT | Discover';
  }, []);
  
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'tags' | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  const handleSortChange = (sort: 'newest' | 'oldest' | 'tags', tags?: string[]) => {
    setSortBy(sort)
    if (tags) {
      setSelectedTags(tags)
    } else {
      setSelectedTags([])
    }
    // TODO: Implement actual sorting logic here
    console.log('Sorting by:', sort, 'Tags:', tags)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // TODO: Implement actual category filtering logic here
    console.log('Selected category:', category)
  }

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
                className="flex-1 w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-text"
              />
              <CategoryFilter onCategoryChange={handleCategoryChange} />
              <SortFilter onSortChange={handleSortChange} />
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
      <Footer />
    </motion.div>
  )
}
