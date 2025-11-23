import { createPostController } from "./posts/create-post-controller";
import { fetchAttendeesController } from "./posts/fetch-attendees-controller";
import { removeAttendeeController } from "./posts/remove-attendee-controller";
import { fetchPostByIdController } from "./posts/fetch-post-by-id-controller";
import { fetchPostsController } from "./posts/fetch-posts-controller";
import { updatePostController } from "./posts/update-post-controller";
import { deletePostController } from "./posts/delete-post-controller";
import { de } from "zod/locales";

// Export a plain object with the controller functions so consumers
// can import `{ EventControllerModule }` and use the functions directly.
export const EventControllerModule = {
    createPostController,
    fetchAttendeesController,
    removeAttendeeController,
    fetchPostByIdController,
    fetchPostsController,
    updatePostController,
    deletePostController
};
