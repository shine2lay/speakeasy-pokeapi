import { Generation } from './api/Generation';
import { Pokemon } from './api/Pokemon';
import Axios from 'axios';
import { type AxiosCacheInstance, setupCache } from 'axios-cache-interceptor';
import { Logger, pino } from 'pino';

export type ApiEndpoints = {
  generation: Generation;
  pokemon: Pokemon;
};

export class PokeApi {
  protected _config: SdkConfig = {
    baseUrl: 'https://pokeapi.co/api/v2',
    retry: {
      maxRetries: 3,
      retryDelay: 1000,
      retryDelayFactor: 2,
    },
    logLevel: 'info',
  };
  protected _logger: Logger | undefined;
  protected _api: ApiEndpoints | undefined;
  protected _axios: AxiosCacheInstance | undefined;
  static instance: PokeApi | null = null;

  constructor(config?: SdkConfigParameter) {
    if (PokeApi.instance !== null) return PokeApi.instance;

    if (config) {
      this._config = Object.assign({}, this._config, config);
    }

    // @todo could potentially upgrade to be dynamic and read from fs path under /src/api folder and install them
    this._api = {
      generation: new Generation(this),
      pokemon: new Pokemon(this),
    };

    this._logger = pino({
      level: this._config.logLevel,
    });

    this._axios = setupCache(Axios.create());

    PokeApi.instance = this;
    return this;
  }

  get config() {
    return this._config;
  }

  get api() {
    if (this._api === undefined) throw new Error('API endpoints not initialized');
    return this._api;
  }

  get axios() {
    if (this._axios === undefined) throw new Error('Axios instance not initialized');
    return this._axios;
  }

  get logger() {
    if (this._logger === undefined) throw new Error('Logger instance not initialized');
    return this._logger;
  }
}
