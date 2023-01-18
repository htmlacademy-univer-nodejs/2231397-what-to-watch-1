import { NextFunction, Request, Response } from 'express';
import { multipart } from 'express-multipart';
import { MiddlewareInterface } from './interface.js';

export class MultipartDataMiddleware implements MiddlewareInterface {
  constructor(private uploadDirectory: string) {}

  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    return multipart({
      preserveExtensions: true,
      destination: this.uploadDirectory,
    }).file('avatar')(req, _res, next);
  }
}
