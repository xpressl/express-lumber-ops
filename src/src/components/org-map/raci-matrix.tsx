"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MatrixTask {
  id: string;
  name: string;
  category: string;
  isCritical: boolean;
  assignments: {
    id: string;
    assignmentType: string;
    roleTemplate: { id: string; title: string } | null;
    user: { id: string; firstName: string; lastName: string } | null;
  }[];
}

interface MatrixRole {
  id: string;
  title: string;
}

interface RaciMatrixProps {
  tasks: MatrixTask[];
  roles: MatrixRole[];
}

const TYPE_COLORS: Record<string, string> = {
  RESPONSIBLE: "bg-primary/80 text-primary-foreground",
  ACCOUNTABLE: "bg-destructive/80 text-white",
  BACKUP: "bg-info/80 text-info-foreground",
  CONSULTED: "bg-muted text-muted-foreground",
  INFORMED: "bg-muted/60 text-muted-foreground/70",
};

const TYPE_ABBREV: Record<string, string> = {
  RESPONSIBLE: "R",
  ACCOUNTABLE: "A",
  BACKUP: "B",
  CONSULTED: "C",
  INFORMED: "I",
};

function getAssignmentForCell(task: MatrixTask, roleId: string): string | null {
  const assignment = task.assignments.find(
    (a) => a.roleTemplate?.id === roleId,
  );
  return assignment?.assignmentType ?? null;
}

export function RaciMatrix({ tasks, roles }: RaciMatrixProps) {
  if (tasks.length === 0 || roles.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-12">
        No data available for the responsibility matrix.
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-border/30 overflow-hidden"
      style={{
        backgroundColor: "oklch(0.14 0.008 260)",
        backgroundImage: [
          "linear-gradient(oklch(0.45 0.08 85 / 0.03) 1px, transparent 1px)",
          "linear-gradient(90deg, oklch(0.45 0.08 85 / 0.03) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "24px 24px",
      }}
    >
      <ScrollArea className="max-h-[600px]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-r border-border/30 p-2 text-left min-w-[200px]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/60">
                    Task
                  </span>
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/30 p-2 text-center min-w-[80px]"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 writing-mode-vertical">
                      {role.title}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => (
                <tr
                  key={task.id}
                  className={cn(
                    "border-b border-border/20 hover:bg-muted/10 transition-colors",
                    i % 2 === 0 && "bg-card/5",
                  )}
                >
                  <td className="sticky left-0 z-10 bg-card/90 backdrop-blur-sm border-r border-border/30 p-2">
                    <div className="flex items-center gap-1.5">
                      {task.isCritical && (
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                      )}
                      <span className="text-xs font-medium truncate max-w-[180px]">
                        {task.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground/50">
                      {task.category}
                    </span>
                  </td>
                  {roles.map((role) => {
                    const type = getAssignmentForCell(task, role.id);
                    return (
                      <td key={role.id} className="p-1 text-center border-border/10">
                        {type ? (
                          <span
                            className={cn(
                              "inline-flex items-center justify-center w-7 h-7 rounded-md text-[11px] font-mono font-bold transition-transform hover:scale-110",
                              TYPE_COLORS[type] ?? "bg-muted",
                            )}
                            title={type}
                          >
                            {TYPE_ABBREV[type] ?? "?"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 text-border/30">
                            ·
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-border/30">
        {Object.entries(TYPE_ABBREV).map(([type, abbrev]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-mono font-bold",
                TYPE_COLORS[type],
              )}
            >
              {abbrev}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/60 capitalize">
              {type.toLowerCase()}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
          <span className="text-[10px] font-mono text-muted-foreground/60">Critical</span>
        </div>
      </div>
    </div>
  );
}
