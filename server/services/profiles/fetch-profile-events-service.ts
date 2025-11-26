import fetchProfileEvents from "../../repositories/profiles/fetch-profile-events-repository.js"

export default async function fetchProfileEventsService(userId : string) {
    const data = await fetchProfileEvents(userId);
    return data
}