import { PokeApi } from '../PokeApi';
import { BaseAPI } from './BaseAPI';
import type { AxiosRequestConfig } from 'axios';

export class Pokemon extends BaseAPI {
  private static ENDPOINT = 'pokemon';
  constructor(pokeApiInstance: PokeApi) {
    super(pokeApiInstance);
  }

  async get(nameOrId: string | number, options?: AxiosRequestConfig) {
    const logger = this.pokeApiInstance.logger;
    logger.debug('Getting Pokemon', { nameOrId });

    return this.getResource(`${Pokemon.ENDPOINT}/${nameOrId}`, options);
  }

  async list(offset?: number, limit?: number, options?: AxiosRequestConfig) {
    const logger = this.pokeApiInstance.logger;
    logger.debug('Listing Pokemon', { offset, limit });

    return this.getResource(
      `${Pokemon.ENDPOINT}/?offset=${offset || 0}&limit=${limit || 20}`,
      options
    );
  }
}
