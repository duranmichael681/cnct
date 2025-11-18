# ⛓️ CNCT ⛓️

![Demo Animation](./src/assets/linkChain.gif)

**CNCT** shorter for connect is a website where FIU students can easily create and join plans — from volleyball or running to sparring and study groups. Each plan has a messaging thread for quick coordination and a “Who’s Going” list so everyone knows who’s in.

## Overview 📝

Our App is going to be the cornerstone of social interaction of students wanting to come together and meet like minded indivduals who want to come together and overall CNCT (see what I did there :)). This app can be used for many things as described earlier so we want to cater to as many niche social groups as possible and honestly invite new people to find new hobbys because I know all you reading this can relate to this here, we as a society try to just come to school get to class and get out and this is supposed to invert the stigma that we have has people to get out of our comfort zones and try new things, see new faces and create new experiences.

## TECH STACK 🦾

This is what we will use for this project

- **Frontend**: React + Vite.js, **TypeScript**, **TailwindCSS**
- **Backend**: **Express** (Node.js)
- **Authentication**: [Auth.js (formerly Next-Auth)](https://next-auth.js.org/)
- **Database**: [Supabase](https://supabase.com/) (Postgres)
- **Image Storage**: Supabase Storage
  - **Storage Endpoint**: `https://dzfnvmwepmukenpsdfsy.storage.supabase.co/storage/v1/s3`
  - **Active Buckets**: `posts_picture`, `profile_pictures`
  - 📦 See [SUPABASE_BUCKETS.md](./SUPABASE_BUCKETS.md) for bucket setup, RLS policies, and upload flows

  ## Features 📲

  - User Stores Data and being able to Log In to save changes, add friends and message others
  - OverView of all the events that will be available (Explore Page or Home Page)
  - Being able to see who is going or who is CNCT'D (Under user post it will show 3 people that are going and users will be able to click on an additional "bubble" that will say a number ( 3 - the people actually going) and when they do it will expand and show the rest of the people who are going.)
  - Resposive Designs that will be powered by Framer
  - Using Profile Pictures under users post or "events" to see whos going
  - We plan to incorporate a messaging system that allows users to communicate privately, in addition to commenting under public posts. To maintain a safe and positive environment, we’ll implement moderation tools and safeguards that allow us to oversee user interactions and prevent misuse.
 # Setup


 
### Cloning

```bash
  git clone https://github.com/duranmichael681/cnct.git
  cd cnct
```

### Pulling

If You’ve Already Cloned the Repository:

Save or commit your current work!
**ONLY do this if you've made local changes that aren’t already pushed to GitHub!!**
This ensures you can restore your work if anything changes after pulling.

1. first you'll create and switch to a new branch, our lead will merge on github and delete the branch

```bash
git switch -c <branch name>
```
- "git switch -c" creates a new branch and switches to it immediately.
- Use a descriptive name (for example: feature/auth-setup, fix/readme-update, or setup/supabase).

```bash
git add .
git commit -m "Brief description of what you changed"
```
- git add . → tells Git which files to include in the next commit.
- git commit → saves a snapshot of your work with a short message.

```bash
git push -u origin <branch name>
```
- Uploads your branch to GitHub so your lead can review and merge it.

Pull the latest updates from GitHub:

```bash
git pull origin main
```
Downloads and merges any new changes (like backend setup or README updates) from the main branch into your local project.

If you see any conflicts:
Open VS Code’s Source Control panel (if using vscode) or terminal and review the conflicts carefully — keep your work and merge new updates when needed.

After pulling successfully
Reinstall dependencies to make sure everything is up to date:

```bash
npm install
```

NOTES:
  - **Do not delete or overwrite your .env or .env.local files.**
    These contain your private keys and should remain local **ONLY.**
  - **Frequently push important work and pull before starting new work**
    to ensure you’re using the latest version of the project.
  - If you’re unsure or run into merge conflicts reach out to our lead, co-leads, or anyone in the group

  ## Node.js

### Install

This project requires **Node.js** to run. You can download it from the official site:

- [Node.js Downloads](https://nodejs.org/en/download)

To verify that Node.js is installed make sure to run:

```bash
node -v
npm -v
```

  ## Frontend

```bash
  cd cnct
  npm i
```

After installing dependencies, follow these steps:
1. In the root folder, create a file named .env.local
2. Paste the following inside:

```bash
VITE_SUPABASE_URL=https://dzfnvmwepmukenpsdfsy.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

3. Save the file — this is used by the React (Vite) frontend to connect to Supabase.
4. This file should already be included in .gitignore, so it won’t be uploaded to GitHub.
    - Double-check your .gitignore to make sure .env.local is listed.

NOTE:
Co-leads (Jose or Jorge) will provide the anon key privately.
**DO NOT share this key publicly or commit it to the repository.**


  ### TailWind CSS

  Follow this guide on the [Tailwind](https://tailwindcss.com/docs/installation/using-vite) website or you can watch this [Youtube Video](https://youtu.be/sHnG8tIYMB4?si=TJn38DnurywPlN7t)

### Framer Motion

Framer Motion is a React library for animations, making it easy to create smooth, interactive UI effects.

### Installation

Install it inside your project folder:

```bash
npm install framer-motion
# or
yarn add framer-motion
```

## Backend (Backend Devs Only)

If you’re working on backend tasks or need access to server logic, follow these steps:
1. Inside the /server folder, create a file named .env
2. Add the following lines:

```bash
SUPABASE_URL=https://dzfnvmwepmukenpsdfsy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

3. Save the file — this connects the Express backend to Supabase.
4. Ensure your .env file is included in .gitignore so it’s never uploaded to GitHub.

NOTE:
  - Co-leads (Jose or Jorge) will provide SERVICE_ROLE_KEY to backend devs!!
  - Frontend-only devs don’t need this file. Your .env.local is enough.
  - **The backend .env is used only for server routes and secure operations.**
  - **DO NOT share this key publicly or commit it to the repository.**


  ## Supabase Command Lines (CLI)

  **OPTIONAL**

  - not needed but if you wanted to install for supabase commandlines
  - if installed, vscode code terminal can do commands that get sent directly to supabase

  install for mac:

  1. might have to install homebrew before

  ```bash
  brew install supabase/tap/supabase
  ```

  install for windows:

  1. command for install, reach out to co-leads if it doesn't work

  ```bash
  iwr https://supabase.com/cli/install/windows | iex
  ```

  Example commands:

```bash
supabase login
supabase init
supabase db push
supabase start
supabase functions deploy
```

can be used to:
Manage Supabase projects locally
Run a local Supabase instance with Postgres
Apply and generate SQL migrations
Push/pull database schema
Manage environment variables
Deploy functions
Handle secrets


## Running the Project

**Start Backend:**
```bash
cd server
npm run dev
```
Backend runs at: `http://localhost:5000`

**Start Frontend:**
```bash
npm run dev
```
Frontend runs at: `http://localhost:5174`

---

## 🎨 Code Structure

### Key Files
- `src/services/api.ts` - All API calls to backend
- `src/services/storage.ts` - File upload utilities
- `src/components/ui/UIComponents.tsx` - Reusable UI components
- `src/components/ImageUpload.tsx` - Image upload component
- `src/utils/helpers.ts` - Utility functions
- `server/routes/` - Express API endpoints
- `server/routes/storage.js` - File storage endpoints
- `server/API_DOCUMENTATION.md` - Complete API reference
- `INTEGRATION_GUIDE.md` - Quick integration guide
- `Supabase/` - Database schema, functions, and RLS policies

### Using the API

```typescript
import { getAllEvents, createEvent } from './services/api';

// Fetch events
const events = await getAllEvents();

// Create event
await createEvent({
  title: 'Beach Volleyball',
  description: 'Come play!',
  location: 'FIU Beach',
  event_date: '2025-12-01T14:00:00Z',
  max_attendees: 15,
});
```

### Uploading Images

See [SUPABASE_BUCKETS.md](./SUPABASE_BUCKETS.md) for detailed bucket configuration and upload patterns.

```typescript
import { uploadFileToStorage } from './services/api';

// Upload to posts_picture bucket
const { url } = await uploadFileToStorage(file, 'posts_picture');
```

---

## React Router

We are going to need this to route all the pages later on so install this 
```bash 
cd cnct
npm install react-router-dom

```
