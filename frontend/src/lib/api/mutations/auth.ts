import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

// Login Mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      toast.success("Login successful!");
      // Store tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      // Invalidate user profile to refetch
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });
};

// Register Mutation
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      toast.success("Registration successful! Please verify your email.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    },
  });
};

// Verify Email Mutation
export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authApi.verifyEmail(data),
    onSuccess: () => {
      toast.success("Email verified successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Email verification failed";
      toast.error(message);
    },
  });
};

// Request Password Reset Mutation
export const useRequestPasswordResetMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordReset(email),
    onSuccess: () => {
      toast.success("Password reset email sent!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to send password reset email";
      toast.error(message);
    },
  });
};

// Reset Password with Token Mutation (for forgot password flow)
export const useResetPasswordWithTokenMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authApi.resetPasswordWithToken(data),
    onSuccess: () => {
      toast.success("Password reset successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
    },
  });
};

// Reset Password Mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
    },
  });
};

// OAuth2 Verify Mutation (Google login)
export const useOAuth2VerifyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authApi.oauth2Verify(token),
    onSuccess: (response) => {
      toast.success("Login successful!");
      // Store tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      // Invalidate user profile to refetch
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "OAuth login failed";
      toast.error(message);
    },
  });
};

// Logout Mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success("Logged out successfully!");
      // Clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Clear all queries
      queryClient.clear();
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
      const message = error.response?.data?.message || "Logout completed";
      toast.success(message);
    },
  });
};

// Refresh Token Mutation
export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: (response) => {
      // Update tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
    },
    onError: () => {
      // If refresh fails, clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  });
};
