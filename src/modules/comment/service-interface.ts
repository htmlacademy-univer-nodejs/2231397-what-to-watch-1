import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { CommentEntity } from './entity.js';
import { TComment } from './dto.js';

export interface CommentServiceInterface {
  findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]>;
  create(dto: TComment): Promise<DocumentType<CommentEntity>>;
}
