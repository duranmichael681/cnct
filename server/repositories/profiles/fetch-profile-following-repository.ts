import { supabaseAdmin } from '../../config/supabase.ts';

export default async function fetchProfileFollowing(userId : string) {
    const {data, error} = await supabaseAdmin
        .from('follows')
        .select("followed_user_id")
        .eq("following_user_id", userId);
        if(error) {
            console.log("Supabase error retrieving following data. Error: ");
            console.log(error);
            throw Error("Error retrieving following data");
        }
    return data;
}