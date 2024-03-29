import { Response, Router } from 'express';
import { RouteInterface } from '../../types/route.js';

export interface ControllerInterface {
  readonly router: Router;
  addRoute<T extends string>(route: RouteInterface<T>): void;
  send<T>(res: Response, statusCode: number, data: T): void;
  ok<T>(res: Response, data: T): void;
  created<T>(res: Response, data: T): void;
  noContent<T>(res: Response, data: T): void;
}
