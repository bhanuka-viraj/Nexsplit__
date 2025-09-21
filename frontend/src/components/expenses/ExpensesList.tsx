"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { expenseApi, categoryApi } from "@/lib/api";
import { Expense, ExpenseFilters } from "@/types/expense";
import { NexMember } from "@/types/nex";
import ExpenseCard from "./ExpenseCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  Tag,
  CreditCard,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ExpensesListProps {
  nexId: string;
  members: NexMember[];
  onExpenseUpdate: () => void;
  onEditExpense: (expense: Expense) => void;
}

type SortField = "date" | "amount" | "description";
type SortDirection = "asc" | "desc";

export default function ExpensesList({
  nexId,
  members,
  onExpenseUpdate,
  onEditExpense,
}: ExpensesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ExpenseFilters>({
    nexId,
  });
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch expenses
  const {
    data: expensesData,
    isLoading: expensesLoading,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ["expenses", nexId, page, filters, searchQuery],
    queryFn: () => {
      if (searchQuery.trim()) {
        return expenseApi.searchExpenses(searchQuery, page, 20);
      }
      return expenseApi.getExpenses(page, 20, filters);
    },
    enabled: !!nexId,
  });

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ["all-categories", nexId],
    queryFn: () => categoryApi.getAllCategories(0, 100, nexId),
  });

  const expenses = expensesData?.data || [];
  const defaultCategories = categoriesData?.defaultCategories || [];
  const customCategories = categoriesData?.customCategories || [];
  const nexCategories = categoriesData?.nexCategories || [];
  const allCategories = [
    ...defaultCategories,
    ...customCategories,
    ...nexCategories,
  ];

  const totalPages = expensesData?.totalPages || 0;

  // Sort expenses locally
  const sortedExpenses = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "description":
          comparison = a.description?.localeCompare(b.description || "") || 0;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [expenses, sortField, sortDirection]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters, searchQuery]);

  const handleFilterChange = (
    key: keyof ExpenseFilters,
    value: string | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const clearFilters = () => {
    setFilters({ nexId });
    setSearchQuery("");
  };

  const getActiveFiltersCount = () => {
    return (
      Object.keys(filters).filter(
        (key) => key !== "nexId" && filters[key as keyof ExpenseFilters]
      ).length + (searchQuery ? 1 : 0)
    );
  };

  const getMemberName = (userId: string) => {
    return members.find((m) => m.userId === userId)?.userName || "Unknown";
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return "";
    if (startDate && !endDate)
      return `From ${format(new Date(startDate), "MMM dd")}`;
    if (!startDate && endDate)
      return `Until ${format(new Date(endDate), "MMM dd")}`;
    return `${format(new Date(startDate!), "MMM dd")} - ${format(
      new Date(endDate!),
      "MMM dd"
    )}`;
  };

  if (expensesLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>
                {expenses.length > 0
                  ? `${expenses.length} expense${
                      expenses.length !== 1 ? "s" : ""
                    } found`
                  : "No expenses found"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Sort Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {sortDirection === "asc" ? (
                      <SortAsc className="h-4 w-4 mr-2" />
                    ) : (
                      <SortDesc className="h-4 w-4 mr-2" />
                    )}
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSortChange("date")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Date {sortField === "date" && `(${sortDirection})`}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("amount")}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Amount {sortField === "amount" && `(${sortDirection})`}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("description")}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Description{" "}
                    {sortField === "description" && `(${sortDirection})`}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={
                  getActiveFiltersCount() > 0
                    ? "border-blue-500 text-blue-600"
                    : ""
                }
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search expenses by description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.categoryId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("categoryId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>

                    {nexCategories.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Nex Categories
                        </div>
                        {nexCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    {defaultCategories.length > 0 && (
                      <>
                        {nexCategories.length > 0 && (
                          <div className="border-t my-1" />
                        )}
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Default Categories
                        </div>
                        {defaultCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    {customCategories.length > 0 && (
                      <>
                        {(nexCategories.length > 0 ||
                          defaultCategories.length > 0) && (
                          <div className="border-t my-1" />
                        )}
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Custom Categories
                        </div>
                        {customCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Paid By Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Paid By</label>
                <Select
                  value={filters.payerId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("payerId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Anyone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Anyone</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.userId} value={member.userId}>
                        {member.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                />
              </div>

              {/* End Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <Input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                />
              </div>

              {/* Clear Filters */}
              {getActiveFiltersCount() > 0 && (
                <div className="md:col-span-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchQuery}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              {filters.categoryId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category:{" "}
                  {allCategories.find((c) => c.id === filters.categoryId)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("categoryId", undefined)}
                  />
                </Badge>
              )}
              {filters.payerId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Paid by: {getMemberName(filters.payerId)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("payerId", undefined)}
                  />
                </Badge>
              )}
              {(filters.startDate || filters.endDate) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date: {formatDateRange(filters.startDate, filters.endDate)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      handleFilterChange("startDate", undefined);
                      handleFilterChange("endDate", undefined);
                    }}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Expenses Grid */}
      {sortedExpenses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              members={members}
              onUpdate={() => {
                refetchExpenses();
                onExpenseUpdate();
              }}
              onEdit={onEditExpense}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {getActiveFiltersCount() > 0
                ? "No expenses match your filters"
                : "No expenses yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {getActiveFiltersCount() > 0
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first expense to this nex"}
            </p>
            {getActiveFiltersCount() > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
