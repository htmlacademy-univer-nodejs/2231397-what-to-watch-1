export interface IFileReader {
  readonly filename: string;
  read(): void;
}
