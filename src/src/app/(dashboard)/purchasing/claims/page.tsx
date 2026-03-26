"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

interface ClaimRow {
  id: string;
  claimNumber: string;
  vendor: string;
  type: string;
  status: string;
  amount: number;
  poNumber: string;
  createdAt: string;
}

const columns: DataTableColumn<ClaimRow>[] = [
  {
    id: "claim",
    header: "Claim #",
    cell: (r) => (
      <span className="font-mono text-xs font-medium">{r.claimNumber}</span>
    ),
    sortable: true,
  },
  {
    id: "vendor",
    header: "Vendor",
    cell: (r) => <span className="text-sm">{r.vendor}</span>,
  },
  {
    id: "type",
    header: "Type",
    cell: (r) => (
      <span className="text-xs uppercase text-muted-foreground">
        {r.type.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    id: "po",
    header: "PO #",
    cell: (r) => <span className="font-mono text-xs">{r.poNumber}</span>,
  },
  {
    id: "status",
    header: "Status",
    cell: (r) => <StatusBadge status={r.status} size="sm" />,
  },
  {
    id: "amount",
    header: "Amount",
    cell: (r) => (
      <span className="font-mono text-xs">
        ${Number(r.amount).toLocaleString()}
      </span>
    ),
    className: "text-right",
    sortable: true,
  },
];

export default function VendorClaimsPage() {
  const [data, setData] = React.useState<ClaimRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/purchasing/claims");
        if (res.ok) setData(await res.json());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vendor Claims"
        description="Shortages, damages, and settlement tracking"
        breadcrumbs={[
          { label: "Purchasing", href: "/purchasing" },
          { label: "Claims" },
        ]}
      />

      <DataTable
        columns={columns}
        data={data}
        total={data.length}
        isLoading={isLoading}
        searchPlaceholder="Search claims..."
        emptyMessage="No vendor claims"
        rowKey={(r) => r.id}
      />
    </div>
  );
}
