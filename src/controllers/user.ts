import { Controller, Post } from "@overnightjs/core";
import { User } from "@src/models/user";
import { Request, Response } from "express";
import { Error } from "mongoose";
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
}