"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { nexApi } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Plus, UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import InviteMemberDialog from "@/components/expenses/InviteMemberDialog";
import MembersList from "@/components/expenses/MembersList";
import AddExpenseDialog from "@/components/expenses/AddExpenseDialog";
import EditExpenseDialog from "@/components/expenses/EditExpenseDialog";
import ExpensesList from "@/components/expenses/ExpensesList";
import CategoryManagement from "@/components/expenses/CategoryManagement";
import SettlementsSection from "@/components/settlements/SettlementsSection";
import { Expense } from "@/types/expense";

export default function NexDetailPage() {
  const params = useParams();
  const router = useRouter();
  const nexId = params.nexId as string;
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [showEditExpenseDialog, setShowEditExpenseDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Fetch nex details
  const {
    data: nex,
    isLoading: nexLoading,
    refetch: refetchNex,
  } = useQuery({
    queryKey: ["nex-detail", nexId],
    queryFn: () => nexApi.getGroupDetails(nexId),
    enabled: !!nexId,
  });

  // Fetch nex summary
  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["nex-summary", nexId],
    queryFn: () => nexApi.getGroupSummary(nexId),
    enabled: !!nexId,
  });

  // Fetch nex members
  const {
    data: membersData,
    isLoading: membersLoading,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ["nex-members", nexId],
    queryFn: () => nexApi.getGroupMembers(nexId, 0, 50),
    enabled: !!nexId,
  });

  const handleRefresh = () => {
    refetchNex();
    refetchSummary();
    refetchMembers();
  };

  const handleInviteSuccess = () => {
    refetchMembers();
    refetchNex();
  };

  const handleExpenseSuccess = () => {
    refetchNex();
    refetchSummary();
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowEditExpenseDialog(true);
  };

  const isLoading = nexLoading || summaryLoading || membersLoading;
  const members = membersData?.content || [];
  const isPersonalNex = nex?.nexType !== "GROUP";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!nex) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">Nex not found</p>
          <p className="text-sm text-gray-600 mb-4">
            The nex you're looking for doesn't exist or you don't have access to
            it.
          </p>
          <Button onClick={() => router.push("/expenses")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expenses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/expenses")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Expenses</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{nex.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{nex.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{nex.settlementType}</Badge>
              <Badge variant={isPersonalNex ? "secondary" : "default"}>
                {isPersonalNex ? "Personal" : "Group"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="expenses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="settlements">Settlements</TabsTrigger>
              <TabsTrigger value="members">
                Members ({members.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Expense Management</h3>
                  <p className="text-sm text-gray-600">
                    Track and manage all expenses for this nex
                  </p>
                </div>
                <Button onClick={() => setShowAddExpenseDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              <ExpensesList
                nexId={nexId}
                members={members}
                onExpenseUpdate={handleExpenseSuccess}
                onEditExpense={handleEditExpense}
              />

              <CategoryManagement nexId={nexId} />
            </TabsContent>

            <TabsContent value="settlements" className="space-y-6">
              <SettlementsSection nexId={nexId} members={members} />
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Nex Members</h3>
                  <p className="text-sm text-gray-600">
                    Manage who has access to this nex
                  </p>
                </div>
                {!isPersonalNex && (
                  <Button size="sm" onClick={() => setShowInviteDialog(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                )}
              </div>

              <MembersList
                members={members}
                groupId={nexId}
                onUpdate={handleRefresh}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Invite Member Dialog */}
      {!isPersonalNex && (
        <InviteMemberDialog
          open={showInviteDialog}
          onOpenChange={setShowInviteDialog}
          groupId={nexId}
          onSuccess={handleInviteSuccess}
        />
      )}

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={showAddExpenseDialog}
        onOpenChange={setShowAddExpenseDialog}
        nexId={nexId}
        members={members}
        onSuccess={handleExpenseSuccess}
      />

      {/* Edit Expense Dialog */}
      <EditExpenseDialog
        open={showEditExpenseDialog}
        onOpenChange={setShowEditExpenseDialog}
        expense={selectedExpense}
        members={members}
        onSuccess={handleExpenseSuccess}
      />
    </DashboardLayout>
  );
}
