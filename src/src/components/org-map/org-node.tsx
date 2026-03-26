"use client";

import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { ChevronDown, ChevronRight, MapPin, User, AlertTriangle, Briefcase } from "lucide-react";

const TYPE_ACCENT: Record<string, string> = {
  COMPANY: "bg-amber-500",
  REGION: "bg-amber-400",
  BRANCH: "bg-amber-300/70",
  DEPARTMENT: "bg-zinc-400",
  TEAM: "bg-zinc-500",
};

const TYPE_GLOW: Record<string, string> = {
  COMPANY: "shadow-amber-500/20",
  REGION: "shadow-amber-400/15",
  BRANCH: "shadow-amber-300/10",
  DEPARTMENT: "shadow-zinc-400/10",
  TEAM: "shadow-zinc-500/5",
};

export interface OrgUnitNode {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  description: string | null;
  head: { id: string; firstName: string; lastName: string } | null;
  location: { id: string; name: string; code: string } | null;
  _count: { roleTemplates: number; coverageGaps: number; hiringRequests: number };
  children: OrgUnitNode[];
}

interface OrgNodeProps {
  unit: OrgUnitNode;
  isSelected: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  depth: number;
}

export function OrgNode({
  unit,
  isSelected,
  isExpanded,
  hasChildren,
  onSelect,
  onToggleExpand,
  depth,
}: OrgNodeProps) {
  const accent = TYPE_ACCENT[unit.type] ?? "bg-zinc-600";
  const glow = TYPE_GLOW[unit.type] ?? "";
  const headInitials = unit.head
    ? `${unit.head.firstName[0]}${unit.head.lastName[0]}`
    : null;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative w-56 rounded-lg border cursor-pointer transition-all duration-200",
        "bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-sm",
        "hover:translate-y-[-1px] hover:shadow-lg",
        isSelected
          ? "ring-2 ring-primary/40 border-primary/30 shadow-lg"
          : "border-border/40 hover:border-border/70",
        glow && `shadow-md ${glow}`,
      )}
    >
      {/* Type accent bar */}
      <div className={cn("h-[3px] rounded-t-lg", accent)} />

      <div className="p-3 space-y-2">
        {/* Header: type badge + expand toggle */}
        <div className="flex items-center justify-between">
          <StatusBadge status={unit.type} size="sm" />
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className="p-0.5 rounded hover:bg-muted/50 transition-colors text-muted-foreground"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>

        {/* Unit name */}
        <div>
          <p className="font-mono text-sm font-semibold leading-tight truncate">
            {unit.name}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground/60 tracking-wider">
            {unit.code}
          </p>
        </div>

        {/* Head person */}
        <div className="flex items-center gap-1.5">
          {headInitials ? (
            <>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-[9px] font-mono font-bold text-primary">
                {headInitials}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {unit.head!.firstName} {unit.head!.lastName}
              </span>
            </>
          ) : (
            <>
              <User size={12} className="text-destructive/60" />
              <span className="text-xs text-destructive/70 italic">Vacant</span>
            </>
          )}
        </div>

        {/* Location */}
        {unit.location && (
          <div className="flex items-center gap-1">
            <MapPin size={10} className="text-muted-foreground/50 shrink-0" />
            <span className="text-[10px] font-mono text-muted-foreground/60 truncate">
              {unit.location.name}
            </span>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 pt-1 border-t border-border/30">
          <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/60">
            <Briefcase size={10} />
            {unit._count.roleTemplates}
          </span>
          <span
            className={cn(
              "flex items-center gap-1 text-[10px] font-mono",
              unit._count.coverageGaps > 0 ? "text-destructive/70" : "text-muted-foreground/60",
            )}
          >
            <AlertTriangle size={10} />
            {unit._count.coverageGaps}
          </span>
          {unit._count.hiringRequests > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-primary/70">
              +{unit._count.hiringRequests} hire
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
