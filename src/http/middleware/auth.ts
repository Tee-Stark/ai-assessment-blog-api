import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../../utils/error";
import { TokenStore, verifyJwt } from "../../utils/jwt";
import { User } from "../../users";

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
  if (!auth) throw new UnauthorizedError();
  const [bearer, token] = auth.split(" ");
  if (!bearer || !token) throw new UnauthorizedError();
  if (bearer !== "Bearer") throw new UnauthorizedError();
  if (_tokenStore.has(token)) {
    const decoded = verifyJwt(token);
    if (!decoded) throw new UnauthorizedError("invalid token");
    req.user = decoded as User;
    return next();
  }
  throw new UnauthorizedError();
};

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== "user") throw new ForbiddenError();
  return next();
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== "admin") throw new ForbiddenError();
  return next();
};
