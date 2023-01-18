import { TFilm, tryGetGenre } from '../types/film.js';
import crypto from 'crypto';
import * as jose from 'jose';
import { TextEncoder } from 'node:util';
import { ClassConstructor, plainToInstance } from 'class-transformer';

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
    commentsCount: 0,
    user: {
      name,
      email,
    },
    posterPath,
    backgroundPath,
    backgroundColor,
  };
};

export const checkPassword = (password: string) => {
  if (password.length < 6 || password.length > 12) {
    throw new Error('Password should be from 6 to 12 characters');
  }
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true, enableImplicitConversion: true});

export const createErrorObject = (message: string) => ({
  error: message,
});

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const createJWT = async (algorithm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(new TextEncoder().encode(jwtSecret));
