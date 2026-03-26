"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

interface MatchRow {
  id: string;
  poNumber: string;
  vendor: string;
  receiptId: string;
  invoiceNumber: string;
  status: string;
  variance: number;
  createdAt: string;
}

const columns: DataTableColumn<MatchRow>[] = [
  {
    id: "po",
    header: "PO #",
    cell: (r) => (
      <span className="font-mono text-xs font-medium">{r.poNumber}</span>
    ),
    sortable: true,
  },
  {
    id: "vendor",
    header: "Vendor",
    cell: (r) => <span className="text-sm">{r.vendor}</span>,
  },
  {
    id: "receipt",
    header: "Receipt",
    cell: (r) => (
      <span className="font-mono text-xs">{r.receiptId.slice(0, 8)}</span>
    ),
  },
  {
    id: "invoice",
    header: "Invoice #",
    cell: (r) => <span className="font-mono text-xs">{r.invoiceNumber}</span>,
  },
  {
    id: "status",
    header: "Status",
    cell: (r) => <StatusBadge status={r.status} size="sm" />,
  },
  {
    id: "variance",
    header: "Variance",
    cell: (r) => {
      const v = Number(r.variance);
      return (
        <span
          className={`font-mono text-xs ${v !== 0 ? "text-destructive" : "text-success"}`}
        >
          ${v.toFixed(2)}
        </span>
      );
    },
    className: "text-right",
    sortable: true,
  },
];

export default function ThreeWayMatchPage() {
  const [data, setData] = React.useState<MatchRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/purchasing/match");
        if (res.ok) setData(await res.json());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Three-Way Match"
        description="PO vs Receipt vs Invoice match review queue"
        breadcrumbs={[
          { label: "Purchasing", href: "/purchasing" },
          { label: "Match" },
        ]}
      />

      <DataTable
        columns={columns}
        data={data}
        total={data.length}
        isLoading={isLoading}
        searchPlaceholder="Search by PO or vendor..."
        emptyMessage="No items pending match review"
        rowKey={(r) => r.id}
      />
    </div>
  );
}
