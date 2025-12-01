-- =====================================================
-- CNCT Database RLS Policies & Optimizations
-- Run these queries in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PART 1: ENABLE RLS ON TABLES
-- =====================================================

-- Enable RLS on groups table
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Enable RLS on follows table
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Enable RLS on comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on comment_votes table
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PART 2: RLS POLICIES FOR GROUPS TABLE
-- =====================================================

-- Anyone can view groups
CREATE POLICY "Anyone can view groups" ON public.groups
  FOR SELECT USING (true);

-- Authenticated users can create groups
CREATE POLICY "Authenticated users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own groups or if they are admins
CREATE POLICY "Users can update their own groups" ON public.groups
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_groups
      WHERE user_groups.group_id = groups.id
      AND user_groups.user_id = auth.uid()
      AND user_groups.role = 'admin'
    )
  );

-- Users can delete their own groups or if they are admins
CREATE POLICY "Users can delete their own groups" ON public.groups
  FOR DELETE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_groups
      WHERE user_groups.group_id = groups.id
      AND user_groups.user_id = auth.uid()
      AND user_groups.role = 'admin'
    )
  );

-- =====================================================
-- PART 3: RLS POLICIES FOR FOLLOWS TABLE
-- =====================================================

-- Anyone can view follows
CREATE POLICY "Anyone can view follows" ON public.follows
  FOR SELECT USING (true);

-- Users can create their own follows
CREATE POLICY "Users can create their own follows" ON public.follows
  FOR INSERT WITH CHECK (following_user_id = auth.uid());

-- Users can delete their own follows
CREATE POLICY "Users can delete their own follows" ON public.follows
  FOR DELETE USING (following_user_id = auth.uid());

-- =====================================================
-- PART 4: RLS POLICIES FOR COMMENTS TABLE
-- =====================================================

-- Anyone can view comments on public posts
CREATE POLICY "Anyone can view comments" ON public.comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id
      AND posts.is_private = false
    )
    OR EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id
      AND posts.organizer_id = auth.uid()
    )
    OR comments.user_id = auth.uid()
  );

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' 
    AND user_id = auth.uid()
  );

-- Users can update their own comments
CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- PART 5: RLS POLICIES FOR COMMENT_VOTES TABLE
-- =====================================================

-- Anyone can view comment votes
CREATE POLICY "Anyone can view comment votes" ON public.comment_votes
  FOR SELECT USING (true);

-- Users can create their own votes
CREATE POLICY "Users can create their own votes" ON public.comment_votes
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own votes
CREATE POLICY "Users can update their own votes" ON public.comment_votes
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes" ON public.comment_votes
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- PART 6: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for comments.post_id (frequently queried when loading post comments)
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);

