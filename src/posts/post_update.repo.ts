import { injectable } from "inversify";
import { Repository } from "../utils/postgres";
import { PendingUpdateExistsErr, PostUpdate } from "./posts.model";
import { Knex } from "knex";

@injectable()
export class PostUpdateRepo extends Repository<PostUpdate> {
  protected table = "post_updates";

  async create(details: Partial<PostUpdate>, ctx?: Knex) {
    const existingPending = await this.db(ctx)
      .from("post_updates")
      .where({ post_id: details.post_id, status: "pending" })
      .first();

    if (existingPending) {
      throw new PendingUpdateExistsErr(details.post_id);
    }
    const [postUpdate] = await this.db(ctx).insert(details, "*");
    return [postUpdate];
  }

  async findMany(where: Partial<PostUpdate>, ctx?: Knex) {
    const pendingUpdates = await this.db(ctx)
      .select("*")
      .leftJoin("posts", "post_updates.post_id", "posts.id")
      .leftJoin("users", "post_updates.author_id", "users.id")
      .select(
        "posts.*",
        this.knex.raw(
          "json_build_object('id', users.id, 'name', users.name, 'email', users.email_address) as author"
        )
      )
      .where(where);

    return pendingUpdates;
  }

  async update(
    where: Partial<PostUpdate>,
    update: Partial<PostUpdate>,
    ctx?: Knex
  ) {
    try {
      const [postUpdate] = await this.db(ctx).where(where).update(update, "*");
      return postUpdate;
    } catch (err) {
      throw err;
    }
  }
}
