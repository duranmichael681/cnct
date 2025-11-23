import fetchProfileFollowing from "../../repositories/profiles/fetch-profile-following-repository.js"

export default function fetchProfileFollowingService(userId : String) {
    const data = fetchProfileFollowing(userId);
    return data
}