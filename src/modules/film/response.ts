import { Expose, Type } from 'class-transformer';
import { TGenre } from '../../types/film.js';
import { UserResponse } from '../user/response.js';

export class MovieModelResponse {
  @Expose()
  public movieName!: string;

  @Expose()
  public movieDescription!: string;

  @Expose()
  public publishDate!: number;

  @Expose()
  public genre!: TGenre;

  @Expose()
  public releaseYear!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewVideoPath!: string;

  @Expose()
  public videoPath!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public movieDuration!: number;

  @Expose()
  public commentsCount!: number;

  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterPath!: string;

  @Expose()
  public backgroundPath!: string;

  @Expose()
  public backgroundColor!: string;
}

export class FilmListItemResponse {
  @Expose()
  public movieName!: string;

  @Expose()
  public publishDate!: number;

  @Expose()
  public genre!: TGenre;

  @Expose()
  public previewVideoPath!: string;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterPath!: string;

  @Expose()
  public commentsCount!: number;
}
