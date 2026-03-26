"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingState } from "@/components/shared/states";
import { ClipboardList, Loader, CheckCircle, AlertTriangle } from "lucide-react";

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

export default function YardWorkloadPage() {
  const [tasks, setTasks] = React.useState<YardTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/yard/tasks");
        if (res.ok) setTasks(await res.json());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <LoadingState rows={4} />;

  const pending = tasks.filter((t) => t.status === "PENDING");
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completed = tasks.filter((t) => t.status === "COMPLETED");
  const blocked = tasks.filter((t) => t.status === "BLOCKED");

  /** Group tasks by type for the breakdown view */
  const byType = tasks.reduce<Record<string, YardTask[]>>((acc, t) => {
    const key = t.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title="Yard Workload"
        description="Task distribution and status breakdown"
        breadcrumbs={[
          { label: "Yard", href: "/yard" },
          { label: "Workload" },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Pending"
          value={pending.length}
          icon={ClipboardList}
          accent="warning"
        />
        <KPICard
          title="In Progress"
          value={inProgress.length}
          icon={Loader}
          accent="copper"
        />
        <KPICard
          title="Completed"
          value={completed.length}
          icon={CheckCircle}
          accent="success"
        />
        <KPICard
          title="Blocked"
          value={blocked.length}
          icon={AlertTriangle}
          accent={blocked.length > 0 ? "destructive" : "default"}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight font-[family-name:var(--font-heading)]">
          By Task Type
        </h2>

        {Object.keys(byType).length === 0 ? (
          <Card className="card-warm">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No yard tasks at this time.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(byType).map(([type, typeTasks]) => {
              const typePending = typeTasks.filter(
                (t) => t.status === "PENDING"
              ).length;
              const typeInProgress = typeTasks.filter(
                (t) => t.status === "IN_PROGRESS"
              ).length;
              return (
                <Card key={type} className="card-warm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        {type.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {typeTasks.length} task
                        {typeTasks.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {typePending > 0 && (
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status="PENDING" size="sm" />
                          <span className="text-xs font-mono">
                            {typePending}
                          </span>
                        </div>
                      )}
                      {typeInProgress > 0 && (
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status="IN_PROGRESS" size="sm" />
                          <span className="text-xs font-mono">
                            {typeInProgress}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
