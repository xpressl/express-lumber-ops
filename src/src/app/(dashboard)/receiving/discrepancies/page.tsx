"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

interface ReceivingRow {
  id: string;
  purchaseOrderId: string;
  status: string;
  totalLinesExpected: number;
  totalLinesReceived: number;
  hasDiscrepancy: boolean;
  receivedAt: string;
}

const columns: DataTableColumn<ReceivingRow>[] = [
  {
    id: "po",
    header: "PO",
    cell: (r) => (
      <span className="font-mono text-xs">
        {r.purchaseOrderId.slice(0, 8)}
      </span>
    ),
    sortable: true,
  },
  {
    id: "status",
    header: "Status",
    cell: (r) => <StatusBadge status={r.status} size="sm" />,
  },
  {
    id: "lines",
    header: "Lines",
    cell: (r) => (
      <span className="font-mono text-xs">
        {r.totalLinesReceived}/{r.totalLinesExpected}
      </span>
    ),
    className: "text-center",
  },
  {
    id: "discrepancy",
    header: "Discrepancy",
    cell: (r) =>
      r.hasDiscrepancy ? (
        <span className="text-sm text-destructive font-mono">YES</span>
      ) : (
        <span className="text-sm text-muted-foreground">No</span>
      ),
  },
  {
    id: "received",
    header: "Received",
    cell: (r) => (
      <span className="text-xs text-muted-foreground">
        {r.receivedAt
          ? new Date(r.receivedAt).toLocaleDateString()
          : "—"}
      </span>
    ),
  },
];

export default function DiscrepanciesPage() {
  const router = useRouter();
  const [data, setData] = React.useState<ReceivingRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/receiving?hasDiscrepancy=true");
        if (res.ok) setData(await res.json());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Discrepancies"
        description="Receiving records with quantity or quality discrepancies"
        breadcrumbs={[
          { label: "Receiving", href: "/receiving" },
          { label: "Discrepancies" },
        ]}
      />

      <DataTable
        columns={columns}
        data={data}
        total={data.length}
        isLoading={isLoading}
        searchPlaceholder="Search by PO..."
        emptyMessage="No discrepancies found"
        rowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/receiving/${r.id}`)}
      />
    </div>
  );
}
