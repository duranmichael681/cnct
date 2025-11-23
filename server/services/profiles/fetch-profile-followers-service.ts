import fetchProfileFollowers from "../../repositories/profiles/fetch-profile-followers-repository.js"

export default async function fetchProfileFollowersService(userId : string) {
    const data = await fetchProfileFollowers(userId);
    return data
}