import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { GENRE, TGenre } from '../../types/film.js';
import { Types } from 'mongoose';
import { UserEntity } from '../user/entity.js';

export interface FilmEntity extends defaultClasses.Base {}

@typegoose.modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @typegoose.prop({trim: true, required: true})
  public movieName!: string;

  @typegoose.prop({trim: true, required: true})
  public movieDescription!: string;

  @typegoose.prop({required: true})
  public publishDate!: Date;

  @typegoose.prop({type: () => String, required: true, enum: GENRE})
  public genre!: TGenre | undefined;

  @typegoose.prop({required: true})
  public releaseYear!: number;

  @typegoose.prop({required: true})
  public rating!: number;

  @typegoose.prop({required: true})
  public previewVideoPath!: string;

  @typegoose.prop({required: true})
  public videoPath!: string;

  @typegoose.prop({required: true})
  public actors!: string[];

  @typegoose.prop({required: true})
  public director!: string;

  @typegoose.prop({required: true})
  public movieDuration!: number;

  @typegoose.prop()
  public commentsAmount!: number;

  @typegoose.prop({required: true, type: Types.ObjectId, ref: UserEntity})
  public user!: Ref<UserEntity>;

  @typegoose.prop({required: true})
  public posterPath!: string;

  @typegoose.prop({required: true})
  public backgroundPath!: string;

  @typegoose.prop({required: true})
  public backgroundColor!: string;
}

export const FilmModel = getModelForClass(FilmEntity);
