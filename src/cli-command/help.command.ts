import { ICommand } from './interface.js';
import chalk from 'chalk';

export default class HelpCommand implements ICommand {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(chalk.yellowBright(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <path>:             # импортирует данные из TSV
    `));
  }
}
