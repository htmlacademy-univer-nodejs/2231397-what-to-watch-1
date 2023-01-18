import { Expose } from 'class-transformer';

export class UserResponse {
  @Expose()
  public email!: string ;

  @Expose()
  public avatarPath?: string;

  @Expose()
  public name!: string;
}


export class LoggedUserResponse {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarPath?: string;

  @Expose()
  public name!: string;
}
