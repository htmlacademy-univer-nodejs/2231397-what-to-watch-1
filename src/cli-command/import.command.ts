import chalk from 'chalk';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './interface.js';
import { createMovie, getErrorMessage } from '../utils/common.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private onLine(line: string) {
    const offer = createMovie(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(`${chalk.greenBright(count)} rows imported.`);
  }

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);
    try {
      await fileReader.read();
    } catch(err) {
      console.log(`Can't read the file: ${chalk.red(getErrorMessage(err))}`);
    }
  }
}
