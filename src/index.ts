import "reflect-metadata";

import express from "express";
import { Container } from "inversify";
import cors from "cors";
import { userRouter } from "./http/controllers/user.controller";
import TYPES from "./config/inversify.types";
import { connectPostgres } from "./config/postgres";
import { Knex } from "knex";
import { UserRepo } from "./users";
import { UserService } from "./users/users.service";
import http from "http";
import { env } from "./config/env";
import { TokenStore } from "./utils/jwt";
import * as errors from "./http/middleware/error";
import { postRouter } from "./http/controllers/post.controller";
import { PostRepo, PostService } from "./posts";
import { PostUpdateRepo } from "./posts/post_update.repo";
import { adminRouter } from "./http/controllers/admin.controller";

async function main() {
  const container = new Container();

  const db = await connectPostgres();
  container.bind<Knex>(TYPES.Knex).toConstantValue(db);

  container.bind<TokenStore>(TYPES.TokenStore).to(TokenStore);
  container.bind<UserRepo>(TYPES.UserRepo).to(UserRepo);
  container.bind<UserService>(TYPES.UserService).to(UserService);
  container.bind<PostRepo>(TYPES.PostRepo).to(PostRepo);
  container.bind<PostService>(TYPES.PostService).to(PostService);
  container.bind<PostUpdateRepo>(TYPES.PostUpdateRepo).to(PostUpdateRepo);

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_, res) => res.send("welcome to AI Blog!"));

  app.use("/api/v1/users", userRouter(container));
  app.use("/api/v1/posts", postRouter(container));
  app.use("/api/v1/admin", adminRouter(container));
  app.use(errors.notFound, errors.reporter);

  const PORT = env.port;
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });

  /**
   * Ensure graceful exit
   */
  process.on("SIGTERM", async () => {
    console.log("exiting app...");
    server.close();
    container.get<TokenStore>(TYPES.TokenStore).clear(); // clear token store memory
    process.exit(0);
  });
}

main();
