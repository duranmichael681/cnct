# 📡 Supabase Functions Guide

**What this document covers:**  
How to call Postgres functions from your React frontend and Express backend.

---

## 🎯 The Basics

Think of Supabase functions like API endpoints that live in your database:

```javascript
// Call any function like this:
const { data, error } = await supabase.rpc('function_name', {
  param1: 'value',
  param2: 123,
});
```

**That's it!** The rest of this doc shows you how to set up the client and provides real examples.

---

## 🔑 What You Need First

### Keys & URLs

You need these environment variables (already set up if you followed the README):

**Frontend** uses public keys (safe to expose):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Backend** uses private keys (never expose these):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **KEEP SECRET**

---

## 🛠️ Step 1: Set Up Your Clients

### For Frontend Developers

Create **`src/config/supabase.js`**:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Now in any component:
```javascript
import { supabase } from './config/supabase';

// Use it to call functions
const { data, error } = await supabase.rpc('function_name', {...});
```

That's all you need for 95% of frontend cases! 

---

### For Backend Developers

Create **`server/config/supabase.js`**:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin client (bypasses security rules)
export const supabaseAdmin = createClient(supabaseUrl, serviceKey);
```

Use in Express routes:
```javascript
import { supabaseAdmin } from './config/supabase.js';

// Call functions with admin privileges
const { data, error } = await supabaseAdmin.rpc('function_name', {...});
```

⚠️ **Important:** This bypasses all security rules. Only use in backend code!

---

## 📝 Step 2: Use Functions (Examples)

### Example 1: Create an Event

**What it does:** Creates a new event and automatically sets you as the creator.

**Parameters:**
- `p_title` - Event name (string)
- `p_description` - Event details (string)
- `p_location` - Where it's happening (string)
- `p_event_date` - When it starts (ISO date string)
- `p_max_attendees` - How many people can join (number, default: 10)

**From React Component:**
```javascript
import { supabase } from './config/supabase';

const { data, error } = await supabase.rpc('create_post', {
  p_title: 'Beach Volleyball',
  p_description: 'Come play at FIU Beach!',
  p_location: 'FIU Beach',
  p_event_date: '2025-10-15T14:00:00Z',
  p_max_attendees: 10,
});

if (error) {
  console.error('Failed to create event:', error);
  return;
}

console.log('Event created:', data);
// data contains the new event with its ID
```

**From Express Backend:**
```javascript
import { supabaseAdmin } from './config/supabase.js';

const { data, error } = await supabaseAdmin.rpc('create_post', {
  p_title: 'Server-Created Event',
  p_description: 'This came from Express backend',
  p_location: 'GC Building',
  p_event_date: '2025-10-20T15:00:00Z',
  p_max_attendees: 20,
});
```

**How it works:**
- The function automatically gets your user ID from your login token
- Only you can create events as yourself (enforced by database rules)

---

### Example 2: Join or Leave an Event

**What it does:** If you're not attending, it adds you. If you are attending, it removes you.

**Parameters:**
- `p_event_id` - The event's ID (UUID string)

**From React Component:**
```javascript
import { supabase } from './config/supabase';

const { data, error } = await supabase.rpc('toggle_attendance', {
  p_event_id: eventId,
});

if (error) {
  console.error('Failed to toggle attendance:', error);
  return;
}

console.log('Attendance toggled:', data);
// data tells you if you joined or left
```

**How it works:**
- Checks if you're already attending
- If yes → removes you from the attendee list
- If no → adds you to the attendee list
- All automatic, one function call!

---

### Example 3: Mark Notification as Read

**What it does:** Marks one of your notifications as read.

**Parameters:**
- `p_notification_id` - The notification's ID (UUID string)

**From React Component:**
```javascript
import { supabase } from './config/supabase';

const { data, error } = await supabase.rpc('mark_notification_read', {
  p_notification_id: notificationId,
});

if (error) {
  console.error('Failed to mark notification as read:', error);
  return;
}

console.log('Notification marked as read:', data);
```

**How it works:**
- Only works on YOUR notifications (can't mark someone else's)
- Updates the status and records when you read it

---

### Example 4: Update Your Settings

**What it does:** Turn a setting on or off (email notifications, reminders, etc.)

**Parameters:**
- `p_setting_name` - Which setting to change (string)
- `p_status` - Turn it on (true) or off (false)

**Available Settings:**
- `'email_notifications'` - Get emails about events
- `'push_notifications'` - Get push notifications
- `'event_reminders'` - Get reminded before events
- `'friend_requests'` - Allow friend requests

**From React Component:**
```javascript
import { supabase } from './config/supabase';

