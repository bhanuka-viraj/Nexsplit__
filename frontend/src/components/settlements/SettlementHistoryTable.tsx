"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { settlementApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  History,
  AlertCircle,
  User,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { SettlementHistoryItem } from "@/types/expense";

interface SettlementHistoryTableProps {
  nexId: string;
}

export default function SettlementHistoryTable({
  nexId,
}: SettlementHistoryTableProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const {
    data: history,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["settlement-history", nexId, page],
    queryFn: () =>
      settlementApi.getSettlementHistory(
        nexId,
        page,
        pageSize,
        "settled_at",
        "DESC"
      ),
    enabled: !!nexId,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return currency === "LKR"
      ? `Rs.${amount.toFixed(2)}`
      : `$${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Settlement History
          </CardTitle>
          <CardDescription>Recent settlement transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !history) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Settlement History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load settlement history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    content: settlements,
    totalPages,
    number: currentPage,
    totalElements,
  } = history;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Settlement History
        </CardTitle>
        <CardDescription>
          {totalElements} settlement{totalElements !== 1 ? "s" : ""} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        {settlements.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No settlements yet</p>
            <p className="text-sm">
              Settlement history will appear here once transactions are
              completed
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Expense</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Settled</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map((settlement: SettlementHistoryItem) => (
                    <TableRow key={settlement.debtId}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(settlement.debtorName)}
                              </AvatarFallback>
                            </Avatar>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(settlement.creditorName)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {settlement.debtorName} →{" "}
                              {settlement.creditorName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {settlement.debtorEmail}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[150px]">
                            {settlement.expenseTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(
                              settlement.expenseAmount,
                              settlement.expenseCurrency
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {formatCurrency(
                            settlement.amount,
                            settlement.expenseCurrency
                          )}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {settlement.paymentMethod || "Not specified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {format(
                              new Date(settlement.settledAt),
                              "MMM dd, yyyy"
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(settlement.settledAt), "HH:mm")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {settlement.settlementHours.toFixed(1)}h
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
