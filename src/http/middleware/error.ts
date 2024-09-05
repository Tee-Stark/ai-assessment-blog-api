import { NextFunction, Request, Response } from "express";

import { AppError } from "../../utils/error";
import { StatusCodes } from "http-status-codes";

export function notFound(_req: Request, res: Response, next: NextFunction) {
  return next(new AppError(StatusCodes.NOT_FOUND, "route doesn't exist."));
}

export function reporter() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    // handling for asynchronous situations where error is thrown after response has been sent
    if (res.headersSent) return next(err);

    if (err instanceof AppError) {
      res.status(err.code).json({ message: err.message, data: err.data });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "there's an issue on our end..."
      });
    }
    console.error(err);
  };
}
