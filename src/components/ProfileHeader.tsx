import React from "react";

interface ProfileHeaderProps {
  name: string;
  pronouns: string;
  major: string;
  profileImage?: string;
  bio?: string;
  isFollowing?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  pronouns,
  major,
  profileImage,
  bio,
  isFollowing = false,
}) => {
  return (
    <div className="relative w-full h-[300px] bg-secondary">
      {/* Profile Picture */}
      <div className="profile-picture overflow-hidden">
        <img
          src={profileImage || "https://placehold.co/144x144"}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* User Info */}
      <div className="absolute top-52 left-28 text-center">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-xl font-bold">{pronouns}</p>
        <p className="text-xl font-bold">{major}</p>
      </div>

      {/* Bio */}
      {bio && (
        <p className="description">{bio}</p>
      )}

      {/* Follow Button */}
      <button className="follow-btn-bg">
        <span className="follow-btn-text">Follow</span>
      </button>

      {/* Small Action Button */}
      <button className="absolute top-24 left-[605px] w-12 h-10 bg-white rounded-[30px] text-black font-bold">
        ...
      </button>
    </div>
  );
};

export default ProfileHeader;
