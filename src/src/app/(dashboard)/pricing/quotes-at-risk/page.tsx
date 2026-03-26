"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function QuotesAtRiskPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Quotes at Risk"
        description="Quotes where underlying costs have shifted since issuance"
        breadcrumbs={[
          { label: "Pricing", href: "/pricing" },
          { label: "Quotes at Risk" },
        ]}
      />

      <Card className="card-warm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-3 rounded-full bg-warning/10 text-warning mb-4">
            <AlertTriangle size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            No Quotes at Risk
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Quotes where underlying costs have changed since the quote was
            issued will appear here. The system continuously monitors cost
            changes and flags affected quotes automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
