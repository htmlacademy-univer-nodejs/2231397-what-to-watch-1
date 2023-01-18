import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto, LoginUserDto } from './dto.js';
import { UserEntity } from './entity.js';
import { FilmEntity } from '../film/entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findToWatch(userId: string): Promise<DocumentType<FilmEntity>[]>;
  addToWatch(movieId: string, userId: string): Promise<void | null>;
  deleteToWatch(movieId: string, userId: string): Promise<void | null>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  setUserAvatarPath(userId: string, avatarPath: string): Promise<void | null>;
}
