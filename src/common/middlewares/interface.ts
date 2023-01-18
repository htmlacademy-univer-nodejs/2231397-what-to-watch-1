import {NextFunction, Request, Response} from 'express';

export interface DocumentExistsInterface {
  exists(documentId: string): Promise<boolean>;
}

export interface MiddlewareInterface {
  execute(req: Request, res: Response, next: NextFunction): void;
}
