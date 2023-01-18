import { inject, injectable } from 'inversify';
import * as mongoose from 'mongoose';
import { LoggerInterface } from '../logger/interface.js';
import { DatabaseInterface } from './interface.js';
import { Component } from '../../entities/component.js';

@injectable()
export class DatabaseService implements DatabaseInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Try to connect to MongoDB…');
    await mongoose.connect(uri);
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Database connection closed.');
  }
}
