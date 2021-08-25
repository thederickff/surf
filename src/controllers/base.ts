import { Response } from "express";
import { Error } from "mongoose";

export abstract class BaseController {

  protected sendCreatedUpdateErrorResponse(res: Response, error: Error.ValidationError | Error) {
    if (error instanceof Error.ValidationError) {
      res.status(422).send({
        errors: Object.values(error.errors).map(e => e.message)
      });
    } else {
      res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}