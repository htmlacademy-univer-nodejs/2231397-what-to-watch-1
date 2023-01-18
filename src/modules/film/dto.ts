import { TGenre } from '../../types/film.js';
import { TUser } from '../../types/user.js';


export class FilmDto {
  public movieName!: string;
  public movieDescription!: string;
  public publishDate!: Date;
  public genre!: TGenre | undefined;
  public releaseYear!: number;
  public rating!: number;
  public previewVideoPath!: string;
  public videoPath!: string;
  public actors!: string[];
  public director!: string;
  public commentsAmount!: number;
  public user!: TUser;
  public posterPath!: string;
  public backgroundPath!: string;
  public backgroundColor!: string;
}
