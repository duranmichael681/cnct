import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Flag, Ban, Share2, Edit, UserPlus, UserMinus, Settings, X, Plus } from "lucide-react";
import GroupList from "./GroupList";
import { type UserProfile } from "../services/api";
import { supabase } from "../supabase/client";

interface ProfileHeaderProps {
  isOwnProfile?: boolean;
  userId?: string;
  userProfile?: UserProfile;
  onProfileUpdate?: () => void;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  role?: string;
}

export default function ProfileHeader({ isOwnProfile = true, userId, userProfile, onProfileUpdate  }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [showEditGroups, setShowEditGroups] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [eventsHostedCount, setEventsHostedCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user stats and groups
  useEffect(() => {
    async function fetchUserData() {
      if (!userProfile?.id) {
        console.log('Skipping user data fetch - userProfile.id not available yet');
        return;
      }

      try {
        // Fetch events hosted count
        const eventsResponse = await fetch(`http://localhost:5000/api/profile/${userProfile.id}/posts`);
        const eventsData = await eventsResponse.json();
        if (eventsData.success) {
          setEventsHostedCount(eventsData.data?.length || 0);
        }

        // Fetch following count
        const followingResponse = await fetch(`http://localhost:5000/api/profile/${userProfile.id}/following`);
        const followingData = await followingResponse.json();
        if (followingData.success) {
          setFollowingCount(followingData.data?.length || 0);
        }

        // Fetch followers count
        const followersResponse = await fetch(`http://localhost:5000/api/profile/${userProfile.id}/followers`);
        const followersData = await followersResponse.json();
        if (followersData.success) {
          setFollowersCount(followersData.data?.length || 0);
        }

        // Fetch user groups
        const groupsResponse = await fetch(`http://localhost:5000/api/groups/user/${userProfile.id}`);
        const groupsData = await groupsResponse.json();
        if (groupsData.success) {
          setGroups(groupsData.data || []);
        }

        // Check if current user is following this profile (if not own profile)
        if (!isOwnProfile) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const followCheckResponse = await fetch(`http://localhost:5000/api/profile/${userProfile.id}/followers`);
            const followCheckData = await followCheckResponse.json();
            if (followCheckData.success) {
              const isCurrentlyFollowing = followCheckData.data?.some((f: any) => f.following_user_id === user.id);
              setIsFollowing(isCurrentlyFollowing || false);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, [userProfile?.id, isOwnProfile]);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    if (!userProfile?.id) {
      console.error('Cannot add group - userProfile.id not available');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('http://localhost:5000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ name: newGroupName.trim() })
      });

      const data = await response.json();
      if (data.success) {
        // Refetch groups to get updated list
        const groupsResponse = await fetch(`http://localhost:5000/api/groups/user/${userProfile.id}`);
        const groupsData = await groupsResponse.json();
        if (groupsData.success) {
          setGroups(groupsData.data || []);
        }
        setNewGroupName("");
      }
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  const handleRemoveGroup = async (groupId: string) => {
    if (!userProfile?.id) {
      console.error('Cannot remove group - userProfile.id not available');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/leave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        // Refetch groups to get updated list
        const groupsResponse = await fetch(`http://localhost:5000/api/groups/user/${userProfile.id}`);
        const groupsData = await groupsResponse.json();
        if (groupsData.success) {
          setGroups(groupsData.data || []);
        }
      }
    } catch (error) {
      console.error('Error removing group:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGroup();
    }
  };

  const handleFollowToggle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !userProfile?.id) return;

      const response = await fetch(`http://localhost:5000/api/users/${userProfile.id}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ follower_id: user.id })
      });

      const result = await response.json();
      if (result.success) {
        setIsFollowing(result.action === 'followed');
        // Update follower count
        if (result.action === 'followed') {
          setFollowersCount(prev => prev + 1);
        } else {
          setFollowersCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userProfile?.id) return;

    try {
      setUploading(true);

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64File = await base64Promise;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile.id}/avatar.${fileExt}`;

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to upload a profile picture');
        setUploading(false);
        return;
      }

      // Upload via backend API
      const uploadResponse = await fetch('http://localhost:5000/api/storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: base64File,
          bucket: 'profile_pictures',
          fileName: fileName,
          contentType: file.type
        })
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      const publicUrl = uploadResult.data.url;

      // Update user profile in database via backend API
      const updateResponse = await fetch(`http://localhost:5000/api/profile/${userProfile.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile_picture_url: publicUrl
        })
      });

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok || !updateResult.success) {
        throw new Error(updateResult.error || 'Profile update failed');
      }

      // Trigger parent component to refetch profile
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative bg-[var(--card-bg)] dark:bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-6 flex flex-col lg:flex-row justify-between items-stretch gap-6">
      {/* Left Section: Profile Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1 min-w-0">
        {/* Profile Picture with Upload - Bigger on desktop */}
        <div className="relative group flex-shrink-0">
          <div 
            className={`w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] rounded-full overflow-hidden ${isOwnProfile && !uploading ? 'cursor-pointer' : ''}`}
            onClick={isOwnProfile && !uploading ? handleProfilePictureClick : undefined}
          >
            {userProfile?.profile_picture_url ? (
              <img src={userProfile.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
          {/* Hover overlay with edit icon - only for own profile */}
          {isOwnProfile && !uploading && (
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
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Text Content - fills remaining space */}
        <div className="flex-1 text-center md:text-left min-w-0 flex flex-col justify-between">
          <div className="flex-1">
            {/* Name and Info */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-[var(--card-bg)] break-words">
                  {userProfile?.first_name} {userProfile?.last_name}
                </h1>
                {userProfile?.degree_program && (
                  <p className="text-base md:text-lg lg:text-2xl font-semibold text-[var(--card-bg)] mt-2">
                    {userProfile.degree_program}
                  </p>
                )}
                {userProfile?.pronouns && (
                  <p className="text-sm md:text-base lg:text-xl text-[var(--card-bg)] opacity-80 mt-1 italic">
                    {userProfile.pronouns}
                  </p>
                )}
                
                {/* Stats - Mobile only, right after name/pronouns/major */}
                <div className="lg:hidden mt-3 flex flex-row gap-4 text-[var(--card-bg)]">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold">{eventsHostedCount}</span>
                    <span className="text-xs opacity-80 whitespace-nowrap">{eventsHostedCount === 1 ? 'Event' : 'Events'}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold">{followersCount}</span>
                    <span className="text-xs opacity-80">{followersCount === 1 ? 'Follower' : 'Followers'}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold">{followingCount}</span>
                    <span className="text-xs opacity-80">Following</span>
                  </div>
                </div>
              </div>
              
              {/* Stats - Desktop, vertically centered with name */}
              <div className="hidden lg:flex flex-row gap-6 text-[var(--card-bg)]">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{eventsHostedCount}</span>
                  <span className="text-sm opacity-80 whitespace-nowrap">{eventsHostedCount === 1 ? 'Event' : 'Events'}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{followersCount}</span>
                  <span className="text-sm opacity-80">{followersCount === 1 ? 'Follower' : 'Followers'}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{followingCount}</span>
                  <span className="text-sm opacity-80">Following</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {userProfile?.description && (
              <p className="mt-4 text-sm md:text-base lg:text-lg text-[var(--card-bg)] opacity-80 break-words">
                {userProfile.description}
              </p>
            )}
          </div>

          {/* Buttons - positioned lower */}
          <div className="mt-6 flex gap-3 items-center justify-center md:justify-start flex-wrap">
            {isOwnProfile ? (
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] shadow-md hover:shadow-lg"
              >
                <Settings size={18} />
                Edit Profile
              </button>
            ) : (
              <>                {!isFollowing ? (
                  <button
                    onClick={handleFollowToggle}
                    className="flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] shadow-md hover:shadow-lg"
                  >
                    <UserPlus size={18} />
                    Follow
                  </button>
                ) : showUnfollowConfirm ? (
                  <button
                    onClick={async () => {
                      await handleFollowToggle();
                      setShowUnfollowConfirm(false);
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

            {!isOwnProfile && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg bg-[var(--menucard)] dark:bg-[var(--tertiary)] hover:bg-[var(--menucard-hover)] transition-all cursor-pointer text-[var(--text)]"
                >
                  <MoreVertical size={20} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-lg shadow-2xl overflow-hidden z-20">
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        alert('User reported. Our team will review this report.');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-[var(--menucard)] flex items-center gap-2 text-[var(--text)] font-medium cursor-pointer transition-colors"
                    >
                      <Flag size={16} />
                      Report
                    </button>
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        alert('User blocked. You will no longer see their content.');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-[var(--menucard)] flex items-center gap-2 text-[var(--danger)] font-medium cursor-pointer transition-colors"
                    >
                      <Ban size={16} />
                      Block User
                    </button>
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        const profileUrl = window.location.href;
                        navigator.clipboard.writeText(profileUrl);
                        alert('Profile link copied to clipboard!');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-[var(--menucard)] flex items-center gap-2 text-[var(--text)] font-medium cursor-pointer transition-colors"
                    >
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

      {/* Right Section: Groups */}
      <div className="w-full lg:w-[30%] lg:max-w-[350px] flex-shrink-0 hidden lg:block">
        <div className="bg-[var(--menucard)] dark:bg-[var(--tertiary)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[var(--card-bg)] mb-3">Groups</h3>
          {groups.length === 0 ? (
            <p className="text-center text-[var(--text)] opacity-60 py-4">No groups</p>
          ) : (
            <GroupList groups={groups} />
          )}
        </div>
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
                  <p className="text-center text-[var(--text)] opacity-60 py-8">
                    No groups
                  </p>
                ) : (
                  <div className="space-y-2">
                    {groups.map((group) => (
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
                    ))}
                  </div>
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
