"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "./status-badge";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  entityType: string;
  entityName?: string;
  currentStatus?: string;
  requestedChange?: string;
  requesterName?: string;
  requestReason?: string;
  onApprove: (note: string) => void | Promise<void>;
  onDeny: (note: string) => void | Promise<void>;
  isLoading?: boolean;
}

export function ApprovalDialog({
  open,
  onOpenChange,
  title,
  description,
  entityType,
  entityName,
  currentStatus,
  requestedChange,
  requesterName,
  requestReason,
  onApprove,
  onDeny,
  isLoading = false,
}: ApprovalDialogProps) {
  const [note, setNote] = React.useState("");

  async function handleApprove() {
    await onApprove(note);
    setNote("");
  }

  async function handleDeny() {
    await onDeny(note);
    setNote("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Context */}
          <div className="bg-muted/50 rounded-md p-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{entityType}</span>
              <span className="font-medium">{entityName ?? "—"}</span>
            </div>
            {currentStatus && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={currentStatus} size="sm" />
              </div>
            )}
            {requestedChange && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested</span>
                <span className="font-medium text-primary">{requestedChange}</span>
              </div>
            )}
            {requesterName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested by</span>
                <span>{requesterName}</span>
              </div>
            )}
          </div>

          {/* Request reason */}
          {requestReason && (
            <div>
              <Label className="text-xs text-muted-foreground">Reason</Label>
              <p className="text-sm mt-1 bg-muted/30 rounded p-2">{requestReason}</p>
            </div>
          )}

          {/* Note */}
          <div>
            <Label htmlFor="approval-note" className="text-xs">
              Note (optional)
            </Label>
            <Textarea
              id="approval-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="mt-1 h-20 text-sm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="destructive" onClick={handleDeny} disabled={isLoading} className="flex-1">
            Deny
          </Button>
          <Button onClick={handleApprove} disabled={isLoading} className="flex-1">
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
