import { AxiosResponse } from "axios";
import api from "./client";
import {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ExpenseSummary,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Settlement,
  SettlementSummaryData,
  CreateSettlementRequest,
  UpdateSettlementRequest,
  ExpenseFilters,
  NexBalanceSummary,
} from "@/types/expense";
import { PaginatedResponse, NexApiResponse } from "@/types/nex";

// Expense API functions
export const expenseApi = {
  // List expenses
  getExpenses: async (
    page: number = 0,
    size: number = 20,
    filters?: ExpenseFilters
  ): Promise<PaginatedResponse<Expense>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters) {
      if (filters.nexId) params.append("nexId", filters.nexId);
      if (filters.payerId) params.append("payerId", filters.payerId);
      if (filters.userId) params.append("userId", filters.userId);
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
    }

    const response: AxiosResponse<NexApiResponse<PaginatedResponse<Expense>>> =
      await api.get(`/expenses?${params.toString()}`);
    return response.data.data!;
  },

  // Create expense
  createExpense: async (data: CreateExpenseRequest): Promise<Expense> => {
    const response: AxiosResponse<NexApiResponse<Expense>> = await api.post(
      "/expenses",
      data
    );
    return response.data.data!;
  },

  // Get expense by ID
  getExpenseById: async (id: string): Promise<Expense> => {
    const response: AxiosResponse<NexApiResponse<Expense>> = await api.get(
      `/expenses/${id}`
    );
    return response.data.data!;
  },

  // Update expense
  updateExpense: async (
    id: string,
    data: UpdateExpenseRequest
  ): Promise<Expense> => {
    const response: AxiosResponse<NexApiResponse<Expense>> = await api.put(
      `/expenses/${id}`,
      data
    );
    return response.data.data!;
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<NexApiResponse> => {
    const response: AxiosResponse<NexApiResponse> = await api.delete(
      `/expenses/${id}`
    );
    return response.data;
  },

  // Get expense summary
  getExpenseSummary: async (
    filters?: ExpenseFilters
  ): Promise<ExpenseSummary> => {
    const params = new URLSearchParams();
    if (filters?.nexId) params.append("nexId", filters.nexId);
    if (filters?.userId) params.append("userId", filters.userId);

    const response: AxiosResponse<NexApiResponse<ExpenseSummary>> =
      await api.get(`/expenses/summary?${params.toString()}`);
    return response.data.data!;
  },

  // Search expenses
  searchExpenses: async (
    query: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<Expense>> => {
    const response: AxiosResponse<NexApiResponse<PaginatedResponse<Expense>>> =
      await api.get(
        `/expenses/search?query=${encodeURIComponent(
          query
        )}&page=${page}&size=${size}`
      );
    return response.data.data!;
  },

  // Get expenses by category
  getExpensesByCategory: async (categoryId: string): Promise<Expense[]> => {
    const response: AxiosResponse<NexApiResponse<Expense[]>> = await api.get(
      `/expenses/category/${categoryId}`
    );
    return response.data.data!;
  },
};

// Category API functions
export const categoryApi = {
  // List all categories (app-wide)
  getCategories: async (
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<Category>> => {
    const response: AxiosResponse<NexApiResponse<PaginatedResponse<Category>>> =
      await api.get(`/categories?page=${page}&size=${size}`);
    return response.data.data!;
  },

  // Get default categories (system-provided)
  getDefaultCategories: async (
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<Category>> => {
    const response: AxiosResponse<
      NexApiResponse<{ data: Category[]; pagination: any }>
    > = await api.get(`/categories/default?page=${page}&size=${size}`);

    // Transform the response to match our PaginatedResponse interface
    return {
      content: response.data.data!.data,
      page: response.data.data!.pagination.page,
      size: response.data.data!.pagination.size,
      totalPages: response.data.data!.pagination.totalPages,
      totalElements: response.data.data!.pagination.totalElements,
    };
  },

  // Get nex-specific categories
  getNexCategories: async (
    nexId: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<Category>> => {
    const response: AxiosResponse<NexApiResponse<PaginatedResponse<Category>>> =
      await api.get(`/nex/${nexId}/categories?page=${page}&size=${size}`);
    return response.data.data!;
  },

  // Get combined categories (default + custom + nex-specific)
  getAllCategories: async (
    page: number = 0,
    size: number = 100,
    nexId?: string
  ): Promise<{
    defaultCategories: Category[];
    customCategories: Category[];
    nexCategories: any[] | undefined;
  }> => {
    try {
      const requests = [
        categoryApi.getDefaultCategories(0, 100),
        categoryApi.getCategories(0, 100),
      ];

      // Add nex-specific categories if nexId is provided
      if (nexId) {
        requests.push(categoryApi.getNexCategories(nexId, 0, 100));
      }

      const responses = await Promise.all(requests);


      return {
        defaultCategories: responses[0].content,
        customCategories: responses[1].content,
        nexCategories: nexId && responses[2] ? responses[2].data : [],
      };
    } catch (error) {
      // If one fails, try to get at least default categories
      try {
        const defaultResponse = await categoryApi.getDefaultCategories(0, 100);
        return {
          defaultCategories: defaultResponse.content,
          customCategories: [],
          nexCategories: [],
        };
      } catch {
        return {
          defaultCategories: [],
          customCategories: [],
          nexCategories: [],
        };
      }
    }
  },

  // Create category (requires nexId)
  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response: AxiosResponse<NexApiResponse<Category>> = await api.post(
      "/categories",
      data
    );
    return response.data.data!;
  },

  // Get category by ID
  getCategoryById: async (id: string): Promise<Category> => {
    const response: AxiosResponse<NexApiResponse<Category>> = await api.get(
      `/categories/${id}`
    );
    return response.data.data!;
  },

  // Update category
  updateCategory: async (
    id: string,
    data: UpdateCategoryRequest
  ): Promise<Category> => {
    const response: AxiosResponse<NexApiResponse<Category>> = await api.put(
      `/categories/${id}`,
      data
    );
    return response.data.data!;
  },

  // Delete category
  deleteCategory: async (id: string): Promise<NexApiResponse> => {
    const response: AxiosResponse<NexApiResponse> = await api.delete(
      `/categories/${id}`
    );
    return response.data;
  },
};

// Settlement API functions
export const settlementApi = {
  // Get settlement summary for a nex
  getSettlementSummary: async (
    nexId: string
  ): Promise<SettlementSummaryData> => {
    const response: AxiosResponse<NexApiResponse<SettlementSummaryData>> =
      await api.get(`/nex/${nexId}/settlements/summary`);
    return response.data.data!;
  },

  // List settlements in a nex
  getSettlements: async (
    nexId: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<Settlement>> => {
    const response: AxiosResponse<
      NexApiResponse<PaginatedResponse<Settlement>>
    > = await api.get(`/nex/${nexId}/settlements?page=${page}&size=${size}`);
    return response.data.data!;
  },

  // Create settlement
  createSettlement: async (
    nexId: string,
    data: CreateSettlementRequest
  ): Promise<Settlement> => {
    const response: AxiosResponse<NexApiResponse<Settlement>> = await api.post(
      `/nex/${nexId}/settlements`,
      data
    );
    return response.data.data!;
  },

  // Update settlement status
  updateSettlement: async (
    nexId: string,
    settlementId: string,
    data: UpdateSettlementRequest
  ): Promise<Settlement> => {
    const response: AxiosResponse<NexApiResponse<Settlement>> = await api.put(
      `/nex/${nexId}/settlements/${settlementId}`,
      data
    );
    return response.data.data!;
  },

  // Delete settlement
  deleteSettlement: async (
    nexId: string,
    settlementId: string
  ): Promise<NexApiResponse> => {
    const response: AxiosResponse<NexApiResponse> = await api.delete(
      `/nex/${nexId}/settlements/${settlementId}`
    );
    return response.data;
  },

  // Get balance summary for a nex (calculated from expenses)
  getBalanceSummary: async (nexId: string): Promise<NexBalanceSummary> => {
    const response: AxiosResponse<NexApiResponse<NexBalanceSummary>> =
      await api.get(`/nex/${nexId}/balances`);
    return response.data.data!;
  },
};
