import {TFilm, tryGetGenre} from '../types/film.js';

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
    commentsAmount,
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
    commentsAmount: parseFloat(commentsAmount),
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

export const getRandomItems = <T>(items: T[]):T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

export const getRandomItem = <T>(items: T[]):T =>
  items[generateRandomValue(0, items.length -1)];
