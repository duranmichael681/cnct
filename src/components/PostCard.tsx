import React from "react";

interface PostCardProps {
  profileName: string;
  profileImage?: string;
  postImage?: string;
  eventDate: string;
  eventLocation: string;
  caption: string;
  commentsCount?: number;
  rsvpCount?: number;
}

const PostCard: React.FC<PostCardProps> = ({
  profileName,
  profileImage,
  postImage,
  eventDate,
  eventLocation,
  caption,
  commentsCount = 0,
  rsvpCount = 0,
}) => {
  return (
    <div className="post-card relative w-[694px] bg-white rounded-2xl shadow-lg p-4 mb-8">
      {/* Post Image */}
      {postImage && (
        <div className="w-full h-96 bg-zinc-300 rounded-2xl overflow-hidden">
          <img src={postImage} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Profile Info */}
      <div className="flex items-center mt-4">
        {profileImage && (
          <div className="w-8 h-8 bg-blue-950 rounded-full overflow-hidden">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <span className="ml-4 text-blue-950 font-semibold">{profileName}</span>
      </div>

      {/* Event Date & Location */}
      <div className="mt-2 text-blue-950 font-semibold text-lg text-center">{eventDate}</div>
      <div className="mt-2 text-blue-950 font-semibold text-lg text-center">{eventLocation}</div>

      {/* Caption */}
      <p className="mt-4 text-blue-950 font-bold text-lg">{caption}</p>

      {/* Stats */}
      <div className="flex mt-2 space-x-6 text-blue-950 font-black text-2xl">
        <span>💬 {commentsCount}</span>
        <span>🔗 {rsvpCount}</span>
      </div>
    </div>
  );
};

export default PostCard;
