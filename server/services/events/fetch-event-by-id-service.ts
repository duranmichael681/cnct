import { Request, Response} from 'express';
import { supabase } from '../../server.js';


export async function fetch_events_by_id(id: string)
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