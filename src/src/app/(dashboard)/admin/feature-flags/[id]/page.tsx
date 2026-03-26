"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingState } from "@/components/shared/states";

interface FlagDetail {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  defaultState: string;
  assignments: Array<{ id: string; level: string; targetId: string; state: string; createdAt: string }>;
}

export default function FlagDetailPage() {
  const params = useParams();
  const flagId = params["id"] as string;
  const [flag, setFlag] = React.useState<FlagDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/feature-flags/${flagId}`);
        if (res.ok) setFlag(await res.json());
      } finally { setIsLoading(false); }
    })();
  }, [flagId]);

  if (isLoading) return <LoadingState rows={3} />;
  if (!flag) return <div className="text-muted-foreground">Flag not found</div>;

  const grouped: Record<string, typeof flag.assignments> = {};
  for (const a of flag.assignments) {
    if (!grouped[a.level]) grouped[a.level] = [];
    grouped[a.level]!.push(a);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={flag.name}
        description={flag.description ?? flag.code}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Feature Flags", href: "/admin/feature-flags" },
          { label: flag.name },
        ]}
        actions={<StatusBadge status={flag.defaultState} />}
      />

      <Card>
        <CardHeader><CardTitle className="text-base">Overrides ({flag.assignments.length})</CardTitle></CardHeader>
        <CardContent>
          {flag.assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Using default state for all contexts</p>
          ) : (
            Object.entries(grouped).map(([level, items]) => (
              <div key={level} className="mb-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">{level}</h4>
                {items.map((a) => (
                  <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-sm font-mono">{a.targetId}</span>
                    <StatusBadge status={a.state} size="sm" />
                  </div>
                ))}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
