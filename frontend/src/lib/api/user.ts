import { AxiosResponse } from "axios";
import api from "./client";
import {
  UserProfileDto,
  ApiResponse,
  UpdateUserDto,
  ChangePasswordDto,
  PasswordValidationRequest,
  PasswordValidationResponse,
  UserSearchDto,
  InvitationDto,
  SettlementSummary,
  SettlementHistoryView,
  SettlementAnalytics,
} from "@/types/auth";
import { PaginatedResponse, NexApiResponse } from "@/types/nex";

// User API functions
export const userApi = {
  // Get user profile
  getProfile: async (): Promise<UserProfileDto> => {
    const response: AxiosResponse<ApiResponse<UserProfileDto>> = await api.get(
      "/users/profile"
    );
    return response.data.data!;
  },

  // Update user profile
  updateProfile: async (data: UpdateUserDto): Promise<UserProfileDto> => {
    const response: AxiosResponse<UserProfileDto> = await api.put(
      "/users/profile",
      data
    );
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordDto): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/users/change-password",
      data
    );
    return response.data;
  },

  // Validate username
  validateUsername: async (username: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(
      `/users/validate/username?username=${username}`
    );
    return response.data;
  },

  // Validate email
  validateEmail: async (email: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(
      `/users/validate/email?email=${email}`
    );
    return response.data;
  },

  // Deactivate user account
  deactivateAccount: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(
      "/users/deactivate"
    );
    return response.data;
  },

  // Validate password
  validatePassword: async (
    data: PasswordValidationRequest
  ): Promise<PasswordValidationResponse> => {
    const response: AxiosResponse<PasswordValidationResponse> = await api.post(
      "/users/validate/password",
      data
    );
    return response.data;
  },

  // Search users by query
  searchUsers: async (
    query: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<UserSearchDto>> => {
    const response: AxiosResponse<
      NexApiResponse<PaginatedResponse<UserSearchDto>>
    > = await api.get(
      `/users/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
    );
    return response.data.data!;
  },

  // Search users by email
  searchUsersByEmail: async (email: string): Promise<UserSearchDto[]> => {
    const response: AxiosResponse<NexApiResponse<UserSearchDto[]>> =
      await api.get(`/users/search/email?email=${encodeURIComponent(email)}`);
    return response.data.data!;
  },

  // Get pending invitations
  getPendingInvitations: async (
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<InvitationDto>> => {
    const response: AxiosResponse<
      NexApiResponse<PaginatedResponse<InvitationDto>>
    > = await api.get(`/user/invitations/pending?page=${page}&size=${size}`);
    return response.data.data!;
  },

  // Respond to invitation
  respondToInvitation: async (
    nexId: string,
    accept: boolean
  ): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      `/user/invitations/${nexId}/respond?accept=${accept}`
    );
    return response.data;
  },

  // Get user settlement summary
  getSettlementSummary: async (userId: string): Promise<SettlementSummary> => {
    const response: AxiosResponse<NexApiResponse<SettlementSummary>> =
      await api.get(`/users/${userId}/settlements/summary`);
    return response.data.data!;
  },

  // Get user settlement history
  getSettlementHistory: async (
    userId: string,
    page: number = 0,
    size: number = 10,
    sortBy?: string,
    sortDirection?: string
  ): Promise<PaginatedResponse<SettlementHistoryView>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDirection) params.append("sortDirection", sortDirection);

    const response: AxiosResponse<
      NexApiResponse<PaginatedResponse<SettlementHistoryView>>
    > = await api.get(
      `/users/${userId}/settlements/history?${params.toString()}`
    );
    return response.data.data!;
  },

  // Get user settlement analytics
  getSettlementAnalytics: async (
    userId: string
  ): Promise<SettlementAnalytics> => {
    const response: AxiosResponse<NexApiResponse<SettlementAnalytics>> =
      await api.get(`/users/${userId}/settlements/analytics`);
    return response.data.data!;
  },
};
