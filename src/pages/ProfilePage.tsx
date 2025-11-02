import React from "react";
import ProfileHeader from "../components/ProfileHeader";
import PostCard from "../components/PostCard";
import StatsSection from "../components/StatsSection";
import GroupList from "../components/GroupList";

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page bg-amber-50 min-h-screen relative">
      {/* Header */}
      <ProfileHeader
        name="Mario Casas"
        pronouns="He/Him"
        major="Computer Science"
        profileImage="https://placehold.co/144x144"
      />

      {/* Sidebar Stats */}
      <StatsSection postsCount={5} followersCount={120} followingCount={80} />

      {/* Groups */}
      <GroupList groups={["Volleyball Events", "Coding Club", "Music Lovers"]} />

      {/* Posts */}
      <div className="posts-container flex flex-col items-center mt-16 space-y-8">
        <PostCard
          profileName="Mario Casas"
          eventDate="MM/DD/YY"
          eventLocation="FIU Campus"
          caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
        />
        <PostCard
          profileName="Mario Casas"
          eventDate="MM/DD/YY"
          eventLocation="Miami Beach"
          caption="Another exciting volleyball event!"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
