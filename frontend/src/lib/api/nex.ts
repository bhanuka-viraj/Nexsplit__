import { AxiosResponse } from "axios";
import api from "./client";
import {
  NexGroup,
  CreateNexGroupRequest,
  UpdateNexGroupRequest,
  NexGroupSummary,
  NexMember,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
  NexCategory,
  PaginatedResponse,
  NexApiResponse,
} from "@/types/nex";

// Nex (Expense Groups) API functions
export const nexApi = {
  // List user's active expense groups
  getActiveGroups: async (
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<NexGroup>> => {
    const response: AxiosResponse<NexApiResponse<PaginatedResponse<NexGroup>>> =
      await api.get(`/nex?page=${page}&size=${size}`);
    return response.data.data!;
  },

  // Create expense group
  createGroup: async (data: CreateNexGroupRequest): Promise<NexGroup> => {
    const response: AxiosResponse<NexApiResponse<NexGroup>> = await api.post(
      "/nex",
      data
    );
    return response.data.data!;
  },

  // Get expense group details
  getGroupDetails: async (nexId: string): Promise<NexGroup> => {
    const response: AxiosResponse<NexApiResponse<NexGroup>> = await api.get(
      `/nex/${nexId}`
    );
    return response.data.data!;
  },

  // Update expense group
  updateGroup: async (
    nexId: string,
    data: UpdateNexGroupRequest
  ): Promise<NexGroup> => {
    const response: AxiosResponse<NexApiResponse<NexGroup>> = await api.put(
      `/nex/${nexId}`,
      data
    );
    return response.data.data!;
  },

  // Delete expense group
  deleteGroup: async (nexId: string): Promise<NexApiResponse> => {
    const response: AxiosResponse<NexApiResponse> = await api.delete(
      `/nex/${nexId}`
    );
    return response.data;
  },

  // Get expense group summary
  getGroupSummary: async (nexId: string): Promise<NexGroupSummary> => {
    const response: AxiosResponse<NexApiResponse<NexGroupSummary>> =
      await api.get(`/nex/${nexId}/summary`);
    return response.data.data!;
  },

  // Get expense group categories
  getGroupCategories: async (
    nexId: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<NexCategory>> => {
    const response: AxiosResponse<
      NexApiResponse<PaginatedResponse<NexCategory>>
    > = await api.get(`/nex/${nexId}/categories?page=${page}&size=${size}`);
    return response.data.data!;
  },

  // List nex members
  getGroupMembers: async (
    nexId: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<NexMember>> => {
    const response: AxiosResponse<
      NexApiResponse<{ data: NexMember[]; pagination: any }>
    > = await api.get(`/nex/${nexId}/members?page=${page}&size=${size}`);

    // Transform the response to match our PaginatedResponse interface
    return {
      content: response.data.data!.data,
      page: response.data.data!.pagination.page,
      size: response.data.data!.pagination.size,
      totalPages: response.data.data!.pagination.totalPages,
      totalElements: response.data.data!.pagination.totalElements,
    };
  },

  // Invite member
  inviteMember: async (
    nexId: string,
    data: InviteMemberRequest
  ): Promise<NexApiResponse> => {
    const response: AxiosResponse<NexApiResponse> = await api.post(
      `/nex/${nexId}/members/invite`,
      data
    );
    return response.data;
  },

  // Leave nex
  leaveGroup: async (nexId: string): Promise<NexApiResponse> => {
    const response: AxiosResponse<NexApiResponse> = await api.post(
      `/nex/${nexId}/members/leave`
    );
    return response.data;
  },

  // Remove member
  removeMember: async (
    nexId: string,
    memberId: string
  ): Promise<NexApiResponse> => {
    const response: AxiosResponse<NexApiResponse> = await api.delete(
      `/nex/${nexId}/members/${memberId}`
    );
    return response.data;
  },

  // Update member role
  updateMemberRole: async (
    nexId: string,
    memberId: string,
    data: UpdateMemberRoleRequest
  ): Promise<NexApiResponse> => {
    const response: AxiosResponse<NexApiResponse> = await api.put(
      `/nex/${nexId}/members/${memberId}/role`,
      data
    );
    return response.data;
  },
};
