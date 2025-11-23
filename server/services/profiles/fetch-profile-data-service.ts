import fetchProfileData from "../../repositories/profiles/fetch-profile-data-repository.js"

export default async function fetchProfileDataService(userId : string) {
    const data = await fetchProfileData(userId);
    return data
}