import { PokeApi } from '../PokeApi';
import { BaseAPI } from './BaseAPI';
import type { AxiosRequestConfig } from 'axios';

export class Generation extends BaseAPI {
  private static ENDPOINT = 'generation';
  constructor(pokeApiInstance: PokeApi) {
    super(pokeApiInstance);
  }

  async get(nameOrId: string | number, options?: AxiosRequestConfig) {
    const logger = this.pokeApiInstance.logger;
    logger.debug('Getting Generation', { nameOrId, options });

    return this.getResource(`generation/${nameOrId}`, options);
  }

  async list(offset?: number, limit?: number, options?: AxiosRequestConfig) {
    const logger = this.pokeApiInstance.logger;
    logger.debug('Listing Generation', { offset, limit, options });

    return this.getResource(
      `${Generation.ENDPOINT}/?offset=${offset || 0}&limit=${limit || 20}`,
      options
    );
  }
}
