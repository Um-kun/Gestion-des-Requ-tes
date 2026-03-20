/**
 * Application Error Response Model
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path?: string;
  details?: Record<string, any>;
}

/**
 * Validation Error Details
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * API Error Response Format
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ValidationError[] | Record<string, any>;
  };
  timestamp: string;
}

/**
 * Error Codes Enum
 */
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
