import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { basicAjax } from './basicAjax';

export type RequestCustomConfig = Partial<{
  successCode: number | string;
  codeKey: string;
  msgKey: string;
  errorKey: string;
  dataKey: string;
  needData: boolean;
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

type RequestConfig<T = any> = RequestAxiosConfig<T> & RequestCustomConfig;

export interface ResponseConfig<T = any> {
  isHttpError: boolean;
  code: number;
  status: number;
  error?: string;
  msg?: string;
  data?: T;
  res: AxiosResponse;
}

function setResError({
  res,
  isHttpError,
  customConfig
}: {
  res: AxiosResponse;
  isHttpError: boolean;
  customConfig: RequestCustomConfig;
}): ResponseConfig {
  const msg: ResponseConfig = {
    isHttpError,
    code: -1,
    status: res.status,
    res
  };
  if (!isHttpError && res.data) {
    const data = res.data;
    if (customConfig.codeKey && typeof data[customConfig.codeKey] === 'number')
      msg.code = data[customConfig.codeKey];
    if (customConfig.errorKey && data[customConfig.errorKey])
      msg.error = data[customConfig.errorKey];
    if (customConfig.msgKey && data[customConfig.msgKey])
      msg.msg = data[customConfig.msgKey];
    if (customConfig.dataKey && data[customConfig.dataKey])
      msg.data = data[customConfig.dataKey];
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
    if (key === 'successCode') customConfig.successCode = config.successCode;
    if (key === 'codeKey') customConfig.codeKey = config.codeKey;
    if (key === 'msgKey') customConfig.msgKey = config.msgKey;
    if (key === 'dataKey') customConfig.dataKey = config.dataKey;
    if (key === 'errorKey') customConfig.errorKey = config.errorKey;
    if (key === 'needData') customConfig.needData = config.needData;
    if (key === 'baseURL') axiosConfig.baseURL = config.baseURL;
    if (key === 'headers') axiosConfig.headers = config.headers;
    if (key === 'timeout') axiosConfig.timeout = config.timeout;
    if (key === 'url') axiosConfig.url = config.url;
    if (key === 'data') axiosConfig.data = config.data;
    if (key === 'params') axiosConfig.params = config.params;
    if (key === 'method') axiosConfig.method = config.method;
    if (key === 'responseType') axiosConfig.responseType = config.responseType;
  });
  return {
    customConfig,
    axiosConfig
  };
}

export function requestBase(
  config: RequestConfig = {},
  axiosConfig?: AxiosRequestConfig
) {
  const allConfig: RequestConfig = {
    successCode: 0,
    codeKey: 'code',
    msgKey: 'msg',
    errorKey: 'error',
    dataKey: 'data',
    needData: true,
    ...config
  };
  const configInfo = transConfig(allConfig);
  let requestCustomConfig: RequestCustomConfig = configInfo.customConfig;
  let requestAxiosConfig: AxiosRequestConfig = {
    ...axiosConfig,
    ...configInfo.axiosConfig
  };

  const basicRequest = basicAjax(requestAxiosConfig);

  // const requestInterceptors: [];

  const requestInterceptors: ((config: RequestCustomConfig) => void)[] = [
    () => {},
    () => {}
  ];

  // basicRequest.interceptors.response.use(
  //   (res: AxiosResponse) => {
  //     if (!allConfig.needData) return Promise.resolve(res.data);
  //     if (
  //       res.data &&
  //       (!allConfig.codeKey ||
  //         !['number', 'string'].includes(typeof allConfig.successCode) ||
  //         res.data[allConfig.codeKey] === allConfig.successCode)
  //     ) {
  //       return Promise.resolve(
  //         allConfig.dataKey ? res.data[allConfig.dataKey] : res.data
  //       );
  //     }
  //     console.error(res);
  //     return Promise.reject(setResError(res, false, allConfig));
  //   },
  //   (res: AxiosResponse) => Promise.reject(setResError(res, true, allConfig))
  // );

  const request = (config: RequestConfig, axiosConfig?: AxiosRequestConfig) => {
    const reqConfigInfo = transConfig(config);
    const customConfig = {
      ...requestCustomConfig,
      ...reqConfigInfo.customConfig
    };

    const requestPromise = basicRequest({
      ...axiosConfig,
      ...reqConfigInfo.axiosConfig
    });

    const a: Promise<any> = requestPromise.then(
      (res: AxiosResponse) => {
        if (!customConfig.needData) return Promise.resolve(res.data);
        if (
          res.data &&
          (!customConfig.codeKey ||
            !['number', 'string'].includes(typeof customConfig.successCode) ||
            res.data[customConfig.codeKey] === customConfig.successCode)
        ) {
          return Promise.resolve(
            customConfig.dataKey ? res.data[customConfig.dataKey] : res.data
          );
        }
        console.error(res);
        return Promise.reject(
          setResError({
            res,
            isHttpError: false,
            customConfig
          })
        );
      },
      (res: AxiosResponse) => {
        return Promise.reject(
          setResError({ res, isHttpError: true, customConfig })
        );
      }
    );

    // requestInterceptors.forEach((item) => {
    //   requestPromise = requestPromise.then((data) => {
    //     return data;
    //   });
    // });

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

  request.interceptors = requestInterceptors;

  return request;
}
