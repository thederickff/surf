import { Controller, Post } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import { BaseController } from './base';

@Controller('beaches')
export class BeachController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body);
      res.status(201).send(await beach.save());
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }
}