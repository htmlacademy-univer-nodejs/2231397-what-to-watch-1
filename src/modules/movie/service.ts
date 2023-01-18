import { DocumentType, types } from '@typegoose/typegoose';
import { MovieEntity } from './entity.js';
import { inject, injectable } from 'inversify';
import { MovieServiceInterface } from './service-interface.js';
import { Component } from '../../entities/component.js';
import { LoggerInterface } from '../../common/logger/interface.js';
import { CreateMovieDto } from './dto.js';

@injectable()
export class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const movie = await this.movieModel.create(dto);
    this.logger.info(`New movie created: ${dto.movieName}`);

    return movie;
  }

  async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieId).exec();
  }
}
