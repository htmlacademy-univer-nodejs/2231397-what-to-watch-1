import 'reflect-metadata';
import { Container } from 'inversify';
import { LoggerInterface } from './common/logger/interface.js';
import { LoggerService } from './common/logger/service.js';
import { Component } from './entities/component.js';
import { ConfigInterface } from './common/config/interface.js';
import { ConfigService } from './common/config/service.js';
import { Application } from './app/application.js';
import { types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './modules/comment/service-interface.js';
import { CommentService } from './modules/comment/service.js';
import { CommentEntity, CommentModel } from './modules/comment/entity.js';
import { ControllerInterface } from './common/controller/interface.js';
import { ExceptionFilterInterface } from './common/error/exception-filter-interface.js';
import {ExceptionFilter} from './common/error/exception-filter.js';
import { UserController } from './modules/user/controller.js';
import { FilmController } from './modules/film/controller.js';
import { CommentController } from './modules/comment/controller.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);
applicationContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
applicationContainer.bind<ControllerInterface>(Component.FilmController).to(FilmController).inSingletonScope();
applicationContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.CommentController).to(CommentController).inSingletonScope();


const application = applicationContainer.get<Application>(Component.Application);
await application.init();
