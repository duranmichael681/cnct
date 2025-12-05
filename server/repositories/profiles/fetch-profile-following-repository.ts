import { supabaseAdmin } from '../../config/supabase.ts';

export default async function fetchProfileFollowing(userId : string) {
    const {data, error} = await supabaseAdmin
        .from('follows')
        .select(`
            followed_user_id,
            users:followed_user_id(id, username_email, first_name, last_name, profile_picture_url)
        `)
        .eq("following_user_id", userId);
        if(error) {
            console.log("Supabase error retrieving following data. Error: ");
            console.log(error);
            throw Error("Error retrieving following data");
        }
    // Flatten the response to return just the user objects
    return data?.map(item => item.users).filter(Boolean) || [];
}