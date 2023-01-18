import { TUser } from './user.js';
import { TGenre } from './film.js';

export type TMockData = {
  movieName: string[];
  movieDescription: string[];
  publishDate: Date[];
  genre: TGenre[];
  releaseYear: number[];
  rating: number[];
  previewVideoPath: string[];
  videoPath: string[];
  actors: string[][];
  director: string[];
  movieDuration: number[];
  commentsAmount: number[];
  user: TUser[];
  posterPath: string[];
  backgroundPath: string[];
  backgroundColor: string[];
}
