import {TFilm, tryGetGenre} from '../types/film.js';
import crypto from 'crypto';

export const createMovie = (row: string): TFilm => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    movieName,
    movieDescription,
    publishDate,
    genre,
    releaseYear,
    rating,
    previewVideoPath,
    videoPath,
    actors,
    director,
    movieDuration,
    name,
    email,
    avatarPath,
    password,
    posterPath,
    backgroundPath,
    backgroundColor,
  ] = tokens;

  return {
    movieName,
    movieDescription,
    publishDate: new Date(publishDate),
    genre: tryGetGenre(genre),
    releaseYear: parseInt(releaseYear, 10),
    rating: parseFloat(rating),
    previewVideoPath,
    videoPath,
    actors: actors.split(','),
    director,
    movieDuration: parseFloat(movieDuration),
    commentsAmount: 0,
    user: {
      name,
      email,
      avatarPath,
      password,
    },
    posterPath,
    backgroundPath,
    backgroundColor,
  };
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const generateRandomValue = (rangeStart: number, rangeEnd: number, toFixed = 0) =>
  +((Math.random() * (rangeStart - rangeEnd)) + rangeStart).toFixed(toFixed);

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
