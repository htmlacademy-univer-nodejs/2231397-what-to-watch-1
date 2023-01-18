import { CreateCommentDto } from './dto.js';
import { CommentServiceInterface } from './service-interface.js';
import { CommentEntity } from './entity.js';
import { Component } from '../../entities/component.js';
import { inject, injectable } from 'inversify';
import { types, DocumentType } from '@typegoose/typegoose';
import { FilmServiceInterface } from '../film/service-interface.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.MovieServiceInterface) private readonly filmService: FilmServiceInterface
  ) { }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await this.filmService.updateMovieRating(dto.movieId, dto.rating);
    await this.filmService.increaseCommentsCount(dto.movieId);
    return comment.populate('user');
  }

  public async findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ movieId }).populate('user');
  }
}
