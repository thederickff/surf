import { Controller, Post } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import { Error } from 'mongoose';

@Controller('beaches')
export class BeachController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body);
      res.status(201).send(await beach.save());
    } catch (error) {
      if (error instanceof Error.ValidationError) {
        res.status(422).send({
          error: error.message
        });
      } else {
        res.status(500).send({
          error: 'Internal Server Error'
        });
      }
    }
  }
}