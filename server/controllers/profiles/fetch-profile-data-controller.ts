import profileDataService from "../../services/profiles/fetch-profile-data-service.js"

export default async function returnProfileData(userId: string) {
    if (false)
        throw Error("Inputted ID not valid");
    return await profileDataService(userId);
}