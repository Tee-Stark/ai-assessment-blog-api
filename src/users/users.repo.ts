import { injectable } from "inversify";
import { Repository } from "../utils/postgres";
import { User, UserAlreadyExists } from "./users.model";
import { Knex } from "knex";

@injectable()
export class UserRepo extends Repository<User> {
  protected table: string = "users";

  async create(user: Partial<User>, ctx?: Knex) {
    try {
      const [newUser] = await this.db(ctx).insert(user, "*");
      return newUser;
    } catch (err) {
      if (err.code === "23505") throw new UserAlreadyExists(user.email_address);
      throw err;
    }
  }

  async findOne(where: Partial<User>, ctx?: Knex): Promise<User> {
    return this.db(ctx)
      .select("email_address", "name", "role")
      .where(where)
      .first("*");
  }
}
