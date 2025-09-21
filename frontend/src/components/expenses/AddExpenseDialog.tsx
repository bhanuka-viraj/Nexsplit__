"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { expenseApi, categoryApi } from "@/lib/api";
import { CreateExpenseRequest, ExpenseSplit, Category } from "@/types/expense";
import { NexMember } from "@/types/nex";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Plus,
  X,
  Calculator,
  Users,
  Percent,
  DollarSign,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nexId: string;
  members: NexMember[];
  onSuccess: () => void;
}

type SplitType = "EQUALLY" | "AMOUNT" | "PERCENTAGE";

interface ParticipantSplit {
  userId: string;
  included: boolean;
  shareType: SplitType;
  shareValue: number;
  calculatedAmount: number;
}

export default function AddExpenseDialog({
  open,
  onOpenChange,
  nexId,
  members,
  onSuccess,
}: AddExpenseDialogProps) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    currency: "LKR", // Default currency
    description: "",
    payerId: "",
    categoryId: "",
    expenseDate: new Date().toISOString().split("T")[0], // Today's date
    isInitialPayerHas: true, // Default to true
  });

  const [splitType, setSplitType] = useState<SplitType>("EQUALLY");
  const [participants, setParticipants] = useState<ParticipantSplit[]>([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Fetch categories (default + custom + nex-specific)
  const { data: categoriesData, refetch: refetchCategories } = useQuery({
    queryKey: ["all-categories", nexId],
    queryFn: () => categoryApi.getAllCategories(0, 100, nexId),
    enabled: open,
  });

  const defaultCategories = categoriesData?.defaultCategories || [];
  const customCategories = categoriesData?.customCategories || [];
  const nexCategories = categoriesData?.nexCategories || [];
  const allCategories = [
    ...defaultCategories,
    ...customCategories,
    ...nexCategories,
  ];

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: (data: CreateExpenseRequest) => expenseApi.createExpense(data),
    onSuccess: () => {
      toast.success("Expense created successfully");
      resetForm();
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create expense";
      toast.error(message);
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => categoryApi.createCategory({ name, nexId }),
    onSuccess: (newCategory) => {
      toast.success("Category created successfully");
      setForm({ ...form, categoryId: newCategory.id });
      setNewCategoryName("");
      setShowNewCategoryForm(false);
      refetchCategories();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create category";
      toast.error(message);
    },
  });

  // Initialize participants when members change or dialog opens
  useEffect(() => {
    if (open && members.length > 0) {
      const amount = parseFloat(form.amount) || 0;
      const equalShare = amount / members.length;

      setParticipants(
        members.map((member) => ({
          userId: member.userId,
          included: true,
          shareType: "EQUALLY",
          shareValue: equalShare,
          calculatedAmount: equalShare,
        }))
      );
    }
  }, [open, members, form.amount]);

  // Recalculate splits when amount or split type changes
  useEffect(() => {
    const amount = parseFloat(form.amount) || 0;
    updateSplitCalculations(amount);
  }, [form.amount, splitType]);

  const updateSplitCalculations = (totalAmount: number) => {
    const includedParticipants = participants.filter((p) => p.included);

    if (includedParticipants.length === 0) return;

    let updatedParticipants = [...participants];

    if (splitType === "EQUALLY") {
      const equalShare = totalAmount / includedParticipants.length;
      updatedParticipants = updatedParticipants.map((p) => ({
        ...p,
        shareType: "EQUALLY" as SplitType,
        shareValue: equalShare,
        calculatedAmount: p.included ? equalShare : 0,
      }));
    } else if (splitType === "PERCENTAGE") {
      // Ensure percentages add up to 100%
      const totalPercentage = includedParticipants.reduce(
        (sum, p) => sum + (p.shareValue || 0),
        0
      );

      if (totalPercentage === 0) {
        // Auto-assign equal percentages
        const equalPercentage = 100 / includedParticipants.length;
        updatedParticipants = updatedParticipants.map((p) => ({
          ...p,
          shareType: "PERCENTAGE" as SplitType,
          shareValue: p.included ? equalPercentage : 0,
          calculatedAmount: p.included
            ? (totalAmount * equalPercentage) / 100
            : 0,
        }));
      } else {
        updatedParticipants = updatedParticipants.map((p) => ({
          ...p,
          shareType: "PERCENTAGE" as SplitType,
          calculatedAmount: p.included ? (totalAmount * p.shareValue) / 100 : 0,
        }));
      }
    }
    // For AMOUNT, amounts are set manually

    setParticipants(updatedParticipants);
  };

  const handleParticipantToggle = (userId: string, included: boolean) => {
    const updatedParticipants = participants.map((p) =>
      p.userId === userId ? { ...p, included } : p
    );
    setParticipants(updatedParticipants);

    // Recalculate splits
    setTimeout(() => {
      const amount = parseFloat(form.amount) || 0;
      updateSplitCalculations(amount);
    }, 0);
  };

  const handleParticipantValueChange = (userId: string, value: number) => {
    const updatedParticipants = participants.map((p) => {
      if (p.userId === userId) {
        return {
          ...p,
          shareValue: value,
          calculatedAmount: splitType === "AMOUNT" ? value : p.calculatedAmount,
        };
      }
      return p;
    });
    setParticipants(updatedParticipants);

    if (splitType === "PERCENTAGE") {
      // Recalculate amounts based on new percentages
      const amount = parseFloat(form.amount) || 0;
      updateSplitCalculations(amount);
    }
  };

  const handleSplitTypeChange = (newSplitType: SplitType) => {
    setSplitType(newSplitType);
    const amount = parseFloat(form.amount) || 0;

    if (newSplitType === "AMOUNT") {
      // Set amount values to equal split as starting point
      const includedCount = participants.filter((p) => p.included).length;
      const equalShare = includedCount > 0 ? amount / includedCount : 0;

      setParticipants(
        participants.map((p) => ({
          ...p,
          shareType: "AMOUNT",
          shareValue: p.included ? equalShare : 0,
          calculatedAmount: p.included ? equalShare : 0,
        }))
      );
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      amount: "",
      currency: "LKR",
      description: "",
      payerId: "",
      categoryId: "",
      expenseDate: new Date().toISOString().split("T")[0],
      isInitialPayerHas: true,
    });
    setSplitType("EQUALLY");
    setParticipants([]);
    setShowNewCategoryForm(false);
    setNewCategoryName("");
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error("Valid amount is required");
      return false;
    }
    if (!form.payerId) {
      toast.error("Please select who paid");
      return false;
    }
    if (!form.categoryId) {
      toast.error("Please select a category");
      return false;
    }

    const includedParticipants = participants.filter((p) => p.included);
    if (includedParticipants.length === 0) {
      toast.error("At least one participant is required");
      return false;
    }

    // Validate split totals
    const totalAmount = parseFloat(form.amount);
    const totalSplit = includedParticipants.reduce(
      (sum, p) => sum + p.calculatedAmount,
      0
    );

    if (Math.abs(totalAmount - totalSplit) > 0.01) {
      toast.error("Split amounts don't match the total expense amount");
      return false;
    }

    if (splitType === "PERCENTAGE") {
      const totalPercentage = includedParticipants.reduce(
        (sum, p) => sum + p.shareValue,
        0
      );
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast.error("Percentages must add up to 100%");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const includedParticipants = participants.filter((p) => p.included);
    const expenseSplits: ExpenseSplit[] = includedParticipants.map((p) => {
      const split: ExpenseSplit = {
        userId: p.userId,
      };

      if (splitType === "PERCENTAGE") {
        split.percentage = p.shareValue;
      } else if (splitType === "AMOUNT") {
        split.amount = p.shareValue;
      }
      // For EQUALLY split, no additional fields needed

      return split;
    });

    const expenseData: CreateExpenseRequest = {
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      currency: form.currency,
      categoryId: form.categoryId,
      description: form.description.trim() || undefined,
      nexId,
      payerId: form.payerId,
      splitType: splitType,
      isInitialPayerHas: form.isInitialPayerHas,
      expenseDate: form.expenseDate,
      splits: expenseSplits,
    };

    createExpenseMutation.mutate(expenseData);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    createCategoryMutation.mutate(newCategoryName.trim());
  };

  const getTotalSplit = () => {
    return participants
      .filter((p) => p.included)
      .reduce((sum, p) => sum + p.calculatedAmount, 0);
  };

  const getMemberName = (userId: string) => {
    return members.find((m) => m.userId === userId)?.userName || "Unknown";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Create a new expense and split it among participants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Details */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Expense title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Additional details about this expense..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(value) =>
                    setForm({ ...form, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LKR">LKR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={form.expenseDate}
                  onChange={(e) =>
                    setForm({ ...form, expenseDate: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="payerId">Paid By</Label>
                <Select
                  value={form.payerId}
                  onValueChange={(value) =>
                    setForm({ ...form, payerId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Who paid?" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.userId} value={member.userId}>
                        {member.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <Select
                    value={form.categoryId}
                    onValueChange={(value) =>
                      setForm({ ...form, categoryId: value })
                    }
                    required
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select category*" />
                    </SelectTrigger>
                    <SelectContent>
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

                      {allCategories.length === 0 && (
                        <div className="px-2 py-1.5 text-sm text-gray-500 italic">
                          No categories available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {showNewCategoryForm && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleCreateCategory()
                      }
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateCategory}
                      disabled={createCategoryMutation.isPending}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowNewCategoryForm(false);
                        setNewCategoryName("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Payer Participation */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isInitialPayerHas"
                checked={form.isInitialPayerHas}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isInitialPayerHas: checked as boolean })
                }
              />
              <Label
                htmlFor="isInitialPayerHas"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include payer in split calculation
              </Label>
            </div>
          </div>

          {/* Split Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Split Between Participants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Split Type Selection */}
              <Tabs
                value={splitType}
                onValueChange={(value) =>
                  handleSplitTypeChange(value as SplitType)
                }
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="EQUALLY"
                    className="flex items-center gap-1"
                  >
                    <Users className="h-4 w-4" />
                    Equally
                  </TabsTrigger>
                  <TabsTrigger
                    value="AMOUNT"
                    className="flex items-center gap-1"
                  >
                    <DollarSign className="h-4 w-4" />
                    Amount
                  </TabsTrigger>
                  <TabsTrigger
                    value="PERCENTAGE"
                    className="flex items-center gap-1"
                  >
                    <Percent className="h-4 w-4" />
                    Percentage
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 space-y-3">
                  {participants.map((participant) => {
                    const member = members.find(
                      (m) => m.userId === participant.userId
                    );
                    if (!member) return null;

                    return (
                      <div
                        key={participant.userId}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <Checkbox
                          checked={participant.included}
                          onCheckedChange={(checked) =>
                            handleParticipantToggle(
                              participant.userId,
                              !!checked
                            )
                          }
                        />

                        <div className="flex-1">
                          <p className="font-medium">{member.userName}</p>
                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                        </div>

                        {participant.included && (
                          <div className="flex items-center gap-2">
                            {splitType !== "EQUALLY" && (
                              <Input
                                type="number"
                                step={
                                  splitType === "PERCENTAGE" ? "0.1" : "0.01"
                                }
                                min="0"
                                max={
                                  splitType === "PERCENTAGE" ? "100" : undefined
                                }
                                placeholder={
                                  splitType === "PERCENTAGE" ? "%" : "$"
                                }
                                value={
                                  splitType === "PERCENTAGE"
                                    ? participant.shareValue.toFixed(1)
                                    : participant.shareValue
                                }
                                onChange={(e) =>
                                  handleParticipantValueChange(
                                    participant.userId,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-24 text-right"
                              />
                            )}

                            <Badge
                              variant="secondary"
                              className="min-w-[80px] justify-center"
                            >
                              {splitType === "PERCENTAGE"
                                ? `${participant.shareValue.toFixed(1)}%`
                                : `$${participant.calculatedAmount.toFixed(2)}`}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Tabs>

              {/* Split Summary */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Split:</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      Math.abs(
                        getTotalSplit() - parseFloat(form.amount || "0")
                      ) < 0.01
                        ? "default"
                        : "destructive"
                    }
                  >
                    ${getTotalSplit().toFixed(2)}
                  </Badge>
                  <span className="text-gray-500">
                    of ${parseFloat(form.amount || "0").toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createExpenseMutation.isPending}
          >
            {createExpenseMutation.isPending ? "Creating..." : "Create Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
