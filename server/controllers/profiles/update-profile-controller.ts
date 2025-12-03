import updateProfileService from "../../services/profiles/update-profile-service.ts";

interface UpdateProfileData {
    profile_picture_url?: string;
    first_name?: string;
    last_name?: string;
    pronouns?: string;
    degree_program?: string;
}

export default async function updateProfileController(userId: string, updates: UpdateProfileData, requestingUserId: string) {
    // Authorization check: only allow users to update their own profile
    if (userId !== requestingUserId) {
        throw new Error("Unauthorized: You can only update your own profile");
    }

    // Validate that there are updates to make
    if (Object.keys(updates).length === 0) {
        throw new Error("No updates provided");
    }

    // Call service to update profile
    return await updateProfileService(userId, updates);
}
