"use client";

import { useQuery } from "@tanstack/react-query";
import { settlementApi } from "@/lib/api";
import { NexMember } from "@/types/nex";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ArrowRightLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface BalanceSummaryProps {
  nexId: string;
  members: NexMember[];
  className?: string;
}

export default function BalanceSummary({
  nexId,
  members,
  className,
}: BalanceSummaryProps) {
  // Fetch balance summary
  const {
    data: balanceSummary,
    isLoading: balanceLoading,
    error: balanceError,
  } = useQuery({
    queryKey: ["balance-summary", nexId],
    queryFn: () => settlementApi.getBalanceSummary(nexId),
    enabled: !!nexId,
  });

  // Fetch settlement summary
  const { data: settlementSummary, isLoading: settlementLoading } = useQuery({
    queryKey: ["settlement-summary", nexId],
    queryFn: () => settlementApi.getSettlementSummary(nexId),
    enabled: !!nexId,
  });

  const getMemberName = (userId: string) => {
    return members.find((m) => m.userId === userId)?.userName || "Unknown";
  };

  const getMemberInitials = (userId: string) => {
    const name = getMemberName(userId);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isLoading = balanceLoading || settlementLoading;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (balanceError) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Unable to load balances</p>
            <p className="text-sm">
              There was an error loading the balance information
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const memberBalances = balanceSummary?.memberBalances || [];
  const totalExpenses = balanceSummary?.totalExpenses || 0;
  const settlements = balanceSummary?.settlements || [];

  // Calculate who owes whom
  const debtors = memberBalances.filter((member) => member.netBalance < 0);
  const creditors = memberBalances.filter((member) => member.netBalance > 0);
  const balanced = memberBalances.filter(
    (member) => Math.abs(member.netBalance) < 0.01
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  ${totalExpenses.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Total Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {settlementSummary?.outstanding || 0}
                </p>
                <p className="text-xs text-gray-500">Outstanding Debts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{memberBalances.length}</p>
                <p className="text-xs text-gray-500">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Member Balances
          </CardTitle>
          <CardDescription>
            Current balance status for all members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {memberBalances.length > 0 ? (
            <div className="space-y-4">
              {/* Members who are owed money */}
              {creditors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-3">
                    Should Receive Money
                  </h4>
                  <div className="space-y-2">
                    {creditors.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-green-100">
                              {getMemberInitials(member.userId)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.userName}</p>
                            <p className="text-xs text-gray-600">
                              Paid ${member.totalPaid.toFixed(2)} • Owes $
                              {member.totalOwed.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          +${member.netBalance.toFixed(2)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Separator */}
              {creditors.length > 0 && debtors.length > 0 && (
                <Separator className="my-4" />
              )}

              {/* Members who owe money */}
              {debtors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-3">
                    Should Pay Money
                  </h4>
                  <div className="space-y-2">
                    {debtors.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-red-100">
                              {getMemberInitials(member.userId)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.userName}</p>
                            <p className="text-xs text-gray-600">
                              Paid ${member.totalPaid.toFixed(2)} • Owes $
                              {member.totalOwed.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          ${Math.abs(member.netBalance).toFixed(2)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Separator */}
              {(creditors.length > 0 || debtors.length > 0) &&
                balanced.length > 0 && <Separator className="my-4" />}

              {/* Members who are balanced */}
              {balanced.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    All Settled Up
                  </h4>
                  <div className="space-y-2">
                    {balanced.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getMemberInitials(member.userId)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.userName}</p>
                            <p className="text-xs text-gray-600">
                              Paid ${member.totalPaid.toFixed(2)} • Owes $
                              {member.totalOwed.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Settled</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No balance data</p>
              <p className="text-sm">
                Add some expenses to see member balances
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Settlement Suggestions */}
      {debtors.length > 0 && creditors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Settlement Suggestions
            </CardTitle>
            <CardDescription>
              Suggested payments to settle all balances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {debtors.slice(0, 3).map((debtor) => {
                const creditor = creditors[0]; // Simplified: suggest paying the first creditor
                if (!creditor) return null;

                const amount = Math.min(
                  Math.abs(debtor.netBalance),
                  creditor.netBalance
                );

                return (
                  <div
                    key={`${debtor.userId}-${creditor.userId}`}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getMemberInitials(debtor.userId)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {debtor.userName}
                        </span>
                      </div>
                      <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getMemberInitials(creditor.userId)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {creditor.userName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">${amount.toFixed(2)}</Badge>
                      <Button size="sm" variant="outline">
                        Settle
                      </Button>
                    </div>
                  </div>
                );
              })}

              {debtors.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{debtors.length - 3} more settlement
                  {debtors.length - 3 !== 1 ? "s" : ""} suggested
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
