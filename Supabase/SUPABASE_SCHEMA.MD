-- Enable UUID generation (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================
-- Base lookup tables first
-- ======================

-- Programs (referenced by users.degree_program)
CREATE TABLE IF NOT EXISTS public.programs (
  program_name text PRIMARY KEY,
  created_at   timestamp DEFAULT now()
);

-- Buildings (referenced by posts.building later)
CREATE TABLE IF NOT EXISTS public.fiu_buildings (
  building_code varchar NOT NULL PRIMARY KEY,   -- e.g., "GC", "PG6", etc.
  building_name varchar NOT NULL UNIQUE         -- human-readable name (unique to support FK from posts.building)
);

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id   serial PRIMARY KEY,
  code varchar NOT NULL UNIQUE -- e.g., sports, academic, soccer, cs, volleyball, business, wics, init
);

-- ======================
-- Core tables
-- ======================

-- Users of the app
CREATE TABLE IF NOT EXISTS public.users (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username_email      varchar NOT NULL UNIQUE,
  first_name          varchar,
  last_name           varchar,
  pronouns            varchar,
  degree_program      varchar,  -- will FK to programs.program_name
  created_at          timestamp NOT NULL DEFAULT now(),
  profile_picture_url text,
  CONSTRAINT fk_users_degree_program
    FOREIGN KEY (degree_program)
    REFERENCES public.programs (program_name)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);
COMMENT ON TABLE public.users IS 'Users of the app';

-- User-to-user follow relationships
CREATE TABLE IF NOT EXISTS public.follows (
  following_user_id uuid NOT NULL, -- who follows
  followed_user_id  uuid NOT NULL, -- who is being followed
  created_at        timestamp NOT NULL DEFAULT now(),
  CONSTRAINT pk_follows PRIMARY KEY (following_user_id, followed_user_id)
);
COMMENT ON TABLE public.follows IS 'User-to-user follow relationships';

-- Events or announcements created by organizers
CREATE TABLE IF NOT EXISTS public.posts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            varchar NOT NULL,
  body             text,
  organizer_id          uuid NOT NULL, -- organizer id
  building         varchar,
  start_date       timestamp,
  end_date         timestamp,
  post_picture_url text,
  created_at       timestamp NOT NULL DEFAULT now(),
  is_private       boolean NOT NULL DEFAULT false
);
COMMENT ON TABLE public.posts IS 'Events or announcements created by organizers';
COMMENT ON COLUMN public.posts.body IS 'Content of the post';
COMMENT ON COLUMN public.posts.user_id IS 'organizer id';

-- Post <-> Tag join
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id uuid NOT NULL,
  tag_id  int  NOT NULL,
  CONSTRAINT pk_post_tags PRIMARY KEY (post_id, tag_id)
);

-- Users attending posts (events)
CREATE TABLE IF NOT EXISTS public.attendees (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posts_id   uuid NOT NULL,
  user_id    uuid NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT uniq_attendee UNIQUE (posts_id, user_id)
);
COMMENT ON TABLE public.attendees IS 'Users attending posts (events)';

-- Settings catalogue (what can be toggled)
CREATE TABLE IF NOT EXISTS public.settings (
  id   serial PRIMARY KEY,
  name varchar NOT NULL UNIQUE -- e.g., email_notifications, sms_alerts, marketing_opt_in
);

-- Per-user settings (toggle values)
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id    uuid NOT NULL,
  setting_id int  NOT NULL,  -- matches settings.id
  status     boolean NOT NULL DEFAULT false,
  CONSTRAINT pk_user_settings PRIMARY KEY (user_id, setting_id)
);

