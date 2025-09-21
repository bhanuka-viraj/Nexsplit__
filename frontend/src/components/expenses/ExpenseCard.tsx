"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { expenseApi } from "@/lib/api";
import {
  Expense,
  ExpenseParticipant,
  ExpenseSplitResponse,
} from "@/types/expense";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  CreditCard,
  Tag,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ExpenseCardProps {
  expense: Expense;
  members: NexMember[];
  onUpdate: () => void;
  onEdit: (expense: Expense) => void;
}

export default function ExpenseCard({
  expense,
  members,
  onUpdate,
  onEdit,
}: ExpenseCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const deleteExpenseMutation = useMutation({
    mutationFn: () => expenseApi.deleteExpense(expense.id),
    onSuccess: () => {
      toast.success("Expense deleted successfully");
      onUpdate();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete expense";
      toast.error(message);
    },
  });

  const handleDeleteExpense = () => {
    deleteExpenseMutation.mutate();
    setShowDeleteDialog(false);
  };

  const getMemberName = (userId: string) => {
    const member = members.find((m) => m.userId === userId);
    return member?.userName || "Unknown User";
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (categoryName?: string) => {
    if (!categoryName) return "bg-gray-100 text-gray-800";

    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];

    const hash = categoryName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  // Handle both new and legacy data structures
  const participants: (ExpenseSplitResponse | ExpenseParticipant)[] =
    expense.splits || expense.participants || [];
  const totalParticipants = participants.length;
  const payerId = expense.payerId || expense.paidBy || "";
  const payerName = expense.payerName || expense.paidByName || "";
  const expenseTitle = expense.title || expense.description || "";
  const expenseDescription = expense.description || "";

  // Find user share - handle both new splits and legacy participants structure
  const userShare = (() => {
    const participant = participants.find((p) => p.userId === payerId);
    if (participant) {
      if ("amount" in participant) {
        return participant.amount;
      } else if ("shareAmount" in participant) {
        return (participant as ExpenseParticipant).shareAmount;
      }
    }
    return 0;
  })();

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg leading-tight">
                {expenseTitle}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Calendar className="h-3 w-3" />
                {formatDate(expense.expenseDate || expense.createdAt)}
                {expense.categoryName && (
                  <>
                    <span>•</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getCategoryColor(
                        expense.categoryName
                      )}`}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {expense.categoryName}
                    </Badge>
                  </>
                )}
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetailsDialog(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(expense)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Expense
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Expense
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Amount and Paid By */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getMemberInitials(payerId)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {payerName || getMemberName(payerId)}
                  </p>
                  <p className="text-xs text-gray-500">paid the bill</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {expense.currency === "LKR" ? "Rs." : "$"}
                  {expense.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">total amount</p>
              </div>
            </div>

            {/* Participants Summary */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">
                  Split among {totalParticipants}{" "}
                  {totalParticipants === 1 ? "person" : "people"}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                {participants.slice(0, 3).map((participant) => (
                  <Avatar
                    key={participant.userId}
                    className="h-6 w-6 border-2 border-white"
                  >
                    <AvatarFallback className="text-xs">
                      {getMemberInitials(participant.userId)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {totalParticipants > 3 && (
                  <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{totalParticipants - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Individual Share (if current user is a participant) */}
            {userShare > 0 && (
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Your share</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {expense.currency === "LKR" ? "Rs." : "$"}
                  {userShare.toFixed(2)}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{expenseTitle}"? This action
              cannot be undone and will affect all participants' balances.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExpense}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Expense
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Expense Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{expenseTitle}</DialogTitle>
            <DialogDescription>
              Expense details and participant breakdown
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Total Amount
                </Label>
                <p className="text-2xl font-bold text-green-600">
                  {expense.currency === "LKR" ? "Rs." : "$"}
                  {expense.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Date
                </Label>
                <p className="text-lg">
                  {formatDate(expense.expenseDate || expense.createdAt)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Paid By
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getMemberInitials(payerId)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{payerName || getMemberName(payerId)}</span>
                </div>
              </div>
              {expense.categoryName && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Category
                  </Label>
                  <Badge
                    variant="secondary"
                    className={`mt-1 ${getCategoryColor(expense.categoryName)}`}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {expense.categoryName}
                  </Badge>
                </div>
              )}
            </div>

            {/* Participants Breakdown */}
            <div>
              <Label className="text-sm font-medium text-gray-500 mb-3 block">
                Participant Breakdown
              </Label>
              <div className="space-y-2">
                {participants.map((participant) => {
                  // Handle both new splits and legacy participants structure
                  const userId = participant.userId;
                  const userName =
                    ("userName" in participant && participant.userName) ||
                    getMemberName(userId);

                  const shareAmount = (() => {
                    if ("amount" in participant) return participant.amount;
                    if ("shareAmount" in participant)
                      return (participant as ExpenseParticipant).shareAmount;
                    return 0;
                  })();

                  const shareType =
                    expense.splitType ||
                    ("shareType" in participant &&
                      (participant as ExpenseParticipant).shareType) ||
                    "EQUALLY";

                  const shareValue = (() => {
                    if ("percentage" in participant)
                      return participant.percentage;
                    if ("shareValue" in participant)
                      return (participant as ExpenseParticipant).shareValue;
                    return 0;
                  })();

                  return (
                    <div
                      key={userId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getMemberInitials(userId)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userName}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {shareType.toLowerCase()} split
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          {expense.currency === "LKR" ? "Rs." : "$"}
                          {shareAmount.toFixed(2)}
                        </p>
                        {shareType === "PERCENTAGE" && (
                          <p className="text-xs text-gray-500">
                            {shareValue.toFixed(1)}%
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
