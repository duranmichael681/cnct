import profileEventsService from "../../services/profiles/fetch-profile-events-service.js"

export default async function returnProfileEvents(userId: string) {
    if (false)
        throw new Error("Inputted ID not valid");
    return await profileEventsService(userId);
}