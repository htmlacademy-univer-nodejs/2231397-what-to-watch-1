import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, {message: 'email must be valid'})
  public email!: string;

  @IsString({message: 'required'})
  public name!: string;

  @IsString({message: 'required'})
  @Length(6, 12, {message: 'min length for password is 6, max is 12'})
  public password!: string;

  @Matches(/[^\\s]+(.*?)\\.(jpg|png)$/, {message: 'avatarPath must be .jpg or .png format image'})
  public avatarPath?: string;

  public moviesToWatch: string[] = [];
}

export class LoginUserDto {
  @IsEmail({}, {message: 'email must be valid'})
  public email!: string;

  @IsString({message: 'required'})
  public password!: string;
}
