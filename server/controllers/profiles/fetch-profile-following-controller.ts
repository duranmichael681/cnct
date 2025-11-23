import profileFollowingService from "../../services/profiles/fetch-profile-following-service.js"

export default function returnProfileFollowing(userId: String) {
    return profileFollowingService(userId);
}