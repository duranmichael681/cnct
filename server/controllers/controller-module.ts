import { createPostController } from "./posts/create-post-controller";
import { fetchAttendeesController } from "./posts/fetch-attendees-controller";
import { removeAttendeeController } from "./posts/remove-attendee-controller";
import { fetchPostByIdController } from "./posts/fetch-post-by-id-controller";
import { fetchPostsController } from "./posts/fetch-posts-controller";
import { updatePostController } from "./posts/update-post-controller";
import { deletePostController } from "./posts/delete-post-controller";
import { toggleAttendanceController } from "./posts/toggle-attendance-controller";
import { fetchPostAttendeesController } from "./posts/fetch-post-attendees-controller";
import { de } from "zod/locales";

// Export a plain object with the controller functions so consumers
// can import `{ PostControllerModule }` and use the functions directly.
export const PostControllerModule = {
    createPostController,
    fetchAttendeesController,
    removeAttendeeController,
    fetchPostByIdController,
    fetchPostsController,
    updatePostController,
    deletePostController,
    toggleAttendanceController,
    fetchPostAttendeesController
};
