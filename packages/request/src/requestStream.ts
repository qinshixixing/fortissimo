import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { basicAjax } from './basicAjax';
import { RequestConfig, ResponseConfig } from './requestBase';

function setResError(res: AxiosResponse): ResponseConfig {
  return {
    isHttpError: true,
    code: -1,
    status: res.status,
    msg: '',
    error: '',
    res
  };
}

export function requestStream(
  config: Partial<RequestConfig> = {}
): AxiosInstance {
  const axiosConfig: AxiosRequestConfig = {};
  if (config.headers) axiosConfig.headers = config.headers;
  if (config.baseUrl) axiosConfig.baseURL = config.baseUrl;
  if (config.timeout) axiosConfig.timeout = config.timeout;
  const request = basicAjax(axiosConfig);

  request.interceptors.response.use(
    (res: AxiosResponse) => {
      return Promise.resolve(res);
    },
    (res: AxiosResponse) => Promise.reject(setResError(res))
  );

  return request;
}
