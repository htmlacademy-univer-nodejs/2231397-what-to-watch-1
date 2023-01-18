import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../common/logger/interface.js';
import { ConfigInterface } from '../common/config/interface.js';
import { Component } from '../entities/component.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface) {}

  public async init() {
    this.logger.info('Application initialization…');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
