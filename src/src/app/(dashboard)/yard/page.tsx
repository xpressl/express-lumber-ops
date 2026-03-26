"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/shared/kpi-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/shared/states";

interface YardTask {
  id: string;
  type: string;
  orderId: string | null;
  assignedTo: string | null;
  priority: number;
  status: string;
  bay: string | null;
  notes: string | null;
  createdAt: string;
}

export default function YardPage() {
  const [tasks, setTasks] = React.useState<YardTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchTasks = React.useCallback(async () => {
    try {
      const res = await fetch("/api/yard/tasks");
      if (res.ok) setTasks(await res.json());
    } finally { setIsLoading(false); }
  }, []);

  React.useEffect(() => { void fetchTasks(); }, [fetchTasks]);

  async function handleAction(taskId: string, action: string) {
    await fetch(`/api/yard/tasks/${taskId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    void fetchTasks();
  }

  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;

  if (isLoading) return <LoadingState rows={4} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Yard" description="Task queue, prep, loading, and bay management"
        breadcrumbs={[{ label: "Yard" }]} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Pending" value={pending} />
        <KPICard title="In Progress" value={inProgress} />
        <KPICard title="Total Active" value={tasks.length} />
        <KPICard title="Blocked" value={tasks.filter((t) => t.status === "BLOCKED").length} />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="prep">Prep</TabsTrigger>
          <TabsTrigger value="loading">Loading</TabsTrigger>
        </TabsList>

        {["all", "prep", "loading"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="space-y-2">
              {tasks
                .filter((t) => tab === "all" || (tab === "prep" && t.type === "ORDER_PREP") || (tab === "loading" && t.type === "LOADING"))
                .map((task) => (
                  <Card key={task.id}>
                    <CardContent className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={task.status} size="sm" />
                        <span className="text-[10px] font-mono uppercase text-muted-foreground">{task.type.replace(/_/g, " ")}</span>
                        {task.bay && <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">Bay {task.bay}</span>}
                        {task.orderId && <span className="text-xs font-mono text-muted-foreground">{task.orderId.slice(0, 8)}</span>}
                      </div>
                      <div className="flex gap-1">
                        {task.status === "PENDING" && <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => void handleAction(task.id, "start")}>Start</Button>}
                        {task.status === "IN_PROGRESS" && <Button size="sm" className="text-xs h-7" onClick={() => void handleAction(task.id, "complete")}>Complete</Button>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
