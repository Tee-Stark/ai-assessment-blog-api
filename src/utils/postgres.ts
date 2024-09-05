import TYPES from "../config/inversify.types";
import { inject, injectable } from "inversify";
import { Knex } from "knex";

/**
 * A Base Model for tables
 */
export interface Model {
  id: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Basically, every repository class extends this
 */

@injectable()
export abstract class Repository<T> {
  protected abstract table: string;
  @inject(TYPES.Knex) protected knex: Knex;

  protected db = (ctx = this.knex) => ctx<T>(this.table);
}
