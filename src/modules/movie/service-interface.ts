import { CreateMovieDto } from './dto.js';
import { MovieEntity } from './entity.js';
import { DocumentType } from '@typegoose/typegoose';

export interface MovieServiceInterface {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
}
