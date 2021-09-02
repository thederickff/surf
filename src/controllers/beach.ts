import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import { BaseController } from './base';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach({ 
        ... req.body,
        user: req.user?.id
      });
      res.status(201).send(await beach.save());
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }
}