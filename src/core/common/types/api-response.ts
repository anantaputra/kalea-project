export type ApiResponse<T = unknown> = {
  success: true;
  data: T | null;
  message?: string | null;
  meta?: Record<string, unknown> | null;
  path?: string;
  timestamp?: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
  statusCode?: number;
  path?: string;
  timestamp?: string;
};

export type AnyApiResponse<T = unknown> = ApiResponse<T> | ApiErrorResponse;
