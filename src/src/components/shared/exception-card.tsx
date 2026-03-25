"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ExceptionCardProps {
  id: string;
  category: string;
  severity: string;
  status: string;
  title: string;
  description?: string;
  entityType: string;
  entityName?: string;
  ownerName?: string;
  slaTargetAt?: string | Date;
  createdAt: string | Date;
  priorityScore: number;
  className?: string;
  onClick?: () => void;
}

export function ExceptionCard({
  category,
  severity,
  status,
  title,
  description,
  entityType,
  entityName,
  ownerName,
  slaTargetAt,
  createdAt,
  priorityScore,
  className,
  onClick,
}: ExceptionCardProps) {
  const slaDate = slaTargetAt ? (typeof slaTargetAt === "string" ? new Date(slaTargetAt) : slaTargetAt) : null;
  const isOverdue = slaDate ? slaDate < new Date() : false;
  const created = typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  return (
    <Card
      className={cn(
        "transition-colors border-l-4",
        severity === "CRITICAL" && "border-l-destructive",
        severity === "HIGH" && "border-l-destructive/70",
        severity === "MEDIUM" && "border-l-warning",
        severity === "LOW" && "border-l-muted-foreground",
        isOverdue && "bg-destructive/5",
        onClick && "cursor-pointer hover:bg-muted/50",
        className,
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={severity} size="sm" />
            <StatusBadge status={status} size="sm" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase">{category.replace(/_/g, " ")}</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground shrink-0">P{priorityScore}</span>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-1">
        <p className="text-sm font-medium leading-tight">{title}</p>
        {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono pt-1">
          <span>{entityType}: {entityName ?? "—"}</span>
          {ownerName && <span>Owner: {ownerName}</span>}
          {slaDate && (
            <span className={cn(isOverdue && "text-destructive font-medium")}>
              SLA: {isOverdue ? "OVERDUE" : formatDistanceToNow(slaDate)}
            </span>
          )}
          <span className="ml-auto">{formatDistanceToNow(created, { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
