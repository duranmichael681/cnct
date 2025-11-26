import { useState, useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import SortFilter from "../components/SortFilter";
import { getUserPosts, type Event } from "../services/api";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../components/ui/UIComponents";
import { formatEventDate } from "../utils/helpers";

export default function ProfilePage() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'tags' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Get real user ID from auth context
  const userId = "temp-user-id"; // Replace with actual auth user ID

  useEffect(() => {
    let mounted = true;

    async function fetchUserEvents() {
      try {
        setLoading(true);
        const data = await getUserPosts(userId);
        if (mounted) {
          setUserEvents(data);
          setFilteredEvents(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching user posts:', err);
          setError('Failed to load your posts.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUserEvents();
    return () => { mounted = false };
  }, [userId]);
  
  useEffect(() => {
    document.title = 'CNCT | My Profile';
    // Mark that user has visited the app (for showing sidebar on info pages)
    sessionStorage.setItem('hasVisitedApp', 'true');
  }, []);

  // Sort posts when sortBy changes
  useEffect(() => {
    let result = [...userEvents];

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    // Note: 'tags' sorting would require tag filtering logic

    setFilteredEvents(result);
  }, [sortBy, userEvents]);

  const handleSortChange = (sort: 'newest' | 'oldest' | 'tags', tags?: string[]) => {
    setSortBy(sort);
    if (tags) {
      setSelectedTags(tags);
      console.log('Sorting by tags:', tags);
    } else {
      setSelectedTags([]);
      console.log('Sorting by:', sort);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors">
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px]">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Sort Filter */}
          <section className="mt-6 flex justify-end">
            <SortFilter onSortChange={handleSortChange} />
          </section>

          {/* Post feed */}
          <section className="mt-6">
            {/* Loading State */}
            {loading && <LoadingSpinner message="Loading your posts..." />}

            {/* Error State */}
            {error && <ErrorMessage message={error} actionText="Retry" onAction={() => window.location.reload()} />}

            {/* Empty State */}
            {!loading && !error && filteredEvents.length === 0 && (
              <EmptyState
                icon="📝"
                title="No posts yet"
                message="Start creating posts to see them here!"
                actionText="Create Post"
                onAction={() => window.location.href = '/create'}
              />
            )}

            {/* Posts Grid */}
            {!loading && !error && filteredEvents.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-[var(--menucard)] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="text-[var(--text)] font-semibold text-xl mb-2">{event.title}</h3>
                    <p className="text-[var(--text)] opacity-80 mb-4 line-clamp-2">{event.body}</p>
                    <div className="flex flex-col gap-2 text-sm text-[var(--text)] opacity-70">
                      {event.building && <span>📍 {event.building}</span>}
                      <span>📅 {formatEventDate(event.start_date)}</span>
                      {event.is_private && <span className="text-yellow-500">🔒 Private Event</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
