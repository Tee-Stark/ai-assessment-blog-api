import { DataValidationError, validate } from "../../utils/validate";
import { NextFunction, Request, Response } from "express";

import { AppError } from "../../utils/error";
import { SchemaLike } from "joi";
import { StatusCodes } from "http-status-codes";

/**
 * middleware that validates the given request based on the
 * context and respond with status code `400`(with appropriate metadata) when
 * schema validation fails.
 * @param schema schema to use for validation
 * @param context whether to validate the request body or its query. Defaults to request body
 * @returns a middleware
 */
export function autoValidate(
  schema: SchemaLike,
  context: "body" | "params" | "query" = "body"
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[context] = validate(req[context], schema);
      next();
    } catch (err) {
      if (err instanceof DataValidationError) {
        const message =
          context === "body"
            ? "request body is invalid"
            : "requests params are invalid";
        throw new AppError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          message,
          err.messages
        );
      }
      throw err;
    }
  };
}
