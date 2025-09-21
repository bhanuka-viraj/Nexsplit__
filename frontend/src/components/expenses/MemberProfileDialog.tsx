"use client";

import { useState } from "react";
import { NexMember } from "@/types/nex";
import { SettlementSummary, SettlementAnalytics } from "@/types/auth";
import {
  useSettlementSummaryQuery,
  useSettlementAnalyticsQuery,
} from "@/lib/api/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Crown,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  DollarSign,
  BarChart3,
  Clock,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface MemberProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: NexMember | null;
}

export default function MemberProfileDialog({
  open,
  onOpenChange,
  member,
}: MemberProfileDialogProps) {
  // Fetch settlement summary for the member
  const { data: settlementSummary, isLoading: summaryLoading } =
    useSettlementSummaryQuery(member?.userId || "", !!member?.userId && open);

  // Fetch settlement analytics for the member
  const { data: analytics, isLoading: analyticsLoading } =
    useSettlementAnalyticsQuery(member?.userId || "", !!member?.userId && open);

  const getInitials = (member: NexMember) => {
    return (member.firstName[0] + member.lastName[0]).toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Header */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {getInitials(member)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-semibold">{member.userName}</h3>
                <Badge
                  variant={member.role === "ADMIN" ? "default" : "secondary"}
                >
                  {member.role === "ADMIN" ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" />
                      Member
                    </>
                  )}
                </Badge>
                <Badge
                  variant={member.status === "ACTIVE" ? "outline" : "secondary"}
                >
                  {member.status}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {format(new Date(member.joinedAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <DollarSign className="h-4 w-4" />
                    <span>Settlement Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summaryLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : settlementSummary ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(settlementSummary.totalOwed)}
                        </p>
                        <p className="text-sm text-gray-500">Total Owed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(settlementSummary.totalOwes)}
                        </p>
                        <p className="text-sm text-gray-500">Total Owes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(settlementSummary.netBalance)}
                        </p>
                        <p className="text-sm text-gray-500">Net Balance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-600">
                          {formatCurrency(settlementSummary.settledAmount)}
                        </p>
                        <p className="text-sm text-gray-500">Settled</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No settlement data available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Member Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <User className="h-4 w-4" />
                    <span>Member Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">First Name</p>
                      <p className="text-gray-600">{member.firstName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Last Name</p>
                      <p className="text-gray-600">{member.lastName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Username</p>
                      <p className="text-gray-600">{member.userName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <p className="text-gray-600">{member.email}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Joined At</p>
                      <p className="text-gray-600">
                        {format(new Date(member.joinedAt), "PPP")}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Status</p>
                      <Badge variant="outline" className="text-xs">
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <BarChart3 className="h-4 w-4" />
                    <span>Spending Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : analytics ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-700">
                              Monthly Spending
                            </span>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatCurrency(analytics.monthlySpending)}
                          </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-700">
                              Total Group Expenses
                            </span>
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-2xl font-bold text-green-900">
                            {formatCurrency(analytics.totalGroupExpenses)}
                          </p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-purple-700">
                              Average Per Group
                            </span>
                            <BarChart3 className="h-4 w-4 text-purple-600" />
                          </div>
                          <p className="text-2xl font-bold text-purple-900">
                            {formatCurrency(analytics.averageExpensePerGroup)}
                          </p>
                        </div>

                        {analytics.mostActiveGroup && (
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-orange-700">
                                Most Active Group
                              </span>
                              <Crown className="h-4 w-4 text-orange-600" />
                            </div>
                            <p className="text-lg font-bold text-orange-900">
                              {analytics.mostActiveGroup}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No analytics data available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
