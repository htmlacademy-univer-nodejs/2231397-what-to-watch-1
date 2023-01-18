import chalk from 'chalk';
import { readFileSync } from 'fs';
import { ConsoleLoggerService } from '../common/logger/console-service.js';
import { LoggerInterface } from '../common/logger/interface.js';
import { CliCommandInterface } from './interface.js';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';
  private logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  private readVersion(): string {
    const contentPageJSON = readFileSync('./package.json', 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute() {
    const version = this.readVersion();
    this.logger.info(chalk.green(version));
  }
}
