import { exit, snakecase } from "./helpers.js";
import { writeFileSync, readdirSync } from "fs";
import { padStart } from "lodash";
import { join } from "path";

const migrationsPath = join(process.cwd(), "db/migrations");
const filename = process.argv[2] ?? exit("migration filename not provided");
const template = `-- database migration file --\nbegin;\n\ncommit; `;

create(snakecase(filename));

function create(filename) {
  const version = padStart(dirLength() + 1 + "", 4, "0");
  writeFileSync(
    join(migrationsPath, `${version}.do.${filename}_${Date.now()}.sql`),
    template
  );
}

function dirLength() {
  const dir = readdirSync(migrationsPath);
  return dir.length;
}
