import { Controller, Post } from "@overnightjs/core";
import { User } from "@src/models/user";
import AuthService from "@src/services/auth";
import { Request, Response } from "express";
import { BaseController } from "./base";

@Controller('users')
export class UserController extends BaseController {

  @Post('')
  public async create(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      res.status(201).send(await user.save());
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        res.status(401).send({ message: 'user not found' });
        return;
      }

      if (!await AuthService.comparePasswords(password, user.password)) {
        res.status(401).send({ message: 'the password does not match' });
        return;
      }

      res.status(200).send({
        token: AuthService.generateToken(user.toJSON())
      });
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }
}