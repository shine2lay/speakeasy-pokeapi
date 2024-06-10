import { PokeApi } from '../PokeApi';
import { AxiosError, type AxiosRequestConfig } from 'axios';

export class BaseAPI {
  protected pokeApiInstance: PokeApi;
  constructor(pokeApiInstance: PokeApi) {
    this.pokeApiInstance = pokeApiInstance;
  }

  public async getResource(endpoint: string, options?: AxiosRequestConfig) {
    const config = this.pokeApiInstance.config;
    const axios = this.pokeApiInstance.axios;
    const logger = this.pokeApiInstance.logger;
    logger.debug('Getting resource', { endpoint });
    const url = `${config.baseUrl}/${endpoint}`;

    let retryCount = 0;
    let delay = config.retry.retryDelay;

    while (retryCount <= config.retry.maxRetries) {
      try {
        const response = await axios.get(url, options);
        logger.debug('Got resource', { endpoint, response });
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (
            error.code === 'ECONNREFUSED' ||
            error.code === 'ECONNRESET' ||
            error.code === 'ETIMEDOUT'
          ) {
            logger.info('Network error', { error });
            // Retry with delay in the case of network issues
            if (retryCount < config.retry.maxRetries) {
              logger.info(
                `Retrying request ${retryCount + 1} of ${config.retry.maxRetries} in ${delay}ms`
              );
              await new Promise((resolve) => setTimeout(resolve, delay));
              delay *= config.retry.retryDelayFactor;
              retryCount++;
            } else {
              throw error;
            }
          } else if (error.response) {
            const errorMessage = `HTTP: error: ${error.response.status} ${error.response.data}`;
            logger.error(errorMessage);
            throw new Error(errorMessage);
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }
  }
}