const { data, error } = await supabase.rpc('set_user_setting', {
  p_setting_name: 'email_notifications',
  p_status: true, // Turn ON email notifications
});

if (error) {
  console.error('Failed to update setting:', error);
  return;
}

console.log('Setting updated:', data);
```

**How it works:**
- If the setting doesn't exist for you yet, it creates it
- If it already exists, it updates it
- Only affects YOUR settings

---

### Example 5: Toggle Interest Tags

**What it does:** Add or remove an interest tag from your profile.

**Parameters:**
- `p_tag_id` - The tag's ID (number)

**Common Tags:**
- `1` - Sports
- `2` - Study Groups  
- `3` - Gaming
- `4` - Music
- `5` - Food & Dining

**From React Component:**
```javascript
import { supabase } from './config/supabase';

const { data, error } = await supabase.rpc('toggle_user_tag', {
  p_tag_id: 1, // Toggle "Sports" interest
});

if (error) {
  console.error('Failed to toggle tag:', error);
  return;
}

console.log('Tag preference updated:', data);
```

**How it works:**
- If you don't have this interest → adds it
- If you already have it → removes it
- Helps us show you relevant events!

---

## 💡 Quick Tips

### Always Check for Errors
```javascript
const { data, error } = await supabase.rpc('function_name', {...});

if (error) {
  console.error('Something went wrong:', error);
  // Show error message to user
  return;
}

// Use the data
console.log('Success:', data);
```

### Function Names Match Parameters
If the SQL function has `p_title` as a parameter, use `p_title` in JavaScript:
```javascript
// SQL: p_title text
// JS:  p_title: 'My Title'
await supabase.rpc('create_post', {
  p_title: 'My Title', // ✅ Matches SQL parameter name
});
```

### All Functions Return Data
Every function returns something (even if it's just success confirmation):
```javascript
const { data, error } = await supabase.rpc('toggle_attendance', {...});
// data contains the attendee record (created or deleted)
```

---

## 🔐 Security Rules (Important!)

### ✅ Safe Practices:
- **Frontend:** Use the public anon key (already in your .env.local)
- **Backend:** Keep service role key in server/.env only
- Let the database handle permissions automatically
- Functions use `auth.uid()` to know who's logged in

### ❌ Never Do This:
- Don't put service role key in frontend code
- Don't share service role key in GitHub
- Don't try to bypass security rules without good reason

**The system is already secure if you follow the setup!** 🔒

---

## 📋 Common Patterns

### Pattern 1: Create Something
```javascript
const { data, error } = await supabase.rpc('create_post', {
  p_title: 'My Event',
  p_description: 'Details here',
  // ... other fields
});
```

### Pattern 2: Toggle Something On/Off
```javascript
const { data, error } = await supabase.rpc('toggle_attendance', {
  p_event_id: eventId,
});
// Automatically adds or removes you
```

### Pattern 3: Update a Setting
```javascript
const { data, error } = await supabase.rpc('set_user_setting', {
  p_setting_name: 'email_notifications',
  p_status: true, // or false
});
```

---

## ❓ Troubleshooting

### "Function not found" error
- Check the function name spelling
- Make sure the function exists in Supabase (ask a co-lead)

### "Permission denied" error
- You might not be logged in
- The function requires authentication
- Check that your JWT token is valid

### "Invalid parameters" error
- Check parameter names match the function (including `p_` prefix)
- Make sure you're passing the right data types (string, number, boolean)

### Nothing happens / No error
- Check your console for errors (`console.log(error)`)
- Make sure you're using `await` with the function call
- Verify your network tab shows the request

---

## 📚 Need More Help?

- **Official Docs:** [Supabase RPC Guide](https://supabase.com/docs/reference/javascript/rpc)
- **Team Help:** Reach out to Jose or Jorge (co-leads)
- **Slack/Discord:** Ask in the #backend or #frontend channel

---

**Remember:** Start simple, call functions, check for errors, use the data. That's it! 🚀
