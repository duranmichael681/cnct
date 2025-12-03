import { useState, useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import PostCard from "../components/PostCard";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import SortFilter from "../components/SortFilter";
import { getUserPosts, getUserProfile, type Post, type UserProfile } from "../services/api";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../components/ui/UIComponents";
import { formatEventDate } from "../utils/helpers";
import { supabase } from "../lib/supabaseClient";

export default function ProfilePage() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'tags' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [userEvents, setUserEvents] = useState<Post[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          setUserId(session.user.id);
        } else {
          setError('Please log in to view your profile.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error getting user session:', err);
        if (mounted) {
          setError('Failed to load user session.');
          setLoading(false);
        }
      }
    }

    initializeUser();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    let mounted = true;

    async function fetchUserData() {
      try {
        setLoading(true);
        
        // Fetch user profile and posts in parallel
        const [profileData, postsData] = await Promise.all([
          getUserProfile(userId as string),
          getUserPosts(userId as string)
        ]);
        
        if (mounted) {
          setUserProfile(profileData);
          setUserEvents(postsData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching user data:', err);
          setError('Failed to load your profile.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUserData();
    return () => { mounted = false };
  }, [userId]);

  const handleSortChange = (sort: 'newest' | 'oldest' | 'tags', tags?: string[]) => {
    setSortBy(sort);
    if (tags) {
      setSelectedTags(tags);
      console.log('Sorting by tags:', tags);
    } else {
      setSelectedTags([]);
      console.log('Sorting by:', sort);
    }

    // Apply sorting
    let sorted = [...userEvents];
    if (sort === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'oldest') {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    setUserEvents(sorted);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors">
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px]">
          {/* Profile Header */}
          {userId && <ProfileHeader userId={userId} userProfile={userProfile || undefined} isOwnProfile={true} />}

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
            {!loading && !error && userEvents.length === 0 && (
              <EmptyState
                icon="📝"
                title="No posts yet"
                message="Start creating posts to see them here!"
                actionText="Create Post"
                onAction={() => window.location.href = '/create'}
              />
            )}

            {/* Posts Grid */}
            {!loading && !error && userEvents.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {userEvents.map((event) => (
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