-- User tag preferences
CREATE TABLE IF NOT EXISTS public.user_tag_preferences (
  user_id    uuid NOT NULL,
  tag_id     int  NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT pk_user_tag_preferences PRIMARY KEY (user_id, tag_id),
  CONSTRAINT fk_user_tag_prefs_user
    FOREIGN KEY (user_id) REFERENCES public.users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_tag_prefs_tag
    FOREIGN KEY (tag_id)  REFERENCES public.tags(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL,
  message    text NOT NULL,
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES public.users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
COMMENT ON TABLE public.notifications IS 'User notifications';

-- ======================
-- Foreign Keys (with cascade) added after both sides exist
-- ======================

-- posts -> users (organizer)
ALTER TABLE public.posts
  ADD CONSTRAINT fk_posts_user
  FOREIGN KEY (organizer_id) REFERENCES public.users(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- follows -> users (both sides)
ALTER TABLE public.follows
  ADD CONSTRAINT fk_follows_following
  FOREIGN KEY (following_user_id) REFERENCES public.users(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.follows
  ADD CONSTRAINT fk_follows_followed
  FOREIGN KEY (followed_user_id) REFERENCES public.users(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- attendees -> posts & users
ALTER TABLE public.attendees
  ADD CONSTRAINT fk_attendees_posts
  FOREIGN KEY (posts_id) REFERENCES public.posts(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.attendees
  ADD CONSTRAINT fk_attendees_users
  FOREIGN KEY (user_id) REFERENCES public.users(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- posts.building -> fiu_buildings(building_name)
ALTER TABLE public.posts
  ADD CONSTRAINT fk_posts_building_name
  FOREIGN KEY (building) REFERENCES public.fiu_buildings(building_name)
  ON UPDATE CASCADE
  ON DELETE SET NULL;

-- post_tags -> posts & tags
ALTER TABLE public.post_tags
  ADD CONSTRAINT fk_post_tags_post
  FOREIGN KEY (post_id) REFERENCES public.posts(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.post_tags
  ADD CONSTRAINT fk_post_tags_tag
  FOREIGN KEY (tag_id) REFERENCES public.tags(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- user_settings -> users & settings
ALTER TABLE public.user_settings
  ADD CONSTRAINT fk_user_settings_user
  FOREIGN KEY (user_id) REFERENCES public.users(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.user_settings
  ADD CONSTRAINT fk_user_settings_setting
  FOREIGN KEY (setting_id) REFERENCES public.settings(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ======================
-- Indexes
-- ======================

-- posts
CREATE INDEX IF NOT EXISTS idx_posts_user_start ON public.posts (user_id, start_date);
CREATE INDEX IF NOT EXISTS idx_posts_start ON public.posts (start_date);

-- post_tags
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON public.post_tags (tag_id);

-- follows
CREATE INDEX IF NOT EXISTS idx_follows_followed ON public.follows (followed_user_id);

-- attendees
CREATE INDEX IF NOT EXISTS idx_attendees_user ON public.attendees (user_id);

-- user_settings
CREATE INDEX IF NOT EXISTS idx_user_settings_setting ON public.user_settings (setting_id);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications (created_at);

-- ======================
-- USER SYNC TRIGGER
-- ======================
-- Automatically syncs Supabase Auth users to public.users table
-- This prevents "User account not found in database" errors

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to insert new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert the new user from auth.users into public.users
  INSERT INTO public.users (id, username_email, first_name, last_name, profile_picture_url)
  VALUES (
    NEW.id,
    NEW.email,
    -- Try to extract first name from raw_user_meta_data if available
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'given_name', split_part(NEW.email, '@', 1)),
    -- Try to extract last name from raw_user_meta_data if available
    COALESCE(NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'family_name', ''),
    -- Get profile picture from Google OAuth metadata if available
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Sync existing auth users who don't have records in public.users
INSERT INTO public.users (id, username_email, first_name, last_name, profile_picture_url)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', au.raw_user_meta_data->>'given_name', split_part(au.email, '@', 1)),
  COALESCE(au.raw_user_meta_data->>'last_name', au.raw_user_meta_data->>'family_name', ''),
  COALESCE(au.raw_user_meta_data->>'avatar_url', au.raw_user_meta_data->>'picture', NULL)
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL -- Only insert users that don't exist in public.users
ON CONFLICT (id) DO NOTHING;
