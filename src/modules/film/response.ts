import { Expose } from 'class-transformer';
import {TGenre} from '../../types/film.js';

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
  public userId!: string;

  @Expose()
  public posterPath!: string;

  @Expose()
  public backgroundPath!: string;

  @Expose()
  public backgroundColor!: string;
}
