"use client";

import { useQuery } from "@tanstack/react-query";
import { settlementApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface SettlementSummaryCardProps {
  nexId: string;
}

export default function SettlementSummaryCard({
  nexId,
}: SettlementSummaryCardProps) {
  const {
    data: summary,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["settlement-summary", nexId],
    queryFn: () => settlementApi.getSettlementSummary(nexId),
    enabled: !!nexId,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["settlement-analytics", nexId],
    queryFn: () => settlementApi.getSettlementAnalytics(nexId),
    enabled: !!nexId,
  });

  if (isLoading || analyticsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !summary || !analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load settlement summary</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Unsettled */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.unsettledAmount)}
              </p>
              <p className="text-xs text-gray-500">
                Unsettled ({summary.unsettledDebts} debts)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Settled */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.settledAmount)}
              </p>
              <p className="text-xs text-gray-500">
                Settled ({summary.settledDebts} debts)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Amount */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">
                {formatCurrency(summary.totalAmount)}
              </p>
              <p className="text-xs text-gray-500">
                Total ({summary.totalDebts} debts)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Settlement Time */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">
                {analytics.averageSettlementTimeHours.toFixed(1)}h
              </p>
              <p className="text-xs text-gray-500">Avg. settlement time</p>
              {summary.lastSettlementDate && (
                <p className="text-xs text-gray-400 mt-1">
                  Last: {format(new Date(summary.lastSettlementDate), "MMM dd")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
