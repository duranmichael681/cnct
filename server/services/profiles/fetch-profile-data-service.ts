import { supabase } from '../../server.js';

export default function fetchProfileData(userId) {
    const {data, error} = supabase
        .from('users')
        .select("profile_picture_url, first_name, last_name, pronouns, degree_program, description")
        .eq("id", userId);
        if(error) {
            console.log("Supabase error retrieving user data. Error: ");
            console.log(error);
        }
        return data;
}