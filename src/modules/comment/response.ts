import { Expose, Type } from 'class-transformer';
import { UserResponse } from '../user/response.js';

export class CommentResponse {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose({ name: 'createdAt'})
  public postDate!: string;

  @Expose({ name: 'user'})
  @Type(() => UserResponse)
  public user!: UserResponse;
}
