import { ConfigSchema } from './shema.js';

export interface ConfigInterface {
  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T];
}
