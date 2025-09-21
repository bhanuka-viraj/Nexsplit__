"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settlementApi } from "@/lib/api";
import { ExecuteSettlementRequest, SettlementItem } from "@/types/expense";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { NexMember } from "@/types/nex";

interface ExecuteSettlementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nexId: string;
  members: NexMember[];
}

export default function ExecuteSettlementDialog({
  open,
  onOpenChange,
  nexId,
  members,
}: ExecuteSettlementDialogProps) {
  const [selectedSettlements, setSelectedSettlements] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [settleAll, setSettleAll] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: availableSettlements,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["available-settlements", nexId],
    queryFn: () => settlementApi.getAvailableSettlements(nexId, "SIMPLIFIED"),
    enabled: open && !!nexId,
  });

  const executeSettlementMutation = useMutation({
    mutationFn: (request: ExecuteSettlementRequest) =>
      settlementApi.executeSettlements(nexId, request),
    onSuccess: (data) => {
      toast.success(
        `Successfully settled ${data.settledCount} settlement${
          data.settledCount !== 1 ? "s" : ""
        } totaling $${data.totalSettledAmount.toFixed(2)}`
      );
      queryClient.invalidateQueries({
        queryKey: ["settlement-summary", nexId],
      });
      queryClient.invalidateQueries({
        queryKey: ["settlement-history", nexId],
      });
      queryClient.invalidateQueries({
        queryKey: ["settlement-analytics", nexId],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-settlements", nexId],
      });
      handleClose();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to execute settlements";
      toast.error(message);
    },
  });

  const getMemberName = (userId: string) => {
    const member = members.find((m) => m.userId === userId);
    return member?.userName || "Unknown User";
  };

  const getInitials = (userId: string) => {
    const name = getMemberName(userId);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSettlementToggle = (settlementId: string, checked: boolean) => {
    if (checked) {
      setSelectedSettlements([...selectedSettlements, settlementId]);
    } else {
      setSelectedSettlements(
        selectedSettlements.filter((id) => id !== settlementId)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && availableSettlements) {
      setSelectedSettlements(
        availableSettlements.availableSettlements.map((s) => s.id)
      );
    } else {
      setSelectedSettlements([]);
    }
  };

  const handleExecute = () => {
    if (!settleAll && selectedSettlements.length === 0) {
      toast.error(
        "Please select at least one settlement or enable 'Settle All'"
      );
      return;
    }

    if (!paymentMethod.trim()) {
      toast.error("Please specify a payment method");
      return;
    }

    const request: ExecuteSettlementRequest = {
      settlementType: "SIMPLIFIED",
      settlementIds: settleAll ? [] : selectedSettlements,
      paymentMethod: paymentMethod.trim(),
      notes: notes.trim(),
      settlementDate: new Date().toISOString(),
      settleAll,
    };

    executeSettlementMutation.mutate(request);
  };

  const handleClose = () => {
    setSelectedSettlements([]);
    setPaymentMethod("");
    setNotes("");
    setSettleAll(false);
    onOpenChange(false);
  };

  const selectedAmount =
    availableSettlements?.availableSettlements
      .filter((s) => settleAll || selectedSettlements.includes(s.id))
      .reduce((sum, s) => sum + s.amount, 0) || 0;

  const selectedCount = settleAll
    ? availableSettlements?.totalAvailable || 0
    : selectedSettlements.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Execute Settlements
          </DialogTitle>
          <DialogDescription>
            Execute pending settlements for this nex
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Available Settlements */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium">
                Available Settlements
              </Label>
              {availableSettlements &&
                availableSettlements.totalAvailable > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="settle-all"
                      checked={settleAll}
                      onCheckedChange={setSettleAll}
                    />
                    <Label htmlFor="settle-all" className="text-sm">
                      Settle All ({availableSettlements.totalAvailable})
                    </Label>
                  </div>
                )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : !availableSettlements ||
              availableSettlements.totalAvailable === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  No pending settlements
                </p>
                <p className="text-sm">All settlements are up to date!</p>
              </div>
            ) : (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {availableSettlements.availableSettlements.map((settlement) => (
                  <div
                    key={settlement.id}
                    className="flex items-center space-x-3 p-3 border-b last:border-b-0"
                  >
                    <Checkbox
                      checked={
                        settleAll || selectedSettlements.includes(settlement.id)
                      }
                      onCheckedChange={(checked) =>
                        handleSettlementToggle(
                          settlement.id,
                          checked as boolean
                        )
                      }
                      disabled={settleAll}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(settlement.fromUserId)}
                          </AvatarFallback>
                        </Avatar>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(settlement.toUserId)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {getMemberName(settlement.fromUserId)} →{" "}
                          {getMemberName(settlement.toUserId)}
                        </p>
                        {settlement.expenseTitle && (
                          <p className="text-xs text-gray-500 truncate">
                            {settlement.expenseTitle}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">
                        ${settlement.amount.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settlement Details */}
          {(selectedCount > 0 || settleAll) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Settlement Summary</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ${selectedAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-600">
                    {selectedCount} settlement{selectedCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="venmo">Venmo</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="zelle">Zelle</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this settlement..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleExecute}
            disabled={
              executeSettlementMutation.isPending ||
              (!settleAll && selectedSettlements.length === 0) ||
              !paymentMethod.trim()
            }
          >
            {executeSettlementMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Executing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Execute Settlement{selectedCount !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
