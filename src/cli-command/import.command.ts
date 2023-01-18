import chalk from 'chalk';
import { TsvFileReader } from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './interface.js';
import { createMovie, getErrorMessage } from '../utils/common.js';
import { LoggerInterface } from '../common/logger/interface.js';
import { ConsoleLoggerService } from '../common/logger/console-service.js';
import { getDbURI } from '../utils/db.js';
import { UserServiceInterface } from '../modules/user/service-interface.js';
import { MovieServiceInterface } from '../modules/movie/service-interface.js';
import { DatabaseInterface } from '../common/db/interface.js';
import { MovieModel } from '../modules/movie/entity.js';
import { UserService } from '../modules/user/service.js';
import { DatabaseService } from '../common/db/service.js';
import { MovieService } from '../modules/movie/service.js';
import { UserModel } from '../modules/user/entity.js';
import { TFilm } from '../types/film.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private userService!: UserServiceInterface;
  private movieService!: MovieServiceInterface;
  private databaseService!: DatabaseInterface;

  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.movieService = new MovieService(this.logger, MovieModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async onLine(line: string, resolve: () => void) {
    const movie = createMovie(line);
    await this.saveMovie(movie);
    resolve();
  }

  private async saveMovie(movie: TFilm) {
    const user = await this.userService.findOrCreate({
      ...movie.user,
      password: 'default-user.ts-password'
    }, this.salt);

    await this.movieService.create({
      ...movie,
      user: user.id,
    });
  }

  private onComplete(count: number) {
    this.logger.info(`${chalk.greenBright(count)} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string
  ): Promise<void> {
    const uri = getDbURI({
      username: login,
      password,
      host,
      databaseName: dbname
    });
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TsvFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);
    try {
      await fileReader.read();
    } catch(err) {
      this.logger.info(`Can't read the file: ${chalk.red(getErrorMessage(err))}`);
    }
  }
}
