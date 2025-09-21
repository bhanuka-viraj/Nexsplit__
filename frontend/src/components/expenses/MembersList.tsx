"use client";

import { useState } from "react";
import { NexMember } from "@/types/nex";
import { useAuth } from "@/hooks/useAuth";
import {
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
  useLeaveGroupMutation,
} from "@/lib/api/mutations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Crown,
  MoreVertical,
  UserMinus,
  Shield,
  User,
  LogOut,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MemberProfileDialog from "./MemberProfileDialog";

interface MembersListProps {
  members: NexMember[];
  groupId: string;
  onUpdate: () => void;
}

export default function MembersList({
  members,
  groupId,
  onUpdate,
}: MembersListProps) {
  const [memberToRemove, setMemberToRemove] = useState<NexMember | null>(null);
  const [memberToPromote, setMemberToPromote] = useState<NexMember | null>(
    null
  );
  const [memberToDemote, setMemberToDemote] = useState<NexMember | null>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [memberToView, setMemberToView] = useState<NexMember | null>(null);
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const removeMemberMutation = useRemoveMemberMutation();
  const updateRoleMutation = useUpdateMemberRoleMutation();
  const leaveGroupMutation = useLeaveGroupMutation();

  const handleRemoveMember = () => {
    if (memberToRemove) {
      removeMemberMutation.mutate(
        { groupId, memberId: memberToRemove.userId },
        {
          onSuccess: () => {
            onUpdate();
            setMemberToRemove(null);
          },
          onError: () => {
            setMemberToRemove(null);
          },
        }
      );
    }
  };

  const handlePromoteMember = () => {
    if (memberToPromote) {
      updateRoleMutation.mutate(
        {
          groupId,
          memberId: memberToPromote.userId,
          role: "ADMIN",
        },
        {
          onSuccess: () => {
            onUpdate();
            setMemberToPromote(null);
            setMemberToDemote(null);
          },
          onError: () => {
            setMemberToPromote(null);
            setMemberToDemote(null);
          },
        }
      );
    }
  };

  const handleDemoteMember = () => {
    if (memberToDemote) {
      updateRoleMutation.mutate(
        {
          groupId,
          memberId: memberToDemote.userId,
          role: "MEMBER",
        },
        {
          onSuccess: () => {
            onUpdate();
            setMemberToPromote(null);
            setMemberToDemote(null);
          },
          onError: () => {
            setMemberToPromote(null);
            setMemberToDemote(null);
          },
        }
      );
    }
  };

  const handleLeaveGroup = () => {
    leaveGroupMutation.mutate(groupId, {
      onSuccess: () => {
        router.push("/expenses");
      },
      onError: () => {
        setShowLeaveDialog(false);
      },
    });
  };

  const getInitials = (member: NexMember) => {
    const firstName = member.firstName || "";
    const lastName = member.lastName || "";

    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    } else if (member.userName) {
      return member.userName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U"; // Default fallback
  };

  const isCurrentUser = (member: NexMember) => {
    return currentUser?.id === member.userId;
  };

  const canRemoveMember = (member: NexMember) => {
    // Can't remove yourself, and typically only admins can remove others
    return !isCurrentUser(member) && member.role !== "ADMIN";
  };

  const canManageRole = (member: NexMember) => {
    // Can't manage your own role, and only admins can manage others
    const currentUserIsAdmin =
      members.find((m) => m.userId === currentUser?.id)?.role === "ADMIN";
    return !isCurrentUser(member) && currentUserIsAdmin;
  };

  const canLeaveGroup = () => {
    // Can leave if you're not the only admin or if there are other admins
    const admins = members.filter((m) => m.role === "ADMIN");
    const currentUserIsAdmin =
      members.find((m) => m.userId === currentUser?.id)?.role === "ADMIN";

    if (currentUserIsAdmin && admins.length === 1) {
      return false; // Can't leave if you're the only admin
    }
    return true;
  };

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No members found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Leave Group Button */}
      {canLeaveGroup() && (
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLeaveDialog(true)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave Group
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {members.map((member) => (
          <Card key={member.userId}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getInitials(member)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">
                      {member.userName}
                    </p>
                    {isCurrentUser(member) && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant={
                        member.role === "ADMIN" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {member.role === "ADMIN" ? (
                        <>
                          <Crown className="h-3 w-3 mr-1" />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1" />
                          Member
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              {(canRemoveMember(member) || canManageRole(member) || true) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setMemberToView(member)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    {(canManageRole(member) || canRemoveMember(member)) && (
                      <DropdownMenuSeparator />
                    )}
                    {canManageRole(member) && (
                      <>
                        {member.role === "MEMBER" ? (
                          <DropdownMenuItem
                            onClick={() => setMemberToPromote(member)}
                          >
                            <Crown className="mr-2 h-4 w-4" />
                            Promote to Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => setMemberToDemote(member)}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Demote to Member
                          </DropdownMenuItem>
                        )}
                        {canRemoveMember(member) && <DropdownMenuSeparator />}
                      </>
                    )}
                    {canRemoveMember(member) && (
                      <DropdownMenuItem
                        onClick={() => setMemberToRemove(member)}
                        className="text-red-600"
                      >
                        <UserMinus className="mr-2 h-4 w-4" />
                        Remove Member
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{memberToRemove?.userName}" from
              this group? They will lose access to all group expenses and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Promote Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToPromote}
        onOpenChange={() => setMemberToPromote(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote to Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to promote "{memberToPromote?.userName}" to
              admin? They will have full access to manage this group, including
              adding/removing members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePromoteMember}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Promote to Admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Demote Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToDemote}
        onOpenChange={() => setMemberToDemote(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demote to Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to demote "{memberToDemote?.userName}" to
              member? They will lose admin privileges and won't be able to
              manage other members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDemoteMember}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Demote to Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Group Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this group? You will lose access to
              all group expenses and data. You can only rejoin if another member
              invites you back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveGroup}
              className="bg-red-600 hover:bg-red-700"
            >
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Member Profile Dialog */}
      <MemberProfileDialog
        open={!!memberToView}
        onOpenChange={() => setMemberToView(null)}
        member={memberToView}
      />
    </>
  );
}
