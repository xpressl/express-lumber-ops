"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

interface GapCardProps {
  gapType: string;
  severity: string;
  status: string;
  summary: string;
  recommendedAction: string | null;
  taskName?: string | null;
  roleName?: string | null;
  userName?: string | null;
  locationName?: string | null;
  className?: string;
}

const GAP_TYPE_LABELS: Record<string, string> = {
  NO_OWNER: "No Owner",
  NO_BACKUP: "No Backup",
  OVERLOADED: "Overloaded",
  SKILL_MISMATCH: "Skill Mismatch",
  PERMISSION_MISMATCH: "Permission Mismatch",
  SINGLE_POINT_OF_FAILURE: "Single Point of Failure",
  MISSING_ROLE: "Missing Role",
  VACANCY_WITH_TASKS: "Vacancy with Tasks",
};

export function GapCard({
  gapType,
  severity,
  status,
  summary,
  recommendedAction,
  taskName,
  roleName,
  userName,
  locationName,
  className,
}: GapCardProps) {
  return (
    <Card
      className={cn(
        "transition-colors border-l-2",
        severity === "CRITICAL" && "border-l-destructive",
        severity === "HIGH" && "border-l-destructive/70",
        severity === "MEDIUM" && "border-l-warning",
        severity === "LOW" && "border-l-muted-foreground/40",
        className,
      )}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            {GAP_TYPE_LABELS[gapType] ?? gapType}
          </span>
          <div className="flex gap-1">
            <StatusBadge status={severity} size="sm" />
            <StatusBadge status={status} size="sm" />
          </div>
        </div>

        <p className="text-sm leading-snug">{summary}</p>

        {/* Related entities */}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] font-mono text-muted-foreground/70">
          {taskName && <span>Task: {taskName}</span>}
          {roleName && <span>Role: {roleName}</span>}
          {userName && <span>Person: {userName}</span>}
          {locationName && <span>Branch: {locationName}</span>}
        </div>

        {recommendedAction && (
          <p className="text-xs text-muted-foreground italic border-t border-border/30 pt-1.5">
            {recommendedAction}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
