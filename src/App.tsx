import ProfileHeader from "./components/ProfileHeader";
import PostCard from "./components/PostCard";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-amber-50 text-[var(--background)] transition-colors">
      {/* Navbar placeholder */}
      <div className="w-20 h-full fixed left-0 top-0 bg-sky-950" />

      <main className="ml-20 p-6">
        {/* Profile Header now includes GroupList */}
        <ProfileHeader />

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
  );
}
