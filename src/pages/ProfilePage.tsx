import { useState, useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import SortFilter from "../components/SortFilter";
import { getUserPosts, getUserProfile, type Post, type UserProfile } from "../services/api";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../components/ui/UIComponents";
import { formatEventDate } from "../utils/helpers";
import { useParams, useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'tags' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({} as UserProfile);
  const [filteredEvents, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const userId = useParams().userId || "";
  useEffect(() => {
    let mounted = true;

    async function fetchUserPosts() {
      try {
        setLoading(true);
        const data = await getUserPosts(userId);
        if (mounted) {
          setUserPosts(data);
          setFilteredPosts(data);
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
    async function fetchUserProfile() {
      try {
        setLoading(true);
        const data = await getUserProfile(userId);
        if (mounted) {
          setUserProfile(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching user profile:', err);
          setError('Failed to load the user.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchUserProfile();
    fetchUserPosts();
    return () => { mounted = false };
  }, [userId]);
  
  useEffect(() => {
    document.title = 'CNCT | My Profile';
    // Mark that user has visited the app (for showing sidebar on info pages)
    sessionStorage.setItem('hasVisitedApp', 'true');
  }, []);

  // Sort posts when sortBy changes
  useEffect(() => {
    let result = [...userPosts];

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    // Note: 'tags' sorting would require tag filtering logic

    setFilteredPosts(result);
  }, [sortBy, userPosts]);

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
