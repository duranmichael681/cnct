import ProfileHeader from "../components/ProfileHeader";
import PostCard from "../components/PostCard";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors">
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        <main className="flex-1 p-6 pb-24 md:pb-6">
          {/* Profile Header */}
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
      <Footer />
    </div>
  );
}
