import { AxiosResponse } from "axios";
import api from "./client";
import {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  ApiResponse,
} from "@/types/auth";

// Auth API functions
export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/login",
      data
    );
    return response.data;
  },

  // Register
  register: async (data: RegisterRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/auth/register",
      data
    );
    return response.data;
  },

  // Verify email
  verifyEmail: async (data: VerifyEmailRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/auth/verify-email",
      data
    );
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/auth/request-password-reset",
      { email }
    );
    return response.data;
  },

  // Reset password (now used for forgot password flow)
  resetPasswordWithToken: async (
    data: ForgotPasswordRequest
  ): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/auth/reset-password",
      data
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/auth/reset-password",
      data
    );
    return response.data;
  },

  // OAuth2 verify (Google login)
  oauth2Verify: async (token: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/oauth2/verify",
      { token }
    );
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post("/auth/logout");
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/refresh",
      { refreshToken }
    );
    return response.data;
  },
};
