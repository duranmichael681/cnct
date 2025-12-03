import { fetchCommentsController } from "./comments/fetch-comments-controller";
import { createCommentController } from "./comments/create-comment-controller";
import { deleteCommentController } from "./comments/delete-comment-controller";
import { voteCommentController } from "./comments/vote-comment-controller";

// Export a plain object with the controller functions
export const CommentControllerModule = {
    fetchCommentsController,
    createCommentController,
    deleteCommentController,
    voteCommentController
};
