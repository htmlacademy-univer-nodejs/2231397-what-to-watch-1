import got from 'got';
import chalk from 'chalk';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';
import FilmGenerator from '../common/film-generator/film-generator.js';
import { CliCommandInterface } from './interface.js';
import { TMockData } from '../types/mock-data.js';


export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: TMockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(chalk.red(`Can't fetch data from ${url}.`));
    }

    const offerGeneratorString = new FilmGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }

    console.log(chalk.blueBright(`File ${filepath} was created!`));
  }
}
