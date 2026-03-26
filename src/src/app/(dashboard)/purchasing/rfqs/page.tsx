"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function RFQsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="RFQs"
        description="Request for quote management"
        breadcrumbs={[
          { label: "Purchasing", href: "/purchasing" },
          { label: "RFQs" },
        ]}
      />

      <Card className="card-warm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
            <FileText size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            Request for Quotes
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Create and manage RFQs to solicit competitive pricing from vendors.
            Compare bids, track response deadlines, and convert winning quotes
            into purchase orders directly from this view.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
