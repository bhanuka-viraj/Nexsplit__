import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import {
  UserSearchDto,
  SettlementSummary,
  SettlementAnalytics,
  InvitationDto,
  PasswordValidationRequest,
} from "@/types/auth";
import { PaginatedResponse } from "@/types/nex";

// Search Users Query
export const useSearchUsersQuery = (
  searchQuery: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["user-search", searchQuery],
    queryFn: () => userApi.searchUsers(searchQuery),
    enabled: enabled && searchQuery.length >= 2,
    staleTime: 30 * 1000,
  });
};

// Get Settlement Summary Query
export const useSettlementSummaryQuery = (
  userId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["settlement-summary", userId],
    queryFn: () => userApi.getSettlementSummary(userId),
    enabled: enabled && !!userId,
    staleTime: 30 * 1000,
  });
};

// Get Settlement Analytics Query
export const useSettlementAnalyticsQuery = (
  userId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["settlement-analytics", userId],
    queryFn: () => userApi.getSettlementAnalytics(userId),
    enabled: enabled && !!userId,
    staleTime: 30 * 1000,
  });
};

// Get Pending Invitations Query
export const usePendingInvitationsQuery = (
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: ["pending-invitations", page, size],
    queryFn: () => userApi.getPendingInvitations(page, size),
    staleTime: 30 * 1000,
  });
};

// Get User Profile Query
export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Validate Username Query
export const useValidateUsernameQuery = (
  username: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["validate-username", username],
    queryFn: () => userApi.validateUsername(username),
    enabled: enabled && !!username && username.length >= 3,
    staleTime: 30 * 1000,
  });
};

// Validate Email Query
export const useValidateEmailQuery = (
  email: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["validate-email", email],
    queryFn: () => userApi.validateEmail(email),
    enabled: enabled && !!email && email.includes("@"),
    staleTime: 30 * 1000,
  });
};

// Validate Password Query
export const useValidatePasswordQuery = (
  data: PasswordValidationRequest,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["validate-password", data.password],
    queryFn: () => userApi.validatePassword(data),
    enabled: enabled && !!data.password,
    staleTime: 10 * 1000, // Shorter cache for password validation
  });
};

// Get Settlement History Query
export const useSettlementHistoryQuery = (
  userId: string,
  page: number = 0,
  size: number = 10,
  sortBy?: string,
  sortDirection?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["settlement-history", userId, page, size, sortBy, sortDirection],
    queryFn: () =>
      userApi.getSettlementHistory(userId, page, size, sortBy, sortDirection),
    enabled: enabled && !!userId,
    staleTime: 30 * 1000,
  });
};

// Search Users by Email Query
export const useSearchUsersByEmailQuery = (
  email: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["user-search-email", email],
    queryFn: () => userApi.searchUsersByEmail(email),
    enabled: enabled && !!email && email.includes("@"),
    staleTime: 30 * 1000,
  });
};
