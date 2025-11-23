import fetchProfileFollowing from "../../repositories/profiles/fetch-profile-following-repository.js"

export default async function fetchProfileFollowingService(userId : string) {
    const data = await fetchProfileFollowing(userId);
    return data
}