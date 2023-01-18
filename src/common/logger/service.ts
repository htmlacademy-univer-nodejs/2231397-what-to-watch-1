import pino, {Logger} from 'pino';
import {injectable} from 'inversify';
import {LoggerInterface} from './interface.js';

@injectable()
export class LoggerService implements LoggerInterface{
  private logger!: Logger;

  constructor() {
    this.logger = pino();
    this.logger.info('Logger created…');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
