"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, History, BarChart3, Play } from "lucide-react";
import { NexMember } from "@/types/nex";
import SettlementSummaryCard from "./SettlementSummaryCard";
import SettlementHistoryTable from "./SettlementHistoryTable";
import ExecuteSettlementDialog from "./ExecuteSettlementDialog";

interface SettlementsSectionProps {
  nexId: string;
  members: NexMember[];
}

export default function SettlementsSection({
  nexId,
  members,
}: SettlementsSectionProps) {
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Settlement Management</h3>
          <p className="text-sm text-gray-600">
            Track and execute settlements for this nex
          </p>
        </div>
        <Button onClick={() => setShowExecuteDialog(true)}>
          <Play className="h-4 w-4 mr-2" />
          Execute Settlements
        </Button>
      </div>

      {/* Settlement Summary Cards */}
      <SettlementSummaryCard nexId={nexId} />

      {/* Settlement Tabs */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Settlement History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <SettlementHistoryTable nexId={nexId} />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Settlement Analytics
              </CardTitle>
              <CardDescription>
                Detailed analytics and insights about settlement patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  Analytics Coming Soon
                </p>
                <p className="text-sm">
                  Detailed settlement analytics and charts will be available
                  here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Execute Settlement Dialog */}
      <ExecuteSettlementDialog
        open={showExecuteDialog}
        onOpenChange={setShowExecuteDialog}
        nexId={nexId}
        members={members}
      />
    </div>
  );
}
