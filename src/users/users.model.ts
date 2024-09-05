import { Model } from "../utils/postgres";

export interface User extends Model {
  name: string;
  email_address: string;
  password: string;
  role: string;
}

export interface UserResponseDto extends Omit<User, "password"> {}

export class UserAlreadyExists extends Error {
  constructor(email: string) {
    const message = `user ${email} already exists`;
    super(message);
  }
}
