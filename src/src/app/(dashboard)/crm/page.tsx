"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface LeadRow { id: string; companyName: string; contactName: string; status: string; source: string | null; createdAt: string }
interface EstimateRow { id: string; estimateNumber: string; jobName: string | null; status: string; totalAmount: number; _count: { lines: number }; createdAt: string }

const leadColumns: DataTableColumn<LeadRow>[] = [
  { id: "company", header: "Company", cell: (r) => <span className="font-medium">{r.companyName}</span>, sortable: true },
  { id: "contact", header: "Contact", accessorFn: (r) => r.contactName },
  { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} size="sm" /> },
  { id: "source", header: "Source", accessorFn: (r) => r.source ?? "—", className: "text-xs" },
];

const estimateColumns: DataTableColumn<EstimateRow>[] = [
  { id: "number", header: "Estimate #", cell: (r) => <span className="font-mono text-xs">{r.estimateNumber}</span>, sortable: true },
  { id: "job", header: "Job", accessorFn: (r) => r.jobName ?? "—" },
  { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} size="sm" /> },
  { id: "amount", header: "Amount", cell: (r) => <span className="font-mono text-xs">${Number(r.totalAmount).toLocaleString()}</span>, className: "text-right" },
  { id: "lines", header: "Lines", accessorFn: (r) => r._count.lines, className: "text-center font-mono" },
];

export default function CRMPage() {
  const [leads, setLeads] = React.useState<LeadRow[]>([]);
  const [estimates, setEstimates] = React.useState<EstimateRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const [l, e] = await Promise.all([fetch("/api/crm/leads"), fetch("/api/crm/estimates")]);
        if (l.ok) setLeads(await l.json());
        if (e.ok) setEstimates(await e.json());
      } finally { setIsLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="CRM" description="Leads, estimates, and revenue recovery"
        breadcrumbs={[{ label: "CRM" }]}
        actions={<Button className="font-mono uppercase tracking-wider text-xs">+ New Lead</Button>} />

      <Tabs defaultValue="leads">
        <TabsList>
          <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
          <TabsTrigger value="estimates">Estimates ({estimates.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="leads" className="mt-4">
          <DataTable columns={leadColumns} data={leads} total={leads.length} isLoading={isLoading}
            searchPlaceholder="Search leads..." emptyMessage="No leads" rowKey={(r) => r.id} />
        </TabsContent>
        <TabsContent value="estimates" className="mt-4">
          <DataTable columns={estimateColumns} data={estimates} total={estimates.length} isLoading={isLoading}
            emptyMessage="No estimates" rowKey={(r) => r.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
