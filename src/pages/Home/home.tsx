import SideBar from "../../components/SideBar";
import Footer from "../../components/Footer";
import PopularEventImage from "../../assets/how-it-works.jpg";
import { useState, useEffect } from "react";
import { getAllPosts, getUserProfile, type Post, type UserProfile } from "../../services/api";
import { LoadingSpinner, ErrorMessage } from "../../components/ui/UIComponents";
import { formatEventDate } from "../../utils/helpers";
import {supabase} from '../../supabase/client'
import PostCard from "../../components/PostCard";
import { motion } from "framer-motion";


export default function Home() {
  const [width, setWidth] = useState(window.innerWidth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userName, setUserName] = useState<string>('User');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user data on mount
    async function fetchUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('🔐 Authenticated user:', user);
        
        if (user) {
          // Fetch user profile from database
          const userProfile = await getUserProfile(user.id);
          console.log('👤 User profile from database:', userProfile);
          
          if (userProfile) {
            setUserProfile(userProfile);
            if (userProfile.first_name) {
              setUserName(userProfile.first_name);
            } else {
              // Fallback to email username if no first name
              const emailUsername = user.email?.split('@')[0] || 'User';
              setUserName(emailUsername);
            }
            console.log('✅ User data loaded successfully');
          }
        } else {
          console.warn('⚠️  No authenticated user found');
        }
      } catch (err) {
        console.error('❌ Error fetching user data:', err);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    document.title = 'CNCT | Home';
    // Mark that user has visited the app (for showing sidebar on info pages)
    sessionStorage.setItem('hasVisitedApp', 'true');
    
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch posts from backend - filtered by user preferences on Home page
  useEffect(() => {
    let mounted = true;

    async function fetchPosts() {
      try {
        setLoading(true);
        
        // Get current user for personalized filtering
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        // Use filtered endpoint if user is logged in (personalized Home feed)
        const url = userId 
          ? `http://localhost:5000/api/posts?userId=${userId}`
          : 'http://localhost:5000/api/posts';

        const response = await fetch(url);
        const result = await response.json();
        
        if (mounted && result.success) {
          setPosts(result.data || []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching posts:", err);
          setError(
            "Failed to load posts. Make sure the backend server is running."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchPosts();
    return () => {
      mounted = false;
    };
  }, []);

  // Use real posts or empty array
  const displayPosts = posts.length > 0 ? posts : [];

  // Get attendee count for each event
  const getAttendeeCount = (event: Post) => {
    return event.attendees && event.attendees.length > 0
      ? event.attendees[0].count
      : 0;
  };

  // Popular posts - latest 4 upcoming posts
  const popularPosts = posts
    .filter((post) => new Date(post.start_date) > new Date())
    .slice(0, 4)
    .map((post) => ({
      id: post.id,
      title: post.title,
      image: post.post_picture_url || PopularEventImage,
      description: post.body,
      location: post.building || "Location TBD",
      date: formatEventDate(post.start_date),
    }));

  return (
    <div className="flex min-h-screen bg-[var(--background)] flex-col">
      <div className="flex flex-1">
        <SideBar />
        <div className="flex-grow flex flex-col lg:flex-row pb-24 md:pb-0 md:ml-[70px]">
          {/* Left Section - Posts */}
          <div className="p-4 sm:p-6 lg:p-8 w-full lg:w-2/3 flex flex-col gap-6 sm:gap-8 lg:gap-10">
            {/* Welcome Message */}
            <div className='animate-fade-in'>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] mb-2'>
                Welcome, <span className='text-[var(--primary)]'>{userName}</span>!
              </h1>
              <p className="text-base sm:text-lg text-[var(--text)] opacity-80">
                Here's what's happening today
              </p>
            </div>

            {/* CNCT Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--text)] animate-fade-in-delay-1">
              Latest Posts
            </h2>

            {/* Loading State */}
            {loading && <LoadingSpinner message="Loading posts ..." />}

            {/* Error State */}
            {error && (
              <ErrorMessage
                message={error}
                actionText="Retry"
                onAction={() => window.location.reload()}
              />
            )}

            {/* Empty State */}
            {!loading && !error && displayPosts.length === 0 && (
              <div className="text-center py-10 bg-[var(--menucard)] rounded-lg">
                <p className="text-[var(--text)] text-lg">No posts yet</p>
                <p className="text-[var(--text)] opacity-70 mt-2">
                  Be the first to create a post!
                </p>
              </div>
            )}

            {/* Posts List - Single Column */}
            {!loading && displayPosts.length > 0 && (
              <div className="flex flex-col gap-4 md:gap-6">
                {displayPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className={`animate-fade-in-delay-${Math.min(index + 2, 4)}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PostCard event={post} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          {width >= 1024 && (
            <div className="m-5 w-full lg:w-1/3 h-auto flex flex-col justify-start items-center border-l border-[var(--border)] mt-20 animate-fade-in-delay-1 px-4">
              <h1 className="text-center text-[var(--primary)] font-semibold text-2xl lg:text-3xl mb-6 animate-fade-in-delay-2">
                Popular this Week
              </h1>

              <div className="flex flex-col w-full gap-4">
                {popularPosts.length === 0 ? (
                  <p className="text-center text-[var(--text)] opacity-70">
                    No posts yet
                  </p>
                ) : (
                  popularPosts.map((post, index) => {
                    // Find the full post object from posts array
                    const fullPost = posts.find(p => p.id === post.id);
                    if (!fullPost) return null;
                    
                    return (
                      <motion.div
                        key={post.id || index}
                        className={`animate-fade-in-delay-${Math.min(index + 3, 4)} scale-90`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <PostCard event={fullPost} />
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
