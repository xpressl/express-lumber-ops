"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/states";

interface ApprovalDetail {
  id: string;
  policy: { name: string; actionType: string };
  requester: { firstName: string; lastName: string; email: string };
  entityType: string;
  entityId: string;
  status: string;
  reason: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
  expiresAt: string;
  resolutionNote: string | null;
}

export default function ApprovalDetailPage() {
  const params = useParams();
  const id = params["id"] as string;
  const [approval, setApproval] = React.useState<ApprovalDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/approvals/${id}`);
        if (res.ok) setApproval(await res.json());
      } finally { setIsLoading(false); }
    })();
  }, [id]);

  async function handleAction(action: "approve" | "deny") {
    await fetch(`/api/approvals/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const res = await fetch(`/api/approvals/${id}`);
    if (res.ok) setApproval(await res.json());
  }

  if (isLoading) return <LoadingState rows={4} />;
  if (!approval) return <div className="text-muted-foreground">Approval not found</div>;

  return (
    <div className="space-y-6">
      <PageHeader title={approval.policy.name} description={`${approval.entityType} approval request`}
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Approvals", href: "/admin/approvals" }, { label: approval.policy.name }]}
        actions={<StatusBadge status={approval.status} />} />

      <Card>
        <CardHeader><CardTitle className="text-base">Request Details</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Requester</span><span>{approval.requester.firstName} {approval.requester.lastName}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Entity</span><span className="font-mono">{approval.entityType}:{approval.entityId.slice(0, 8)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Reason</span><span>{approval.reason}</span></div>
          {approval.resolutionNote && <div className="flex justify-between"><span className="text-muted-foreground">Resolution</span><span>{approval.resolutionNote}</span></div>}
        </CardContent>
      </Card>

      {approval.status === "PENDING" && (
        <div className="flex gap-3">
          <Button variant="destructive" onClick={() => void handleAction("deny")} className="flex-1">Deny</Button>
          <Button onClick={() => void handleAction("approve")} className="flex-1">Approve</Button>
        </div>
      )}
    </div>
  );
}
