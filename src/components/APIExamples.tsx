/**
 * Example React Component demonstrating how to use the API service
 * to interact with Supabase through the Express backend
 */

import { useState, useEffect } from 'react';
import {
  getAllPosts,
  createPost,
  togglePostAttendance,
  getAllTags,
  getUserProfile,
  type Post,
  type Tag,
} from '../services/api';

export default function APIExamples() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  // Example 1: Fetch all posts on component mount
  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getAllPosts();
        setPosts(data);
        console.log('Loaded posts:', data);
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    }

    loadPosts();
  }, []);

  // Example 2: Create a new post
  async function handleCreatePost() {
    try {
      setLoading(true);
      const newPost = await createPost({
        title: 'Beach Volleyball',
        body: 'Come play volleyball at FIU Beach!',
        building: 'FIU Beach',
        start_date: '2025-12-01T14:00:00Z',
        organizer_id: 'temp-user-id', // TODO: Get from auth
      });

      console.log('Created post:', newPost);
      
      // Refresh posts list
      const updatedPosts = await getAllPosts();
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Error creating post. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  // Example 3: Toggle attendance for a post
  async function handleJoinPost(postId: string) {
    try {
      const result = await togglePostAttendance(postId, 'user-id-placeholder');
      console.log('Toggled attendance:', result);
      alert('Attendance toggled successfully!');
    } catch (error) {
      console.error('Failed to toggle attendance:', error);
      alert('Error toggling attendance');
    }
  }

  // Example 4: Load all tags
  async function loadTags() {
    try {
      const data = await getAllTags();
      setTags(data);
      console.log('Loaded tags:', data);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  }

  // Example 5: Get user profile
  async function getUserInfo(userId: string) {
    try {
      const profile = await getUserProfile(userId);
      console.log('User profile:', profile);
    } catch (error) {
      console.error('Failed to get user profile:', error);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">API Usage Examples</h1>

      {/* Create Post Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Create Post</h2>
        <button
          onClick={handleCreatePost}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Sample Post'}
        </button>
      </div>

      {/* Display Posts Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Posts from Supabase</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border p-4 rounded-lg">
                <h3 className="font-bold text-xl">{post.title}</h3>
                <p className="text-gray-600">{post.body}</p>
                <p className="text-sm text-gray-500 mt-2">
                  📍 {post.building || 'Location TBD'} | 📅 {new Date(post.start_date).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleJoinPost(post.id)}
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Join/Leave Post
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load Tags Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Tags</h2>
        <button
          onClick={loadTags}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 mb-4"
        >
          Load Tags
        </button>
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {tag.code}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Code Examples */}
      <div className="mt-12 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">1. Fetch all posts:</h3>
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`import { getAllPosts } from '../services/api';

const posts = await getAllPosts();
console.log(posts);`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">2. Create a post:</h3>
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`import { createPost } from '../services/api';

const newPost = await createPost({
  title: 'Study Group',
  body: 'Studying for finals!',
  building: 'Library',
  start_date: '2025-12-15T18:00:00Z',
  organizer_id: 'user-id',
});`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">3. Join/Leave post:</h3>
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`import { togglePostAttendance } from '../services/api';

await togglePostAttendance(postId, userId);`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">4. Update user settings:</h3>
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`import { updateUserSetting } from '../services/api';

await updateUserSetting(userId, 'email_notifications', true);`}
          </pre>
        </div>
      </div>
    </div>
  );
}
