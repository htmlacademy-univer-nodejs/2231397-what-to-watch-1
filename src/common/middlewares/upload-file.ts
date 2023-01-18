import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { MiddlewareInterface } from './interface.js';
import { HttpError } from '../error/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { UserServiceInterface } from '../../modules/user/service-interface.js';
import { extension } from 'mime-types';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private userService: UserServiceInterface,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.params.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} doesn't exist`,
        'UploadFileMiddleware'
      );
    }

    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const ext = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${ext}`);
      }
    });

    const uploadSingleFileMiddleware = multer({storage})
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
