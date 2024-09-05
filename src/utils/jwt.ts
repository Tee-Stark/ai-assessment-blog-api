import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { injectable } from "inversify";
import { User } from "../users";

/**
 * A dummy in-memory token store to keep tokens and expire them after 1 hour
 */
@injectable()
export class TokenStore {
  private store: Set<string> = new Set();
  private readonly ttl = 1000 * 60 * 60; // tokens are valid for 1 hour

  add(token: string) {
    this.store.add(token);
    setTimeout(() => this.store.delete(token), this.ttl); // delete token after ttl
  }

  has(token: string) {
    return this.store.has(token);
  }

  clear() {
    this.store.clear();
  }

  delete(token: string) {
    this.store.delete(token);
  }
}

/**
 * JWT specific functions
 * @param payload Toke Payload
 * @returns
 */
export function signJwt(payload: Partial<User>) {
  return jwt.sign(payload, env.jwt_expiry, { expiresIn: env.jwt_expiry });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, env.jwt_secret);
  } catch (err) {
    return null;
  }
}
