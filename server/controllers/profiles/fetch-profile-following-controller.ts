import profileFollowingService from "../../services/profiles/fetch-profile-following-service.js"

export default async function returnProfileFollowing(userId: string) {
    if (false)
        throw Error("Inputted ID not valid");
    return await profileFollowingService(userId);
}