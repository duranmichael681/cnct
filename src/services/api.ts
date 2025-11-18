// API Service for communicating with the Express backend

import { getAuthToken } from '../lib/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    // Get auth token if available
    const token = await getAuthToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };
    
    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log(`🔐 API Request with auth: ${endpoint}`);
    } else {
      console.log(`⚠️  API Request without auth: ${endpoint}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error (${endpoint}):`, data);
      throw new APIError(data.error || 'API request failed', response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    console.error(`API Error (${endpoint}):`, error);
    throw new APIError('Network error. Check if backend is running.');
  }
}

// ==================== POSTS API ====================

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  body: string;
  building: string | null;
  start_date: string;
  end_date: string | null;
  post_picture_url: string | null;
  created_at: string;
  is_private: boolean;
  attendees?: { count: number }[];
}

export interface CreatePostData {
  title: string;
  body: string;
  building?: string;
  start_date: string;
  end_date?: string;
  is_private?: boolean;
  organizer_id: string;
  post_picture_url?: string | null;
}

export interface Attendee {
  id: string;
  user_id: string;
  posts_id: string;
  created_at: string;
  users?: {
    id: string;
    username_email: string;
    first_name: string | null;
    last_name: string | null;
    profile_picture_url: string | null;
  };
}

// Get all posts
export async function getAllPosts(): Promise<Event[]> {
  const response = await fetchAPI<{ success: boolean; data: Event[] }>('/posts');
  return response.data;
}

// Get single post by ID
export async function getPostById(id: string): Promise<Event> {
  const response = await fetchAPI<{ success: boolean; data: Event }>(`/posts/${id}`);
  return response.data;
}

// Create a new post
export async function createPost(postData: CreatePostData): Promise<Event> {
  const response = await fetchAPI<{ success: boolean; data: Event }>('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
  return response.data;
}

// Toggle attendance for a post
export async function togglePostAttendance(postId: string, userId: string): Promise<any> {
  const response = await fetchAPI<{ success: boolean; action: string; data: any }>(
    `/posts/${postId}/toggle-attendance`,
    {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }
  );
  return response;
}

// Get attendees for a post
export async function getPostAttendees(postId: string): Promise<Attendee[]> {
  const response = await fetchAPI<{ success: boolean; data: Attendee[] }>(
    `/posts/${postId}/attendees`
  );
  return response.data;
}

// ==================== USERS API ====================

export interface UserProfile {
  id: string;
  username_email: string;
  first_name: string | null;
  last_name: string | null;
  pronouns: string | null;
  degree_program: string | null;
  created_at: string;
  profile_picture_url: string | null;
}

export interface UserTag {
  user_id: string;
  tag_id: number;
  created_at: string;
  tags?: {
    id: number;
    code: string;
  };
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await fetchAPI<{ success: boolean; data: UserProfile }>(
    `/users/${userId}`
  );
  return response.data;
}

// Get posts created by user
export async function getUserPosts(userId: string): Promise<Event[]> {
  const response = await fetchAPI<{ success: boolean; data: Event[] }>(
    `/users/${userId}/posts`
  );
  return response.data;
}

// Get posts user is attending
export async function getUserAttendingPosts(userId: string): Promise<any[]> {
  const response = await fetchAPI<{ success: boolean; data: any[] }>(
    `/users/${userId}/attending`
  );
  return response.data;
}

// Update user setting
export async function updateUserSetting(
  userId: string,
  settingName: string,
  status: boolean
): Promise<any> {
  const response = await fetchAPI<{ success: boolean; data: any }>(
    `/users/${userId}/settings`,
    {
      method: 'POST',
      body: JSON.stringify({ setting_name: settingName, status }),
    }
  );
  return response.data;
}

// Toggle user tag/interest
export async function toggleUserTag(userId: string, tagId: number): Promise<any> {
  const response = await fetchAPI<{ success: boolean; data: any }>(
    `/users/${userId}/tags/toggle`,
    {
      method: 'POST',
      body: JSON.stringify({ tag_id: tagId }),
    }
  );
  return response.data;
}

// Get user tags
export async function getUserTags(userId: string): Promise<UserTag[]> {
  const response = await fetchAPI<{ success: boolean; data: UserTag[] }>(
    `/users/${userId}/tags`
  );
  return response.data;
}

// ==================== NOTIFICATIONS API ====================

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

// Get user notifications
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const response = await fetchAPI<{ success: boolean; data: Notification[] }>(
    `/notifications/${userId}`
  );
  return response.data;
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<any> {
  const response = await fetchAPI<{ success: boolean; data: any }>(
    `/notifications/${notificationId}/mark-read`,
    {
      method: 'POST',
    }
  );
  return response.data;
}

// Get unread notification count
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const response = await fetchAPI<{ success: boolean; count: number }>(
    `/notifications/${userId}/unread-count`
  );
  return response.count;
}

// ==================== TAGS API ====================

export interface Tag {
  id: number;
  code: string;
}

// Get all tags
export async function getAllTags(): Promise<Tag[]> {
  const response = await fetchAPI<{ success: boolean; data: Tag[] }>('/tags');
  return response.data;
}

// Get tag by ID
export async function getTagById(id: number): Promise<Tag> {
  const response = await fetchAPI<{ success: boolean; data: Tag }>(`/tags/${id}`);
  return response.data;
}

// ==================== STORAGE API ====================

export interface UploadResponse {
  path: string;
  url: string;
}

// Upload file to storage
export async function uploadFileToStorage(
  file: File,
  bucket: string
): Promise<UploadResponse> {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const response = await fetchAPI<{ success: boolean; data: UploadResponse }>(
          '/storage/upload',
          {
            method: 'POST',
            body: JSON.stringify({
              file: base64,
              bucket,
              fileName,
              contentType: file.type,
            }),
          }
        );
        
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Delete file from storage
export async function deleteFileFromStorage(bucket: string, filePath: string): Promise<void> {
  await fetchAPI<{ success: boolean }>('/storage/delete', {
    method: 'DELETE',
    body: JSON.stringify({ bucket, filePath }),
  });
}

// Get public URL for a file
export async function getFileUrl(bucket: string, filePath: string): Promise<string> {
  const response = await fetchAPI<{ success: boolean; url: string }>(
    `/storage/url/${bucket}/${filePath}`
  );
  return response.url;
}
