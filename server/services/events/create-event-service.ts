import { date } from "zod";
import { supabase }  from '../../server.js';

export async function createEventService(title: string, date: date, is_private: boolean, created_at: date)
{
    const { error } = await supabase.from('posts').insert({
        "title": title,
        "date": date,
        "is_private": is_private,
        "created_at": created_at
    });

    if(error) return null;

    return "Success!";
}
