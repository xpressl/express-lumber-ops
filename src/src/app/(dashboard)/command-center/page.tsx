"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { ExceptionCard } from "@/components/shared/exception-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/shared/states";

interface ExceptionSummary {
  total: number;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
}

interface ExceptionItem {
  id: string; category: string; severity: string; status: string; title: string;
  description: string | null; entityType: string; entityName: string | null;
  slaTargetAt: string | null; createdAt: string; priorityScore: number;
}

export default function CommandCenterPage() {
  const [summary, setSummary] = React.useState<ExceptionSummary | null>(null);
  const [exceptions, setExceptions] = React.useState<ExceptionItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const [sRes, eRes] = await Promise.all([
          fetch("/api/exceptions?view=summary"),
          fetch("/api/exceptions?severity=CRITICAL"),
        ]);
        if (sRes.ok) setSummary(await sRes.json());
        if (eRes.ok) setExceptions(await eRes.json());
      } finally { setIsLoading(false); }
    })();
  }, []);

  if (isLoading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Command Center" description="Operational overview — what needs attention right now" />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KPICard title="Open Exceptions" value={summary?.total ?? 0} trend={summary && summary.total > 0 ? "down" : "flat"} />
        <KPICard title="Critical" value={summary?.bySeverity?.["CRITICAL"] ?? 0} />
        <KPICard title="High" value={summary?.bySeverity?.["HIGH"] ?? 0} />
        <KPICard title="Medium" value={summary?.bySeverity?.["MEDIUM"] ?? 0} />
        <KPICard title="Low" value={summary?.bySeverity?.["LOW"] ?? 0} />
        <KPICard title="Categories" value={Object.keys(summary?.byCategory ?? {}).length} />
      </div>

      {/* Department Health */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {["Dispatch", "Yard", "Delivery", "Collections", "Purchasing", "Pricing"].map((dept) => (
          <Card key={dept}>
            <CardContent className="pt-3 text-center">
              <p className="text-[10px] font-mono text-muted-foreground uppercase">{dept}</p>
              <p className="text-sm font-medium mt-1 text-success">Operational</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Exceptions */}
      <Card>
        <CardHeader><CardTitle className="text-base">Top Exceptions</CardTitle></CardHeader>
        <CardContent>
          {exceptions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No critical exceptions</p>
          ) : (
            <div className="space-y-2">
              {exceptions.slice(0, 5).map((ex) => (
                <ExceptionCard key={ex.id} {...ex} description={ex.description ?? undefined} entityName={ex.entityName ?? undefined} slaTargetAt={ex.slaTargetAt ?? undefined} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
