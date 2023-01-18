export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatarPath?: string;
  public password!: string;
}

export class LoginUserDto {
  public email!: string;
  public password!: string;
}
