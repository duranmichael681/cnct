import { supabase } from '../../server.js';


export async function fetchEventsByID(id: string)
{
    try 
    {
        const {data, error} = await supabase.from("posts").select("*").eq("id", id);
        if(error) throw error;
        return data
    } catch (error: any) {
        return null;
    }
}