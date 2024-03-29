import { DocumentType, types } from '@typegoose/typegoose';
import { FilmEntity } from './entity.js';
import { inject, injectable } from 'inversify';
import { FilmServiceInterface } from './service-interface.js';
import { Component } from '../../entities/component.js';
import { LoggerInterface } from '../../common/logger/interface.js';
import { FilmDto } from './dto.js';
import { FILM_DISPLAY_LIMIT } from './const.js';
import { TGenre } from '../../types/film.js';

@injectable()
export class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  async create(dto: FilmDto, userId: string): Promise<DocumentType<FilmEntity>> {
    const film = await this.filmModel.create({...dto, user: userId});
    this.logger.info(`New movie created: ${dto.movieName}`);

    return film;
  }

  async findById(movieId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(movieId).exec();
  }

  async deleteById(movieId: string): Promise<void | null> {
    this.filmModel.findByIdAndDelete(movieId);
    return Promise.resolve(null);
  }

  async findByGenre(genre: TGenre, limit?: number): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel.find({ genre }, {}, { limit }).populate('user');
  }

  async findPromo(): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({ isPromo: true }).populate('user');
  }

  async exists(documentId: string): Promise<boolean> {
    return (this.filmModel.exists({_id: documentId})) !== null;
  }

  async getMovies(limit?: number): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel.aggregate([
      {$sort: {publishingDate: 1}},
      { $limit: limit || FILM_DISPLAY_LIMIT }
    ]);
  }

  async increaseCommentsCount(movieId: string): Promise<void | null> {
    return this.filmModel.findByIdAndUpdate(movieId, { $inc: { commentsCount: 1 } });
  }

  async updateById(movieId: string, dto: FilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findByIdAndUpdate(movieId, dto, { new: true }).populate('user');
  }

  async updateMovieRating(movieId: string, newRating: number): Promise<void | null> {
    const oldValues = await this.filmModel.findById(movieId).select('rating commentsAmount');
    const oldRating = oldValues?.['rating'] ?? 0;
    const oldCommentsAmount = oldValues?.['commentsAmount'] ?? 0;
    return this.filmModel.findByIdAndUpdate(movieId, {
      rating: (oldRating * oldCommentsAmount + newRating) / (oldCommentsAmount + 1)
    });
  }
}
