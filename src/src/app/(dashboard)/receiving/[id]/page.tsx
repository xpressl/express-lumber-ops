"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { LoadingState } from "@/components/shared/states";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";

interface ReceivingLine {
  id: string;
  sku: string;
  description: string;
  expected: number;
  received: number;
  discrepancy: number;
}

interface ReceivingDetail {
  id: string;
  purchaseOrderId: string;
  status: string;
  lines: ReceivingLine[];
  receivedAt: string;
}

const lineColumns: DataTableColumn<ReceivingLine>[] = [
  {
    id: "sku",
    header: "SKU",
    cell: (r) => <span className="font-mono text-xs">{r.sku}</span>,
  },
  {
    id: "description",
    header: "Description",
    cell: (r) => <span className="text-sm">{r.description}</span>,
  },
  {
    id: "expected",
    header: "Expected",
    accessorFn: (r) => r.expected,
    className: "text-center font-mono",
  },
  {
    id: "received",
    header: "Received",
    accessorFn: (r) => r.received,
    className: "text-center font-mono",
  },
  {
    id: "discrepancy",
    header: "Discrepancy",
    cell: (r) =>
      r.discrepancy !== 0 ? (
        <span className="font-mono text-xs text-destructive">
          {r.discrepancy > 0 ? "+" : ""}
          {r.discrepancy}
        </span>
      ) : (
        <span className="font-mono text-xs text-success">0</span>
      ),
    className: "text-center",
  },
];

export default function ReceivingDetailPage() {
  const params = useParams();
  const id = params["id"] as string;
  const [record, setRecord] = React.useState<ReceivingDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/receiving/${id}`);
        if (res.ok) setRecord(await res.json());
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) return <LoadingState rows={6} />;

  if (!record) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Receiving Detail"
          breadcrumbs={[
            { label: "Receiving", href: "/receiving" },
            { label: "Not Found" },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Receiving record not found.
        </p>
      </div>
    );
  }

  const totalExpected = record.lines.reduce((s, l) => s + l.expected, 0);
  const totalReceived = record.lines.reduce((s, l) => s + l.received, 0);
  const discrepancyCount = record.lines.filter(
    (l) => l.discrepancy !== 0
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Receiving ${record.purchaseOrderId.slice(0, 8)}`}
        description={`Received ${record.receivedAt ? new Date(record.receivedAt).toLocaleDateString() : "—"}`}
        breadcrumbs={[
          { label: "Receiving", href: "/receiving" },
          { label: record.purchaseOrderId.slice(0, 8) },
        ]}
        actions={<StatusBadge status={record.status} size="lg" />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Total Lines"
          value={record.lines.length}
          icon={Package}
        />
        <KPICard title="Expected Qty" value={totalExpected} />
        <KPICard
          title="Received Qty"
          value={totalReceived}
          icon={CheckCircle}
          accent={totalReceived === totalExpected ? "success" : "warning"}
        />
        <KPICard
          title="Discrepancies"
          value={discrepancyCount}
          icon={AlertTriangle}
          accent={discrepancyCount > 0 ? "destructive" : "success"}
        />
      </div>

      <DataTable
        columns={lineColumns}
        data={record.lines}
        total={record.lines.length}
        emptyMessage="No line items"
        rowKey={(r) => r.id}
      />
    </div>
  );
}
