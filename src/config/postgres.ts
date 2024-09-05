import { env } from "./env";
import knex from "knex";

export async function connectPostgres() {
  const db = knex({ client: "pg", connection: env.database_url });
  await db.raw("select now()");
  db.on("error", (err) => console.error(err));
  return db;
}
