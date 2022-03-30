import { AxiosInstance } from 'axios';
import type { ResponseConfig } from './requestBase';
export interface RequestAuthConfig {
  token: string;
  tokenKey: string[];
  tokenInfo: { [key: string]: string };
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
    token: '',
    tokenKey: ['X-Access-Token', 'Authorization'],
    tokenInfo: {},
    loginUrl: '',
    loginStatusCode: [401, 403, 426],
    loginCode: [],
    withHref: false
  };
  const allConfig: RequestAuthConfig = { ...defaultConfig, ...config };

  Object.keys(allConfig.tokenInfo).forEach((key) => {
    request.defaults.headers.common[key] = allConfig.tokenInfo[key];
  });

  if (allConfig.tokenKey && allConfig.tokenKey.length) {
    allConfig.tokenKey.forEach((key) => {
      request.defaults.headers.common[key] = allConfig.token;
    });
  }

  const hasLoginCode =
    (allConfig.loginCode && allConfig.loginCode.length) ||
    (allConfig.loginStatusCode && allConfig.loginStatusCode.length);
  if (allConfig.loginUrl && hasLoginCode) {
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
        if (
          !res.isHttpError &&
          allConfig.loginCode &&
          allConfig.loginCode.length
        )
          isUnLogin = allConfig.loginCode.includes(res.data);
        if (isUnLogin && allConfig.loginUrl)
          window.location.href =
            allConfig.loginUrl +
            (allConfig.withHref ? window.location.href : '');
        return Promise.reject(res);
      }
    );
    loginInterceptorMap.set(request, interceptor);
  }

  return request;
}
