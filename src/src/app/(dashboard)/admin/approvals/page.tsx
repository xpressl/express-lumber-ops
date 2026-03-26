"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDistanceToNow } from "date-fns";

interface ApprovalRow {
  id: string;
  policy: { name: string; actionType: string };
  requester: { firstName: string; lastName: string };
  entityType: string;
  entityId: string;
  status: string;
  reason: string;
  createdAt: string;
  expiresAt: string;
}

const columns: DataTableColumn<ApprovalRow>[] = [
  { id: "policy", header: "Policy", cell: (r) => <span className="font-medium">{r.policy.name}</span>, sortable: true },
  { id: "requester", header: "Requester", cell: (r) => `${r.requester.firstName} ${r.requester.lastName}` },
  { id: "entity", header: "Entity", cell: (r) => <span className="font-mono text-xs">{r.entityType}:{r.entityId.slice(0, 8)}</span> },
  { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} size="sm" /> },
  { id: "created", header: "Created", cell: (r) => formatDistanceToNow(new Date(r.createdAt), { addSuffix: true }), className: "text-xs" },
];

export default function ApprovalsPage() {
  const [data, setData] = React.useState<ApprovalRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/approvals?limit=50");
        if (res.ok) { const json = await res.json(); setData(json.data ?? json); }
      } finally { setIsLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Approval Requests" description="Review and manage pending approvals"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Approvals" }]} />
      <DataTable columns={columns} data={data} total={data.length} isLoading={isLoading}
        emptyMessage="No approval requests" rowKey={(r) => r.id} />
    </div>
  );
}
