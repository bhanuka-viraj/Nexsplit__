"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi, userApi } from "@/lib/api";
import { tokenManager, userManager } from "@/lib/auth";
import { UserProfileDto, LoginRequest, RegisterRequest } from "@/types/auth";
import { toast } from "sonner";

export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Initialize auth state
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const isAuthenticated = tokenManager.isAuthenticated();
  const currentUser = userManager.getUser();

  // Get user profile query
  const {
    data: user,
    isLoading: isLoadingProfile,
    error,
  } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: userApi.getProfile,
    enabled: isAuthenticated && isInitialized,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Cache user data when it's fetched successfully
  useEffect(() => {
    if (user) {
      userManager.setUser(user);
    }
  }, [user]);

  // Handle authentication errors
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401) {
      console.error("Authentication failed, clearing tokens");
      tokenManager.clearTokens();
      userManager.clearUser();
      queryClient.removeQueries({ queryKey: ["user"] });
    }
  }, [error, queryClient]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      userManager.setUser(data.user);
      queryClient.setQueryData(["user", "profile"], data.user);
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      router.push("/auth/success?type=register");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      tokenManager.clearTokens();
      userManager.clearUser();
      queryClient.removeQueries({ queryKey: ["user"] });
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: () => {
      // Even if the API call fails, clear local storage
      tokenManager.clearTokens();
      userManager.clearUser();
      queryClient.removeQueries({ queryKey: ["user"] });
      router.push("/auth/login");
    },
  });

  const login = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  const register = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: user || currentUser,
    isAuthenticated: isAuthenticated && isInitialized,
    isLoading: isLoadingProfile || !isInitialized,
    login,
    register,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
