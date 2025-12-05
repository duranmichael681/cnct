import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import SortFilter from "../components/SortFilter";
import { getUserPosts, getUserProfile, getUserFollowers, getUserFollowing, toggleFollow, type Post, type UserProfile } from "../services/api";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../components/ui/UIComponents";
import { formatEventDate } from "../utils/helpers";
import { supabase } from "../lib/supabaseClient";
import { UserPlus, UserMinus } from "lucide-react";

export default function ProfilePage() {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [userEvents, setUserEvents] = useState<Post[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Initialize: get current user and determine which profile to view
  useEffect(() => {
    let mounted = true;

    async function initializeUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          setCurrentUserId(session.user.id);
          // If URL has a userId param, view that user's profile, otherwise view own profile
          setUserId(paramUserId || session.user.id);
          setIsOwnProfile(!paramUserId || paramUserId === session.user.id);
        } else {
          setError('Please log in to view profiles.');
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
  }, [paramUserId]);

  useEffect(() => {
    if (!userId) return;
    
    let mounted = true;

    async function fetchUserData() {
      try {
        setLoading(true);
        
        // Fetch user profile, posts, followers, and following in parallel
        const [profileData, postsData, followersData, followingData] = await Promise.all([
          getUserProfile(userId as string),
          getUserPosts(userId as string),
          getUserFollowers(userId as string),
          getUserFollowing(userId as string)
        ]);
        
        if (mounted) {
          setUserProfile(profileData);
          setUserEvents(postsData);
          setFollowers(followersData);
          setFollowing(followingData);
          
          // Check if current user is following this profile
          if (currentUserId && !isOwnProfile) {
            setIsFollowing(followersData.some(f => f.id === currentUserId));
          }
          
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

  const handleSortChange = (sort: 'newest' | 'oldest') => {
    setSortBy(sort);
    setSelectedTags([]);
    console.log('Sorting by:', sort);

    // Apply sorting
    let sorted = [...userEvents];
    if (sort === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'oldest') {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    setUserEvents(sorted);
  };

  const handleProfileUpdate = async () => {
    if (!userId) return;
    
    try {
      // Refetch user profile to get updated profile picture
      const profileData = await getUserProfile(userId);
      setUserProfile(profileData);
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  const handleFollowToggle = async (targetUserId?: string) => {
    const userIdToToggle = targetUserId || userId;
    if (!currentUserId || !userIdToToggle) return;
    
    try {
      const result = await toggleFollow(userIdToToggle, currentUserId);
      
      if (result.action === 'followed') {
        setIsFollowing(true);
        // Refresh followers list
        const followersData = await getUserFollowers(userIdToToggle);
        setFollowers(followersData);
      } else {
        setIsFollowing(false);
        // Refresh followers list
        const followersData = await getUserFollowers(userIdToToggle);
        setFollowers(followersData);
      }
      
      // Refresh following list for current user
      if (currentUserId) {
        const followingData = await getUserFollowing(currentUserId);
        setFollowing(followingData);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors">
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px]">
          {/* Profile Header */}
          {userId && (
            <ProfileHeader 
              userId={userId} 
              userProfile={userProfile || undefined} 
              isOwnProfile={isOwnProfile} 
              onProfileUpdate={handleProfileUpdate}
              onShowFollowers={() => setShowFollowers(true)}
              onShowFollowing={() => setShowFollowing(true)}
            />
          )}

          {/* Follow Button */}
          {!isOwnProfile && currentUserId && (
            <section className="mt-6 flex justify-end">
              <button
                onClick={() => handleFollowToggle()}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition cursor-pointer ${
                  isFollowing
                    ? 'bg-[var(--danger)] hover:bg-[var(--danger)]/80 text-white'
                    : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus size={20} />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </section>
          )}

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

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowFollowers(false)}>
          <div className="bg-[var(--background)] rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[var(--text)]">Followers ({followers.length})</h2>
              <button onClick={() => setShowFollowers(false)} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-2xl">&times;</button>
            </div>
            {followers.length === 0 ? (
              <p className="text-[var(--text-secondary)] text-center py-8">No followers yet</p>
            ) : (
              <div className="space-y-3">
                {followers.map((follower, index) => (
                  <div key={`${follower.id}-${index}`} className="flex items-center gap-3 p-3 bg-[var(--card-bg)] rounded-lg hover:bg-[var(--menucard)] transition cursor-pointer" onClick={() => {
                    setShowFollowers(false);
                    navigate(`/profile/${follower.id}`);
                  }}>
                    {follower.profile_picture_url ? (
                      <img
                        src={follower.profile_picture_url}
                        alt={`${follower.first_name} ${follower.last_name}`}
                        className="rounded-full object-cover flex-shrink-0"
                        style={{ width: '40px', height: '40px', minWidth: '40px' }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold text-sm">
                        {(follower.first_name?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[var(--text)] font-semibold">
                        {follower.first_name} {follower.last_name}
                      </p>
                      <p className="text-[var(--text-secondary)] text-sm">{follower.username_email}</p>
                    </div>
                    {currentUserId && follower.id !== currentUserId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowToggle(follower.id);
                        }}
                        className={`px-3 py-1 rounded text-sm font-semibold transition flex-shrink-0 ${
                          following.some(f => f.id === follower.id)
                            ? 'bg-[var(--danger)] hover:bg-[var(--danger)]/80 text-white'
                            : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white'
                        }`}
                      >
                        {following.some(f => f.id === follower.id) ? 'Unfollow' : 'Follow'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowFollowing(false)}>
          <div className="bg-[var(--background)] rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[var(--text)]">Following ({following.length})</h2>
              <button onClick={() => setShowFollowing(false)} className="text-[var(--text-secondary)] hover:text-[var(--text)] text-2xl">&times;</button>
            </div>
            {following.length === 0 ? (
              <p className="text-[var(--text-secondary)] text-center py-8">Not following anyone yet</p>
            ) : (
              <div className="space-y-3">
                {following.map((user, index) => (
                  <div key={`${user.id}-${index}`} className="flex items-center gap-3 p-3 bg-[var(--card-bg)] rounded-lg hover:bg-[var(--menucard)] transition cursor-pointer" onClick={() => {
                    setShowFollowing(false);
                    navigate(`/profile/${user.id}`);
                  }}>
                    {user.profile_picture_url ? (
                      <img
                        src={user.profile_picture_url}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="rounded-full object-cover flex-shrink-0"
                        style={{ width: '40px', height: '40px', minWidth: '40px' }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold text-sm">
                        {(user.first_name?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[var(--text)] font-semibold">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-[var(--text-secondary)] text-sm">{user.username_email}</p>
                    </div>
                    {currentUserId && user.id !== currentUserId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowToggle(user.id);
                        }}
                        className={`px-3 py-1 rounded text-sm font-semibold transition flex-shrink-0 ${
                          following.some(f => f.id === user.id)
                            ? 'bg-[var(--danger)] hover:bg-[var(--danger)]/80 text-white'
                            : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white'
                        }`}
                      >
                        {following.some(f => f.id === user.id) ? 'Unfollow' : 'Follow'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
