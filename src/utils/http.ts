import { NextFunction, Request, Response } from "express";

/**
 * A handler for every HTTP request controller
 * Every controller should be wrapped in this function
 * and should not end or return anything.
 * @param fn
 * @returns
 */
export function controller(fn: (req: Request, res: Response) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fn(req, res);

      if (!res.headersSent) res.json(data ?? null);
    } catch (err) {
      next(err);
    }
  };
}
