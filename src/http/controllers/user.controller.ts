import { Container } from "inversify";
import express from "express";
import { UserService } from "../../users/users.service";
import TYPES from "../../config/inversify.types";
import { controller } from "../../utils/http";
import { UserAlreadyExists } from "../../users";
import { AppError } from "../../utils/error";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { autoValidate } from "../middleware/validation";
import { createUserDto, loginUserDto } from "./user.dto";

function signUp(userService: UserService) {
  return async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const createdUser = await userService.signup(body);
      return createdUser;
    } catch (err) {
      if (err instanceof UserAlreadyExists)
        throw new AppError(StatusCodes.CONFLICT, err.message);
      throw err;
    }
  };
}

function login(userService: UserService) {
  return async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const user = await userService.login(body!.email_address, body!.password);
      return user;
    } catch (err) {
      throw err;
    }
  };
}

export const userRouter = (container: Container) => {
  const router = express.Router();
  const userService = container.get<UserService>(TYPES.UserService);

  router.post(
    "/",
    autoValidate(createUserDto),
    controller(signUp(userService))
  );
  router.post(
    "/login",
    autoValidate(loginUserDto),
    controller(login(userService))
  );

  return router;
};
