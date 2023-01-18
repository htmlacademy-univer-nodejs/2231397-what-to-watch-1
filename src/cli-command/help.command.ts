import { CliCommandInterface } from './interface.js';
import chalk from 'chalk';
import { LoggerInterface } from '../common/logger/interface.js';
import { ConsoleLoggerService } from '../common/logger/console-service.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';
  private logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  public async execute(): Promise<void> {
    this.logger.info(chalk.yellowBright(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <path>:             # импортирует данные из TSV
            --generate <n> <path> <url>  # генерирует тестовые данные
    `));
  }
}
