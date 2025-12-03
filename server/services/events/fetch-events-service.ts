import { supabaseAdmin } from "../../config/supabase";

/*
    
*/

export async function fetchEventsService()
{
    const {error, data} = await supabaseAdmin.from("posts").select();
    if(error) throw error;
    return JSON.stringify(data);
}