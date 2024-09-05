import joi from "joi";
import { validate } from "../utils/validate";
import dotenv from "dotenv";

interface ApplicationEnv {
  port: number;
  service_name: string;
  jwt_secret: string;
  jwt_expiry: string;
  database_url: string;
  database_name: string;
}

const envSchema: Record<keyof ApplicationEnv, joi.SchemaLike> = {
  port: joi.number().required(),
  jwt_secret: joi.string().required(),
  service_name: joi.string().required(),
  jwt_expiry: joi.string().required(),
  database_url: joi
    .string()
    .uri({ scheme: ["postgres", "postgresql"] })
    .required(),
  database_name: joi.string().required()
};

function loadEnv(): ApplicationEnv {
  dotenv.config();
  const parsedData = Object.keys(process.env).reduce((obj, key) => {
    const path = key.toLowerCase();

    // filter by the keys we need
    if ((<any>envSchema).hasOwnProperty(path)) {
      obj[key.toLowerCase()] = process.env[key];
    }
    return obj;
  }, <Record<string, any>>{});

  return validate(parsedData, envSchema);
}

export const env = loadEnv();
