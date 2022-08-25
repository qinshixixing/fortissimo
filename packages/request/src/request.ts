import { requestBase } from './requestBase';
import type {
  RequestConfig,
  RequestBaseInstance,
  ResponseConfig
} from './requestBase';

export interface RequestInstance<S = any, D = any> {
  (config: Partial<RequestConfig>): Promise<D>;
  config: (config: Partial<RequestConfig>) => void;
}

export function request(config: Partial<RequestConfig> = {}): RequestInstance {
  const baseInstance: RequestBaseInstance = requestBase(config);

  const fn = (config: Partial<RequestConfig> = {}) => {
    return baseInstance(config).then(
      (data) => {
        return Promise.resolve(data.data);
      },
      (data: ResponseConfig) => {
        return Promise.reject(data);
      }
    );
  };

  fn.config = (config: Partial<RequestConfig> = {}) => {
    baseInstance.config(config);
  };

  return fn;
}
