/**
 * User Role Types
 */
export type UserRole = 'student' | 'admin' | 'superadmin';

/**
 * User Domain Model
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

/**
 * User DTO for API responses
 */
export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

/**
 * Login Credentials DTO
 */
export interface LoginDTO {
  matricule: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register Credentials DTO
 */
export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  password: string;
  confirmPassword: string;
}

/**
 * Auth Response DTO
 */
export interface AuthResponseDTO {
  success: boolean;
  message: string;
  data?: {
    user: UserDTO;
    token: string;
    refreshToken?: string;
  };
  error?: {
    code: string;
    details?: Record<string, string>;
  };
}
