"use client";

import { useState } from "react";
import { useActiveNexGroupsQuery } from "@/lib/api/queries";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import CreateNexDialog from "@/components/expenses/CreateNexDialog";
import NexCard from "@/components/expenses/NexCard";

export default function ExpensesPage() {
  const [page, setPage] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch active nex
  const {
    data: nexData,
    isLoading,
    error,
    refetch,
  } = useActiveNexGroupsQuery(page, 20);

  console.log("Nex Data:", nexData);
  const nexList = nexData?.data || [];
  const totalPages = nexData?.totalPages || 0;

  const handleCreateNex = () => {
    refetch(); // Refresh the list after creating a nex
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your nex and split expenses
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search */}
          <div className="relative w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search nex..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Nex
            </Button>
          </div>

          {/* Nex Grid */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load nex</p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : nexList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2">No nex yet</p>
              <p className="text-sm text-gray-600 mb-4">
                Create your first nex to start tracking expenses
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nexList.map((nex) => (
                <NexCard key={nex.id} nex={nex} onUpdate={refetch} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Nex Dialog */}
      <CreateNexDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateNex}
      />
    </DashboardLayout>
  );
}
