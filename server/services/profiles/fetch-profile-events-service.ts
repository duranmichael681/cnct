import fetchProfileEvents from "../../repositories/profiles/fetch-profile-events-repository.js"

export default function fetchProfileEventsService(userId : String) {
    const data = fetchProfileEvents(userId);
    return data
}