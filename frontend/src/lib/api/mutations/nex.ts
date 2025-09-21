import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { nexApi } from "@/lib/api";
import {
  CreateNexGroupRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
} from "@/types/nex";

// Create Nex Group Mutation
export const useCreateNexMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNexGroupRequest) => nexApi.createGroup(data),
    onSuccess: (data) => {
      toast.success(`Nex "${data.name}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["nex-list"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create nex";
      toast.error(message);
    },
  });
};

// Invite Member Mutation
export const useInviteMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: InviteMemberRequest;
    }) => nexApi.inviteMember(groupId, data),
    onSuccess: (_, variables) => {
      toast.success("Invitation sent successfully!");
      queryClient.invalidateQueries({
        queryKey: ["nex-group-members", variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["nex-group", variables.groupId],
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to send invitation";
      toast.error(message);
    },
  });
};

// Remove Member Mutation
export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      memberId,
    }: {
      groupId: string;
      memberId: string;
    }) => nexApi.removeMember(groupId, memberId),
    onSuccess: (_, variables) => {
      toast.success("Member removed successfully");
      queryClient.invalidateQueries({
        queryKey: ["nex-group-members", variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["nex-group", variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["nex-group-summary", variables.groupId],
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to remove member";
      toast.error(message);
    },
  });
};

// Update Member Role Mutation
export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      memberId,
      role,
    }: {
      groupId: string;
      memberId: string;
      role: "ADMIN" | "MEMBER";
    }) => nexApi.updateMemberRole(groupId, memberId, { role }),
    onSuccess: (_, variables) => {
      const action =
        variables.role === "ADMIN" ? "promoted to admin" : "demoted to member";
      toast.success(`Member ${action} successfully`);
      queryClient.invalidateQueries({
        queryKey: ["nex-group-members", variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["nex-group", variables.groupId],
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update member role";
      toast.error(message);
    },
  });
};

// Leave Group Mutation
export const useLeaveGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => nexApi.leaveGroup(groupId),
    onSuccess: () => {
      toast.success("You have left the group successfully");
      queryClient.invalidateQueries({ queryKey: ["nex-list"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to leave group";
      toast.error(message);
    },
  });
};
