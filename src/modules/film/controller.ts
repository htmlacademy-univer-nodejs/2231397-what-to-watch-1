import { inject, injectable} from 'inversify';
import { FilmRoute } from './const.js';
import { HttpMethod } from '../../types/route.js';
import { FilmServiceInterface } from './service-interface.js';
import { LoggerInterface } from '../../common/logger/interface.js';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../entities/component.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../common/error/http-error.js';
import { fillDTO } from '../../utils/common.js';
import { FilmListItemResponse, MovieModelResponse } from './response.js';
import { FilmDto } from './dto.js';
import { CommentServiceInterface } from '../comment/service-interface.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-identifier.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exist.js';
import { CommentResponse } from '../comment/response.js';
import * as core from 'express-serve-static-core';
import { DocumentType } from '@typegoose/typegoose';
import { FilmEntity } from './entity.js';
import {TGenre, tryGetGenre} from '../../types/film.js';
import { PrivateMiddleware } from '../../common/middlewares/private.js';

@injectable()
export class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController.');

    this.addRoute<FilmRoute>({
      path: FilmRoute.CREATE,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateMiddleware(),
        new ValidateDtoMiddleware(FilmDto)
      ]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.MOVIE,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.filmService, 'Movie', 'movieId')
      ]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.MOVIE,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateMiddleware(),
        new ValidateObjectIdMiddleware('movieId'),
        new ValidateDtoMiddleware(FilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Movie', 'movieId')
      ]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.MOVIE,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateMiddleware(),
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.filmService, 'Movie', 'movieId')
      ]
    });
    this.addRoute<FilmRoute>({path: FilmRoute.PROMO, method: HttpMethod.Get, handler: this.showPromo});
    this.addRoute<FilmRoute>({
      path: FilmRoute.COMMENTS,
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.filmService, 'Movie', 'movieId'),
      ]
    });
  }

  async index(req: Request<unknown, unknown, unknown, {
    limit?: string;
    genre?: TGenre;
  }>, res: Response): Promise<void> {
    const genre = req.query.genre;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    let movies: DocumentType<FilmEntity>[];
    if (genre) {
      const validatedGenre = tryGetGenre(genre);
      if (!validatedGenre){
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          `Unrecognised genre: ${genre}.`,
          'getGenre'
        );
      }
      movies = await this.filmService.findByGenre(genre, limit);
    } else {
      movies = await this.filmService.getMovies(limit);
    }
    const movieResponse = fillDTO(FilmListItemResponse, movies);
    this.ok(res, movieResponse);
  }

  async getComments({params}: Request<core.ParamsDictionary | { movieId: string; }>, res: Response): Promise<void> {
    const comments = await this.commentService.findByMovieId(params.movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  async create({body, user}: Request<Record<string, unknown>, Record<string, unknown>, FilmDto>, res: Response): Promise<void> {
    const result = await this.filmService.create(body, user.id);
    const film = await this.filmService.findById(result.id);
    this.created(res, fillDTO(MovieModelResponse, film));
  }

  async show({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const result = await this.filmService.findById(`${params.movieId}`);
    this.ok(res, fillDTO(MovieModelResponse, result));
  }

  async update({params, body, user}: Request<Record<string, string>, Record<string, unknown>, FilmDto>, res: Response): Promise<void> {
    const film = await this.filmService.findById(params.movieId);

    if (film?.user?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${user.id} doesn't own film card with id ${film?.id}, so can't edit it.`,
        'MovieController'
      );
    }

    if (!film) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильма с id «${params.movieId}» не существует.`, 'MovieController');
    }

    const result = await this.filmService.updateById(params.movieId, body);
    this.ok(res, fillDTO(MovieModelResponse, result));
  }

  async delete({params, user}: Request<Record<string, string>>, res: Response): Promise<void> {
    const film = await this.filmService.findById(`${params.movieId}`);

    if (film?.user?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${user.id} doesn't own movie card with id ${film?.id}, so can't delete it.`,
        'MovieController'
      );
    }
    if (!film) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильма с id «${params.movieId}» не существует.`, 'MovieController');
    }

    await this.filmService.deleteById(`${params.movieId}`);
    this.noContent(res, {message: 'Фильм успешно удален.'});
  }

  async showPromo(_: Request, res: Response): Promise<void> {
    const result = await this.filmService.findPromo();
    this.ok(res, fillDTO(MovieModelResponse, result));
  }
}
