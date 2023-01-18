import { CreateUserDto } from './dto.js';
import { UserServiceInterface } from './service-interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../entities/component.js';
import { LoggerInterface } from '../../common/logger/interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './entity.js';
import { FilmEntity } from '../film/entity.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.MovieModel) private readonly filmModel: types.ModelType<FilmEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  async addToWatch(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $push: { moviesToWatch: movieId }
    });
  }

  async deleteToWatch(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: { moviesToWatch: movieId }
    });
  }

  async findToWatch(userId: string): Promise<DocumentType<FilmEntity>[]> {
    const moviesToWatch = await this.userModel.findById(userId).select('moviesToWatch');
    return this.filmModel.find({ _id: { $in: moviesToWatch } });
  }
}
