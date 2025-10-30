import type { ApiResponse } from '../../core/common/types/api-response';

export function ok<T>(data: T, message: string | null = null): ApiResponse<T> {
  return { success: true, data: (data as T) ?? null, message };
}

export function created<T>(
  data: T,
  message: string | null = null,
): ApiResponse<T> {
  return { success: true, data: (data as T) ?? null, message };
}

export function updated<T>(
  data: T,
  message: string | null = null,
): ApiResponse<T> {
  return { success: true, data: (data as T) ?? null, message };
}

export function deleted(
  message: string | null = null,
): ApiResponse<{ deleted: true }> {
  return { success: true, data: { deleted: true }, message };
}
