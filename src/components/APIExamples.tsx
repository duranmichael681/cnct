/**
 * Example React Component demonstrating how to use the API service
 * to interact with Supabase through the Express backend
 */

import { useState, useEffect } from 'react';
import {
  getAllEvents,
  createEvent,
  toggleEventAttendance,
  getAllTags,
  getUserProfile,
  type Event,
  type Tag,
} from '../services/api';

export default function APIExamples() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  // Example 1: Fetch all events on component mount
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getAllEvents();
        setEvents(data);
        console.log('Loaded events:', data);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    }

    loadEvents();
  }, []);

  // Example 2: Create a new event
  async function handleCreateEvent() {
    try {
      setLoading(true);
      const newEvent = await createEvent({
        title: 'Beach Volleyball',
        description: 'Come play volleyball at FIU Beach!',
        location: 'FIU Beach',
        event_date: '2025-12-01T14:00:00Z',
        max_attendees: 15,
      });

      console.log('Created event:', newEvent);
      
      // Refresh events list
      const updatedEvents = await getAllEvents();
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Error creating event. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  // Example 3: Toggle attendance for an event
  async function handleJoinEvent(eventId: string) {
    try {
      const result = await toggleEventAttendance(eventId);
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

      {/* Create Event Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Create Event</h2>
        <button
          onClick={handleCreateEvent}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Sample Event'}
        </button>
      </div>

      {/* Display Events Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Events from Supabase</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events found. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border p-4 rounded-lg">
                <h3 className="font-bold text-xl">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  📍 {event.location} | 📅 {new Date(event.event_date).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleJoinEvent(event.id)}
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Join/Leave Event
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
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Code Examples */}
      <div className="mt-12 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">1. Fetch all events:</h3>
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`import { getAllEvents } from '../services/api';

const events = await getAllEvents();
console.log(events);`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">2. Create an event:</h3>
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`import { createEvent } from '../services/api';

const newEvent = await createEvent({
  title: 'Study Group',
  description: 'Studying for finals!',
  location: 'Library',
  event_date: '2025-12-15T18:00:00Z',
  max_attendees: 10,
});`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">3. Join/Leave event:</h3>
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`import { toggleEventAttendance } from '../services/api';

await toggleEventAttendance(eventId);`}
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
