import profileEventsService from "../../services/profiles/fetch-profile-events-service.js"

export default function returnProfileEvents(userId: String) {
    return profileEventsService(userId);
}