import chalk from 'chalk';
import { readFileSync } from 'fs';
import { ICommand } from './interface.js';

export default class VersionCommand implements ICommand {
  public readonly name = '--version';

  private readVersion(): string {
    const contentPageJSON = readFileSync('./package.json', 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute() {
    const version = this.readVersion();
    console.log(chalk.green(version));
  }
}
