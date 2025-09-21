"use client";

import { useState } from "react";
import { InvitationDto } from "@/types/auth";
import { useRespondToInvitationMutation } from "@/lib/api/mutations";
import { usePendingInvitationsQuery } from "@/lib/api/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Mail,
  Clock,
  Check,
  X,
  Users,
  Calendar,
  Loader2,
  Crown,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PendingInvitations() {
  const [invitationToRespond, setInvitationToRespond] = useState<{
    invitation: InvitationDto;
    accept: boolean;
  } | null>(null);

  // Fetch pending invitations
  const {
    data: invitations,
    isLoading,
    error,
    refetch,
  } = usePendingInvitationsQuery();

  // Respond to invitation mutation
  const respondMutation = useRespondToInvitationMutation();

  const handleRespond = () => {
    if (invitationToRespond) {
      respondMutation.mutate(
        {
          nexId: invitationToRespond.invitation.nexId,
          accept: invitationToRespond.accept,
        },
        {
          onSuccess: () => {
            setInvitationToRespond(null);
          },
          onError: () => {
            setInvitationToRespond(null);
          },
        }
      );
    }
  };

  const getUserInitials = (invitation: InvitationDto) => {
    const name = invitation.userName || "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to safely parse dates
  const parseDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Since the new format doesn't have expiration, we'll consider invitations as never expired
  // or you can implement logic based on createdAt + some time period
  const isExpired = (invitation: InvitationDto) => {
    const createdAt = parseDate(invitation.createdAt);
    if (!createdAt) return false;

    // Example: Consider invitation expired after 7 days
    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + 7);
    return expirationDate < new Date();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load invitations</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pendingInvitations = invitations?.data || [];

  if (pendingInvitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <span>Pending Invitations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No pending invitations</p>
          <p className="text-sm text-gray-400">
            You'll see group invitations here when someone invites you
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>Pending Invitations</span>
            </div>
            <Badge variant="secondary">{pendingInvitations.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingInvitations.map((invitation) => (
            <div
              key={invitation.id}
              className={`border rounded-lg p-4 ${isExpired(invitation)
                ? "border-red-200 bg-red-50"
                : "border-gray-200 bg-white"
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getUserInitials(invitation)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {invitation.nexName}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {invitation.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {invitation.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Received{" "}
                          {(() => {
                            const date = parseDate(invitation.createdAt);
                            return date ? format(date, "MMM d, yyyy") : "Unknown";
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          Expires{" "}
                          {(() => {
                            const createdAt = parseDate(invitation.createdAt);
                            if (!createdAt) return "Unknown";
                            const expiration = new Date(createdAt);
                            expiration.setDate(expiration.getDate() + 7);
                            return format(expiration, "MMM d, yyyy");
                          })()}
                        </span>
                      </div>
                      {!invitation.isRead && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    {isExpired(invitation) && (
                      <Badge variant="destructive" className="text-xs mt-2">
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>

                {!isExpired(invitation) && (
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setInvitationToRespond({
                          invitation,
                          accept: false,
                        })
                      }
                      disabled={respondMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        setInvitationToRespond({
                          invitation,
                          accept: true,
                        })
                      }
                      disabled={respondMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Respond to Invitation Confirmation Dialog */}
      <AlertDialog
        open={!!invitationToRespond}
        onOpenChange={() => setInvitationToRespond(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {invitationToRespond?.accept ? "Accept" : "Decline"} Invitation
            </AlertDialogTitle>
            <AlertDialogDescription>
              {invitationToRespond?.accept ? (
                <>
                  Are you sure you want to accept the invitation to join "
                  {invitationToRespond?.invitation.nexName}"? You'll be added to
                  the group and can start managing expenses.
                </>
              ) : (
                <>
                  Are you sure you want to decline the invitation to join "
                  {invitationToRespond?.invitation.nexName}"? This action cannot
                  be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRespond}
              className={
                invitationToRespond?.accept
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {invitationToRespond?.accept
                ? "Accept Invitation"
                : "Decline Invitation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
