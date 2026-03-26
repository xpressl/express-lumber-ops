"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/states";

interface RouteData {
  id: string;
  routeNumber: string;
  status: string;
  totalStops: number;
  completedStops: number;
  truck: { number: string; type: string };
  stops: Array<{
    id: string;
    sequence: number;
    customerName: string;
    status: string;
    outcome: string | null;
    address: Record<string, string>;
    appointmentWindow: string | null;
    deliveryProof: unknown | null;
    codCollection: unknown | null;
  }>;
}

export default function DeliveryPage() {
  const [route, setRoute] = React.useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/delivery");
        if (res.ok) setRoute(await res.json());
      } finally { setIsLoading(false); }
    })();
  }, []);

  if (isLoading) return <LoadingState rows={5} />;

  if (!route) {
    return (
      <div className="space-y-6">
        <PageHeader title="Delivery" description="Today's route and stop execution" breadcrumbs={[{ label: "Delivery" }]} />
        <Card><CardContent className="py-12 text-center text-muted-foreground">No route assigned for today</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Route ${route.routeNumber}`}
        description={`${route.truck.number} (${route.truck.type}) · ${route.completedStops}/${route.totalStops} stops`}
        breadcrumbs={[{ label: "Delivery" }]}
        actions={<StatusBadge status={route.status} />} />

      <div className="space-y-2">
        {route.stops.map((stop) => (
          <Card key={stop.id} className={`border-l-4 ${stop.status === "COMPLETED" ? "border-l-success opacity-70" : stop.status === "ARRIVED" ? "border-l-primary" : "border-l-muted-foreground"}`}>
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-mono font-bold">{stop.sequence}</span>
                <div>
                  <p className="text-sm font-medium">{stop.customerName}</p>
                  <p className="text-xs text-muted-foreground">{stop.address?.["street"] ?? "—"}</p>
                  {stop.appointmentWindow && <p className="text-[10px] font-mono text-primary">{stop.appointmentWindow}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stop.deliveryProof ? <span className="text-[10px] font-mono text-success">POD</span> : null}
                {stop.codCollection ? <span className="text-[10px] font-mono text-warning">COD</span> : null}
                <StatusBadge status={stop.outcome ?? stop.status} size="sm" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
