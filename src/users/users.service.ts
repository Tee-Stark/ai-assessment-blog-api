import { inject, injectable } from "inversify";
import TYPES from "../config/inversify.types";
import { UserRepo } from "./users.repo";
import { User, UserResponseDto } from "./users.model";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/error";
import { signJwt, TokenStore } from "../utils/jwt";

@injectable()
export class UserService {
  @inject(TYPES.UserRepo) private readonly userRepo: UserRepo;
  @inject(TYPES.TokenStore) private readonly tokenStore: TokenStore;

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ email_address: email });
    if (!user) throw new UnauthorizedError("invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedError("invalid credentials");

    const authToken = signJwt(user);
    this.tokenStore.add(authToken);
    const userData: Partial<UserResponseDto> = {
      id: user.id,
      name: user.name,
      email_address: user.email_address,
      role: user.role
    };

    return { ...userData, authToken };
  }

  async signup(user: User) {
    const hashedPw = await bcrypt.hash(user.password, 12);
    user.password = hashedPw;
    return await this.userRepo.create(user);
  }
}
