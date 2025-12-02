import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { MoreVertical, Flag, Ban, Share2, MapPin, Clock, MessageCircle, Link, Send, EyeOff, Unlink, Pencil, Trash2, ThumbsUp, ThumbsDown, Edit3, Plus, X } from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import ShareModal from "./ShareModal";
import { supabase } from "../lib/supabaseClient";
import type { Post } from "../services/api";

interface Tag {
  id: string;
  code: string;
}

interface Building {
  building_code: string;
  building_name: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  profilePicture: string | null;
  text: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
}

interface PostCardProps {
  event: Post;
  isOwnProfile?: boolean;
  initialOpen?: boolean;
  onUpdate?: (postId: string, updatedData: {
    eventName: string;
    location: string;
    time: string;
    description: string;
    tags: string[];
  }) => void;
  onDelete?: (postId: string) => void;
  onClose?: () => void;
}

export default function PostCard({
  event,
  isOwnProfile = false,
  initialOpen = false,
  onUpdate,
  onDelete,
  onClose,
}: PostCardProps) {
  const navigate = useNavigate();
  const location_route = useLocation();
  
  // Fetch dynamic data from Supabase
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [postTags, setPostTags] = useState<Tag[]>([]);
  const [organizerUsername, setOrganizerUsername] = useState<string>("");
  const [organizerProfilePic, setOrganizerProfilePic] = useState<string | null>(null);
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [locationDisplay, setLocationDisplay] = useState<string>("");
  
  // Format location display helper
  const formatLocationDisplay = (buildingStr: string | null, buildingsList: Building[]): string => {
    if (!buildingStr) return 'Location TBD';
    
    // Check if there's a room number (e.g., "PG6 123" or "PG6-123")
    const match = buildingStr.match(/^([A-Z0-9]+)[\s-]*([\d]+)?$/i);
    
    if (match) {
      const buildingCode = match[1].toUpperCase();
      const roomNumber = match[2];
      
      // Find the full building name
      const building = buildingsList.find(b => b.building_code === buildingCode);
      const fullBuildingName = building ? `${buildingCode} - ${building.building_name}` : buildingCode;
      
      // Add room number if it exists
      return roomNumber ? `${fullBuildingName}, Room ${roomNumber}` : fullBuildingName;
    }
    
    // If format doesn't match, try to find just the building code
    const building = buildingsList.find(b => b.building_code === buildingStr.toUpperCase());
    return building ? `${building.building_code} - ${building.building_name}` : buildingStr;
  };
  
  // UI State
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedEventName, setEditedEventName] = useState("");
  const [editedBuildingCode, setEditedBuildingCode] = useState("");
  const [editedRoomNumber, setEditedRoomNumber] = useState("");
  const [editedDate, setEditedDate] = useState<Dayjs | null>(dayjs());
  const [editedTimeHour, setEditedTimeHour] = useState("12");
  const [editedTimeMinute, setEditedTimeMinute] = useState("00");
  const [editedTimePeriod, setEditedTimePeriod] = useState("PM");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isRsvpd, setIsRsvpd] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [isRsvpLoading, setIsRsvpLoading] = useState(false);
  const [isRsvpHovered, setIsRsvpHovered] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    { id: "1", userId: "101", username: "user1", text: "This looks amazing!", timestamp: "1h ago", upvotes: 5, downvotes: 0, userVote: null },
    { id: "2", userId: "102", username: "user2", text: "Count me in!", timestamp: "30m ago", upvotes: 3, downvotes: 0, userVote: null },
    { id: "3", userId: "103", username: "user3", text: "Can't wait!", timestamp: "15m ago", upvotes: 8, downvotes: 1, userVote: null },
    { id: "4", userId: "104", username: "user4", text: "So excited for this!", timestamp: "45m ago", upvotes: 2, downvotes: 0, userVote: null },
    { id: "5", userId: "105", username: "user5", text: "Thanks for organizing!", timestamp: "50m ago", upvotes: 6, downvotes: 0, userVote: null },
    { id: "6", userId: "106", username: "user6", text: "Will there be food?", timestamp: "1h ago", upvotes: 4, downvotes: 2, userVote: null },
    { id: "7", userId: "107", username: "user7", text: "I'll bring my friends!", timestamp: "2h ago", upvotes: 7, downvotes: 0, userVote: null },
  ]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Mock user ID - in a real app, this would come from props or context
  const mockUserId = "123";

  // Fetch dynamic data on mount
  useEffect(() => {
    async function fetchData() {
      // Fetch buildings
      const { data: buildingsData } = await supabase
        .from('fiu_buildings')
        .select('building_code, building_name')
        .order('building_code', { ascending: true });
      if (buildingsData) {
        setBuildings(buildingsData);
        // Set location display once buildings are loaded
        setLocationDisplay(formatLocationDisplay(event.building, buildingsData));
      }

      // Fetch all tags
      const { data: tagsData } = await supabase
        .from('tags')
        .select('id, code')
        .order('code', { ascending: true });
      if (tagsData) setAvailableTags(tagsData);

      // Fetch post tags
      const { data: postTagsData, error: tagsError } = await supabase
        .from('post_tags')
        .select('tag_id, tags(id, code)')
        .eq('post_id', event.id);
      
      if (tagsError) {
        console.error('Error fetching post tags:', tagsError);
      } else if (postTagsData) {
        const tags = postTagsData
          .map(pt => pt.tags)
          .filter((t): t is Tag => t !== null);
        setPostTags(tags);
      }

      // Fetch organizer info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('first_name, last_name, profile_picture_url')
        .eq('id', event.organizer_id)
        .single();
      
      if (userError) {
        console.error('Error fetching user:', userError);
        setOrganizerUsername('Unknown User');
      } else if (userData) {
        const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
        setOrganizerUsername(fullName || 'Unknown User');
        // Only set profile pic if it's a valid non-empty URL
        setOrganizerProfilePic(userData.profile_picture_url && userData.profile_picture_url.trim() ? userData.profile_picture_url : null);
      }

      // Fetch RSVP status and count
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if current user has RSVP'd
        const { data: rsvpData } = await supabase
          .from('attendees')
          .select('id')
          .eq('posts_id', event.id)
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        setIsRsvpd(!!rsvpData);

        // Get total RSVP count
        const { count } = await supabase
          .from('attendees')
          .select('*', { count: 'exact', head: true })
          .eq('posts_id', event.id);
        
        setRsvpCount(count || 0);
      }

      // Fetch comments
      try {
        const response = await fetch(`http://localhost:5000/api/comments/post/${event.id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const formatTimeAgo = (timestamp: string) => {
            const now = new Date();
            const created = new Date(timestamp);
            const diffMs = now.getTime() - created.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            
            if (diffMins < 1) return 'just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours}h ago`;
            const diffDays = Math.floor(diffHours / 24);
            if (diffDays < 7) return `${diffDays}d ago`;
            const diffWeeks = Math.floor(diffDays / 7);
            if (diffWeeks < 4) return `${diffWeeks}w ago`;
            const diffMonths = Math.floor(diffDays / 30);
            return `${diffMonths}mo ago`;
          };
          
          const formattedComments = result.data.map((c: any) => ({
            id: c.id,
            userId: c.user_id,
            username: c.users ? `${c.users.first_name || ''} ${c.users.last_name || ''}`.trim() : 'Unknown',
            profilePicture: c.users?.profile_picture_url || null,
            text: c.text,
            timestamp: formatTimeAgo(c.created_at),
            upvotes: c.upvotes,
            downvotes: c.downvotes,
            userVote: null // TODO: Fetch user's vote from comment_votes
          }));
          setComments(formattedComments);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }

      // Fetch RSVP info
      const { data: attendeesData, error: attendeesError } = await supabase
        .from('attendees')
        .select('user_id')
        .eq('posts_id', event.id);
      
      if (attendeesError) {
        console.error('Error fetching attendees:', attendeesError);
      } else if (attendeesData) {
        setRsvpCount(attendeesData.length);
        setIsRsvpd(attendeesData.some(a => a.user_id === mockUserId));
      }

      // Calculate time ago
      if (event.created_at) {
        const now = new Date();
        // Ensure created_at is parsed as UTC by adding 'Z' if missing
        const createdAtString = event.created_at.endsWith('Z') ? event.created_at : event.created_at + 'Z';
        const created = new Date(createdAtString);
        const diffMs = now.getTime() - created.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) setTimeAgo('Just now');
        else if (diffMins < 60) setTimeAgo(`${diffMins}m ago`);
        else if (diffHours < 24) setTimeAgo(`${diffHours}h ago`);
        else setTimeAgo(`${diffDays}d ago`);
      } else {
        setTimeAgo('Recently');
      }
    }

    fetchData();
  }, [event.id, event.organizer_id, event.created_at, event.building]);

  // Determine if we're on home or discover page
  const isHomeOrDiscover = location_route.pathname === '/home' || location_route.pathname === '/discover';

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${event.organizer_id}`);
  };

  const handleCommentUserClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    navigate(`/profile/${userId}`);
  };

  const handleRsvp = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRsvpLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to RSVP');
        setIsRsvpLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/posts/${event.id}/toggle-attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update UI based on action
        const newRsvpState = result.action === 'joined';
        setIsRsvpd(newRsvpState);
        setRsvpCount(prev => newRsvpState ? prev + 1 : prev - 1);
      } else {
        console.error('RSVP failed:', result.error);
        alert('Failed to update RSVP');
      }
    } catch (error) {
      console.error('Failed to RSVP:', error);
      alert('Failed to update RSVP');
    } finally {
      setIsRsvpLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to comment');
        return;
      }

      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          post_id: event.id,
          text: newComment.trim()
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Add new comment to top of list
        const newCommentData: Comment = {
          id: result.data.id,
          userId: result.data.user_id,
          username: result.data.users ? `${result.data.users.first_name || ''} ${result.data.users.last_name || ''}`.trim() : 'Unknown',
          text: result.data.text,
          timestamp: 'Just now',
          upvotes: 0,
          downvotes: 0,
          userVote: null
        };
        setComments(prev => [newCommentData, ...prev]);
        setNewComment('');
        setShowEmojiPicker(false);
      } else {
        console.error('Comment creation failed:', result.error);
        alert('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    }
  };

  const handleEditComment = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  const handleSaveCommentEdit = (commentId: string) => {
    if (editingCommentText.trim()) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, text: editingCommentText }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditingCommentText("");
      // In a real app: await fetch(`/api/events/${postId}/comments/${commentId}`, { method: 'PUT', body: JSON.stringify({ text: editingCommentText }) });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to delete comments');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      } else {
        console.error('Comment deletion failed:', result.error);
        alert(result.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const handleLoadMoreComments = async () => {
    setIsLoadingMore(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setVisibleCommentsCount(prev => prev + 5);
    setIsLoadingMore(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewComment(prev => prev + emoji);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentVote = async (commentId: string, voteType: 'up' | 'down') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to vote');
        return;
      }

      // Get current vote for this comment
      const currentComment = comments.find(c => c.id === commentId);
      const currentVote = currentComment?.userVote;
      
      // Determine new vote (toggle if same, otherwise switch)
      const newVote = currentVote === voteType ? null : voteType;

      const response = await fetch(`http://localhost:5000/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vote_type: newVote })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update local state with new vote counts
        setComments(prev =>
          prev.map(comment => {
            if (comment.id !== commentId) return comment;
            return {
              ...comment,
              upvotes: result.data.upvotes,
              downvotes: result.data.downvotes,
              userVote: newVote
            };
          })
        );
      } else {
        console.error('Vote failed:', result.error);
        alert('Failed to vote on comment');
      }
    } catch (error) {
      console.error('Error voting on comment:', error);
      alert('Failed to vote on comment');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareModal(true);
    setShowMenu(false);
  };

  const handleReport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    // In a real app, open report modal or make API call
    alert('Report functionality will be implemented. This post will be reported to moderators.');
    // await fetch(`/api/events/${postId}/report`, { method: 'POST' });
  };

  const handleBlockUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    // In a real app, make API call and update user preferences
    if (confirm(`Are you sure you want to block ${organizerUsername}?`)) {
      alert(`User ${organizerUsername} has been blocked. You won't see their posts anymore.`);
      // await fetch(`/api/users/${mockUserId}/block`, { method: 'POST', body: JSON.stringify({ blockUserId: event.organizer_id }) });
    }
  };

  const handleNotInterested = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    // Remove associated tags from user preferences
    const tagNames = postTags.map(t => `#${t.code}`).join(', ');
    alert(`This post has been marked as "Not Interested". We'll show you less content like this. Tags affected: ${tagNames}`);
    // In a real app:
    // await fetch(`/api/users/${mockUserId}/preferences`, { method: 'PUT', body: JSON.stringify({ removeTags: postTags.map(t => t.id) }) });
    // Then remove the post from the feed
  };

  const handleEditPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    
    // Reset edit values to current values
    setEditedEventName(event.title);
    setEditedDescription(event.body);
    setEditedTags(postTags.map(t => t.id));
    
    // Parse location - building field now only contains building_code (FK constraint)
    // Room numbers are not stored in the database currently
    setEditedBuildingCode(event.building || "");
    setEditedRoomNumber(""); // Room number feature not yet implemented in schema
    
    // Parse date and time from start_date
    // Database stores 'timestamp without time zone', so parse it as-is without timezone conversion
    const dateString = event.start_date.includes('T') ? event.start_date.split('T')[0] : event.start_date.split(' ')[0];
    const timeString = event.start_date.includes('T') ? event.start_date.split('T')[1].substring(0, 5) : event.start_date.split(' ')[1].substring(0, 5);
    
    const startDate = new Date(event.start_date.replace('Z', ''));
    
    // Set the date for the date picker
    setEditedDate(dayjs(startDate));
    
    // Get hours and minutes directly from the timestamp string
    const [hourStr, minuteStr] = timeString.split(':');
    let hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    setEditedTimeHour(hours.toString());
    setEditedTimeMinute(minutes.toString().padStart(2, '0'));
    setEditedTimePeriod(period);
    
    setShowEditModal(true);
  };

  const handleSavePostEdit = async () => {
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to edit a post');
        return;
      }

      // Format location - building field in DB only stores building_code (FK constraint)
      // Room number is not stored separately in current schema
      const formattedLocation = editedBuildingCode || null;

      // Format date and time into ISO string using edited date
      if (!editedDate) {
        alert('Please select a date');
        return;
      }
      
      // Convert time to 24-hour format
      let hours = parseInt(editedTimeHour);
      if (editedTimePeriod === 'PM' && hours !== 12) hours += 12;
      if (editedTimePeriod === 'AM' && hours === 12) hours = 0;
      
      // Build timestamp string directly without Date constructor to avoid any timezone conversion
      const year = editedDate.year();
      const month = editedDate.month() + 1; // dayjs months are 0-11
      const day = editedDate.date();
      const minutes = parseInt(editedTimeMinute);
      
      // Format as 'YYYY-MM-DD HH:MM:SS' - direct string formatting
      const pad = (n: number) => n.toString().padStart(2, '0');
      const isoString = `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:00`;

      const updatePayload = {
        title: editedEventName,
        body: editedDescription,
        building: formattedLocation,
        start_date: isoString,
        // Note: Tags update would require separate API call to post_tags table
      };

      const response = await fetch(`http://localhost:5000/api/posts/${event.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update tags if they changed
        const currentTagIds = postTags.map(t => t.id).sort();
        const newTagIds = [...editedTags].sort();
        const tagsChanged = JSON.stringify(currentTagIds) !== JSON.stringify(newTagIds);

        if (tagsChanged) {
          // Delete all existing tags
          await supabase
            .from('post_tags')
            .delete()
            .eq('post_id', event.id);

          // Insert new tags
          if (editedTags.length > 0) {
            const tagInserts = editedTags.map(tagId => ({
              post_id: event.id,
              tag_id: parseInt(tagId)
            }));

            await supabase
              .from('post_tags')
              .insert(tagInserts);
          }
          
          // Refetch tags to update UI immediately
          const { data: postTagsData, error: tagsError } = await supabase
            .from('post_tags')
            .select('tag_id, tags!inner(id, code)')
            .eq('post_id', event.id);
          
          if (!tagsError && postTagsData) {
            const tags: Tag[] = postTagsData
              .map((pt: any) => ({
                id: String(pt.tags.id),
                code: String(pt.tags.code)
              }))
              .filter((t: Tag) => t.id && t.code);
            setPostTags(tags);
          }
        }

        alert('Post updated successfully!');
        setShowEditModal(false);
      } else {
        alert(`Failed to update post: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('An error occurred while updating the post');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedTags.includes(newTag.trim())) {
      const formattedTag = newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
      setEditedTags([...editedTags, formattedTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const handleDeletePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        // Get auth token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          alert('You must be logged in to delete a post');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/posts/${event.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert('Post deleted successfully!');
          // Call the parent onDelete callback if provided
          if (onDelete) {
            onDelete(event.id);
          }
          // Refresh the page or navigate away
          window.location.reload();
        } else {
          alert(`Failed to delete post: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('An error occurred while deleting the post');
      }
    }
  };

  const postUrl = `${window.location.origin}/event/${event.id}`;

  return (
    <>
      {/* Compact Card (preview) */}
      <div
        className="cursor-pointer bg-[var(--card-bg)] rounded-lg shadow-md p-3 md:p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] border border-transparent hover:border-[var(--primary)] relative"
      >
        {/* Three-dot menu button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-[var(--menucard)] rounded-full transition-colors cursor-pointer"
            aria-label="More options"
          >
            <MoreVertical size={20} color="var(--text-secondary)" />
          </button>
          
          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-10">
              <button
                onClick={handleReport}
                className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer rounded-t-lg"
              >
                <Flag size={16} />
                Report
              </button>
              {!isOwnProfile && (
                <button
                  onClick={handleBlockUser}
                  className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--danger)] cursor-pointer"
                >
                  <Ban size={16} />
                  Block User
                </button>
              )}
              {isHomeOrDiscover ? (
                <button
                  onClick={handleNotInterested}
                  className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer rounded-b-lg"
                >
                  <EyeOff size={16} />
                  Not Interested
                </button>
              ) : isOwnProfile ? (
                <>
                  <button
                    onClick={handleEditPost}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer"
                  >
                    <Edit3 size={16} />
                    Edit Post
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--danger)] cursor-pointer rounded-b-lg"
                  >
                    <Trash2 size={16} />
                    Delete Post
                  </button>
                </>
              ) : (
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer rounded-b-lg"
                >
                  <Share2 size={16} />
                  Share
                </button>
              )}
            </div>
          )}
        </div>

        <div onClick={() => setIsOpen(true)}>
          {/* User + Timestamp */}
          <div 
            className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 cursor-pointer hover:opacity-80 transition-opacity max-w-full"
            onClick={handleUserClick}
          >
            {/* Circular profile picture container */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)]">
              {organizerProfilePic ? (
                <img 
                  src={organizerProfilePic} 
                  alt={organizerUsername} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm md:text-base text-[var(--text)] hover:text-[var(--primary)] transition-colors truncate">{organizerUsername || 'Loading...'}</p>
              <p className="text-xs md:text-sm text-[var(--text-secondary)]">{timeAgo}</p>
            </div>
          </div>

          {/* Event Name */}
          <h3 className="text-base md:text-lg font-semibold text-[var(--text)] mb-2 md:mb-3 hover:text-[var(--primary)] transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Event Info */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 text-xs md:text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="md:w-4 md:h-4 fill-[var(--primary)] dark:fill-transparent stroke-[var(--primary)] flex-shrink-0" />
              <span className="truncate">{locationDisplay || 'Location TBD'}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock size={14} className="md:w-4 md:h-4 fill-[var(--primary)] dark:fill-transparent stroke-[var(--primary)] flex-shrink-0" />
              <span className="truncate">{new Date(event.start_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Post Image */}
          <div className="w-full h-48 md:h-56 bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/20 to-[var(--tertiary)]/20 rounded-lg overflow-hidden group flex items-center justify-center">
            {event.post_picture_url ? (
              <img src={event.post_picture_url} alt={event.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/30 via-[var(--secondary)]/30 to-[var(--tertiary)]/30 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <div className="text-[var(--text-secondary)] text-4xl font-bold opacity-20">📸</div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 md:gap-6 mt-2 md:mt-3 text-[var(--text-secondary)]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRsvp(e);
              }}
              disabled={isRsvpLoading}
              onMouseEnter={() => setIsRsvpHovered(true)}
              onMouseLeave={() => setIsRsvpHovered(false)}
              className={`flex items-center gap-1 transition-all hover:scale-110 transform duration-200 ${
                isRsvpd ? 'text-[var(--primary)] font-bold' : 'hover:text-[var(--primary)]'
              } ${isRsvpLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={isRsvpd ? 'Cancel RSVP' : 'RSVP to event'}
            >
              {isRsvpd && isRsvpHovered ? (
                <Unlink size={16} className="md:w-5 md:h-5 stroke-[var(--danger)]" />
              ) : (
                <Link size={16} className={`md:w-5 md:h-5 ${isRsvpd ? 'fill-[var(--primary)]' : 'fill-transparent'} stroke-[var(--primary)]`} />
              )}
              <span className="text-xs md:text-sm">{rsvpCount}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleComments(e);
              }}
              className="flex items-center gap-1 cursor-pointer hover:text-[var(--primary)] transition-colors hover:scale-110 transform duration-200"
              aria-label={showComments ? "Hide comments" : "Show comments"}
            >
              <MessageCircle size={16} className="md:w-5 md:h-5 fill-transparent stroke-[var(--primary)]" />
              <span className="text-xs md:text-sm">{comments.length}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare(e);
              }}
              className="flex items-center gap-1 cursor-pointer hover:text-[var(--primary)] transition-colors hover:scale-110 transform duration-200"
              aria-label="Share event"
            >
              <Share2 size={16} className="md:w-5 md:h-5 fill-transparent stroke-[var(--primary)]" />
              <span className="text-xs md:text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal (expanded view) - Rendered as Portal */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-md p-2 sm:p-4"
          onClick={() => {
            setIsOpen(false);
            setShowMenu(false);
            onClose?.();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--card-bg)] rounded-xl shadow-2xl w-full h-full sm:h-auto sm:max-w-3xl sm:max-h-[95vh] overflow-y-auto p-4 sm:p-6 relative animate-fadeIn"
          >
            {/* Three-dot menu in modal */}
            <div className="absolute top-16 right-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 hover:bg-[var(--menucard)] rounded-full transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreVertical size={20} color="var(--text-secondary)" />
              </button>
              
              {showMenu && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-10"
                >
                  <button
                    onClick={handleReport}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer rounded-t-lg"
                  >
                    <Flag size={16} />
                    Report
                  </button>
                  {!isOwnProfile && (
                    <button
                      onClick={handleBlockUser}
                      className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--danger)] cursor-pointer"
                    >
                      <Ban size={16} />
                      Block User
                    </button>
                  )}
                  {isHomeOrDiscover ? (
                    <button
                      onClick={handleNotInterested}
                      className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer rounded-b-lg"
                    >
                      <EyeOff size={16} />
                      Not Interested
                    </button>
                  ) : isOwnProfile ? (
                    <>
                      <button
                        onClick={handleEditPost}
                        className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer"
                      >
                        <Edit3 size={16} />
                        Edit Post
                      </button>
                      <button
                        onClick={handleDeletePost}
                        className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--danger)] cursor-pointer rounded-b-lg"
                      >
                        <Trash2 size={16} />
                        Delete Post
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleShare}
                      className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer rounded-b-lg"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowMenu(false);
                onClose?.();
              }}
              className="absolute top-5 right-5.5 text-[var(--text-secondary)] hover:text-[var(--text)] text-2xl hover:rotate-90 transition-all duration-300 cursor-pointer"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Event Header */}
            <div 
              className="flex items-center gap-4 mb-4 cursor-pointer hover:opacity-80 transition-opacity w-fit max-w-full"
              onClick={handleUserClick}
            >
              {/* Circular profile picture container */}
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)]">
                {organizerProfilePic ? (
                  <img 
                    src={organizerProfilePic} 
                    alt={organizerUsername} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[var(--text)] hover:text-[var(--primary)] transition-colors truncate">{organizerUsername || 'Loading...'}</p>
                <p className="text-sm text-[var(--text-secondary)]">{timeAgo}</p>
              </div>
            </div>

            {/* Big Event Name */}
            <h2 className="text-2xl font-bold text-[var(--text)] mb-3">
              {event.title}
            </h2>

            {/* Event Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-1">
                <MapPin size={16} className="fill-[var(--primary)] dark:fill-transparent stroke-[var(--primary)]" />
                <span>{locationDisplay || 'Location TBD'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} className="fill-[var(--primary)] dark:fill-transparent stroke-[var(--primary)]" />
                <span>{new Date(event.start_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Image */}
            <div className="w-full aspect-video bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/20 to-[var(--tertiary)]/20 rounded-lg mb-4 overflow-hidden">
              {event.post_picture_url ? (
                <img src={event.post_picture_url} alt={event.title} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/30 via-[var(--secondary)]/30 to-[var(--tertiary)]/30 flex items-center justify-center">
                  <div className="text-[var(--text-secondary)] text-6xl font-bold opacity-20">📸</div>
                </div>
              )}
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-6 mb-4 text-[var(--text-secondary)]">
              <button
                onClick={handleRsvp}
                disabled={isRsvpLoading}
                onMouseEnter={() => setIsRsvpHovered(true)}
                onMouseLeave={() => setIsRsvpHovered(false)}
                className={`flex items-center gap-1 transition-all hover:scale-110 transform duration-200 ${
                  isRsvpd ? 'text-[var(--primary)] font-bold' : 'hover:text-[var(--primary)]'
                } ${isRsvpLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label={isRsvpd ? 'Cancel RSVP' : 'RSVP to event'}
              >
                {isRsvpd && isRsvpHovered ? (
                  <Unlink size={20} className="stroke-[var(--danger)]" />
                ) : (
                  <Link size={20} className={`${isRsvpd ? 'fill-[var(--primary)]' : 'fill-transparent'} stroke-[var(--primary)]`} />
                )}
                <span className="text-sm">{isRsvpd ? 'RSVP\'d' : 'RSVP'} ({rsvpCount})</span>
              </button>

              <button
                onClick={toggleComments}
                className="flex items-center gap-1 cursor-pointer hover:text-[var(--primary)] transition-colors hover:scale-110 transform duration-200"
                aria-label={showComments ? "Hide comments" : "Show comments"}
              >
                <MessageCircle size={20} className="fill-transparent stroke-[var(--primary)]" />
                <span className="text-sm">{showComments ? 'Hide' : 'Show'} {comments.length} Comments</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 cursor-pointer hover:text-[var(--primary)] transition-colors hover:scale-110 transform duration-200"
                aria-label="Share event"
              >
                <Share2 size={20} className="fill-transparent stroke-[var(--primary)]" />
                <span className="text-sm">Share</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-[var(--text)] mb-3">
              {event.body}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {postTags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-[var(--menucard)] text-[var(--text)] text-sm rounded-full hover:bg-[var(--primary)] hover:text-white cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  #{tag.code}
                </span>
              ))}
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="text-lg font-bold text-[var(--text)] mb-4">Comments</h3>
                
                {/* Comment List */}
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {comments.slice(0, visibleCommentsCount).map((comment) => (
                    <div 
                      key={comment.id} 
                      className={`flex gap-3 p-2 rounded-lg transition-colors ${
                        comment.userId === mockUserId ? 'bg-[var(--comment-highlight)]' : ''
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                        style={{
                          backgroundImage: comment.profilePicture 
                            ? `url(${comment.profilePicture})` 
                            : 'linear-gradient(to bottom right, var(--primary), var(--tertiary))',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                        onClick={(e) => handleCommentUserClick(e, comment.userId)}
                        aria-label={`View ${comment.username}'s profile`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="font-bold text-[var(--text)] text-sm cursor-pointer hover:text-[var(--primary)] transition-colors"
                            onClick={(e) => handleCommentUserClick(e, comment.userId)}
                          >
                            {comment.username}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)]">{comment.timestamp}</span>
                          {comment.username === "currentUser" && (
                            <div className="flex items-center gap-1 ml-auto">
                              <button
                                onClick={() => handleEditComment(comment.id, comment.text)}
                                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                                aria-label="Edit comment"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors"
                                aria-label="Delete comment"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="flex gap-2 mt-2">
                            <input
                              type="text"
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              className="flex-1 px-3 py-1 text-sm border-2 border-[var(--border)] rounded-full bg-[var(--background)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveCommentEdit(comment.id)}
                              className="px-3 py-1 text-sm bg-[var(--primary)] text-white rounded-full hover:bg-[var(--primary-hover)] transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 text-sm bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-[var(--text)] text-sm mb-2">{comment.text}</p>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleCommentVote(comment.id, 'up')}
                                className={`flex items-center gap-1 transition-colors ${
                                  comment.userVote === 'up' ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--primary)]'
                                }`}
                                aria-label="Upvote comment"
                              >
                                <ThumbsUp size={14} className={comment.userVote === 'up' ? 'fill-[var(--primary)]' : 'fill-transparent'} />
                                <span className="text-xs">{comment.upvotes}</span>
                              </button>
                              <button
                                onClick={() => handleCommentVote(comment.id, 'down')}
                                className={`flex items-center gap-1 transition-colors ${
                                  comment.userVote === 'down' ? 'text-[var(--danger)]' : 'text-[var(--text-secondary)] hover:text-[var(--danger)]'
                                }`}
                                aria-label="Downvote comment"
                              >
                                <ThumbsDown size={14} className={comment.userVote === 'down' ? 'fill-[var(--danger)]' : 'fill-transparent'} />
                                <span className="text-xs">{comment.downvotes}</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {comments.length > visibleCommentsCount && (
                  <div className="flex justify-center mb-4">
                    {isLoadingMore ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-48 h-2 bg-[var(--menucard)] rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--primary)] animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">Loading more comments...</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleLoadMoreComments}
                        className="px-4 py-2 text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold transition-colors"
                      >
                        Show more ({comments.length - visibleCommentsCount} remaining)
                      </button>
                    )}
                  </div>
                )}

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        ref={commentInputRef}
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-full bg-[var(--background)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:scale-110 transition-transform"
                        aria-label="Add emoji"
                      >
                        😊
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className={`px-6 py-2 rounded-full font-bold transition-all ${
                        newComment.trim()
                          ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                      aria-label="Post comment"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  
                  {/* Simple Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
                      <div className="grid grid-cols-8 gap-2">
                        {['😀', '😂', '😍', '🥰', '😎', '🤩', '😊', '😁', '👍', '👏', '🙌', '💪', '🎉', '🎊', '❤️', '🔥', '✨', '⭐', '👀', '💯', '🤔', '😮', '😢', '😭'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleEmojiSelect(emoji)}
                            className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postUrl={postUrl}
        isInModal={isOpen}
      />

      {/* Edit Post Modal */}
      {showEditModal && createPortal(
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] backdrop-blur-md p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--card-bg)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-fadeIn"
          >
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text)] text-2xl hover:rotate-90 transition-all duration-300 cursor-pointer"
              aria-label="Close edit modal"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-[var(--text)] mb-6">Edit Post</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text)] mb-2">Event Name</label>
                <input
                  type="text"
                  value={editedEventName}
                  onChange={(e) => setEditedEventName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--text)] mb-2">Location</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editedBuildingCode}
                      onChange={(e) => setEditedBuildingCode(e.target.value)}
                      className="px-4 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                    >
                      <option value="">Select Building</option>
                      {buildings.map(building => (
                        <option key={building.building_code} value={building.building_code}>
                          {building.building_code} - {building.building_name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Room # (not saved)"
                      value={editedRoomNumber}
                      onChange={(e) => setEditedRoomNumber(e.target.value)}
                      disabled
                      className="px-4 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none opacity-50 cursor-not-allowed"
                      title="Room numbers are not yet stored in the database"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text)] mb-2">Event Date</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={editedDate}
                      onChange={(newValue) => setEditedDate(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            style: { 
                              color: 'var(--text)', 
                              borderColor: 'var(--border)', 
                              borderWidth: '2px',
                              backgroundColor: 'var(--background)',
                              borderRadius: '0.5rem'
                            }
                          },
                          InputLabelProps: {
                            style: { 
                              color: 'var(--primary)',
                              fontWeight: 'bold',
                              backgroundColor: 'var(--background)',
                              paddingLeft: '4px',
                              paddingRight: '4px'
                            }
                          },
                          sx: {
                            '& .MuiInputLabel-root': { 
                              color: 'var(--primary)',
                              fontWeight: 'bold',
                            },
                            '& .MuiOutlinedInput-notchedOutline': { 
                              borderColor: 'var(--border) !important', 
                              borderWidth: '2px' 
                            },
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { 
                              borderColor: 'var(--primary)' 
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                              borderColor: 'var(--primary)' 
                            },
                            '& .MuiIconButton-root': { color: 'var(--primary)' },
                          },
                        },
                        layout: {
                          sx: {
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--text)',
                            '.MuiPickersDay-root': {
                              color: 'var(--text)',
                              '&.Mui-selected': {
                                backgroundColor: 'var(--primary)',
                                color: 'var(--primary-text)',
                              },
                            },
                            '.MuiPickersCalendarHeader-label': { color: 'var(--text)' },
                            '.MuiIconButton-root': { color: 'var(--primary)' },
                            '.MuiDayCalendar-weekDayLabel': { color: 'var(--text)' },
                            '.MuiPickersToolbar-root': { 
                              backgroundColor: 'var(--primary)',
                              color: 'var(--primary-text)',
                            },
                            '.MuiPickersToolbarText-root': { color: 'var(--primary-text)' },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text)] mb-2">Time (EST)</label>
                  <div className="flex gap-2">
                    <select
                      value={editedTimeHour}
                      onChange={(e) => setEditedTimeHour(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                    <span className="flex items-center text-[var(--text)] font-bold">:</span>
                    <select
                      value={editedTimeMinute}
                      onChange={(e) => setEditedTimeMinute(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                    >
                      {['00', '15', '30', '45'].map(minute => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                    <select
                      value={editedTimePeriod}
                      onChange={(e) => setEditedTimePeriod(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text)] mb-2">Description</label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text)] mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editedTags.map((tagId) => {
                    const tag = availableTags.find(t => t.id === tagId);
                    return (
                      <span
                        key={tagId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)] text-white rounded-full text-sm"
                      >
                        #{tag?.code || tagId}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tagId)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
                          aria-label={`Remove ${tag?.code}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                  >
                    <option value="">Select a tag...</option>
                    {availableTags
                      .filter(tag => !editedTags.includes(tag.id))
                      .map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.code}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!newTag}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSavePostEdit}
                  className="flex-1 px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-bold hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
