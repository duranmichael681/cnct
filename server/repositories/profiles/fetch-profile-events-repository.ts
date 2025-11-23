import { supabase } from '../../server.js'

export default async function fetchProfileEvents(userId: string) {
    const {data, error} = await supabase
        .from('posts')
        .select()
        .eq("organizer_id", userId);
        if(error) {
            console.log("Supabase error retrieving post data. Error: ");
            console.log(error);
        }
    return data;
}