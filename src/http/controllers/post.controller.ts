import { Container } from "inversify";
import { Request, Response } from "express";
import { PostService } from "../../posts";
import { Post, PostUpdate } from "../../posts/posts.model";
import express from "express";
import { controller } from "../../utils/http";
import TYPES from "../../config/inversify.types";
import { autoValidate } from "../middleware/validation";
import { createPostDto } from "./post.dto";
import { authenticate } from "../middleware/auth";

function createPost(postService: PostService) {
  return async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const { id } = req.user;
      const post: Partial<Post> = {
        ...body,
        author_id: id
      };
      return await postService.createPost(post);
    } catch (err) {
      throw err;
    }
  };
}

function getPost(postService: PostService) {
  return async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      return await postService.getPost(id);
    } catch (err) {
      throw err;
    }
  };
}

function getPublishedPosts(postService: PostService) {
  return async (req: Request, res: Response) => {
    try {
      return await postService.getPublishedPosts();
    } catch (err) {
      throw err;
    }
  };
}

/**
 * To either update or delete post
 */
function requestUpdate(postService: PostService) {
  return async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const { id } = req.params;
      const details: Partial<PostUpdate> = {
        ...body,
        author_id: req.user.id,
        post_id: id
      };
      return await postService.createAction(details);
    } catch (err) {
      throw err;
    }
  };
}

export const postRouter = (container: Container) => {
  const router = express.Router();
  const postService = container.get<PostService>(TYPES.PostService);

  router.post(
    "/",
    autoValidate(createPostDto),
    controller(createPost(postService))
  );

  router.get("/", controller(getPublishedPosts(postService)));
  router.get("/:id", controller(getPost(postService)));
  router.put("/:id", authenticate, requestUpdate(postService));

  return router;
};
