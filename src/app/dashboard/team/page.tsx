"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function TeamPage() {
  return (
    <main className="space-y-4">
      <Card gradientBorder padding="lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-pulse-text">Team</h1>
            <p className="mt-1 text-sm text-pulse-muted">
              Invite teammates, assign roles, and configure approval workflows (demo).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info" dot>
              Collaboration
            </Badge>
            <Button variant="secondary" size="sm">
              Invite member
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            { name: "Alex Morgan", role: "Owner", status: "Active" },
            { name: "Jordan Lee", role: "Manager", status: "Active" },
            { name: "Sam Patel", role: "Analyst", status: "Invited" }
          ].map((m) => (
            <div key={m.name} className="glass rounded-2xl border border-white/10 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-pulse-text">{m.name}</p>
                  <p className="text-xs text-pulse-muted">{m.role}</p>
                </div>
                <Badge variant={m.status === "Active" ? "success" : "warning"} dot>
                  {m.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}

