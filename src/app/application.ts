import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../common/logger/interface.js';
import { ConfigInterface } from '../common/config/interface.js';
import { Component } from '../entities/component.js';
import { DatabaseInterface } from '../common/db/interface.js';
import { getDbURI } from '../utils/db.js';
import express, { Express } from 'express';
import { ControllerInterface } from '../common/controller/interface.js';
import { ExceptionFilterInterface } from '../common/error/exception-filter-interface.js';
import { AuthMiddleware } from '../common/middlewares/auth.js';

@injectable()
export class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    @inject(Component.FilmController) private filmController: ControllerInterface,
    @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface,
  ) {
    this.expressApp = express();
  }

  async init() {
    this.logger.info(`Application initialized. Get value from $PORT: ${this.config.get('PORT')}.`);
    const port = this.config.get('PORT');

    const dbURI = getDbURI({
      username: this.config.get('DB_USER'),
      password: this.config.get('DB_PASSWORD'),
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      databaseName: this.config.get('DB_NAME'),
    }
    );

    await this.databaseClient.connect(dbURI);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    this.expressApp.listen(
      port,
      () => this.logger.info(`Server started on http://localhost:${port}`)
    );
  }

  initRoutes() {
    this.expressApp.use('/movies', this.filmController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  initMiddleware() {
    const authMiddleware = new AuthMiddleware(this.config.get('JWT_SECRET'));

    this.expressApp.use(express.json());
    this.expressApp.use('/upload', express.static(this.config.get('STATIC_DIRECTORY')));
    this.expressApp.use(authMiddleware.execute.bind(authMiddleware));
  }

  initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }
}
