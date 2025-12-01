import { useState, useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import SortFilter from "../components/SortFilter";
import { getUserPosts, getUserProfile, type Post, type UserProfile } from "../services/api";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../components/ui/UIComponents";
import { formatEventDate } from "../utils/helpers";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'tags' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({} as UserProfile);
  const [filteredEvents, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [pageTitle, setPageTitle] = useState('Profile');

  const navigate = useNavigate();

  const userId = useParams().userId || "";
  useEffect(() => {
    let mounted = true;
    async function emptyUserIdRedirect() {
      if(!userId) {
        const user = await (await supabase.auth.getUser()).data.user;
        if (!user) {
          //enable when auth is required
          navigate('/SignIn');
          return;
        }
        const userId = user.id;
        navigate(`/profile/${userId}`);
      }
    }
    emptyUserIdRedirect();

    // Don't make API calls if userId is empty
    if (!userId) return;

    async function checkIfOwnProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id === userId) {
        setIsOwnProfile(true);
      } else {
        setIsOwnProfile(false);
      }
    }
    checkIfOwnProfile();

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
          setError('Failed to load posts.');
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
  }, [userId, navigate]);
  
  useEffect(() => {
    if (userProfile?.first_name && userProfile?.last_name) {
      if (isOwnProfile) {
        setPageTitle('My Profile');
      } else {
        setPageTitle(`${userProfile.first_name} ${userProfile.last_name}`);
      }
    }
  }, [userProfile, isOwnProfile]);
  
  useEffect(() => {
    document.title = `${pageTitle} | CNCT`;
    // Mark that user has visited the app (for showing sidebar on info pages)
    sessionStorage.setItem('hasVisitedApp', 'true');
  }, [pageTitle]);

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
          <ProfileHeader 
            isOwnProfile={isOwnProfile} 
            userProfile={userProfile}
            onProfileUpdate={async () => {
              // Refetch user profile after image upload
              try {
                const data = await getUserProfile(userId);
                setUserProfile(data);
              } catch (err) {
                console.error('Error refetching profile:', err);
              }
            }}
          />

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
            {!loading && !error && (filteredEvents?.length === 0 || filteredEvents?.length === null) && (
              <EmptyState
                icon="📝"
                title="No posts yet"
                message="This user hasn't created any posts yet."
              />
            )}
            {/* Empty State */}
            {!loading && !error && (filteredEvents?.length === 0 || filteredEvents?.length === null) && isOwnProfile && (
              <EmptyState
                icon="📝"
                title="No posts yet"
                message="Start creating posts to see them here!"
                actionText="Create Post"
                onAction={() => window.location.href = '/create'}
              />
            )}

            {/* Posts Grid */}
            {!loading && !error && filteredEvents?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PostCard event={event} isOwnProfile={isOwnProfile} />
                  </motion.div>
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
