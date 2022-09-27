import {
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  AxiosRequestHeaders
} from 'axios';
import { basicAjax } from './basicAjax';

export type ResponseCode = number | string;

interface RequestCustomConfig {
  successCode: ResponseCode[];
  codeKey: string;
  msgKey: string;
  errorKey: string;
  dataKey: string;
  needData: boolean;
  checkAuth: boolean;
  tokenInfo: Record<string, string>;
  tokenStorageKeys: string[];
  tokenStorageInfo: Record<string, string>;
  loginUrl: string;
  loginStatusCode: number[];
  loginCode: ResponseCode[];
  loginWithHref: boolean;
}

type RequestAxiosConfig<T = any> = Pick<
  AxiosRequestConfig<T>,
  | 'baseURL'
  | 'headers'
  | 'timeout'
  | 'url'
  | 'data'
  | 'params'
  | 'method'
  | 'responseType'
>;

export type RequestConfig<T = any> = RequestAxiosConfig<T> &
  RequestCustomConfig;

export type ResponseType = 'success' | 'dataError' | 'httpError' | 'authError';

export interface ResponseConfig<T = any, D = any> {
  type: ResponseType;
  status: AxiosResponse['status'];
  code: ResponseCode;
  error?: string;
  msg?: string;
  data?: T;
  config: RequestConfig<D>;
  axiosConfig?: AxiosRequestConfig<D>;
  res: AxiosResponse<T, D>;
}

export type ResponseCallback = (
  data: ResponseConfig
) => ResponseConfig | PromiseLike<ResponseConfig>;

export interface ResponseCallbackConfig {
  success: ResponseCallback;
  error?: ResponseCallback;
}

export interface RequestBaseInstance<S = any, D = any> {
  (config: Partial<RequestConfig>, axiosConfig?: AxiosRequestConfig): Promise<
    ResponseConfig<D, S>
  >;
  config: (
    config: Partial<RequestConfig>,
    axiosConfig?: AxiosRequestConfig
  ) => void;
  setHeader: (data: AxiosRequestHeaders, type?: keyof HeadersDefaults) => void;
  interceptors: ResponseCallbackConfig[];
}

function setResponse({
  type,
  res,
  config,
  axiosConfig
}: {
  type: ResponseType;
  res: AxiosResponse;
  config: RequestConfig;
  axiosConfig?: AxiosRequestConfig;
}): ResponseConfig {
  const msg: ResponseConfig = {
    type,
    status: res.status,
    code: -1,
    config,
    axiosConfig,
    res
  };
  if (res.data) {
    const data = res.data;
    if (!config.needData) msg.data = data;
    else {
      if (
        config.codeKey &&
        (typeof data[config.codeKey] === 'number' ||
          typeof data[config.codeKey] === 'string')
      )
        msg.code = data[config.codeKey];
      if (config.errorKey && typeof data[config.errorKey] === 'string')
        msg.error = data[config.errorKey];
      if (config.msgKey && typeof data[config.msgKey] === 'string')
        msg.msg = data[config.msgKey];
      if (config.dataKey && Reflect.has(data, config.dataKey))
        msg.data = data[config.dataKey];
      else msg.data = data;
    }
  }
  return msg;
}

function pickAxiosConfig(config: Partial<RequestConfig>): RequestAxiosConfig {
  const axiosConfig: RequestAxiosConfig = {};
  Object.keys(config).forEach((item) => {
    const key = item as keyof RequestConfig;

    if (key === 'url') axiosConfig.url = config.url;
    else if (key === 'method') axiosConfig.method = config.method;
    else if (key === 'data') axiosConfig.data = config.data;
    else if (key === 'params') axiosConfig.params = config.params;
    else if (key === 'headers') axiosConfig.headers = config.headers;
    else if (key === 'baseURL') axiosConfig.baseURL = config.baseURL;
    else if (key === 'timeout') axiosConfig.timeout = config.timeout;
    else if (key === 'responseType')
      axiosConfig.responseType = config.responseType;
  });
  return axiosConfig;
}

function checkSuccess(
  successCode: ResponseCode[],
  code: ResponseCode
): boolean {
  if (!successCode) return true;
  return successCode
    .filter((item) => ['number', 'string'].includes(typeof item))
    .some((item) => item === code);
}

