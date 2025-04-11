import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {nullsToUndefined} from '../../shared/utils';
import {IApiResponse} from '../types';
import {getToken} from './token';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = Omit<AxiosRequestConfig, 'url' | 'method'> & {
  params?: Record<string, string>;
  tag?: string;
};

class HttpError extends Error {
  constructor(public response: AxiosResponse) {
    super(`HTTP Error ${response.status}: ${response.statusText}`);
    this.name = 'HttpError';
  }
}

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use(async config => {
      const token = await getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          // You could trigger a logout or redirect here
        }
        return Promise.reject(error);
      },
    );
  }

  private async request<T>(
    url: string,
    method: HttpMethod,
    options: RequestOptions = {},
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request({
        url,
        method,
        ...options,
        headers: {
          ...options.headers,
          ...(options.tag ? {'Cache-Tag': options.tag} : {}),
        },
      });

      const responseData = response.data;

      if (!isSuccessResponse<T>(responseData)) {
        throw new HttpError(response);
      }

      return nullsToUndefined(responseData) as T;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpError(error.response);
      }
      throw error;
    }
  }

  public async get<T>(url: string, options?: RequestOptions) {
    return this.request<T>(url, 'GET', options);
  }

  public async post<T>(url: string, data?: any, options?: RequestOptions) {
    return this.request<T>(url, 'POST', {...options, data});
  }

  public async put<T>(url: string, data?: any, options?: RequestOptions) {
    return this.request<T>(url, 'PUT', {...options, data});
  }

  public async patch<T>(url: string, data?: any, options?: RequestOptions) {
    return this.request<T>(url, 'PATCH', {...options, data});
  }

  public async delete<T>(url: string, options?: RequestOptions) {
    return this.request<T>(url, 'DELETE', options);
  }
}

/**
 * Error handling utilities
 */
export function getErrorMessage(error: IApiResponse): string {
  return error.error?.message || 'An unknown error occurred';
}

export function getFieldError(
  error: IApiResponse,
  field: string,
): string | undefined {
  return error.error?.errors?.find(err => err.field === field)?.message;
}

export function getFieldErrors(error: IApiResponse): Record<string, string> {
  if (!error.error?.errors) return {};

  return error.error.errors.reduce(
    (acc, err) => {
      if (err.field) {
        acc[err.field] = err.message;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: IApiResponse,
): response is IApiResponse & {data: T} {
  return response.success === true && response.data !== undefined;
}
