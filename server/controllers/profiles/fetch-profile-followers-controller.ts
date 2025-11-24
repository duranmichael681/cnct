import profileFollowersService from "../../services/profiles/fetch-profile-followers-service.js"

export default async function returnProfileFollowers(userId: string) {
    if (false)
        throw Error("Inputted ID not valid");
    return await profileFollowersService(userId);
}