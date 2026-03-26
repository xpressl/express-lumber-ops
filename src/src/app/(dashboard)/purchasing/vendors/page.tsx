"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

interface VendorRow {
  id: string;
  code: string;
  name: string;
  status: string;
  reliabilityScore: number | null;
  _count: { purchaseOrders: number; prices: number };
}

const columns: DataTableColumn<VendorRow>[] = [
  {
    id: "code",
    header: "Code",
    cell: (r) => <span className="font-mono text-xs">{r.code}</span>,
  },
  {
    id: "name",
    header: "Vendor",
    cell: (r) => <span className="font-medium">{r.name}</span>,
    sortable: true,
  },
  {
    id: "status",
    header: "Status",
    cell: (r) => <StatusBadge status={r.status} size="sm" />,
  },
  {
    id: "reliability",
    header: "Reliability",
    cell: (r) =>
      r.reliabilityScore ? (
        <span className="font-mono text-xs">
          {(Number(r.reliabilityScore) * 100).toFixed(0)}%
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    className: "text-center",
  },
  {
    id: "pos",
    header: "PO Count",
    accessorFn: (r) => r._count.purchaseOrders,
    className: "text-center font-mono",
  },
  {
    id: "products",
    header: "Products",
    accessorFn: (r) => r._count.prices,
    className: "text-center font-mono",
  },
];

export default function VendorsPage() {
  const [data, setData] = React.useState<VendorRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/purchasing/vendors");
        if (res.ok) setData(await res.json());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vendors"
        description="All vendor accounts and performance metrics"
        breadcrumbs={[
          { label: "Purchasing", href: "/purchasing" },
          { label: "Vendors" },
        ]}
      />

      <DataTable
        columns={columns}
        data={data}
        total={data.length}
        isLoading={isLoading}
        searchPlaceholder="Search vendors..."
        emptyMessage="No vendors found"
        rowKey={(r) => r.id}
      />
    </div>
  );
}
