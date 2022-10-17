export interface ICommand {
  readonly name: string;
  execute(...parameters: string[]): void;
}
