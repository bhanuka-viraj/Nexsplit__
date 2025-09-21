"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">NexSplit</h1>
            <p className="text-lg text-gray-600 mb-8">
              Split expenses effortlessly with friends and family
            </p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>Welcome to NexSplit</CardTitle>
              <CardDescription>
                The easiest way to split bills, track expenses, and settle up
                with friends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Link href="/auth/login">
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Split</div>
                <div>Bills & Expenses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Track</div>
                <div>Who Owes What</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Settle</div>
                <div>Payments Easily</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
