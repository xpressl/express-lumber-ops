"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

interface FlagRow {
  id: string;
  code: string;
  name: string;
  category: string | null;
  defaultState: string;
  _count: { assignments: number };
}

const columns: DataTableColumn<FlagRow>[] = [
  { id: "name", header: "Flag", cell: (row) => (
    <div><span className="font-medium">{row.name}</span><span className="text-[10px] font-mono text-muted-foreground ml-2">{row.code}</span></div>
  ), sortable: true },
  { id: "category", header: "Category", accessorFn: (row) => row.category ?? "—", className: "font-mono text-xs" },
  { id: "defaultState", header: "Default", cell: (row) => <StatusBadge status={row.defaultState} size="sm" /> },
  { id: "overrides", header: "Overrides", accessorFn: (row) => row._count.assignments, className: "text-center font-mono" },
];

export default function FeatureFlagsPage() {
  const router = useRouter();
  const [data, setData] = React.useState<FlagRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/feature-flags");
        if (res.ok) setData(await res.json());
      } finally { setIsLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Flags"
        description="Control feature availability by company, branch, role, or user"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Feature Flags" }]}
      />
      <DataTable
        columns={columns} data={data} total={data.length} isLoading={isLoading}
        emptyMessage="No feature flags" rowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/admin/feature-flags/${r.id}`)}
      />
    </div>
  );
}
