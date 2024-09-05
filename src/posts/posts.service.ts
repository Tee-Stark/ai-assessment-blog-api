import { inject, injectable } from "inversify";
import TYPES from "../config/inversify.types";
import { PostRepo } from "./posts.repo";
import { Post, PostStatus, PostUpdate } from "./posts.model";
import { PostUpdateRepo } from "./post_update.repo";
import { Knex } from "knex";

@injectable()
export class PostService {
  @inject(TYPES.PostRepo) private readonly postRepo: PostRepo;
  @inject(TYPES.PostUpdateRepo) private readonly postUpdateRepo: PostUpdateRepo;
  @inject(TYPES.Knex) private readonly knex: Knex;

  async createPost(details: Partial<Post>) {
    return await this.postRepo.create(details);
  }

  async getPost(postId: string) {
    return await this.postRepo.findOne(postId);
  }

  async updatePostStatus(postId: string, status: string) {
    return await this.postRepo.update({ id: postId }, { status });
  }

  async getPublishedPosts() {
    return this.postRepo.findMany({ status: "published" });
  }

  /**
   * In case admin needs to get pending posts
   * for review, for example
   */
  async getPendingPosts() {
    return this.postRepo.findMany({ status: "pending" });
  }

  async deletePost(postId: string) {
    return await this.postRepo.delete(postId);
  }

  /**
   * Update services
   */
  async createAction(details: Partial<PostUpdate>) {
    return await this.postUpdateRepo.create(details);
  }

  async getPendingActions() {
    return await this.postUpdateRepo.findMany({ status: PostStatus.PENDING });
  }

  async approveAction(postId: string) {
    const where = { post_id: postId, status: PostStatus.PENDING };
    const trx = await this.knex.transaction();
    try {
      let postUpdate = await this.postUpdateRepo.update(
        where,
        { status: PostStatus.APPROVED },
        trx
      );

      if (postUpdate.action === "delete") {
        const deleted = await this.postRepo.delete(postId, trx);
        await trx.commit();
        return deleted;
      } else {
        const updatedPost: Partial<Post> = {
          title: postUpdate.title,
          content_body: postUpdate.content_body
        };
        const newPost = await this.postRepo.update(
          { id: postId },
          updatedPost,
          trx
        );
        await trx.commit();
        return newPost;
      }
    } catch (err) {
      trx.rollback();
      throw err;
    }
  }
}
