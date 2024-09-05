import joi, { SchemaLike, ValidationError } from "joi";

export class DataValidationError extends Error {
  readonly messages: { [key: string]: string } = {};
  constructor(baseErr: ValidationError) {
    super("Could not validate the given that");
    baseErr.details.forEach((detail) => {
      this.messages[detail.context!.label!] = detail.message;
    });
  }
}

export function validate(data: any, schema: SchemaLike) {
  const realSchema = joi.compile(schema);
  const { error, value } = realSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    throw new DataValidationError(error);
  }

  return value;
}
