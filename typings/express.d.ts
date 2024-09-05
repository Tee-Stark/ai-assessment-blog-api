import { User } from "../src/users";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
