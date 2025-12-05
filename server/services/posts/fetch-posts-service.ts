import { supabaseAdmin } from '../../config/supabase';

export async function fetchPostService(userId?: string): Promise<any[]> {
    try {
        // If userId provided, filter by user's tag preferences
        if (userId) {
            // Fetch user's tag preferences
            const { data: userPrefs, error: prefsError } = await supabaseAdmin
                .from('user_tag_preferences')
                .select('tag_id')
                .eq('user_id', userId);

            if (prefsError) throw prefsError;

            if (userPrefs && userPrefs.length > 0) {
                // User has tag preferences - show posts matching those tags OR posts with no tags
                const tagIds = userPrefs.map(pref => pref.tag_id);

                // Get posts that match user's tag preferences
                const { data: postTags, error: postTagsError } = await supabaseAdmin
                    .from('post_tags')
                    .select('post_id')
                    .in('tag_id', tagIds);

                if (postTagsError) throw postTagsError;

                const taggedPostIds = [...new Set(postTags.map(pt => pt.post_id))];

                // Get all posts with enhanced data
                const { data: allPosts, error: allPostsError } = await supabaseAdmin
                    .from('posts')
                    .select(`
                        *,
                        users!posts_organizer_id_fkey (
                            id,
                            first_name,
                            last_name,
                            profile_picture_url
                        ),
                        attendees(count),
                        comments:comments(count),
                        post_tags(tag_id)
                    `)
                    .eq('is_private', false)
                    .order('start_date', { ascending: true });

                if (allPostsError) throw allPostsError;

                // Get all post IDs that have tags
                const { data: allPostTags, error: allPostTagsError } = await supabaseAdmin
                    .from('post_tags')
                    .select('post_id');

                if (allPostTagsError) throw allPostTagsError;

                const postsWithTags = new Set(allPostTags.map(pt => pt.post_id));

                // Filter: show posts that match user's tags OR posts with no tags
                const filteredPosts = allPosts.filter(post => 
                    taggedPostIds.includes(post.id) || !postsWithTags.has(post.id)
                );

                // Map post_tags to tag_ids array
                return filteredPosts.map((post: any) => ({
                    ...post,
                    tag_ids: post.post_tags?.map((pt: any) => pt.tag_id) || [],
                    post_tags: undefined // Remove the post_tags array from response
                }));
            }
        }

        // Default: fetch all public posts with enhanced data (joins for users, attendees, comments)
        const { data, error } = await supabaseAdmin
            .from('posts')
            .select(`
                *,
                users!posts_organizer_id_fkey (
                    id,
                    first_name,
                    last_name,
                    profile_picture_url
                ),
                attendees(count),
                comments:comments(count),
                post_tags(tag_id)
            `)
            .eq('is_private', false)
            .order('start_date', { ascending: true });
            
        if (error) {
            throw new Error(`Error fetching posts: ${error.message}`);
        }
        if (!data) {
            throw new Error('No data returned from fetch');
        }

        // Map post_tags to tag_ids array
        const postsWithTagIds = data.map((post: any) => {
            const tagIds = post.post_tags?.map((pt: any) => pt.tag_id) || [];
            console.log(`📍 Post ${post.id}: post_tags =`, post.post_tags, 'mapped to tag_ids =', tagIds);
            return {
                ...post,
                tag_ids: tagIds,
                post_tags: undefined // Remove the post_tags array from response
            };
        });
        
        console.log(`✅ Fetched ${postsWithTagIds.length} posts with tags`);
        return postsWithTagIds;
    } catch (error) {
        console.error('Error in fetchPostService:', error);
        throw error;
    }
}