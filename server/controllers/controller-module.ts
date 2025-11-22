import { createEventController } from "./events/create-event-controller";
import { fetchAttendeesController } from "./events/fetch-attendees-controller";
import { removeAttendeeController } from "./events/remove-attendee-controller";
import { fetchEventByIdController } from "./events/fetch-event-by-id-controller";
import { fetchEventsController } from "./events/fetch-events-controller";
import { updateEventController } from "./events/update-event-controller";
import { deletePostController } from "./events/delete-event-controller";
import { de } from "zod/locales";

// Export a plain object with the controller functions so consumers
// can import `{ EventControllerModule }` and use the functions directly.
export const EventControllerModule = {
    createEventController,
    fetchAttendeesController,
    removeAttendeeController,
    fetchEventByIdController,
    fetchEventsController,
    updateEventController,
    deletePostController
};
