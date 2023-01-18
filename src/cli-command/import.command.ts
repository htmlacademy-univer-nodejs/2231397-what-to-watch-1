import chalk from 'chalk';
import { TsvFileReader } from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './interface.js';
import { createMovie, getErrorMessage } from '../utils/common.js';
import { LoggerInterface } from '../common/logger/interface.js';
import { ConsoleLoggerService } from '../common/logger/console-service.js';
import { getDbURI } from '../utils/db.js';
import { UserServiceInterface } from '../modules/user/service-interface.js';
import { FilmServiceInterface } from '../modules/film/service-interface.js';
import { DatabaseInterface } from '../common/db/interface.js';
import { FilmModel } from '../modules/film/entity.js';
import { UserService } from '../modules/user/service.js';
import { DatabaseService } from '../common/db/service.js';
import { FilmService } from '../modules/film/service.js';
import { UserModel } from '../modules/user/entity.js';
import { TFilm } from '../types/film.js';
import { ConfigInterface } from '../common/config/interface.js';
import { ConfigService } from '../common/config/service.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private userService!: UserServiceInterface;
  private movieService!: FilmServiceInterface;
  private databaseService!: DatabaseInterface;

  private logger: LoggerInterface;
  private salt!: string;

  private config: ConfigInterface;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.config = new ConfigService(this.logger);

    this.movieService = new FilmService(this.logger, FilmModel);
    this.userService = new UserService(this.logger, UserModel, FilmModel);
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

    await this.movieService.create(movie, user.id);
  }

  private onComplete(count: number) {
    this.logger.info(`${chalk.greenBright(count)} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(
    filename: string
  ): Promise<void> {
    const uri = getDbURI({
      username: this.config.get('DB_USER'),
      password: this.config.get('DB_PASSWORD'),
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      databaseName: this.config.get('DB_NAME')
    });
    this.salt = this.config.get('SALT');

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
