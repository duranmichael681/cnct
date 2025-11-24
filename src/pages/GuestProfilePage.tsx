import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import PostCard from "../components/PostCard";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import SortFilter from "../components/SortFilter";

export default function GuestProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'tags' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    document.title = userId ? `CNCT | ${userId}` : 'CNCT | Profile';
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors">
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px]">
          {/* Profile Header - Guest View */}
          <ProfileHeader isOwnProfile={false} userId={userId} />

          {/* Sort Filter */}
          <section className="mt-6 flex justify-end">
            <SortFilter onSortChange={handleSortChange} />
          </section>

          {/* Post feed */}
          <section className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((id) => (
                <PostCard key={id} />
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
