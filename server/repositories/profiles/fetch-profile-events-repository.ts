import { supabaseAdmin } from '../../config/supabase.ts';

export default async function fetchProfileEvents(userId: string) {
    const {data, error} = await supabaseAdmin
        .from('posts')
        .select("* , attendees(count), post_tags(tag_id)")
        .eq("organizer_id", userId);
        if(error) {
            console.log("Supabase error retrieving post data. Error: ");
            console.log(error);
            throw new Error("Error retrieving post data");
        }
    
    // Map post_tags to tag_ids array
    const postsWithTagIds = data?.map((post: any) => ({
        ...post,
        tag_ids: post.post_tags?.map((pt: any) => pt.tag_id) || [],
        post_tags: undefined
    })) || [];
    
    return postsWithTagIds;
}