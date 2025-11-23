import fetchProfileFollowers from "../../repositories/profiles/fetch-profile-followers-repository.js"

export default function fetchProfileFollowersService(userId : String) {
    const data = fetchProfileFollowers(userId);
    return data
}