"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Mail,
  KeyRound,
  UserPlus,
  ArrowRight,
} from "lucide-react";

const successMessages = {
  register: {
    title: "Account created successfully!",
    description:
      "Welcome to NexSplit! We've sent a verification email to your inbox.",
    icon: UserPlus,
    action: "Verify your email",
    actionLink: "/auth/verify-email",
    secondaryAction: "Sign in",
    secondaryLink: "/auth/login",
  },
  "verify-email": {
    title: "Email verified successfully!",
    description:
      "Your email has been verified. You can now sign in to your account.",
    icon: Mail,
    action: "Sign in to your account",
    actionLink: "/auth/login",
  },
  "forgot-password": {
    title: "Reset link sent!",
    description:
      "We've sent a password reset link to your email. Check your inbox and follow the instructions.",
    icon: KeyRound,
    action: "Check your email",
    actionLink: "/auth/login",
    secondaryAction: "Back to sign in",
    secondaryLink: "/auth/login",
  },
  "reset-password": {
    title: "Password reset successfully!",
    description:
      "Your password has been updated. You can now sign in with your new password.",
    icon: CheckCircle,
    action: "Sign in",
    actionLink: "/auth/login",
  },
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const type =
    (searchParams.get("type") as keyof typeof successMessages) || "register";

  const config = successMessages[type] || successMessages.register;
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <IconComponent className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {config.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{config.description}</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">What's next?</CardTitle>
            <CardDescription>
              {type === "register" &&
                "Check your email and verify your account to get started."}
              {type === "verify-email" &&
                "Your account is ready! Sign in to start using NexSplit."}
              {type === "forgot-password" &&
                "Look for an email from us with password reset instructions."}
              {type === "reset-password" &&
                "Your account is secure with your new password."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={config.actionLink}>
              <Button className="w-full">
                {config.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {config.secondaryAction && config.secondaryLink && (
              <Link href={config.secondaryLink}>
                <Button variant="outline" className="w-full">
                  {config.secondaryAction}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {type === "register" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Check your email
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    We sent a verification link to your email address. Click the
                    link to activate your account.
                  </p>
                  <p className="mt-1">
                    Didn't receive the email? Check your spam folder or{" "}
                    <Link
                      href="/auth/verify-email"
                      className="font-medium underline"
                    >
                      resend verification code
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <Link
              href="/support"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
