import { supabase } from "../../server";

export async function fetchEventsService()
{
    const {error, data} = await supabase.from("posts").select();
    if(error) throw error;
    return data;
}