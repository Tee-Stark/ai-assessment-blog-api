import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  constructor(
    readonly code: StatusCodes,
    readonly message: string,
    readonly data?: any
  ) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(msg = "unable to authenticate request", data?: any) {
    super(StatusCodes.UNAUTHORIZED, msg, data);
  }
}

export class ForbiddenError extends AppError {
  constructor(msg = "Haha! This is not your zone") {
    super(StatusCodes.FORBIDDEN, msg);
  }
}
