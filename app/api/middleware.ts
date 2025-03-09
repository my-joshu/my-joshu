import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from '../../services/logger';

export type ApiHandler = (
  req: NextRequest,
  params?: Record<string, string | string[]>
) => Promise<NextResponse> | NextResponse;

export interface ApiError {
  error: string;
  message: string;
  status: number;
  details?: unknown;
}

/**
 * API middleware that wraps API route handlers with error handling
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, params?: Record<string, string | string[]>) => {
    try {
      // Start timer for request duration
      const startTime = Date.now();

      // Execute the original handler
      const response = await handler(req, params);

      // Log the request if it was successful
      const duration = Date.now() - startTime;
      logger.info({
        method: req.method,
        path: req.nextUrl.pathname,
        status: response.status,
        duration,
      }, 'API request completed');

      return response;
    } catch (error) {
      // Format the error response based on error type
      const apiError = formatError(error);

      // Log the error
      logger.error({
        method: req.method,
        path: req.nextUrl.pathname,
        error: apiError,
      }, 'API request error');

      // Return formatted error response
      return NextResponse.json(
        { error: apiError.error, message: apiError.message, details: apiError.details },
        { status: apiError.status }
      );
    }
  };
}

/**
 * Format different error types into a consistent API error
 */
function formatError(error: unknown): ApiError {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return {
      error: 'validation_error',
      message: 'Invalid request data',
      status: 400,
      details: error.format(),
    };
  }

  // Handle known errors (thrown as objects with status)
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    typeof error.status === 'number' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return {
      error: (error as any).code || 'api_error',
      message: (error as any).message,
      status: (error as any).status,
      details: (error as any).details,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      error: 'server_error',
      message: error.message || 'An unexpected error occurred',
      status: 500,
      details: error.stack,
    };
  }

  // Handle unknown errors
  return {
    error: 'unknown_error',
    message: 'An unexpected error occurred',
    status: 500,
    details: String(error),
  };
}

/**
 * Create a custom API error
 */
export function createApiError(
  code: string,
  message: string,
  status: number = 500,
  details?: unknown
): never {
  throw {
    code,
    message,
    status,
    details,
  };
}
