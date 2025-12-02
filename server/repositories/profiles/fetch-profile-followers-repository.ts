import { supabaseAdmin } from '../../config/supabase.ts';

export default async function fetchProfileFollowers(userId : string) {
    const {data, error} = await supabaseAdmin
        .from('follows')
        .select("following_user_id")
        .eq("followed_user_id", userId);
        if(error) {
            console.log("Supabase error retrieving followers data. Error: ");
            console.log(error);
            throw Error("Error retrieving followers data");
        }
    return data;
}