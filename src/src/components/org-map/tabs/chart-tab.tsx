"use client";

import * as React from "react";
import { OrgTree } from "@/components/org-map/org-tree";
import { OrgDetailPanel } from "@/components/org-map/org-detail-panel";
import { LoadingState } from "@/components/shared/states";
import type { OrgUnitNode } from "@/components/org-map/org-node";

interface ChartTabProps {
  units: OrgUnitNode[];
  isLoading: boolean;
}

export function ChartTab({ units, isLoading }: ChartTabProps) {
  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(null);
  const [filterType, setFilterType] = React.useState("");
  const [filterLocation, setFilterLocation] = React.useState("");

  // Collect unique locations from tree for filter
  const locations = React.useMemo(() => {
    const locs: { id: string; name: string }[] = [];
    function walk(nodes: OrgUnitNode[]) {
      for (const n of nodes) {
        if (n.location && !locs.find((l) => l.id === n.location!.id)) {
          locs.push({ id: n.location.id, name: n.location.name });
        }
        walk(n.children);
      }
    }
    walk(units);
    return locs;
  }, [units]);

  // Filter tree (shallow: hide non-matching leaves but keep parents)
  const filteredUnits = React.useMemo(() => {
    if (!filterType && !filterLocation) return units;

    function filterTree(nodes: OrgUnitNode[]): OrgUnitNode[] {
      return nodes
        .map((node) => {
          const filteredChildren = filterTree(node.children);
          const typeMatch = !filterType || node.type === filterType;
          const locMatch = !filterLocation || node.location?.id === filterLocation;
          const selfMatch = typeMatch && locMatch;
          if (selfMatch || filteredChildren.length > 0) {
            return { ...node, children: filteredChildren };
          }
          return null;
        })
        .filter(Boolean) as OrgUnitNode[];
    }
    return filterTree(units);
  }, [units, filterType, filterLocation]);

  if (isLoading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-8 rounded-md border border-border/50 bg-card px-2 text-xs font-mono focus:ring-1 focus:ring-primary/30"
        >
          <option value="">All Types</option>
          {["COMPANY", "REGION", "BRANCH", "DEPARTMENT", "TEAM"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="h-8 rounded-md border border-border/50 bg-card px-2 text-xs font-mono focus:ring-1 focus:ring-primary/30"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        {(filterType || filterLocation) && (
          <button
            onClick={() => { setFilterType(""); setFilterLocation(""); }}
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Tree */}
      {filteredUnits.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-12">
          No organization units match the current filters.
        </div>
      ) : (
        <OrgTree
          units={filteredUnits}
          onSelectUnit={setSelectedUnitId}
          selectedUnitId={selectedUnitId}
        />
      )}

      {/* Detail panel */}
      <OrgDetailPanel
        unitId={selectedUnitId}
        open={selectedUnitId !== null}
        onClose={() => setSelectedUnitId(null)}
      />
    </div>
  );
}
