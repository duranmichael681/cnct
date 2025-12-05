import { supabaseAdmin } from '../../config/supabase';

export interface postData {
    title: string;
    body: string;
    userId: string;
    building?: string;
    start_date?: string;
    end_date?: string;
    postPictureUrl?: string;
    isPrivate?: boolean;
    tagIds?: (string | number)[];
}

export interface postResponse {
    success: boolean;
    message: string;
    id: string;         // id is uuid, not number
    title: string;
    body: string;       // was content
    created_at: string;
}
export async function createPostService(postData: postData): Promise<postResponse> {
    try {
        console.log('🚀 Starting createPostService with userId:', postData.userId);
        
        const { data, error } = await supabaseAdmin
            .from('posts')
            .insert([{
                title: postData.title,
                body: postData.body,
                organizer_id: postData.userId,
                building: postData.building,
                start_date: postData.start_date,
                end_date: postData.end_date,
                post_picture_url: postData.postPictureUrl,
                is_private: postData.isPrivate ?? false
            }])
            .select()
            .single();

        if (error) {
            throw new Error(`Error inserting post: ${error.message}`);
        }

        if (!data) {
            throw new Error('No data returned after insert');
        }

        console.log('✅ Post inserted:', data.id);

        // Add organizer as an attendee automatically
        console.log(`\n🔔 ATTEMPTING TO ADD ORGANIZER AS ATTENDEE\n`);
        console.log(`   Post ID: ${data.id}`);
        console.log(`   User ID: ${postData.userId}`);
        
        const attendeePayload = {
            posts_id: data.id,
            user_id: postData.userId
        };
        console.log(`   Payload:`, attendeePayload);

        const { data: attendeeData, error: attendeeError } = await supabaseAdmin
            .from('attendees')
            .insert([attendeePayload])
            .select();

        console.log(`   Response:`, { data: attendeeData, error: attendeeError });

        if (attendeeError) {
            console.error(`\n❌ ERROR ADDING ORGANIZER AS ATTENDEE\n`, {
                message: attendeeError.message,
                code: attendeeError.code,
                details: attendeeError.details,
                hint: attendeeError.hint,
                postId: data.id,
                userId: postData.userId
            });
        } else {
            console.log(`\n✅ ORGANIZER ADDED AS ATTENDEE\n`, attendeeData);
        }

        // Insert tags into post_tags junction table if provided
        if (postData.tagIds && postData.tagIds.length > 0) {
            console.log(`📝 Inserting ${postData.tagIds.length} tags for post ${data.id}`);
            const postTagsData = postData.tagIds.map(tagId => ({
                post_id: data.id,
                tag_id: typeof tagId === 'string' ? parseInt(tagId, 10) : tagId
            }));
            
            console.log('📋 Tag data to insert:', postTagsData);

            const { error: tagsError } = await supabaseAdmin
                .from('post_tags')
                .insert(postTagsData);

            if (tagsError) {
                console.error('❌ Error inserting post tags:', tagsError);
            } else {
                console.log('✅ Tags inserted successfully');
            }
        }

        const response: postResponse = {
            success: true,
            message: 'Post created successfully',
            id: data.id,
            title: data.title,
            body: data.body,
            created_at: data.created_at,
        }

        return response;

    } catch (error) {
        console.error('Error in createPost:', error);
        throw error;
    }
}