import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { UpdateUserDto, ChangePasswordDto } from "@/types/auth";

// Update User Profile Mutation
export const useUpdateUserProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => userApi.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });
};

// Change Password Mutation
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => userApi.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to change password";
      toast.error(message);
    },
  });
};

// Deactivate Account Mutation
export const useDeactivateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.deactivateAccount(),
    onSuccess: () => {
      toast.success("Account deactivated successfully!");
      // Clear all user data
      queryClient.clear();
      // Clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to deactivate account";
      toast.error(message);
    },
  });
};

// Respond to Invitation Mutation
export const useRespondToInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nexId, accept }: { nexId: string; accept: boolean }) =>
      userApi.respondToInvitation(nexId, accept),
    onSuccess: (_, variables) => {
      const action = variables.accept ? "accepted" : "declined";
      toast.success(`Invitation ${action} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["pending-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["nex-list"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to respond to invitation";
      toast.error(message);
    },
  });
};
