import { supabaseAdmin } from '../../config/supabase.js';

export default async function fetchProfileData(userId : string) {
    const {data, error} = await supabaseAdmin
        .from('users')
        .select("profile_picture_url, first_name, last_name, pronouns, degree_program, description")
        .eq("id", userId);
        if(error) {
            console.log("Supabase error retrieving user data. Error: ");
            console.log(error);
            throw new Error("Error retrieving user data");
        }
    return data;
}