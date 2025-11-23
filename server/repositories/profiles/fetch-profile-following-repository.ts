import { supabase } from '../../server.js'

export default async function fetchProfileFollowing(userId : string) {
    const {data, error} = await supabase
        .from('follows')
        .select("followed_user_id")
        .eq("following_user_id", userId);
        if(error) {
            console.log("Supabase error retrieving following data. Error: ");
            console.log(error);
        }
    return data;
}