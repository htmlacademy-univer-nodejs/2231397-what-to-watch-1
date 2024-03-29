import { FilmEntity } from './entity.js';
import { DocumentType } from '@typegoose/typegoose';
import { FilmDto } from './dto.js';
import {DocumentExistsInterface} from '../../common/middlewares/interface.js';

export interface FilmServiceInterface extends DocumentExistsInterface {
  create(dto: FilmDto, userId: string): Promise<DocumentType<FilmEntity>>;
  findById(movieId: string): Promise<DocumentType<FilmEntity> | null>;
  updateById(movieId: string, dto: FilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteById(movieId: string): Promise<void | null>;
  getMovies(limit?: number): Promise<DocumentType<FilmEntity>[]>;
  findByGenre(genre: string, limit?: number): Promise<DocumentType<FilmEntity>[]>;
  findPromo(): Promise<DocumentType<FilmEntity> | null>;
  increaseCommentsCount(movieId: string): Promise<void | null>;
  updateMovieRating(movieId: string, newRating: number): Promise<void | null>;
}