export function requestBase(
  config: Partial<RequestConfig> = {},
  axiosConfig?: AxiosRequestConfig
): RequestBaseInstance {
  const defaultCustomConfig: RequestCustomConfig = {
    successCode: [0],
    codeKey: 'code',
    msgKey: 'msg',
    errorKey: 'error',
    dataKey: 'data',
    needData: true,
    checkAuth: false,
    tokenInfo: {},
    tokenStorageKeys: [],
    tokenStorageInfo: {},
    loginUrl: '',
    loginStatusCode: [],
    loginCode: [],
    loginWithHref: false
  };
  let requestDefaultConfig: RequestConfig = {
    ...defaultCustomConfig,
    ...config
  };
  let requestDefaultAxiosConfig: AxiosRequestConfig = {
    ...axiosConfig,
    ...pickAxiosConfig(config)
  };

  const basicRequest = basicAjax(requestDefaultAxiosConfig);

  const requestInterceptors: ResponseCallbackConfig[] = [];

  const request = (
    config: Partial<RequestConfig>,
    axiosConfig?: AxiosRequestConfig
  ) => {
    const requestConfig: RequestConfig = {
      ...requestDefaultConfig,
      ...config
    };
    const requestAxiosConfig: AxiosRequestConfig = {
      ...axiosConfig,
      ...pickAxiosConfig(config)
    };

    if (requestConfig.checkAuth) {
      Object.entries(requestConfig.tokenStorageInfo).forEach(
        ([key, storageKey]) => {
          if (!requestAxiosConfig.headers) requestAxiosConfig.headers = {};
          const value = window.localStorage.getItem(storageKey);
          if (value) requestAxiosConfig.headers[key] = value;
        }
      );
      Object.entries(requestConfig.tokenInfo).forEach(([key, value]) => {
        if (!requestAxiosConfig.headers) requestAxiosConfig.headers = {};
        requestAxiosConfig.headers[key] = value;
      });
    }

    let requestPromise: Promise<ResponseConfig> = basicRequest(
      requestAxiosConfig
    ).then(
      (res: AxiosResponse) => {
        if (!requestConfig.needData)
          return Promise.resolve(
            setResponse({
              type: 'success',
              res,
              config: requestConfig,
              axiosConfig: requestAxiosConfig
            })
          );
        if (
          res.data &&
          (!requestConfig.codeKey ||
            checkSuccess(
              requestConfig.successCode,
              res.data[requestConfig.codeKey]
            ))
        )
          return Promise.resolve(
            setResponse({
              type: 'success',
              res,
              config: requestConfig,
              axiosConfig: requestAxiosConfig
            })
          );
        console.error(res);
        return Promise.reject(
          setResponse({
            type: 'dataError',
            res,
            config: requestConfig,
            axiosConfig: requestAxiosConfig
          })
        );
      },
      (res: AxiosResponse) => {
        return Promise.reject(
          setResponse({
            type: 'httpError',
            res,
            config: requestConfig,
            axiosConfig: requestAxiosConfig
          })
        );
      }
    );

    if (requestConfig.checkAuth) {
      const hasLoginCode =
        (requestConfig.loginCode && requestConfig.loginCode.length) ||
        (requestConfig.loginStatusCode && requestConfig.loginStatusCode.length);
      if (hasLoginCode)
        requestPromise = requestPromise.then(
          (data) => Promise.resolve(data),
          (data: ResponseConfig) => {
            let isUnLogin = false;

            if (
              data.type === 'httpError' &&
              requestConfig.loginStatusCode &&
              requestConfig.loginStatusCode.length
            )
              isUnLogin = requestConfig.loginStatusCode.includes(data.status);
            if (
              data.type === 'dataError' &&
              requestConfig.loginCode &&
              requestConfig.loginCode.length
            )
              isUnLogin = requestConfig.loginCode.includes(data.code);
            if (isUnLogin) {
              data.type = 'authError';
              Object.entries(requestConfig.tokenStorageInfo).forEach(
                ([key, storageKey]) => {
                  window.localStorage.removeItem(storageKey);
                }
              );
              requestConfig.tokenStorageKeys.forEach((storageKey) => {
                window.localStorage.removeItem(storageKey);
              });
              if (requestConfig.loginUrl)
                window.location.href =
                  requestConfig.loginUrl +
                  (requestConfig.loginWithHref ? window.location.href : '');
            }
            return Promise.reject(data);
          }
        );
    }

    requestInterceptors.forEach((item) => {
      requestPromise = requestPromise.then(item.success, item.error);
    });

    return requestPromise;
  };

  request.config = (
    config: Partial<RequestConfig> = {},
    axiosConfig?: AxiosRequestConfig
  ) => {
    requestDefaultConfig = {
      ...requestDefaultConfig,
      ...config
    };
    const newDefaultAxiosConfig: AxiosRequestConfig = {
      ...axiosConfig,
      ...pickAxiosConfig(config)
    };
    requestDefaultAxiosConfig = {
      ...requestDefaultAxiosConfig,
      ...newDefaultAxiosConfig
    };
    basicRequest.defaults = {
      ...basicRequest.defaults,
      ...newDefaultAxiosConfig,
      headers: {
        ...basicRequest.defaults.headers,
        common: {
          ...basicRequest.defaults.headers.common,
          ...newDefaultAxiosConfig.headers
        }
      }
    };
  };

  request.setHeader = (
    data: AxiosRequestHeaders,
    type: keyof HeadersDefaults = 'common'
  ) => {
    basicRequest.defaults.headers[type] = {
      ...basicRequest.defaults.headers[type],
      ...data
    };
  };

  request.interceptors = requestInterceptors;

  return request;
}
