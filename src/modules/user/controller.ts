import { HttpMethod } from '../../types/route.js';
import { ALG, UserRoute } from './const.js';
import { ConfigInterface } from '../../common/config/interface.js';
import { UserServiceInterface } from './service-interface.js';
import { LoggerInterface } from '../../common/logger/interface.js';
import { Controller } from '../../common/controller/controller.js';
import { Request, Response } from 'express';
import { Component } from '../../entities/component.js';
import { CreateUserDto, LoginUserDto } from './dto.js';
import { inject, injectable } from 'inversify';
import { HttpError } from '../../common/error/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { createJWT, fillDTO } from '../../utils/common.js';
import {LoggedUserResponse, UserResponse} from './response.js';
import { MovieModelResponse } from '../film/response.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-identifier.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.js';
import { MultipartDataMiddleware } from '../../common/middlewares/multipart-data.js';
import { PrivateMiddleware } from '../../common/middlewares/private.js';

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
      middlewares: [
        new MultipartDataMiddleware(this.configService.get('STATIC_DIRECTORY')),
        new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGIN,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute<UserRoute>({path: UserRoute.LOGIN, method: HttpMethod.Get, handler: this.get});
    this.addRoute<UserRoute>({path: UserRoute.LOGOUT, method: HttpMethod.Delete, handler: this.logout});
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Get,
      handler: this.getToWatch,
      middlewares: [new PrivateMiddleware()]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Post,
      handler: this.postToWatch,
      middlewares: [new PrivateMiddleware()]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Delete,
      handler: this.deleteToWatch,
      middlewares: [new PrivateMiddleware()]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.AVATAR,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware( this.configService.get('STATIC_DIRECTORY'), 'avatar', this.userService)
      ]
    });
  }

  async get(_: Request<Record<string, unknown>, Record<string, unknown>, Record<string, string>>, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController',);
  }

  async logout(_: Request<Record<string, unknown>, Record<string, unknown>, Record<string, string>>, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController',);
  }

  async create({body, file}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email «${body.email}» exists.`, 'UserController');
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    const createdUser: UserResponse = result;

    if (file) {
      const avatarPath = file.path.slice(1);
      await this.userService.setUserAvatarPath(result.id, avatarPath);
      createdUser.avatarPath = avatarPath;
    }

    this.created(res, fillDTO(UserResponse, createdUser));

  }

  async login({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>, _res: Response): Promise<void> {
    const existsUser = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!existsUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, `User with email ${body.email} not found.`, 'UserController',);
    }

    const token = await createJWT(
      ALG,
      this.configService.get('JWT_SECRET'),
      { email: existsUser.email, id: existsUser.id}
    );

    this.ok(_res, fillDTO(LoggedUserResponse, {token}));
  }

  async getToWatch({ user }: Request<Record<string, unknown>, Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = this.userService.findToWatch(user.id);
    this.ok(_res, fillDTO(MovieModelResponse, result));
  }

  async uploadAvatar({ params, file }: Request, res: Response) {
    const createdFilePath = file?.path;
    if (createdFilePath) {
      await this.userService.setUserAvatarPath(params.userId, createdFilePath);
      this.created(res, {
        filepath: createdFilePath
      });
    }
  }

  async deleteToWatch({body, user}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string, movieId: string}>, _res: Response): Promise<void> {
    await this.userService.deleteToWatch(user.id, body.movieId);
    this.noContent(_res, {message: 'Успешно. Фильм удален из списка "К просмотру".'});
  }

  async postToWatch({body, user}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string, movieId: string}>, _res: Response): Promise<void> {
    await this.userService.addToWatch(user.id, body.movieId);
    this.noContent(_res, {message: 'Успешно. Фильм добавлен в список "К просмотру".'});
  }
}
