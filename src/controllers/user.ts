import { Controller, Post } from "@overnightjs/core";
import { User } from "@src/models/user";
import { Request, Response } from "express";
import { Error } from "mongoose";

@Controller('users')
export class UserController {

  @Post('')
  public async create(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      res.status(201).send(await user.save());
    } catch (error) {
      if (error instanceof Error.ValidationError || error.message.includes('duplicate key')) {
        res.status(422).send({ error: error.message });
      } else {
        res.status(500).send({ error: 'Internal Server Error' })
      }
    }
  }
}