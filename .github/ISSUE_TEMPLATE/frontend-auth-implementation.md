# Frontend - Authentication Implementation

## What's Missing
The sign-in/sign-up forms don't actually authenticate users with Supabase. They just navigate to other pages.

## Tasks

### 1. Connect Signup Form (`src/auth/Signup.tsx`)
- [ ] Add Supabase auth call on form submit
- [ ] Handle errors (show message if email already exists)
- [ ] Redirect to home on success

### 2. Connect Signin Form (`src/auth/Signin.tsx`)
- [ ] Add Supabase auth call on form submit
- [ ] Handle errors (show message for invalid credentials)
- [ ] Redirect to home on success

### 3. Add Google OAuth (Both files)
- [ ] Connect Google button to Supabase OAuth
- [ ] Configure Google provider in Supabase dashboard

### 4. Create Auth Context (`src/contexts/AuthContext.tsx`)
- [ ] Create context to store user state
- [ ] Add sign-out function
- [ ] Keep user logged in on page refresh

### 5. Protect Routes (`src/components/ProtectedRoute.tsx`)
- [ ] Create component that checks if user is logged in
- [ ] Redirect to sign-in if not authenticated
- [ ] Wrap protected pages (home, profile, create)

### 6. Add Sign Out Button
- [ ] Add to profile page and navbar
- [ ] Clear session and redirect to sign-in

## Must Work
- [ ] Users can sign up
- [ ] Users can sign in
- [ ] Users can sign in with Google
- [ ] Users can sign out
- [ ] Login persists on page refresh
- [ ] Protected pages redirect if not logged in
- [ ] Errors show helpful messages

## Resources
- Auth helper already exists: `src/lib/supabaseClient.ts`
- API client ready: `src/services/api.ts`
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

**Priority:** HIGH | **Time:** 8-12 hours
