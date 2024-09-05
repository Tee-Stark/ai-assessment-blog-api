import Postgrator from "postgrator";
import { join } from "path";
import { exit } from "./helpers.js";
import knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const db = knex({
  connection: process.env.DATABASE_URL,
  client: "pg"
});

async function main() {
  const postgrator = new Postgrator({
    migrationPattern: join(process.cwd(), "db/migrations/*"),
    driver: "pg",
    database: process.env.DATABASE_NAME,
    schemaTable: "schema_migrations",
    execQuery: (query) => db.raw(query)
  });

  await postgrator.migrate();
  exit("successfully run migrations", 0);
}
main();