-- Index for comments.user_id (querying user's comments)
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- Index for follows.followed_user_id (querying who is following a user)
CREATE INDEX IF NOT EXISTS idx_follows_followed_user_id ON public.follows(followed_user_id);

-- Index for follows.following_user_id (already has constraint, but adding explicit index)
CREATE INDEX IF NOT EXISTS idx_follows_following_user_id ON public.follows(following_user_id);

-- Index for user_groups.group_id (querying users in a group)
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON public.user_groups(group_id);

-- Index for user_groups.user_id (already has constraint, but adding explicit index)
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON public.user_groups(user_id);

-- Index for post_tags.tag_id (querying posts with specific tag)
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON public.post_tags(tag_id);

-- Index for post_tags.post_id (already has constraint, but adding explicit index)
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON public.post_tags(post_id);

-- Index for attendees.posts_id (querying attendees for a post)
CREATE INDEX IF NOT EXISTS idx_attendees_posts_id ON public.attendees(posts_id);

-- Index for attendees.user_id (querying posts a user is attending)
CREATE INDEX IF NOT EXISTS idx_attendees_user_id ON public.attendees(user_id);

-- Index for comment_votes.comment_id (already has constraint, but adding explicit index)
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_id ON public.comment_votes(comment_id);

-- Index for posts.organizer_id (querying posts by organizer)
CREATE INDEX IF NOT EXISTS idx_posts_organizer_id ON public.posts(organizer_id);

-- Index for posts.start_date (querying upcoming events)
CREATE INDEX IF NOT EXISTS idx_posts_start_date ON public.posts(start_date);

-- Index for posts.is_private (filtering public/private posts)
CREATE INDEX IF NOT EXISTS idx_posts_is_private ON public.posts(is_private);

-- Index for notifications.user_id (querying user notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Index for notifications.status (filtering read/unread notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);

-- =====================================================
-- PART 7: ADD CASCADING DELETES (OPTIONAL BUT RECOMMENDED)
-- =====================================================

-- WARNING: These will modify existing foreign key constraints
-- Back up your data before running these!

-- Drop and recreate foreign keys with CASCADE for posts-related tables
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS fk_comments_post;
ALTER TABLE public.comments 
  ADD CONSTRAINT fk_comments_post 
  FOREIGN KEY (post_id) 
  REFERENCES public.posts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.attendees DROP CONSTRAINT IF EXISTS fk_attendees_posts;
ALTER TABLE public.attendees 
  ADD CONSTRAINT fk_attendees_posts 
  FOREIGN KEY (posts_id) 
  REFERENCES public.posts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.post_tags DROP CONSTRAINT IF EXISTS fk_post_tags_post;
ALTER TABLE public.post_tags 
  ADD CONSTRAINT fk_post_tags_post 
  FOREIGN KEY (post_id) 
  REFERENCES public.posts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_post_id_fkey;
ALTER TABLE public.notifications 
  ADD CONSTRAINT notifications_post_id_fkey 
  FOREIGN KEY (post_id) 
  REFERENCES public.posts(id) 
  ON DELETE CASCADE;

-- Drop and recreate foreign keys with CASCADE for user-related tables
ALTER TABLE public.follows DROP CONSTRAINT IF EXISTS fk_follows_following;
ALTER TABLE public.follows 
  ADD CONSTRAINT fk_follows_following 
  FOREIGN KEY (following_user_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.follows DROP CONSTRAINT IF EXISTS fk_follows_followed;
ALTER TABLE public.follows 
  ADD CONSTRAINT fk_follows_followed 
  FOREIGN KEY (followed_user_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.user_groups DROP CONSTRAINT IF EXISTS fk_user_groups_user;
ALTER TABLE public.user_groups 
  ADD CONSTRAINT fk_user_groups_user 
  FOREIGN KEY (user_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.comment_votes DROP CONSTRAINT IF EXISTS fk_comment_votes_user;
ALTER TABLE public.comment_votes 
  ADD CONSTRAINT fk_comment_votes_user 
  FOREIGN KEY (user_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE;

-- Drop and recreate foreign keys with CASCADE for comment votes
ALTER TABLE public.comment_votes DROP CONSTRAINT IF EXISTS fk_comment_votes_comment;
ALTER TABLE public.comment_votes 
  ADD CONSTRAINT fk_comment_votes_comment 
  FOREIGN KEY (comment_id) 
  REFERENCES public.comments(id) 
  ON DELETE CASCADE;

-- Drop and recreate foreign keys with CASCADE for groups
ALTER TABLE public.user_groups DROP CONSTRAINT IF EXISTS fk_user_groups_group;
ALTER TABLE public.user_groups 
  ADD CONSTRAINT fk_user_groups_group 
  FOREIGN KEY (group_id) 
  REFERENCES public.groups(id) 
  ON DELETE CASCADE;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('groups', 'follows', 'comments', 'comment_votes')
ORDER BY tablename;

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- List all indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Run PART 1-6 safely in any order
-- 2. PART 7 (cascading deletes) modifies constraints - test in staging first
-- 3. Indexes improve read performance but slightly slow down writes
-- 4. RLS policies are checked on every query - test performance with your data volume
-- 5. You can always disable RLS with: ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
