"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateNexGroupRequest } from "@/types/nex";
import { useCreateNexMutation } from "@/lib/api/mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, User } from "lucide-react";
import { toast } from "sonner";

const createNexSchema = z.object({
  name: z
    .string()
    .min(1, "Nex name is required")
    .min(3, "Nex name must be at least 3 characters")
    .max(50, "Nex name must be less than 50 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters"),
  settlementType: z.enum(["SIMPLIFIED", "DETAILED"], {
    required_error: "Please select a settlement type",
  }),
  nexType: z.enum(["GROUP", "PERSONAL"], {
    required_error: "Please select a nex type",
  }),
});

type CreateNexFormData = z.infer<typeof createNexSchema>;

interface CreateNexDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateNexDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateNexDialogProps) {
  const [nexType, setNexType] = useState<"GROUP" | "PERSONAL">("GROUP");

  const form = useForm<CreateNexFormData>({
    resolver: zodResolver(createNexSchema),
    defaultValues: {
      name: "",
      description: "",
      settlementType: "SIMPLIFIED",
      nexType: "GROUP",
    },
  });

  const createNexMutation = useCreateNexMutation();

  const onSubmit = (data: CreateNexFormData) => {
    createNexMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
        onSuccess();
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createNexMutation.isPending) {
      form.reset();
      setNexType("GROUP");
    }
    onOpenChange(newOpen);
  };

  const handleTabChange = (value: string) => {
    const type = value as "GROUP" | "PERSONAL";
    setNexType(type);
    form.setValue("nexType", type);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Nex</DialogTitle>
          <DialogDescription>
            Choose between group nex for shared expenses or personal nex for
            individual tracking.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={nexType}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="GROUP" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Group Nex</span>
            </TabsTrigger>
            <TabsTrigger
              value="PERSONAL"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Personal Nex</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="GROUP" className="space-y-4">
            <p className="text-sm text-gray-600">
              Create a shared nex to split expenses with friends, family, or
              colleagues.
            </p>
          </TabsContent>

          <TabsContent value="PERSONAL" className="space-y-4">
            <p className="text-sm text-gray-600">
              Create a personal nex to track your individual expenses and
              budgets.
            </p>
          </TabsContent>
        </Tabs>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nex Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        nexType === "GROUP"
                          ? "e.g., Trip to Bali, Apartment Rent"
                          : "e.g., Monthly Budget, Vacation Fund"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of what this nex is for..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {nexType === "GROUP" && (
              <FormField
                control={form.control}
                name="settlementType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Settlement Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select settlement type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SIMPLIFIED">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Simplified</span>
                            <span className="text-sm text-gray-500">
                              Minimize number of transactions
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="DETAILED">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Detailed</span>
                            <span className="text-sm text-gray-500">
                              Track exact transactions between members
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How should expenses be settled between group members?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createNexMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createNexMutation.isPending}>
                {createNexMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  `Create ${nexType === "GROUP" ? "Group" : "Personal"} Nex`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
