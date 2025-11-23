import { supabase } from '../../server.js';
export default function fetchProfileFollowing(userId) {
    const {data, error} = supabase
        .from('follows')
        .select("followed_user_id")
        .eq("following_user_id", userId);
        if(error) {
            console.log("Supabase error retrieving following data. Error: ");
            console.log(error);
        }
    return data;
}