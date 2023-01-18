import { HttpMethod } from '../../types/route.js';
import {UserRoute} from './const.js';
import {ConfigInterface} from '../../common/config/interface.js';
import { UserServiceInterface } from './service-interface.js';
import {LoggerInterface} from '../../common/logger/interface.js';
import {Controller} from '../../common/controller/controller.js';
import {Request, Response} from 'express';
import {Component} from '../../entities/component.js';
import {CreateUserDto, LoginUserDto} from './dto.js';
import {inject, injectable} from 'inversify';
import {HttpError} from '../../common/error/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../../utils/common.js';
import {UserResponse} from './response.js';
import { MovieModelResponse } from '../film/response.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-identifier.js';
import {UploadFileMiddleware} from '../../common/middlewares/upload-file.js';

@injectable()
export class UserController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface) {
    super(logger);
    this.logger.info('Register routes for UserController.');

    this.addRoute<UserRoute>({
      path: UserRoute.REGISTER,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGIN,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute<UserRoute>({path: UserRoute.LOGIN, method: HttpMethod.Get, handler: this.get});
    this.addRoute<UserRoute>({path: UserRoute.LOGOUT, method: HttpMethod.Delete, handler: this.logout});
    this.addRoute<UserRoute>({path: UserRoute.TO_WATCH, method: HttpMethod.Get, handler: this.getToWatch});
    this.addRoute<UserRoute>({path: UserRoute.TO_WATCH, method: HttpMethod.Post, handler: this.postToWatch});
    this.addRoute<UserRoute>({path: UserRoute.TO_WATCH, method: HttpMethod.Delete, handler: this.deleteToWatch});
    this.addRoute<UserRoute>({
      path: UserRoute.AVATAR,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('STATIC_DIRECTORY'), 'avatar'),
      ]
    });
  }

  async get(_: Request<Record<string, unknown>, Record<string, unknown>, Record<string, string>>, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController',);
  }

  async logout(_: Request<Record<string, unknown>, Record<string, unknown>, Record<string, string>>, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController',);
  }

  async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email «${body.email}» exists.`, 'UserController');
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserResponse, result));
  }

  async login({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>, _res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, `User with email ${body.email} not found.`, 'UserController',);
    }

    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController',);
  }

  async getToWatch({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = this.userService.findToWatch(body.userId);
    this.ok(_res, fillDTO(MovieModelResponse, result));
  }

  async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  async deleteToWatch({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string, movieId: string}>, _res: Response): Promise<void> {
    await this.userService.deleteToWatch(body.userId, body.movieId);
    this.noContent(_res, {message: 'Успешно. Фильм удален из списка "К просмотру".'});
  }

  async postToWatch({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string, movieId: string}>, _res: Response): Promise<void> {
    await this.userService.addToWatch(body.userId, body.movieId);
    this.noContent(_res, {message: 'Успешно. Фильм добавлен в список "К просмотру".'});
  }
}
