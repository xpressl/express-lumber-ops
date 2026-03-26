"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function PriceImportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Price Import"
        description="Upload and process vendor price lists"
        breadcrumbs={[
          { label: "Pricing", href: "/pricing" },
          { label: "Import" },
        ]}
      />

      <Card className="card-warm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
            <Upload size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            Price List Import
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Upload vendor price lists in CSV or Excel format. The import engine
            will parse the file, match products by SKU, detect cost changes, and
            queue updates for review before applying them to the system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
