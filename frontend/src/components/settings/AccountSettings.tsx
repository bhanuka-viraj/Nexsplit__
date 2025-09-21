"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api";
import { tokenManager, userManager } from "@/lib/auth";
import { UserProfileDto } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  AlertTriangle,
  Calendar,
  Mail,
  Phone,
  User,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface AccountSettingsProps {
  user: UserProfileDto;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const router = useRouter();

  const deactivateAccountMutation = useMutation({
    mutationFn: userApi.deactivateAccount,
    onSuccess: () => {
      toast.success("Account deactivated successfully");
      tokenManager.clearTokens();
      userManager.clearUser();
      router.push("/auth/login");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to deactivate account";
      toast.error(message);
      setShowDeactivateDialog(false);
    },
  });

  const handleDeactivateAccount = () => {
    deactivateAccountMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
          <CardDescription>
            View your account details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Email Address
                  </p>
                  <p className="text-sm text-gray-900">{user.email}</p>
                  <Badge
                    variant={user.isEmailValidate ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {user.isEmailValidate ? "Verified" : "Pending Verification"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Contact Number
                  </p>
                  <p className="text-sm text-gray-900">{user.contactNumber}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Account Status
                  </p>
                  <Badge variant="outline">{user.status}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Account Created
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Last Modified
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(user.modifiedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Authentication Method
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">Email & Password</Badge>
                    {user.isGoogleAuth && (
                      <Badge variant="outline">Google OAuth</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Once you deactivate your account, there is no going back. This
                action cannot be undone.
              </AlertDescription>
            </Alert>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  Deactivate Account
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Permanently deactivate your account and delete all associated
                  data
                </p>
              </div>

              <Dialog
                open={showDeactivateDialog}
                onOpenChange={setShowDeactivateDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Deactivate Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Confirm Account Deactivation</span>
                    </DialogTitle>
                    <DialogDescription>
                      <div className="space-y-2">
                        <p>
                          Are you absolutely sure you want to deactivate your
                          account?
                        </p>
                        <p className="font-medium">This action will:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Permanently delete your profile</li>
                          <li>Remove you from all groups and expenses</li>
                          <li>Delete all your transaction history</li>
                          <li>Cancel any pending settlements</li>
                        </ul>
                        <p className="text-red-600 font-medium">
                          This action cannot be undone.
                        </p>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeactivateDialog(false)}
                      disabled={deactivateAccountMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeactivateAccount}
                      disabled={deactivateAccountMutation.isPending}
                    >
                      {deactivateAccountMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deactivating...
                        </>
                      ) : (
                        "Yes, Deactivate Account"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
