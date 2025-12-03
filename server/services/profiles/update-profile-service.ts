import { supabaseAdmin } from '../../config/supabase.ts';

interface UpdateProfileData {
    profile_picture_url?: string;
    first_name?: string;
    last_name?: string;
    pronouns?: string;
    degree_program?: string;
}

export default async function updateProfileService(userId: string, updates: UpdateProfileData) {
    const { data, error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select();

    if (error) {
        console.log("Supabase error updating user profile. Error:", error);
        throw new Error("Error updating user profile");
    }

    return data;
}
