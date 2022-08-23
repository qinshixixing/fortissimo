import {
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  AxiosRequestHeaders
} from 'axios';
import { basicAjax } from './basicAjax';

export type ResponseCode = number | string;

export type RequestCustomConfig = Partial<{
  successCode: ResponseCode;
  codeKey: string;
  msgKey: string;
  errorKey: string;
  dataKey: string;
  needData: boolean;
  checkAuth?: boolean;
  tokenInfo?: Record<string, string>;
  tokenStorageKeys?: string[];
  tokenStorageInfo?: Record<string, string>;
  loginUrl?: string;
  loginStatusCode?: number[];
  loginCode?: ResponseCode[];
  loginWithHref?: boolean;
}>;

export type RequestAxiosConfig<T = any> = Partial<
  Pick<
    AxiosRequestConfig<T>,
    | 'baseURL'
    | 'headers'
    | 'timeout'
    | 'url'
    | 'data'
    | 'params'
    | 'method'
    | 'responseType'
  >
>;

export type RequestConfig<T = any> = RequestAxiosConfig<T> &
  RequestCustomConfig;

export type ResponseType = 'success' | 'dataError' | 'httpError';

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
  (config: RequestConfig, axiosConfig?: AxiosRequestConfig): Promise<
    ResponseConfig<D, S>
  >;
  config: (config?: RequestConfig, axiosConfig?: AxiosRequestConfig) => void;
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
  if (type !== 'httpError' && res.data) {
    const data = res.data;
    if (!config.needData) msg.data = data;
    else {
      if (config.codeKey && typeof data[config.codeKey] === 'number')
        msg.code = data[config.codeKey];
      if (config.errorKey && data[config.errorKey])
        msg.error = data[config.errorKey];
      if (config.msgKey && data[config.msgKey]) msg.msg = data[config.msgKey];
      if (config.dataKey && data[config.dataKey])
        msg.data = data[config.dataKey];
      else msg.data = data;
    }
  }
  return msg;
}

function transConfig(config: RequestConfig): {
  customConfig: RequestCustomConfig;
  axiosConfig: RequestAxiosConfig;
} {
  const customConfig: RequestCustomConfig = {};
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
    else if (key === 'successCode')
      customConfig.successCode = config.successCode;
    else if (key === 'codeKey') customConfig.codeKey = config.codeKey;
    else if (key === 'msgKey') customConfig.msgKey = config.msgKey;
    else if (key === 'dataKey') customConfig.dataKey = config.dataKey;
    else if (key === 'errorKey') customConfig.errorKey = config.errorKey;
    else if (key === 'needData') customConfig.needData = config.needData;
    else if (key === 'checkAuth') customConfig.checkAuth = config.checkAuth;
    else if (key === 'tokenInfo') customConfig.tokenInfo = config.tokenInfo;
    else if (key === 'tokenStorageKeys')
      customConfig.tokenStorageKeys = config.tokenStorageKeys;
    else if (key === 'tokenStorageInfo')
      customConfig.tokenStorageInfo = config.tokenStorageInfo;
    else if (key === 'loginUrl') customConfig.loginUrl = config.loginUrl;
    else if (key === 'loginStatusCode')
      customConfig.loginStatusCode = config.loginStatusCode;
    else if (key === 'loginCode') customConfig.loginCode = config.loginCode;
    else if (key === 'loginWithHref')
      customConfig.loginWithHref = config.loginWithHref;
  });
  return {
    customConfig,
    axiosConfig
  };
}

