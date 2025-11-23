import { supabase } from '../../server.js'

export default function fetchProfileFollowers(userId : String) {
    const {data, error} = supabase
            .from('follows')
            .select("following_user_id")
            .eq("followed_user_id", userId);
            if(error) {
                console.log("Supabase error retrieving followers data. Error: ");
                console.log(error);
            }
}