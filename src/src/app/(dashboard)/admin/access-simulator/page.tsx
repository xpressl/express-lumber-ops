"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function AccessSimulatorPage() {
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [permissions, setPermissions] = React.useState<string[]>([]);

  // TODO: Fetch roles from API and resolve permissions for selected role
  const SAMPLE_ROLES = [
    "SUPER_ADMIN", "BRANCH_MANAGER", "DISPATCHER", "DRIVER", "YARD_WORKER",
    "COUNTER_SALES", "OUTSIDE_SALES", "COLLECTIONS_REP", "PURCHASING", "VIEWER",
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Access Simulator" description="Preview what a role or user can see and do"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Access Simulator" }]} />

      <Card>
        <CardHeader><CardTitle className="text-base">Select Role to Simulate</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v ?? "")}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Choose a role..." /></SelectTrigger>
            <SelectContent>
              {SAMPLE_ROLES.map((r) => (
                <SelectItem key={r} value={r}>{r.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedRole && (
        <Card>
          <CardHeader><CardTitle className="text-base">Effective Permissions for {selectedRole.replace(/_/g, " ")}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This view will show all modules, pages, and actions accessible with this role.
              Connect to a running database to see resolved permissions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Orders", "Dispatch", "Delivery", "Yard", "Receiving", "Collections", "Pricing", "Purchasing", "CRM", "Imports", "Reports", "Admin"].map((mod) => (
                <div key={mod} className="flex items-center gap-2 py-1 px-2 rounded bg-muted/30">
                  <Checkbox checked={selectedRole === "SUPER_ADMIN"} disabled />
                  <span className="text-sm">{mod}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
