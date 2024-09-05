import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../../utils/error";
import { TokenStore, verifyJwt } from "../../utils/jwt";

let _tokenStore: TokenStore;

export function initAuth(store: TokenStore) {
  _tokenStore = store;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  const [bearer, token] = auth.split(" ");
  if (!bearer || !token) throw new UnauthorizedError();
  if (bearer !== "Bearer") throw new UnauthorizedError();
  if (_tokenStore.has(token)) {
    const decoded = verifyJwt(token);
    req.user = decoded;
    return next();
  }
  throw new UnauthorizedError();
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== "admin") throw new ForbiddenError();
  return next();
};
