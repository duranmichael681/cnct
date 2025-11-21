import { supabase } from '../../server.js';

export async function removeAttendeesService(user_id: string)
{
    const {data, error} = await supabase.from("attendees").delete().eq("user_id", user_id);
    if(error) throw error;
    return data;
}