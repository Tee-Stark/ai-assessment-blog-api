import joi from "joi";

export const createUserDto = joi.object().keys({
  email_address: joi.string().email().required(),
  password: joi.string().min(8).required(),
  name: joi.string().required(),
  role: joi.string().valid("user", "admin").optional()
});

export const loginUserDto = joi.object().keys({
  email_address: joi.string().email().required(),
  password: joi.string().min(8).required()
});
