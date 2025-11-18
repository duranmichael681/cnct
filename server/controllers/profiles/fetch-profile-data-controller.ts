import profileDataService from "../../services/profiles/fetch-profile-data-service.js"

export default function returnProfileData(userId) {
    return profileDataService(userId);
}