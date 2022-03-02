import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { basicAjax } from './basicAjax';

export interface RequestConfig {
  baseUrl?: string;
  successCode: number;
  headers?: { [key: string]: string };
  timeout?: number;
  codeKey: string;
  msgKey: string;
  errorKey: string;
  dataKey: string;
}

export interface ResponseConfig<T = any> {
  isHttpError: boolean;
  code: number;
  status: number;
  error: string;
  msg: string;
  data?: T;
  res: AxiosResponse;
}

function setResError(
  res: AxiosResponse,
  isHttpError: boolean,
  allConfig: RequestConfig
): ResponseConfig {
  const msg: ResponseConfig = {
    isHttpError,
    code: -1,
    status: res.status,
    msg: '',
    error: '',
    res
  };
  if (!isHttpError && res.data) {
    const data = res.data;
    if (typeof data[allConfig.codeKey] === 'number')
      msg.code = data[allConfig.codeKey];
    if (data[allConfig.errorKey]) msg.error = data[allConfig.errorKey];
    if (data[allConfig.msgKey]) msg.msg = data[allConfig.msgKey];
    if (data[allConfig.dataKey]) msg.data = data[allConfig.dataKey];
  }
  return msg;
}

export function requestBase(
  config: Partial<RequestConfig> = {}
): AxiosInstance {
  const defaultConfig: RequestConfig = {
    successCode: 0,
    codeKey: 'code',
    msgKey: 'msg',
    errorKey: 'error',
    dataKey: 'data'
  };
  const allConfig: RequestConfig = { ...defaultConfig, ...config };

  const axiosConfig: AxiosRequestConfig = {};
  if (allConfig.headers) axiosConfig.headers = allConfig.headers;
  if (allConfig.baseUrl) axiosConfig.baseURL = allConfig.baseUrl;
  if (allConfig.timeout) axiosConfig.timeout = allConfig.timeout;
  const request = basicAjax(axiosConfig);

  request.interceptors.response.use(
    (res: AxiosResponse) => {
      if (res.data && res.data[allConfig.codeKey] === allConfig.successCode) {
        return Promise.resolve(res.data[allConfig.dataKey] || null);
      }
      console.error(res);
      return Promise.reject(setResError(res, false, allConfig));
    },
    (res: AxiosResponse) => Promise.reject(setResError(res, true, allConfig))
  );

  return request;
}
