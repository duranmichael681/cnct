import { useState, useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import PostCard from "../components/PostCard";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import SortFilter from "../components/SortFilter";

interface Post {
  id: string;
  username?: string;
  timestamp?: string;
  eventName: string;
  location: string;
  time: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  initialRsvpCount?: number;
  initialIsRsvpd: boolean;
}

export default function ProfilePage() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'tags' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    // Mark that user has visited the app (for showing sidebar on info pages)
    sessionStorage.setItem('hasVisitedApp', 'true');
  }, []);
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      username: "you",
      timestamp: "3h ago",
      eventName: "Weekend Dog Walk",
      location: "PG6 105",
      time: "10:00 AM EST",
      description: "Join us for a relaxing morning walk with our furry friends! We'll meet at the Tech Station parking lot and walk the campus trails together.",
      tags: ["#dogs", "#outdoors", "#exercise"],
      imageUrl: "/src/assets/download (1).jfif",
      initialRsvpCount: 8,
      initialIsRsvpd: true
    },
    {
      id: "2",
      username: "you",
      timestamp: "1d ago",
      eventName: "Puppy Training Class",
      location: "GC 140",
      time: "2:00 PM EST",
      description: "Professional trainer leading a beginner-friendly session for puppies under 6 months. Bring treats and a leash! Meeting in Graham Center.",
      tags: ["#training", "#puppies", "#education"],
      imageUrl: "/src/assets/download (1).jfif",
      initialRsvpCount: 5,
      initialIsRsvpd: false
    },
    {
      id: "3",
      username: "you",
      timestamp: "2d ago",
      eventName: "Campus Study Group",
      location: "GL 220",
      time: "11:30 AM EST",
      description: "Study session for midterm prep at Green Library. Quiet study space, bring your own materials. Great for focused work and meeting study partners!",
      tags: ["#study", "#academics", "#library"],
      imageUrl: "/src/assets/download (1).jfif",
      initialRsvpCount: 12,
      initialIsRsvpd: true
    },
    {
      id: "4",
      username: "you",
      timestamp: "3d ago",
      eventName: "Engineering Project Meetup",
      location: "ECS 230",
      time: "9:00 AM EST",
      description: "Working on engineering projects? Join us at the Engineering and Computer Science Building to collaborate, share ideas, and get help from peers.",
      tags: ["#engineering", "#projects", "#collaboration"],
      imageUrl: "/src/assets/download (1).jfif",
      initialRsvpCount: 15,
      initialIsRsvpd: false
    }
  ]);

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

  const handleUpdatePost = (postId: string, updatedData: {
    eventName: string;
    location: string;
    time: string;
    description: string;
    tags: string[];
  }) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, ...updatedData }
          : post
      )
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard 
                  key={post.id}
                  postId={post.id}
                  username={post.username}
                  timestamp={post.timestamp}
                  eventName={post.eventName}
                  location={post.location}
                  time={post.time}
                  description={post.description}
                  tags={post.tags}
                  imageUrl={post.imageUrl}
                  initialRsvpCount={post.initialRsvpCount}
                  initialIsRsvpd={post.initialIsRsvpd}
                  isOwnProfile={true}
                  onUpdate={handleUpdatePost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
