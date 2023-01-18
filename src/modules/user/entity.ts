import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/common.js';
import { TUser } from '../../types/user.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
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
    this.password = data.password;
  }

  @prop({required: true, default: ''})
  public name!: string;

  @prop({unique: true, required: true})
  public email!: string;

  @prop()
  public avatarPath!: string;

  @prop({required: true, default: ''})
  public password!: string;

  setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
