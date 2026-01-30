"use client";

import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PLATFORMS, getPlatformColor, type PlatformKey } from "@/lib/constants";
import { usePlatformStore } from "@/store/platform-store";
import { useNotificationStore } from "@/store/notification-store";

export function PlatformConnector() {
  const { connections, loadingKeys, connect, disconnect } = usePlatformStore();
  const pushToast = useNotificationStore((s) => s.push);

  const statusFor = (key: string) => connections.find((c) => c.key === key)?.status ?? "disconnected";
  const isLoadingFor = (key: string) => loadingKeys.has(key as PlatformKey);

  return (
    <Card gradientBorder padding="lg">
      <CardHeader>
        <div>
          <CardTitle>Platform Connector</CardTitle>
          <CardDescription>Connect every major social platform from one pane of glass.</CardDescription>
        </div>
        <Badge variant="info" dot>
          OAuth-ready (demo)
        </Badge>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {PLATFORMS.map((p) => {
            const status = statusFor(p.key);
            const isConnected = status === "connected";
            const platformColor = getPlatformColor(p.key);
            return (
              <div
                key={p.key}
                className="glass group flex flex-col justify-between rounded-2xl border border-white/10 p-3 hover:border-white/20 transition-colors"
                style={{ borderLeftColor: platformColor, borderLeftWidth: "4px" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {p.features.slice(0, 2).join(" • ")}
                    </p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: isConnected ? "#10B981" : "#808080" }}
                    title={isConnected ? "Connected" : "Disconnected"}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-gray-400">
                  <span>Permissions: posting, analytics, messages (demo)</span>
                  <Button
                    size="sm"
                    variant={isConnected ? "secondary" : "primary"}
                    loading={isLoadingFor(p.key)}
                    onClick={async () => {
                      if (isConnected) {
                        disconnect(p.key);
                        pushToast({
                          title: "Disconnected",
                          description: `${p.name} is now disconnected.`,
                          variant: "info"
                        });
                      } else {
                        await connect(p.key);
                        pushToast({
                          title: "Connected",
                          description: `${p.name} is now connected.`,
                          variant: "success"
                        });
                      }
                    }}
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