export function requestBase(
  config: RequestConfig = {},
  axiosConfig?: AxiosRequestConfig
): RequestBaseInstance {
  const allConfig: RequestConfig = {
    successCode: 0,
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
    loginWithHref: false,
    ...config
  };
  const configInfo = transConfig(allConfig);
  let requestCustomConfig: Required<RequestCustomConfig> =
    configInfo.customConfig as Required<RequestCustomConfig>;
  let requestAxiosConfig: AxiosRequestConfig = {
    ...axiosConfig,
    ...configInfo.axiosConfig
  };

  const basicRequest = basicAjax(requestAxiosConfig);

  const requestInterceptors: ResponseCallbackConfig[] = [];

  const request = (config: RequestConfig, axiosConfig?: AxiosRequestConfig) => {
    const reqConfigInfo = transConfig(config);
    const customConfig = {
      ...requestCustomConfig,
      ...reqConfigInfo.customConfig
    };
    const allAxiosConfig: AxiosRequestConfig = {
      ...axiosConfig,
      ...reqConfigInfo.axiosConfig
    };

    if (customConfig.checkAuth) {
      Object.entries(customConfig.tokenStorageInfo).forEach(
        ([key, storageKey]) => {
          if (!allAxiosConfig.headers) allAxiosConfig.headers = {};
          const value = window.localStorage.getItem(storageKey);
          if (value) allAxiosConfig.headers[key] = value;
        }
      );
      Object.entries(customConfig.tokenInfo).forEach(([key, value]) => {
        if (!allAxiosConfig.headers) allAxiosConfig.headers = {};
        allAxiosConfig.headers[key] = value;
      });
    }

    let requestPromise: Promise<ResponseConfig> = basicRequest(
      allAxiosConfig
    ).then(
      (res: AxiosResponse) => {
        if (!customConfig.needData)
          return Promise.resolve(
            setResponse({
              type: 'success',
              res,
              config,
              axiosConfig
            })
          );
        if (
          res.data &&
          (!customConfig.codeKey ||
            !['number', 'string'].includes(typeof customConfig.successCode) ||
            res.data[customConfig.codeKey] === customConfig.successCode)
        )
          return Promise.resolve(
            setResponse({
              type: 'success',
              res,
              config,
              axiosConfig
            })
          );
        console.error(res);
        return Promise.reject(
          setResponse({
            type: 'dataError',
            res,
            config: allConfig,
            axiosConfig
          })
        );
      },
      (res: AxiosResponse) => {
        return Promise.reject(
          setResponse({
            type: 'httpError',
            res,
            config: allConfig,
            axiosConfig
          })
        );
      }
    );

    if (customConfig.checkAuth) {
      const hasLoginCode =
        (customConfig.loginCode && customConfig.loginCode.length) ||
        (customConfig.loginStatusCode && customConfig.loginStatusCode.length);
      if (hasLoginCode)
        requestPromise = requestPromise.then(
          (data) => Promise.resolve(data),
          (data: ResponseConfig) => {
            let isUnLogin = false;

            if (
              data.type === 'httpError' &&
              customConfig.loginStatusCode &&
              customConfig.loginStatusCode.length
            )
              isUnLogin = customConfig.loginStatusCode.includes(data.status);
            if (
              data.type === 'dataError' &&
              customConfig.loginCode &&
              customConfig.loginCode.length
            )
              isUnLogin = customConfig.loginCode.includes(data.code);
            if (isUnLogin) {
              {
                Object.entries(customConfig.tokenStorageInfo).forEach(
                  ([key, storageKey]) => {
                    window.localStorage.removeItem(storageKey);
                  }
                );
                customConfig.tokenStorageKeys.forEach((storageKey) => {
                  window.localStorage.removeItem(storageKey);
                });
              }
              if (customConfig.loginUrl)
                window.location.href =
                  customConfig.loginUrl +
                  (customConfig.loginWithHref ? window.location.href : '');
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
    config: RequestConfig = {},
    axiosConfig?: AxiosRequestConfig
  ) => {
    const configInfo = transConfig(config);
    requestCustomConfig = {
      ...requestCustomConfig,
      ...configInfo.customConfig
    };
    requestAxiosConfig = {
      ...requestAxiosConfig,
      ...axiosConfig,
      ...configInfo.axiosConfig
    };
    basicRequest.defaults = {
      ...basicRequest.defaults,
      ...axiosConfig,
      ...configInfo.axiosConfig,
      headers: {
        ...basicRequest.defaults.headers,
        common: {
          ...basicRequest.defaults.headers.common,
          ...requestAxiosConfig.headers
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
