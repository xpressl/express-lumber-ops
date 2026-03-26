"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface VendorRow { id: string; code: string; name: string; status: string; reliabilityScore: number | null; _count: { purchaseOrders: number; prices: number } }
interface PORow { id: string; poNumber: string; vendor: { name: string }; status: string; totalAmount: number; _count: { lines: number }; createdAt: string }

const vendorColumns: DataTableColumn<VendorRow>[] = [
  { id: "code", header: "Code", cell: (r) => <span className="font-mono text-xs">{r.code}</span> },
  { id: "name", header: "Vendor", cell: (r) => <span className="font-medium">{r.name}</span>, sortable: true },
  { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} size="sm" /> },
  { id: "reliability", header: "Reliability", cell: (r) => r.reliabilityScore ? <span className="font-mono text-xs">{(Number(r.reliabilityScore) * 100).toFixed(0)}%</span> : <span className="text-muted-foreground">—</span>, className: "text-center" },
  { id: "pos", header: "POs", accessorFn: (r) => r._count.purchaseOrders, className: "text-center font-mono" },
  { id: "products", header: "Products", accessorFn: (r) => r._count.prices, className: "text-center font-mono" },
];

const poColumns: DataTableColumn<PORow>[] = [
  { id: "po", header: "PO #", cell: (r) => <span className="font-mono text-xs font-medium">{r.poNumber}</span>, sortable: true },
  { id: "vendor", header: "Vendor", cell: (r) => <span className="text-sm">{r.vendor.name}</span> },
  { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} size="sm" /> },
  { id: "amount", header: "Amount", cell: (r) => <span className="font-mono text-xs">${Number(r.totalAmount).toLocaleString()}</span>, className: "text-right" },
  { id: "lines", header: "Lines", accessorFn: (r) => r._count.lines, className: "text-center font-mono" },
];

export default function PurchasingPage() {
  const router = useRouter();
  const [vendors, setVendors] = React.useState<VendorRow[]>([]);
  const [pos, setPOs] = React.useState<PORow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const [v, p] = await Promise.all([fetch("/api/purchasing/vendors"), fetch("/api/purchasing/pos")]);
        if (v.ok) setVendors(await v.json());
        if (p.ok) setPOs(await p.json());
      } finally { setIsLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Purchasing" description="Vendors, POs, and three-way match"
        breadcrumbs={[{ label: "Purchasing" }]}
        actions={<Button className="font-mono uppercase tracking-wider text-xs">+ New PO</Button>} />

      <Tabs defaultValue="vendors">
        <TabsList>
          <TabsTrigger value="vendors">Vendors ({vendors.length})</TabsTrigger>
          <TabsTrigger value="pos">Purchase Orders ({pos.length})</TabsTrigger>
          <TabsTrigger value="match">Match Queue</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>
        <TabsContent value="vendors" className="mt-4">
          <DataTable columns={vendorColumns} data={vendors} total={vendors.length} isLoading={isLoading}
            searchPlaceholder="Search vendors..." emptyMessage="No vendors" rowKey={(r) => r.id} />
        </TabsContent>
        <TabsContent value="pos" className="mt-4">
          <DataTable columns={poColumns} data={pos} total={pos.length} isLoading={isLoading}
            emptyMessage="No purchase orders" rowKey={(r) => r.id} />
        </TabsContent>
        <TabsContent value="match" className="mt-4 text-center text-muted-foreground text-sm py-8">
          Three-way match review queue (PO vs Receipt vs Invoice)
        </TabsContent>
        <TabsContent value="claims" className="mt-4 text-center text-muted-foreground text-sm py-8">
          Vendor claims and settlements
        </TabsContent>
      </Tabs>
    </div>
  );
}
