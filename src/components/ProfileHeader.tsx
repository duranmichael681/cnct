import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Flag, Ban, Share2, Edit, UserPlus, UserMinus, Settings, X, Plus } from "lucide-react";
import GroupList from "./GroupList";
import { type UserProfile } from "../services/api";

interface ProfileHeaderProps {
  isOwnProfile?: boolean;
  userId?: string;
  userProfile : UserProfile;
}

export default function ProfileHeader({ isOwnProfile = true, userId, userProfile  }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showEditGroups, setShowEditGroups] = useState(false);
  const [groups, setGroups] = useState([
    { id: 1, name: "Volleyball Events" },
    { id: 2, name: "Art Club" },
    { id: 3, name: "Tech Talks" },
  ]);
  console.log(userProfile);
  const [newGroupName, setNewGroupName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      setGroups([...groups, { id: Date.now(), name: newGroupName.trim() }]);
      setNewGroupName("");
    }
  };

  const handleRemoveGroup = (groupId: number) => {
    setGroups(groups.filter(g => g.id !== groupId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGroup();
    }
  };

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
            className={`w-32 h-32 bg-[var(--menucard)] dark:bg-[var(--tertiary)] rounded-full shrink-0 overflow-hidden ${isOwnProfile ? 'cursor-pointer' : ''}`}
            onClick={isOwnProfile ? handleProfilePictureClick : undefined}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) :
             userProfile ? (
              <img src={profileImage as string} alt="Profile" className="w-full h-full object-cover" />
            ) :
             (
              <div className="w-full h-full" />
            )}
          </div>
          {/* Hover overlay with edit icon - only for own profile */}
          {isOwnProfile && (
            <>
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
            </>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[var(--card-bg)] animate-fade-in">
            {userProfile?.first_name} {userProfile?.last_name}
          </h1>
          <p className="text-lg font-semibold text-[var(--card-bg)] animate-fade-in-delay-1">
            {userProfile?.pronouns} • {userProfile?.degree_program}
          </p>
          <p className="mt-2 max-w-2xl text-[var(--card-bg)] opacity-80 animate-fade-in-delay-2">
            {userProfile?.description}
          </p>

          {/* Buttons */}
          <div className="mt-4 flex gap-3 items-center">
            {isOwnProfile ? (
              // Admin view - Edit Profile button
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] shadow-md hover:shadow-lg"
              >
                <Settings size={18} />
                Edit Profile
              </button>
            ) : (
              // Guest view - Follow button
              <>
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
              </>
            )}

            {/* More Options Button - Only show for guest profiles */}
            {!isOwnProfile && (
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
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Scrollable Group List */}
      <div className="w-full lg:w-[30%] lg:max-w-[350px] flex-shrink-0">
        <GroupList groups={groups} />
        {isOwnProfile && (
          <button
            onClick={() => setShowEditGroups(true)}
            className="w-full mt-3 px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] font-bold transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            Edit Groups
          </button>
        )}
      </div>

      {/* Edit Groups Modal */}
      {showEditGroups && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
          onClick={() => setShowEditGroups(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--card-bg)] rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-2xl font-bold text-[var(--text)]">Edit Groups</h2>
              <button
                onClick={() => setShowEditGroups(false)}
                className="p-2 hover:bg-[var(--menucard)] rounded-full transition-colors cursor-pointer"
              >
                <X size={24} className="text-[var(--text)]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Add Group Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                  Add New Group
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter group name"
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <button
                    onClick={handleAddGroup}
                    className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add
                  </button>
                </div>
              </div>

              {/* Groups List */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
                  Your Groups ({groups.length})
                </h3>
                {groups.length === 0 ? (
                  <p className="text-center text-[var(--text-secondary)] py-8">
                    No groups yet. Add one above!
                  </p>
                ) : (
                  groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--menucard)] dark:bg-[var(--tertiary)] border border-[var(--border)]"
                    >
                      <span className="font-semibold text-[var(--text)] break-words flex-1 mr-2">
                        {group.name}
                      </span>
                      <button
                        onClick={() => handleRemoveGroup(group.id)}
                        className="p-1.5 hover:bg-red-500 hover:text-white rounded-full transition-all cursor-pointer text-[var(--danger)]"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--border)]">
              <button
                onClick={() => setShowEditGroups(false)}
                className="w-full px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] rounded-lg font-bold transition-all cursor-pointer shadow-md hover:shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
