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
import { MovieModelResponse } from './response.js';
import { FilmDto } from './dto.js';

@injectable()
export default class FilmController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly filmService: FilmServiceInterface) {
    super(logger);

    this.logger.info('Register routes for MovieController.');

    this.addRoute<FilmRoute>({path: FilmRoute.ROOT, method: HttpMethod.Get, handler: this.index});
    this.addRoute<FilmRoute>({path: FilmRoute.CREATE, method: HttpMethod.Post, handler: this.create});
    this.addRoute<FilmRoute>({path: FilmRoute.MOVIE, method: HttpMethod.Get, handler: this.getFilm});
    this.addRoute<FilmRoute>({path: FilmRoute.MOVIE, method: HttpMethod.Patch, handler: this.updateFilm});
    this.addRoute<FilmRoute>({path: FilmRoute.MOVIE, method: HttpMethod.Delete, handler: this.deleteFilm});
    this.addRoute<FilmRoute>({path: FilmRoute.PROMO, method: HttpMethod.Get, handler: this.getPromo});
  }

  async index(_req: Request, res: Response): Promise<void> {
    const movies = await this.filmService.getMovies();
    const movieResponse = fillDTO(MovieModelResponse, movies);
    this.ok(res, movieResponse);
  }

  async create({body}: Request<Record<string, unknown>, Record<string, unknown>, FilmDto>, res: Response): Promise<void> {
    const result = await this.filmService.create(body);
    this.created(res, fillDTO(MovieModelResponse, result));
  }

  async getFilm({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const result = await this.filmService.findById(`${params.movieId}`);
    this.ok(res, fillDTO(MovieModelResponse, result));
  }

  async updateFilm({params, body}: Request<Record<string, string>, Record<string, unknown>, FilmDto>, res: Response): Promise<void> {
    const film = await this.filmService.findById(params.movieId);

    if (!film) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильма с id «${params.movieId}» не существует.`, 'MovieController');
    }

    const result = await this.filmService.updateById(params.movieId, body);
    this.ok(res, fillDTO(MovieModelResponse, result));
  }

  async deleteFilm({params}: Request<Record<string, string>>, res: Response): Promise<void> {
    const film = await this.filmService.findById(`${params.movieId}`);

    if (!film) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильма с id «${params.movieId}» не существует.`, 'MovieController');
    }

    await this.filmService.deleteById(`${params.movieId}`);
    this.noContent(res, {message: 'Фильм успешно удален.'});
  }

  async getPromo(_: Request, res: Response): Promise<void> {
    const result = await this.filmService.findPromo();
    this.ok(res, fillDTO(MovieModelResponse, result));
  }
}