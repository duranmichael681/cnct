import { supabase } from "../../server";

export async function fetchAttendessService(post_id: string)
{
    const {error, data} = await supabase.from('attendees').select().eq("posts_id", post_id);
    
    if(error) throw error; 

    return data;
}