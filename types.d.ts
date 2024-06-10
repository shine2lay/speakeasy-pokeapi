type SdkConfigParameter = {
  baseUrl?: string;
  retry?: {
    maxRetries?: number;
    retryDelay?: number;
    retryDelayFactor?: number;
  }
  logLevel?: string;
};

type SdkConfig = {
  baseUrl: string;
  retry: {
    maxRetries: number;
    retryDelay: number;
    retryDelayFactor: number;
  };
  logLevel: string;
};

type getApiOptions = {
  limit?: number;
  offset?: number;
};
