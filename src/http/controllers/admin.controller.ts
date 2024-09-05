import { Container } from "inversify";
import express, { Request, Response } from "express";
import { PostService } from "../../posts";
import { PostStatus } from "../../posts/posts.model";
import TYPES from "../../config/inversify.types";
import { authenticate, authorizeAdmin } from "../middleware/auth";

function approvePost(postService: PostService) {
  return async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      return await postService.updatePostStatus(postId, PostStatus.PUBLISHED);
    } catch (err) {
      throw err;
    }
  };
}

/**
 * Approves either an Update or Delete request
 * @param postService
 * @returns
 */

function approvePostUpdateAction(postService: PostService) {
  return async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const actionApproved = postService.approveAction(postId);
      return actionApproved;
    } catch (err) {
      throw err;
    }
  };
}

export const adminRouter = (container: Container) => {
  const router = express.Router();
  const postService = container.get<PostService>(TYPES.PostService);

  router.post(
    "/post/:postId/publish",
    authenticate,
    authorizeAdmin,
    approvePost(postService)
  );
  router.put(
    "/post/:postId/update",
    authenticate,
    authorizeAdmin,
    approvePostUpdateAction(postService)
  );
  return router;
};
