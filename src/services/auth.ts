import { compare, hash } from "bcrypt";
import jwt from 'jsonwebtoken';
import config from 'config';

export default class AuthService {

  public static async hashPassword(password: string, salt = 10): Promise<string> {
    return await hash(password, salt);
  }
  
  public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  public static generateToken(payload: object): string {
    return jwt.sign(payload, config.get('App.auth.key'), {
      expiresIn: config.get('App.auth.tokenExpiresIn')
    });
  }
}