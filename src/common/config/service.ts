import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from './interface.js';
import { LoggerInterface } from '../logger/interface.js';
import { configSchema, ConfigSchema } from './shema.js';
import { Component } from '../../entities/component.js';

@injectable()
export class ConfigService implements ConfigInterface {
  private config: ConfigSchema;
  private logger: LoggerInterface;

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface) {
    this.logger = logger;

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof ConfigSchema>(key: T) {
    return this.config[key];
  }
}
