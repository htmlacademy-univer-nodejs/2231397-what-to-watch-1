import {IFileReader} from './interface.js';
import {readFileSync} from 'fs';
import chalk from 'chalk';
import {TFilm} from '../../types/film.js';
import {TActor} from '../../types/actor.js';

export default class TsvFileReader implements IFileReader {
  private rawData = '';
  private columns: string[] = [];

  constructor(public filename: string) {}

  public read() {
    this.rawData = readFileSync(this.filename, 'utf-8');
    this.findColumnsInFile();
  }

  private findColumnsInFile(): void {
    const separatedData = this.rawData.split('\n');
    const columnsString =  separatedData[0];
    const indexEndOfColumns = columnsString.length;
    this.columns = separatedData[0].split('\t');
    this.rawData = this.rawData.slice(indexEndOfColumns);
  }

  public toArray(): TFilm[] {
    if (!this.rawData) {
      return [];
    }
    console.log(chalk.red('TSV columns'), chalk.bgBlack(this.columns));
    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
        name,
        description,
        pubDate,
        genre,
        year,
        rating,
        preview,
        video,
        actors,
        producer,
        duration,
        commentNumber,
        userName,
        userEmail,
        userAvatar,
        userPassword,
        poster,
        backgroundImg,
        backgroundColor
      ]) => new TFilm(
        name,
        description,
        new Date(Date.parse(pubDate)),
        genre.split(';'),
        Number(year),
        Number(rating),
        preview,
        video,
        actors.split(';').map((item) => {
          const splitString = item.slice();
          return new TActor(splitString.at(0), splitString.at(1));
        }),
        producer,
        Number(duration),
        Number(commentNumber),
        {name: userName, email: userEmail, avatar: userAvatar, password: userPassword},
        poster,
        backgroundImg,
        backgroundColor
      )
      );
  }
}
