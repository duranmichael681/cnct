import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import SortFilter from "../components/SortFilter";
import CategoryFilter from "../components/CategoryFilter";
import PostCard from "../components/PostCard";
import { getAllPosts, getUserFollowing, type Post, type UserProfile } from "../services/api";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../components/ui/UIComponents";

export default function DiscoverPage() {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | null>(
    null
  );
  const [selectedFilter, setSelectedFilter] = useState("All Filters");
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(undefined);
  const [selectedOtherFilter, setSelectedOtherFilter] = useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [following, setFollowing] = useState<UserProfile[]>([]);

  // Fetch current user and their following list
  useEffect(() => {
    let mounted = true;

    async function fetchCurrentUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted && user) {
          setCurrentUserId(user.id);
          // Fetch following list
          const followingData = await getUserFollowing(user.id);
          if (mounted) {
            setFollowing(followingData);
          }
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    }

    fetchCurrentUser();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch posts from backend
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const postsData = await getAllPosts();
        if (mounted) {
          setPosts(postsData);
          setFilteredPosts(postsData);
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

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter and sort posts when search, filter, or sort changes
  useEffect(() => {
    let result = [...posts];

    console.log('🔍 Filtering posts:', {
      totalPosts: posts.length,
      selectedTagId,
      selectedOtherFilter,
      searchQuery,
      sortBy
    });

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.building &&
            post.building.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by tag (if selected)
    if (selectedTagId !== undefined) {
      console.log(`📍 Filtering by tag ID: ${selectedTagId}`);
      result = result.filter((post) => {
        const hasTag = post.tag_ids?.includes(selectedTagId);
        console.log(`   Post "${post.title}" - tag_ids: ${JSON.stringify(post.tag_ids)}, matches: ${hasTag}`);
        return hasTag;
      });
    }

    // Filter by other filters (friends are going, friends are organizing, this week)
    if (selectedOtherFilter === 'friends_going') {
      const friendIds = following.map(f => f.id);
      result = result.filter((post) => {
        // Check if any attendees are in the user's following list
        const hasFollowingAttendee = (post.attendees || []).some(attendee => 
          attendee.users && friendIds.includes(attendee.users.id)
        );
        return hasFollowingAttendee;
      });
      console.log('📍 Filtering by friends are going - Friend IDs:', friendIds);
    } else if (selectedOtherFilter === 'friends_organizing') {
      // TODO: Implement friends are organizing filter
      console.log('📍 Filtering by friends are organizing');
    } else if (selectedOtherFilter === 'this_week') {
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      result = result.filter((post) => {
        const postDate = new Date(post.start_date);
        return postDate >= today && postDate <= weekFromNow;
      });
      console.log('📍 Filtering by this week');
    }

    // Sort posts
    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    setFilteredPosts(result);
  }, [searchQuery, sortBy, selectedTagId, selectedOtherFilter, posts, following]);

  const handleSortChange = (
    sort: "newest" | "oldest"
  ) => {
    setSortBy(sort);
    console.log("Sorting by:", sort);
  };

  const handleFilterChange = (filter: string, tagId?: number) => {
    setSelectedFilter(filter);
    
    if (tagId !== undefined) {
      // It's a tag filter
      setSelectedTagId(tagId);
      setSelectedOtherFilter(undefined);
    } else if (filter === 'All Filters') {
      // Reset all filters
      setSelectedTagId(undefined);
      setSelectedOtherFilter(undefined);
    } else if (filter === 'Friends are going') {
      setSelectedOtherFilter('friends_going');
      setSelectedTagId(undefined);
    } else if (filter === 'Friends are organizing') {
      setSelectedOtherFilter('friends_organizing');
      setSelectedTagId(undefined);
    } else if (filter === 'This week') {
      setSelectedOtherFilter('this_week');
      setSelectedTagId(undefined);
    }
    
    console.log("Selected filter:", filter, "Tag ID:", tagId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-[var(--background)]"
    >
      {" "}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--text)] mb-6">
              Discover Posts
            </h1>

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-text"
              />
              <CategoryFilter onCategoryChange={handleFilterChange} />
              <SortFilter onSortChange={handleSortChange} />
            </div>

            {/* Loading State */}
            {loading && (
              <LoadingSpinner size="lg" message="Loading posts ..." />
            )}

            {/* Error State */}
            {error && (
              <ErrorMessage
                message={error}
                actionText="Retry"
                onAction={() => window.location.reload()}
              />
            )}

            {/* No Results */}
            {!loading && !error && filteredPosts.length === 0 && (
              <EmptyState
                icon="🔍"
                title={
                  searchQuery
                    ? `No posts found for "${searchQuery}"`
                    : "No posts available"
                }
                message="Try adjusting your search or filters"
              />
            )}

            {/* Post Grid */}
            {!loading && !error && filteredPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <PostCard event={post} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </motion.div>
  );
}
