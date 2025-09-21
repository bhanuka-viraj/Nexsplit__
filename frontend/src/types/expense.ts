// Expense API Types

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  categoryId?: string;
  categoryName?: string;
  description?: string;
  nexId: string;
  nexName?: string;
  createdBy: string;
  createdByName?: string;
  payerId: string;
  payerName?: string;
  splitType: "EQUALLY" | "AMOUNT" | "PERCENTAGE";
  isInitialPayerHas: boolean;
  expenseDate: string;
  createdAt: string;
  modifiedAt?: string;
  splits: ExpenseSplitResponse[];
  debts?: ExpenseDebt[];
  // Legacy fields for backward compatibility
  paidBy?: string;
  paidByName?: string;
  participants?: ExpenseParticipant[];
  updatedAt?: string;
}

export interface ExpenseParticipant {
  userId: string;
  userName?: string;
  userEmail?: string;
  shareAmount: number;
  shareType: "EQUALLY" | "AMOUNT" | "PERCENTAGE";
  shareValue: number; // For percentage or custom amount
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  currency: string;
  categoryId: string;
  description?: string;
  nexId: string;
  payerId: string;
  splitType: "EQUALLY" | "AMOUNT" | "PERCENTAGE";
  isInitialPayerHas: boolean;
  expenseDate?: string; // ISO date string
  splits: ExpenseSplit[];
}

export interface ExpenseSplit {
  userId: string;
  percentage?: number; // for PERCENTAGE split type
  amount?: number; // for AMOUNT split type
  notes?: string;
}

// New API response interfaces
export interface ExpenseSplitResponse {
  userId: string;
  userName: string;
  percentage: number;
  amount: number;
  createdAt: string;
  modifiedAt: string;
}

export interface ExpenseDebt {
  id: string;
  debtorId: string;
  debtorName?: string;
  creditorId: string;
  creditorName?: string;
  amount: number;
  paymentMethod?: string;
  settledAt?: string;
  createdAt: string;
  modifiedAt: string;
}

export interface UpdateExpenseRequest {
  title?: string;
  amount?: number;
  currency?: string;
  categoryId?: string;
  description?: string;
  splitType?: "EQUALLY" | "AMOUNT" | "PERCENTAGE";
  isInitialPayerHas?: boolean;
  expenseDate?: string;
  splits?: ExpenseSplit[];
}

export interface ExpenseSummary {
  totalExpenses: number;
  totalCount: number;
}

// Category types (extending from nex.ts)
export interface Category {
  id: string;
  name: string;
  createdBy?: string;
  nexId?: string | null;
  isDefault?: boolean;
  createdAt?: string;
  modifiedAt?: string;
  creatorName?: string;
  creatorUsername?: string | null;
  nexName?: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  nexId: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

// Settlement types for integration
export interface Settlement {
  id: string;
  fromUser: string;
  fromUserName?: string;
  toUser: string;
  toUserName?: string;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SettlementSummaryData {
  nexId: string;
  totalOwed: number;
  totalPaid: number;
  outstanding: number;
  memberCount: number;
}

export interface CreateSettlementRequest {
  fromUserId: string;
  toUserId: string;
  amount: number;
  note?: string;
}

export interface UpdateSettlementRequest {
  status: "PENDING" | "PAID" | "CANCELLED";
}

// Expense filters and search
export interface ExpenseFilters {
  nexId?: string;
  payerId?: string;
  userId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

// Balance calculation types
export interface MemberBalance {
  userId: string;
  userName: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number; // positive means they are owed money, negative means they owe money
}

export interface NexBalanceSummary {
  nexId: string;
  totalExpenses: number;
  memberBalances: MemberBalance[];
  settlements: Settlement[];
}

// Settlement API Types
export interface SettlementItem {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  settlementType: "SIMPLIFIED" | "DETAILED";
  status: "PENDING" | "EXECUTED" | "CANCELLED";
  relatedDebtIds: string[];
  expenseId?: string;
  expenseTitle?: string;
  nexId: string;
  createdAt: string;
  executedAt?: string;
}

export interface ExecuteSettlementRequest {
  settlementType: string;
  settlementIds: string[];
  paymentMethod: string;
  notes: string;
  settlementDate: string;
  settleAll: boolean;
}

export interface ExecuteSettlementResponse {
  executedSettlements: SettlementItem[];
  remainingSettlements: SettlementItem[];
  totalSettledAmount: number;
  settledCount: number;
  remainingCount: number;
  nexId: string;
  executionDate: string;
}

export interface SettlementSummary {
  nexId: string;
  userId: string;
  totalDebts: number;
  settledDebts: number;
  unsettledDebts: number;
  totalAmount: number;
  settledAmount: number;
  unsettledAmount: number;
  lastSettlementDate?: string;
}

export interface SettlementHistoryItem {
  debtId: string;
  debtorId: string;
  debtorName: string;
  debtorEmail: string;
  creditorId: string;
  creditorName: string;
  creditorEmail: string;
  creditorType: string;
  amount: number;
  expenseId: string;
  expenseTitle: string;
  expenseAmount: number;
  expenseCurrency: string;
  nexId: string;
  nexName: string;
  paymentMethod: string;
  debtNotes: string;
  settledAt: string;
  debtCreatedAt: string;
  debtModifiedAt: string;
  isSettled: boolean;
  settlementHours: number;
}

export interface AvailableSettlements {
  availableSettlements: SettlementItem[];
  settlementType: string;
  nexId: string;
  totalAvailable: number;
  totalAmount: number;
}

export interface SettlementAnalytics {
  totalSettlements: number;
  settledCount: number;
  unsettledCount: number;
  totalSettledAmount: number;
  totalUnsettledAmount: number;
  averageSettlementTimeHours: number;
  nexId: string;
  userId: string;
}
