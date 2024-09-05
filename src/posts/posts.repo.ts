import { injectable } from "inversify";
import { Repository } from "../utils/postgres";
import { Post } from "./posts.model";
import { Knex } from "knex";

@injectable()
export class PostRepo extends Repository<Post> {
  protected table: string = "posts";

  async create(post: Partial<Post>, ctx?: Knex) {
    try {
      const [newPost] = await this.db(ctx).insert(post, "*");
      return newPost;
    } catch (err) {
      throw err;
    }
  }

  async findOne(postId: string, ctx?: Knex) {
    const post = this.db(ctx)
      .select("posts.*")
      .leftJoin("users", "posts.author_id", "users.id")
      .select(
        "posts.*",
        this.knex.raw(
          "json_build_object('id', users.id, 'name', users.name, 'email', users.email) as author"
        )
      )
      .where("posts.id", postId)
      .first();

    return post;
  }

  async findMany(where: Partial<Post>, ctx?: Knex) {
    const posts = this.db(ctx)
      .select("posts.*")
      .leftJoin("users", "posts.author_id", "users.id")
      .select(
        "posts.*",
        this.knex.raw(
          "json_build_object('id', users.id, 'name', users.name, 'email', users.email) as author"
        )
      )
      .where(where);

    return posts;
  }

  async update(where: Partial<Post>, update: Partial<Post>, ctx?: Knex) {
    try {
      const [post] = await this.db(ctx).where(where).update(update, "*");
      return post;
    } catch (err) {
      throw err;
    }
  }

  async delete(postId: string, ctx?: Knex) {
    try {
      return await this.db(ctx).where({ id: postId }).delete();
    } catch (err) {
      throw err;
    }
  }
}
