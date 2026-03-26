"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

interface PORow {
  id: string;
  poNumber: string;
  vendor: { name: string };
  status: string;
  totalAmount: number;
  _count: { lines: number };
  createdAt: string;
}

const columns: DataTableColumn<PORow>[] = [
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
    cell: (r) => <span className="text-sm">{r.vendor.name}</span>,
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
        ${Number(r.totalAmount).toLocaleString()}
      </span>
    ),
    className: "text-right",
  },
  {
    id: "lines",
    header: "Lines",
    accessorFn: (r) => r._count.lines,
    className: "text-center font-mono",
  },
];

export default function PurchaseOrdersPage() {
  const [data, setData] = React.useState<PORow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/purchasing/pos");
        if (res.ok) setData(await res.json());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Purchase Orders"
        description="All purchase orders across vendors"
        breadcrumbs={[
          { label: "Purchasing", href: "/purchasing" },
          { label: "Purchase Orders" },
        ]}
      />

      <DataTable
        columns={columns}
        data={data}
        total={data.length}
        isLoading={isLoading}
        searchPlaceholder="Search POs..."
        emptyMessage="No purchase orders found"
        rowKey={(r) => r.id}
      />
    </div>
  );
}
