"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { nexApi } from "@/lib/api";
import { NexGroup, UpdateNexGroupRequest } from "@/types/nex";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  CreditCard,
  MoreVertical,
  Settings,
  LogOut,
  Trash2,
  Eye,
  User,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NexCardProps {
  nex: NexGroup;
  onUpdate: () => void;
}

export default function NexCard({ nex, onUpdate }: NexCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: nex.name,
    description: nex.description,
    settlementType: nex.settlementType,
  });
  const router = useRouter();

  const deleteNexMutation = useMutation({
    mutationFn: () => nexApi.deleteGroup(nex.id),
    onSuccess: () => {
      toast.success(`Nex "${nex.name}" deleted successfully`);
      onUpdate();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete nex";
      toast.error(message);
    },
  });

  const leaveNexMutation = useMutation({
    mutationFn: () => nexApi.leaveGroup(nex.id),
    onSuccess: () => {
      toast.success(`Left nex "${nex.name}"`);
      onUpdate();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to leave nex";
      toast.error(message);
    },
  });

  const updateNexMutation = useMutation({
    mutationFn: (data: UpdateNexGroupRequest) =>
      nexApi.updateGroup(nex.id, data),
    onSuccess: () => {
      toast.success(`Nex "${editForm.name}" updated successfully`);
      setShowEditDialog(false);
      onUpdate();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update nex";
      toast.error(message);
    },
  });

  const handleDeleteNex = () => {
    deleteNexMutation.mutate();
    setShowDeleteDialog(false);
  };

  const handleLeaveNex = () => {
    leaveNexMutation.mutate();
  };

  const handleEditNex = () => {
    // Reset form to current nex values when opening
    setEditForm({
      name: nex.name,
      description: nex.description,
      settlementType: nex.settlementType,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    const updateData: UpdateNexGroupRequest = {
      name: editForm.name.trim(),
      description: editForm.description.trim(),
      settlementType: editForm.settlementType,
    };

    updateNexMutation.mutate(updateData);
  };

  const isPersonalNex = nex.nexType !== "GROUP";

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg leading-tight">
                {nex.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {nex.description}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/expenses/${nex.id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditNex}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Nex
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!isPersonalNex && (
                  <DropdownMenuItem
                    onClick={handleLeaveNex}
                    className="text-orange-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Leave Nex
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Nex
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Badge variant="outline">{nex.settlementType}</Badge>
            <Badge variant={isPersonalNex ? "secondary" : "default"}>
              {isPersonalNex ? "Personal" : "Group"}
            </Badge>
            {nex.creatorName && !isPersonalNex && (
              <Badge variant="secondary" className="text-xs">
                by {nex.creatorName}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent
          className="pt-0"
          onClick={() => router.push(`/expenses/${nex.id}`)}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {!isPersonalNex && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{nex.memberCount} members</span>
                </div>
              )}
              {isPersonalNex && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Personal</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span>{nex.expenseCount} expenses</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ${nex.totalExpenseAmount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">total spent</p>
            </div>
          </div>

          {nex.expenseCount === 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 text-center">
                No expenses yet. Start by adding your first expense!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Nex</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{nex.name}"? This action cannot
              be undone and will permanently remove all expenses and data
              associated with this nex.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNex}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Nex
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Nex Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Nex</DialogTitle>
            <DialogDescription>
              Update your nex details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Enter nex name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Enter nex description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="settlementType" className="text-sm font-medium">
                Settlement Type
              </label>
              <Select
                value={editForm.settlementType}
                onValueChange={(value: "SIMPLIFIED" | "DETAILED") =>
                  setEditForm({ ...editForm, settlementType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select settlement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIMPLIFIED">Simplified</SelectItem>
                  <SelectItem value="DETAILED">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={updateNexMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateNexMutation.isPending}
            >
              {updateNexMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
