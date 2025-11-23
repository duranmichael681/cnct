import { supabase } from '../../server.js';

export default function fetchProfileEvents(userId: String) {
    const {data, error} = supabase
        .from('posts')
        .select()
        .eq("organizer_id", userId);
        if(error) {
            console.log("Supabase error retrieving post data. Error: ");
            console.log(error);
        }
        return data;
}