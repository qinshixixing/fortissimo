import { requestBase } from './requestBase';
import type {
  RequestConfig,
  RequestBaseInstance,
  ResponseConfig
} from './requestBase';

export interface RequestInstance<S = any, D = any> {
  (config: Partial<RequestConfig>): Promise<ResponseConfig<D, S>>;
  config: (config: Partial<RequestConfig>) => void;
}

export function request(config: Partial<RequestConfig> = {}): RequestInstance {
  const baseInstance: RequestBaseInstance = requestBase(config);

  const baseInstanceMethods = { ...baseInstance };

  const instance: RequestInstance = baseInstance;

  Reflect.deleteProperty(instance, 'config');
  Reflect.deleteProperty(instance, 'setHeader');
  Reflect.deleteProperty(instance, 'interceptors');

  instance.config = (config: Partial<RequestConfig> = {}) => {
    baseInstanceMethods.config(config);
  };

  return instance;
}
