import { useQuery } from "@tanstack/react-query";
import { nexApi } from "@/lib/api";
import {
  NexGroup,
  NexGroupSummary,
  NexMember,
  NexCategory,
  PaginatedResponse,
} from "@/types/nex";

// Get Active Nex Groups Query
export const useActiveNexGroupsQuery = (
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: ["nex-list", page, size],
    queryFn: () => nexApi.getActiveGroups(page, size),
    staleTime: 30 * 1000,
  });
};

// Get Nex Group Details Query
export const useNexGroupDetailsQuery = (
  nexId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["nex-group", nexId],
    queryFn: () => nexApi.getGroupDetails(nexId),
    enabled: enabled && !!nexId,
    staleTime: 30 * 1000,
  });
};

// Get Nex Group Summary Query
export const useNexGroupSummaryQuery = (
  nexId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["nex-group-summary", nexId],
    queryFn: () => nexApi.getGroupSummary(nexId),
    enabled: enabled && !!nexId,
    staleTime: 30 * 1000,
  });
};

// Get Nex Group Members Query
export const useNexGroupMembersQuery = (
  nexId: string,
  page: number = 0,
  size: number = 50,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["nex-group-members", nexId, page, size],
    queryFn: () => nexApi.getGroupMembers(nexId, page, size),
    enabled: enabled && !!nexId,
    staleTime: 30 * 1000,
  });
};

// Get Nex Group Categories Query
export const useNexGroupCategoriesQuery = (
  nexId: string,
  page: number = 0,
  size: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["nex-group-categories", nexId, page, size],
    queryFn: () => nexApi.getGroupCategories(nexId, page, size),
    enabled: enabled && !!nexId,
    staleTime: 30 * 1000,
  });
};
