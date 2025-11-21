import profileDataService from "../../services/profiles/fetch-profile-data-service.js"

export default function returnProfileData(userId: String) {
    if (parseInt(userId) != userId)
        throw Error("Inputted ID not valid");
    return profileDataService(userId);
}