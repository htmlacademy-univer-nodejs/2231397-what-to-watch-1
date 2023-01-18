import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/common.js';
import { TUser } from '../../types/user.js';

export interface UserEntity extends defaultClasses.Base {}

@typegoose.modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements TUser {
  constructor(data: TUser) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatarPath = data.avatarPath;
  }

  @typegoose.prop({ required: true })
  public name!: string;

  @typegoose.prop({unique: true, required: true})
  public email!: string;

  @typegoose.prop()
  public avatarPath?: string;

  @typegoose.prop({ required: true, default: [] })
  public moviesToWatch!: string[];

  @typegoose.prop({required: true})
  public password!: string;

  setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  verifyPassword(password: string, salt: string) {
    return createSHA256(password, salt) === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
