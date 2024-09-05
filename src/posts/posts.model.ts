import { Model } from "../utils/postgres";

export interface Post extends Model {
  title: string;
  content_body: string;
  author_id: string;
  status: string;
}

export interface PostUpdate extends Post {
  post_id: string;
  action: string;
}

export const PostStatus = {
  PUBLISHED: "published",
  REJECTED: "rejected",
  APPROVED: "approved",
  PENDING: "pending"
};

export class PendingUpdateExistsErr extends Error {
  constructor(postId: string) {
    const errMessage = `post ${postId} is under a pending review`;
    super(errMessage);
  }
}
