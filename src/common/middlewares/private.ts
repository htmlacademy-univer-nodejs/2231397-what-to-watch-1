import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './interface.js';
import { HttpError } from '../error/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class PrivateMiddleware implements MiddlewareInterface {
  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }
    return next();
  }
}
