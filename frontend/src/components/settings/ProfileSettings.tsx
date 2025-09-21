"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import { userManager } from "@/lib/auth";
import {
  updateProfileSchema,
  UpdateProfileFormData,
} from "@/lib/validations/auth";
import { UserProfileDto } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, Check, X } from "lucide-react";
import { toast } from "sonner";

interface ProfileSettingsProps {
  user: UserProfileDto;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [validationStates, setValidationStates] = useState({
    username: { isChecking: false, isValid: null as boolean | null },
  });
  const queryClient = useQueryClient();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      contactNumber: user.contactNumber || "",
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      contactNumber: user.contactNumber || "",
    });
  }, [user, form]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: async (updatedUser) => {
      // Update local storage
      userManager.setUser(updatedUser);

      // Refetch the latest user data from API
      await queryClient.refetchQueries({ queryKey: ["user", "profile"] });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });

  // Username validation
  const validateUsernameMutation = useMutation({
    mutationFn: userApi.validateUsername,
    onSuccess: (response) => {
      setValidationStates((prev) => ({
        ...prev,
        username: { isChecking: false, isValid: response.success },
      }));
    },
    onError: () => {
      setValidationStates((prev) => ({
        ...prev,
        username: { isChecking: false, isValid: false },
      }));
    },
  });

  const checkUsername = (username: string) => {
    if (username === user.username) {
      setValidationStates((prev) => ({
        ...prev,
        username: { isChecking: false, isValid: true },
      }));
      return;
    }

    setValidationStates((prev) => ({
      ...prev,
      username: { isChecking: true, isValid: null },
    }));

    validateUsernameMutation.mutate(username);
  };

  const onSubmit = (data: UpdateProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleCancel = () => {
    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      contactNumber: user.contactNumber || "",
    });
    setIsEditing(false);
    setValidationStates({ username: { isChecking: false, isValid: null } });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and contact details
            </CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        disabled={!isEditing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        disabled={!isEditing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your username"
                        disabled={!isEditing}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (isEditing && e.target.value) {
                            checkUsername(e.target.value);
                          }
                        }}
                      />
                      {isEditing && validationStates.username.isChecking && (
                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                      )}
                      {isEditing &&
                        !validationStates.username.isChecking &&
                        validationStates.username.isValid === true && (
                          <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                        )}
                      {isEditing &&
                        !validationStates.username.isChecking &&
                        validationStates.username.isValid === false && (
                          <X className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                        )}
                    </div>
                  </FormControl>
                  <FormMessage />
                  {isEditing && validationStates.username.isValid === false && (
                    <p className="text-sm text-red-500">
                      Username is already taken
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your contact number"
                      disabled={!isEditing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input value={user.email || ""} disabled className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input
                    value={user.fullName || ""}
                    disabled
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically generated from first and last name.
                  </p>
                </div>
              </div>

              {isEditing && (
                <Alert>
                  <AlertDescription>
                    Make sure your information is accurate as it will be used
                    for account verification and communication.
                  </AlertDescription>
                </Alert>
              )}

              {isEditing && (
                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      updateProfileMutation.isPending ||
                      validationStates.username.isChecking ||
                      validationStates.username.isValid === false
                    }
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
