import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.js';
import { HttpMethod } from '../../types/route.js';
import { Request, Response } from 'express';
import { HttpError } from '../../common/error/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/interface.js';
import { CommentServiceInterface } from './service-interface.js';
import { inject } from 'inversify';
import { Component } from '../../entities/component.js';
import { FilmServiceInterface } from '../film/service-interface.js';
import { CommentRoute } from './const.js';
import { TComment } from './dto.js';
import { CommentResponse } from './response.js';

export class CommentController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.MovieServiceInterface) private  readonly filmService: FilmServiceInterface) {
    super(logger);

    this.logger.info('Register routes for CommentController.');
    this.addRoute<CommentRoute>({
      path: CommentRoute.ROOT,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(TComment)]
    });
  }

  public async create({body}: Request<object, object, TComment>, res: Response): Promise<void> {
    if (!await this.filmService.findById(body.movieId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${body.movieId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body);
    await this.filmService.increaseCommentsCount(body.movieId);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
