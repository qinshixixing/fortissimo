import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';

export function basicAjax(config?: AxiosRequestConfig): AxiosInstance {
  const request = axios.create({
    ...(config || {}),
    headers: {
      'X-Client-Type': 'web'
    }
  });

  request.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  request.interceptors.response.use(
    (res) => Promise.resolve(res),
    (error) => {
      console.error(error);
      const res: AxiosResponse = error.response;
      return Promise.reject(res);
    }
  );

  return request;
}
