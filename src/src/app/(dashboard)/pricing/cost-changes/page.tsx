"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";

interface CostChangeRow {
  id: string;
  product: { sku: string; name: string; currentSell: number };
  oldCost: number;
  newCost: number;
  changePercent: number;
  source: string;
  effectiveAt: string;
}

const columns: DataTableColumn<CostChangeRow>[] = [
  {
    id: "sku",
    header: "SKU",
    cell: (r) => <span className="font-mono text-xs">{r.product.sku}</span>,
    sortable: true,
  },
  {
    id: "product",
    header: "Product",
    cell: (r) => <span className="text-sm">{r.product.name}</span>,
  },
  {
    id: "old",
    header: "Old Cost",
    cell: (r) => (
      <span className="font-mono text-xs">
        ${Number(r.oldCost).toFixed(4)}
      </span>
    ),
    className: "text-right",
  },
  {
    id: "new",
    header: "New Cost",
    cell: (r) => (
      <span className="font-mono text-xs">
        ${Number(r.newCost).toFixed(4)}
      </span>
    ),
    className: "text-right",
  },
  {
    id: "change",
    header: "Change %",
    cell: (r) => {
      const pct = Number(r.changePercent);
      return (
        <span
          className={`font-mono text-xs ${pct > 0 ? "text-destructive" : "text-success"}`}
        >
          {pct > 0 ? "+" : ""}
          {pct.toFixed(1)}%
        </span>
      );
    },
    className: "text-right",
    sortable: true,
  },
  {
    id: "source",
    header: "Source",
    accessorFn: (r) => r.source,
    className: "text-xs",
  },
];

export default function CostChangesPage() {
  const [data, setData] = React.useState<CostChangeRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/pricing");
        if (res.ok) setData(await res.json());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cost Changes"
        description="Recent vendor cost changes and their impact on margins"
        breadcrumbs={[
          { label: "Pricing", href: "/pricing" },
          { label: "Cost Changes" },
        ]}
      />

      <DataTable
        columns={columns}
        data={data}
        total={data.length}
        isLoading={isLoading}
        searchPlaceholder="Search by SKU or product..."
        emptyMessage="No recent cost changes"
        rowKey={(r) => r.id}
      />
    </div>
  );
}
