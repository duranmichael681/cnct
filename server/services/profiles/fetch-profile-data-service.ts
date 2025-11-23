import { supabase } from '../../server.js';
import fetchProfileData from "../../repositories/profiles/fetch-profile-data-repository.js"

export default function fetchProfileDataService(userId) {
    const data = fetchProfileData(userId);
    return data
}