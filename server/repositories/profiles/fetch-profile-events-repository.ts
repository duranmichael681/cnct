import { supabaseAdmin } from '../../config/supabase.js';

export default async function fetchProfileEvents(userId: string) {
    const {data, error} = await supabaseAdmin
        .from('posts')
        .select("* , attendees(count)")
        .eq("organizer_id", userId);
        if(error) {
            console.log("Supabase error retrieving post data. Error: ");
            console.log(error);
            throw new Error("Error retrieving post data");
        }
    return data;
}