import profileFollowersService from "../../services/profiles/fetch-profile-followers-service.js"

export default function returnProfileFollowers(userId: String) {
    return profileFollowersService(userId);
}