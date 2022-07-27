import { AxiosInstance } from 'axios';
import type { ResponseConfig } from './requestBase';
export interface RequestAuthConfig {
  tokenInfo: { [key: string]: string };
  tokenStorageKey: string[];
  loginUrl: string;
  loginStatusCode: number[];
  loginCode: (string | number)[];
  withHref: boolean;
}

const loginInterceptorMap: Map<AxiosInstance, number> = new Map();

export function setRequestAuth(
  request: AxiosInstance,
  config: Partial<RequestAuthConfig>
): AxiosInstance {
  const defaultConfig: RequestAuthConfig = {
    tokenInfo: {},
    tokenStorageKey: [],
    loginUrl: '',
    loginStatusCode: [401, 403, 426],
    loginCode: [],
    withHref: false
  };
  const allConfig: RequestAuthConfig = { ...defaultConfig, ...config };

  Object.entries(allConfig.tokenInfo).forEach(([key, value]) => {
    request.defaults.headers.common[key] = value;
  });

  const hasLoginCode =
    (allConfig.loginCode && allConfig.loginCode.length) ||
    (allConfig.loginStatusCode && allConfig.loginStatusCode.length);
  if (!hasLoginCode) return request;

  if (loginInterceptorMap.has(request)) {
    const interceptor = loginInterceptorMap.get(request) as number;
    loginInterceptorMap.delete(request);
    request.interceptors.response.eject(interceptor);
  }
  const interceptor = request.interceptors.response.use(
    (data) => Promise.resolve(data),
    (res: ResponseConfig) => {
      let isUnLogin = false;

      if (
        res.isHttpError &&
        allConfig.loginStatusCode &&
        allConfig.loginStatusCode.length
      )
        isUnLogin = allConfig.loginStatusCode.includes(res.status);
      if (!res.isHttpError && allConfig.loginCode && allConfig.loginCode.length)
        isUnLogin = allConfig.loginCode.includes(res.code);
      if (isUnLogin) {
        allConfig.tokenStorageKey.forEach((key) => {
          window.localStorage.removeItem(key);
        });
        if (allConfig.loginUrl)
          window.location.href =
            allConfig.loginUrl +
            (allConfig.withHref ? window.location.href : '');
      }

      return Promise.reject(res);
    }
  );
  loginInterceptorMap.set(request, interceptor);
  return request;
}
