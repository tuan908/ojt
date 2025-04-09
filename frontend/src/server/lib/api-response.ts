import json from '~/shared/i18n/locales/ja.json';
import type {IApiResponse, IPagination, IValidationError} from '~/shared/types';

// Create a successful response
export function createSuccessResponse<TData>(
  data: TData,
  options?: {
    code?: number;
    message?: string;
    requestId?: string;
    pagination?: IPagination;
  },
): IApiResponse<TData> {
  return {
    success: true,
    status: {
      code: options?.code ?? 200,
      message: options?.message ?? 'Success',
    },
    requestId: options?.requestId ?? generateRequestId(),
    timestamp: generateTimestamp(),
    data,
    pagination: options?.pagination,
  };
}

// Create an error response
export function createErrorResponse(
  error: {
    code: string;
    message: string;
    details?: unknown;
    statusCode?: number;
    errors?: IValidationError[];
  },
  requestId?: string,
): IApiResponse {
  return {
    success: false,
    status: {
      code: error.statusCode ?? 400,
      message: 'Error',
    },
    requestId: requestId ?? generateRequestId(),
    timestamp: new Date().toISOString(),
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
      errors: error.errors,
    },
  };
}

// Generate a unique request ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function generateTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Error handling utilities
 */
export function getErrorMessage(error: IApiResponse): string {
  return error.error?.message || json.error.unknown;
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
  response: IApiResponse<T>,
): response is IApiResponse<T> & {data: T} {
  return response.success === true && response.data !== undefined;
}
