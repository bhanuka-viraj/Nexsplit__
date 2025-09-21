// Nex (Expense Groups) API Types

export interface NexGroup {
  id: string;
  name: string;
  description: string;
  creatorName?: string;
  createdBy?: string;
  memberCount: number;
  expenseCount: number;
  totalExpenseAmount: number;
  nexType: "GROUP" | "PERSONAL";
  settlementType: "SIMPLIFIED" | "DETAILED";
  isArchived?: boolean;
}

export interface CreateNexGroupRequest {
  name: string;
  description: string;
  settlementType: "SIMPLIFIED" | "DETAILED";
  nexType: "GROUP" | "PERSONAL";
}

export interface UpdateNexGroupRequest {
  name?: string;
  description?: string;
  settlementType?: "SIMPLIFIED" | "DETAILED";
  isArchived?: boolean;
}

export interface NexGroupSummary {
  nexId: string;
  totalExpenses: number;
  totalMembers: number;
  outstandingDebts: number;
}

export interface NexMember {
  nexId: string;
  userId: string;
  userName: string;
  userEmail: string;
  nexName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  status: "ACTIVE" | "INACTIVE";
  invitedAt: string | null;
  joinedAt: string;
  createdAt: string;
  modifiedAt: string;
}

export interface InviteMemberRequest {
  email: string;
  role: "ADMIN" | "MEMBER";
}

export interface UpdateMemberRoleRequest {
  role: "ADMIN" | "MEMBER";
}

export interface NexCategory {
  id: string;
  name: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  data?: T[]; // Alternative key for compatibility
  page: number;
  size: number;
  totalPages: number;
  totalElements?: number;
}

export interface NexApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
