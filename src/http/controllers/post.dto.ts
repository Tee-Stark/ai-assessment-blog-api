import joi from "joi";

export const createPostDto = joi.object().keys({
  title: joi.string().min(10).required(),
  content_body: joi.string().required()
});

export const requestUpdateDto = joi.object().keys({
  action: joi.string().valid("update", "delete").required(),
  title: joi.string().optional(),
  content_body: joi.string().optional()
});
