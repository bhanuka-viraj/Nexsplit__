"use client";

import { useState } from "react";
import {
  useNexGroupDetailsQuery,
  useNexGroupSummaryQuery,
  useNexGroupMembersQuery,
} from "@/lib/api/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  CreditCard,
  TrendingUp,
  Plus,
  Crown,
  UserPlus,
  Loader2,
} from "lucide-react";
import InviteMemberDialog from "./InviteMemberDialog";
import MembersList from "./MembersList";

interface GroupDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onUpdate: () => void;
}

export default function GroupDetailsDialog({
  open,
  onOpenChange,
  groupId,
  onUpdate,
}: GroupDetailsDialogProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Fetch group details
  const {
    data: group,
    isLoading: groupLoading,
    refetch: refetchGroup,
  } = useNexGroupDetailsQuery(groupId, open && !!groupId);

  // Fetch group summary
  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useNexGroupSummaryQuery(groupId, open && !!groupId);

  // Fetch group members
  const {
    data: membersData,
    isLoading: membersLoading,
    refetch: refetchMembers,
  } = useNexGroupMembersQuery(groupId, 0, 50, open && !!groupId);

  const handleRefresh = () => {
    refetchGroup();
    refetchSummary();
    refetchMembers();
    onUpdate();
  };

  const handleInviteSuccess = () => {
    refetchMembers();
    refetchGroup();
  };

  if (!open) return null;

  const isLoading = groupLoading || summaryLoading || membersLoading;
  const members = membersData?.content || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>{group?.name || "Group Details"}</span>
            </DialogTitle>
            <DialogDescription>
              {group?.description || "Loading group information..."}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">
                  Members ({members.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Group Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Group Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Settlement Type
                        </p>
                        <Badge
                          variant={
                            group?.settlementType === "SIMPLIFIED"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-1"
                        >
                          {group?.settlementType}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Created By
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {group?.creatorName || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">
                            ${summary?.totalExpenses?.toFixed(2) || "0.00"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Total Expenses
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">
                            {summary?.totalMembers || 0}
                          </p>
                          <p className="text-xs text-gray-500">Members</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-2xl font-bold">
                            {summary?.outstandingDebts || 0}
                          </p>
                          <p className="text-xs text-gray-500">Outstanding</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Expense
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowInviteDialog(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Balances
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Group Members</h3>
                  <Button size="sm" onClick={() => setShowInviteDialog(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </div>

                <MembersList
                  members={members}
                  groupId={groupId}
                  onUpdate={handleRefresh}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        groupId={groupId}
        onSuccess={handleInviteSuccess}
      />
    </>
  );
}
