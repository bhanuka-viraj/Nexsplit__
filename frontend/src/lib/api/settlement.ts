import {
  ExecuteSettlementRequest,
  ExecuteSettlementResponse,
  SettlementSummary,
  SettlementHistoryItem,
  AvailableSettlements,
  SettlementAnalytics,
} from "@/types/expense";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import apiClient from "./client";

export const settlementApi = {
  // Execute settlements
  executeSettlements: async (
    nexId: string,
    request: ExecuteSettlementRequest
  ): Promise<ExecuteSettlementResponse> => {
    const response = await apiClient.post<
      ApiResponse<ExecuteSettlementResponse>
    >(`/nex/${nexId}/settlements/execute`, request);
    return response.data.data;
  },

  // Get settlement summary
  getSettlementSummary: async (nexId: string): Promise<SettlementSummary> => {
    const response = await apiClient.get<ApiResponse<SettlementSummary>>(
      `/nex/${nexId}/settlements/summary`
    );
    return response.data.data;
  },

  // Get settlement history
  getSettlementHistory: async (
    nexId: string,
    page: number = 0,
    size: number = 20,
    sortBy: string = "settledAt",
    sortDirection: "ASC" | "DESC" = "DESC"
  ): Promise<PaginatedResponse<SettlementHistoryItem>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<SettlementHistoryItem>>
    >(
      `/nex/${nexId}/settlements/history?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.data.data;
  },

  // Get available settlements
  getAvailableSettlements: async (
    nexId: string,
    settlementType: "SIMPLIFIED" | "DETAILED" = "SIMPLIFIED"
  ): Promise<AvailableSettlements> => {
    const response = await apiClient.get<ApiResponse<AvailableSettlements>>(
      `/nex/${nexId}/settlements/available?settlementType=${settlementType}`
    );
    return response.data.data;
  },

  // Get settlement analytics
  getSettlementAnalytics: async (
    nexId: string
  ): Promise<SettlementAnalytics> => {
    const response = await apiClient.get<ApiResponse<SettlementAnalytics>>(
      `/nex/${nexId}/settlements/analytics`
    );
    return response.data.data;
  },
};
