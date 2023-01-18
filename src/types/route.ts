import { NextFunction, Request, Response } from 'express';

export enum HttpMethod {
  Get = 'get',
  Post = 'post',
  Delete = 'delete',
  Patch = 'patch',
  Put = 'put',
}

export interface RouteInterface<Path extends string> {
  path: Path;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
