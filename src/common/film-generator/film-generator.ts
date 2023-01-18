import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem } from '../../utils/random.js';
import { FIlmGeneratorInterface } from './interface.js';
import { TMockData } from '../../types/mock-data.js';
import { TUser } from '../../types/user.js';
import { TGenre } from '../../types/film.js';

const MIN_RATING = 1;
const MAX_RATING = 10;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class FilmGenerator implements FIlmGeneratorInterface {
  constructor(private readonly mockData: TMockData) {}

  public generate(): string {
    const movieName = getRandomItem<string>(this.mockData.movieName);
    const movieDescription = getRandomItem<string>(this.mockData.movieDescription);
    const publishDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const genre = getRandomItem<TGenre>(this.mockData.genre);
    const releaseYear = getRandomItem(this.mockData.releaseYear);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING).toString();
    const previewVideoPath = getRandomItem<string>(this.mockData.previewVideoPath);
    const videoPath = getRandomItem<string>(this.mockData.videoPath);
    const actors = getRandomItem<string[]>(this.mockData.actors).join(';');
    const director = getRandomItem<string>(this.mockData.director);
    const movieDuration = getRandomItem<number>(this.mockData.movieDuration);
    const commentsAmount = getRandomItem<number>(this.mockData.commentsAmount);
    const user = getRandomItem<TUser>(this.mockData.user);
    const posterPath = getRandomItem<string>(this.mockData.posterPath);
    const backgroundPath = getRandomItem<string>(this.mockData.backgroundPath);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColor);

    const { name, email, avatarPath, password } = user;
    return [
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
      backgroundColor
    ].join('\t');
  }
}
