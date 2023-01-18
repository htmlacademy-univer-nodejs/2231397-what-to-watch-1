import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import { UserEntity } from '../user/entity.js';
import { FilmEntity } from '../film/entity.js';
import { Types } from 'mongoose';

export interface CommentEntity extends defaultClasses.Base { }

@typegoose.modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})

export class CommentEntity extends defaultClasses.TimeStamps {
  @typegoose.prop({ trim: true, required: true, minlength: 5, maxlength: 1024 })
  public text!: string;

  @typegoose.prop({ required: true, min: 1, max: 10 })
  public rating!: number;

  @typegoose.prop({ ref: UserEntity, required: true, type: Types.ObjectId })
  public user!: Ref<UserEntity>;

  @typegoose.prop({ ref: FilmEntity, required: true })
  public movieId!: Ref<FilmEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
