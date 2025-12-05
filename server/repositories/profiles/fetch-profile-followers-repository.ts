import { supabaseAdmin } from '../../config/supabase.ts';

export default async function fetchProfileFollowers(userId : string) {
    const {data, error} = await supabaseAdmin
        .from('follows')
        .select(`
            following_user_id,
            users:following_user_id(id, username_email, first_name, last_name, profile_picture_url)
        `)
        .eq("followed_user_id", userId);
        if(error) {
            console.log("Supabase error retrieving followers data. Error: ");
            console.log(error);
            throw Error("Error retrieving followers data");
        }
    // Flatten the response to return just the user objects
    return data?.map(item => item.users).filter(Boolean) || [];
}