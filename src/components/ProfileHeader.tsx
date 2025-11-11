import { useState, useRef } from "react";
import { MoreVertical, Flag, Ban, Share2, Edit, UserPlus, UserMinus } from "lucide-react";
import GroupList from "./GroupList";

export default function ProfileHeader() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative bg-[var(--card-bg)] dark:bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-6 flex flex-col lg:flex-row justify-between items-start gap-6">
      {/* Left Section: Profile Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1 min-w-0">
        {/* Profile Picture with Upload */}
        <div className="relative group">
          <div 
            className="w-32 h-32 bg-[var(--menucard)] dark:bg-[var(--tertiary)] rounded-full shrink-0 overflow-hidden cursor-pointer"
            onClick={handleProfilePictureClick}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
          {/* Hover overlay with edit icon */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleProfilePictureClick}
          >
            <Edit size={32} color="white" />
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[var(--card-bg)] animate-fade-in">
            Person's Name
          </h1>
          <p className="text-lg font-semibold text-[var(--card-bg)] animate-fade-in-delay-1">
            Pronouns • Major
          </p>
          <p className="mt-2 max-w-2xl text-[var(--card-bg)] opacity-80 animate-fade-in-delay-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam...
          </p>

          {/* Buttons */}
          <div className="mt-4 flex gap-3 items-center">
            {!isFollowing ? (
              <button
                onClick={() => setIsFollowing(true)}
                className="flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] shadow-md hover:shadow-lg"
              >
                <UserPlus size={18} />
                Follow
              </button>
            ) : showUnfollowConfirm ? (
              <button
                onClick={() => {
                  setIsFollowing(false)
                  setShowUnfollowConfirm(false)
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all cursor-pointer bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
              >
                <UserMinus size={18} />
                Unfollow?
              </button>
            ) : (
              <button
                onClick={() => setShowUnfollowConfirm(true)}
                className="flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all cursor-pointer bg-[var(--menucard)] dark:bg-[var(--tertiary)] text-[var(--text)] hover:opacity-90"
              >
                <UserMinus size={18} />
                Following
              </button>
            )}

            {/* More Options Button with Click Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg bg-[var(--menucard)] dark:bg-[var(--tertiary)] hover:opacity-90 transition-all cursor-pointer text-[var(--text)]"
              >
                <MoreVertical size={20} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-lg shadow-2xl overflow-hidden z-20">
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[var(--menucard)] dark:hover:bg-[var(--menucard)] flex items-center gap-2 text-[var(--text)] font-medium cursor-pointer transition-colors">
                    <Flag size={16} />
                    Report
                  </button>
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[var(--menucard)] dark:hover:bg-[var(--menucard)] flex items-center gap-2 text-[var(--danger)] font-medium cursor-pointer transition-colors">
                    <Ban size={16} />
                    Block User
                  </button>
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[var(--menucard)] dark:hover:bg-[var(--menucard)] flex items-center gap-2 text-[var(--text)] font-medium cursor-pointer transition-colors">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Scrollable Group List */}
      <div className="w-full lg:w-[30%] lg:max-w-[350px] flex-shrink-0">
          <GroupList />
      </div>
    </div>
  );
}
