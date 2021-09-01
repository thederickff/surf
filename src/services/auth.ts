import { compare, hash } from "bcrypt";

export default class AuthService {

  public static async hashPassword(password: string, salt = 10): Promise<string> {
    return await hash(password, salt);
  }
  
  public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

}