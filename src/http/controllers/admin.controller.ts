import { Container } from "inversify";
import express, { Request, Response } from "express";
import { PostService } from "../../posts";
import { PostStatus } from "../../posts/posts.model";
import TYPES from "../../config/inversify.types";
import { authenticate, authorizeAdmin } from "../middleware/auth";
import { controller } from "../../utils/http";

function approvePost(postService: PostService) {
  return async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const updated = await postService.updatePostStatus(
        postId,
        PostStatus.PUBLISHED
      );
      console.log("returning now");
      return updated;
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
    controller(approvePost(postService))
  );
  router.put(
    "/post/:postId/update",
    authenticate,
    authorizeAdmin,
    controller(approvePostUpdateAction(postService))
  );
  return router;
};
