import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../error/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from './interface.js';

export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private param: string) {}

  public execute({params}: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (mongoose.Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
